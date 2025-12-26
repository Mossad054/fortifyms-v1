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

            if (status === 'IN_TRANSIT') {
                updateData.departureTime = new Date()
            }

            if (status === 'DELIVERED') {
                updateData.actualDeliveryDate = new Date()
                updateData.proofOfDelivery = proofOfDelivery || {}
            }

            if (location) {
                updateData.currentLocation = location
            }

            if (notes) {
                updateData.notes = notes
            }

            const delivery = await prisma.delivery.update({
                where: { id: params.id },
                data: updateData,
                include: {
                    order: {
                        include: {
                            buyer: true,
                            mill: true
                        }
                    }
                }
            })

            // Create notification for buyer
            if (status === 'IN_TRANSIT' || status === 'DELIVERED') {
                await prisma.alert.create({
                    data: {
                        type: 'DELIVERY_UPDATE',
                        severity: 'LOW',
                        title: `Delivery ${status}`,
                        message: status === 'IN_TRANSIT'
                            ? `Delivery departed from ${delivery.order.mill.name}`
                            : `Delivery completed to ${delivery.order.buyer.organizationName}`,
                        resourceType: 'DELIVERY',
                        resourceId: delivery.id,
                        status: 'ACTIVE'
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
