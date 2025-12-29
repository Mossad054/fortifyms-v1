import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/lib/rbac'
import { prisma } from '@/lib/prisma'

/**
 * PATCH /api/logistics/deliveries/[id]/status
 * Update delivery status (for drivers)
 */
export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    return withAuth(async (user) => {
        try {
            const body = await request.json()
            const { status, location, notes, proofOfDelivery } = body

            const validStatuses = ['SCHEDULED', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED', 'DELAYED']

            if (!validStatuses.includes(status)) {
                return NextResponse.json(
                    { error: 'Invalid status' },
                    { status: 400 }
                )
            }

            const updateData: any = {
                status,
                updatedAt: new Date()
            }

            if (status === 'DELIVERED') {
                updateData.actualDate = new Date()
                updateData.proofOfDelivery = typeof proofOfDelivery === 'object' ? JSON.stringify(proofOfDelivery) : proofOfDelivery
            }

            if (notes) {
                updateData.conditionNotes = notes
            }

            const delivery = await prisma.delivery.update({
                where: { id: params.id },
                data: updateData,
                include: {
                    purchaseOrder: {
                        include: {
                            buyer: true,
                            mill: true
                        }
                    }
                }
            })

            // Create notification for buyer
            if (status === 'IN_TRANSIT' || status === 'DELIVERED') {
                const deliveryAny = delivery as any;
                await prisma.alert.create({
                    data: {
                        type: 'PRODUCTION_TARGET_MISS',
                        category: 'PRODUCTION',
                        severity: 'LOW',
                        title: `Delivery ${status}`,
                        message: status === 'IN_TRANSIT'
                            ? `Delivery departed from ${deliveryAny.purchaseOrder.mill.name}`
                            : `Delivery completed to ${deliveryAny.purchaseOrder.buyer.organizationName}`,
                        sourceType: 'DELIVERY',
                        sourceId: delivery.id,
                        status: 'ACTIVE' as any
                    }
                })
            }

            return NextResponse.json({
                message: 'Delivery status updated successfully',
                delivery
            })
        } catch (error) {
            console.error('Error updating delivery status:', error)
            return NextResponse.json(
                { error: 'Failed to update delivery status' },
                { status: 500 }
            )
        }
    }, {
        requiredRoles: ['LOGISTICS_PLANNER', 'MILL_MANAGER', 'SYSTEM_ADMIN']
    })
}
