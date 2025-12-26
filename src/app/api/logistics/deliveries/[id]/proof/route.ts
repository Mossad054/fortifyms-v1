import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/lib/rbac'
import { prisma } from '@/lib/prisma'

/**
 * POST /api/logistics/deliveries/[id]/proof
 * Submit proof of delivery
 */
export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    return withAuth(async (user) => {
        try {
            const body = await request.json()
            const {
                recipientName,
                recipientSignature,
                deliveryPhotos,
                quantityReceived,
                conditionNotes,
                issuesReported
            } = body

            if (!recipientName || !recipientSignature) {
                return NextResponse.json(
                    { error: 'Recipient name and signature are required' },
                    { status: 400 }
                )
            }

            const proofOfDelivery = {
                recipientName,
                recipientSignature,
                deliveryPhotos: deliveryPhotos || [],
                quantityReceived,
                conditionNotes,
                issuesReported: issuesReported || [],
                timestamp: new Date().toISOString(),
                submittedBy: (await prisma.user.findUnique({ where: { email: user.email! } }))?.id
            }

            const delivery = await prisma.delivery.update({
                where: { id: params.id },
                data: {
                    status: 'DELIVERED',
                    actualDeliveryDate: new Date(),
                    proofOfDelivery
                },
                include: {
                    order: {
                        include: {
                            buyer: true
                        }
                    }
                }
            })

            // Update order status if all deliveries complete
            const allDeliveries = await prisma.delivery.findMany({
                where: { orderId: delivery.orderId }
            })

            const allDelivered = allDeliveries.every(d => d.status === 'DELIVERED')

            if (allDelivered) {
                await prisma.purchaseOrder.update({
                    where: { id: delivery.orderId },
                    data: { status: 'DELIVERED' }
                })
            }

            // Notify buyer
            await prisma.alert.create({
                data: {
                    type: 'DELIVERY_COMPLETED',
                    severity: 'LOW',
                    title: 'Delivery Completed',
                    message: `Delivery to ${delivery.order.buyer.organizationName} completed. Please review and confirm.`,
                    resourceType: 'DELIVERY',
                    resourceId: delivery.id,
                    status: 'ACTIVE'
                }
            })

            return NextResponse.json({
                message: 'Proof of delivery submitted successfully',
                delivery
            })
        } catch (error) {
            console.error('Error submitting proof of delivery:', error)
            return NextResponse.json(
                { error: 'Failed to submit proof of delivery' },
                { status: 500 }
            )
        }
    }, {
        requiredRoles: ['LOGISTICS_PLANNER', 'MILL_MANAGER', 'SYSTEM_ADMIN']
    })
}
