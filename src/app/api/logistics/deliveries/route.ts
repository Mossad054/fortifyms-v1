import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/lib/rbac'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/logistics/deliveries
 * Get deliveries for logistics planning
 */
export async function GET(request: NextRequest) {
    return withAuth(async (user) => {
        const { searchParams } = new URL(request.url)
        const status = searchParams.get('status')
        const orderId = searchParams.get('orderId')

        try {
            const userProfile = await prisma.user.findUnique({
                where: { email: user.email! },
                select: { role: true, millId: true }
            })

            const where: any = {}

            if (status) where.status = status
            if (orderId) where.orderId = orderId

            // Role-based filtering
            if (userProfile?.role === 'MILL_MANAGER' && userProfile.millId) {
                // Get orders for this mill
                const orders = await prisma.purchaseOrder.findMany({
                    where: { millId: userProfile.millId },
                    select: { id: true }
                })
                where.orderId = { in: orders.map(o => o.id) }
            }

            const deliveries = await prisma.delivery.findMany({
                where,
                orderBy: { scheduledDate: 'asc' },
                include: {
                    order: {
                        include: {
                            mill: {
                                select: {
                                    id: true,
                                    name: true,
                                    location: true
                                }
                            },
                            buyer: {
                                select: {
                                    organizationName: true
                                }
                            }
                        }
                    },
                    driver: {
                        select: {
                            id: true,
                            name: true,
                            phone: true
                        }
                    }
                }
            })

            return NextResponse.json({ deliveries })
        } catch (error) {
            console.error('Error fetching deliveries:', error)
            return NextResponse.json(
                { error: 'Failed to fetch deliveries' },
                { status: 500 }
            )
        }
    })
}

/**
 * POST /api/logistics/deliveries
 * Create delivery schedule
 */
export async function POST(request: NextRequest) {
    return withAuth(async (user) => {
        try {
            const body = await request.json()
            const {
                orderId,
                scheduledDate,
                deliveryLocations,
                driverId,
                vehicleInfo,
                notes
            } = body

            if (!orderId || !scheduledDate || !deliveryLocations || deliveryLocations.length === 0) {
                return NextResponse.json(
                    { error: 'Order ID, scheduled date, and delivery locations are required' },
                    { status: 400 }
                )
            }

            const delivery = await prisma.delivery.create({
                data: {
                    orderId,
                    scheduledDate: new Date(scheduledDate),
                    deliveryLocations,
                    driverId,
                    vehicleInfo: vehicleInfo || {},
                    status: 'SCHEDULED',
                    notes
                },
                include: {
                    order: {
                        include: {
                            buyer: {
                                select: {
                                    organizationName: true
                                }
                            }
                        }
                    }
                }
            })

            // Create alert for driver
            if (driverId) {
                await prisma.alert.create({
                    data: {
                        type: 'DELIVERY_ASSIGNED',
                        severity: 'MEDIUM',
                        title: 'Delivery Assigned',
                        message: `Delivery to ${delivery.order.buyer.organizationName} scheduled for ${new Date(scheduledDate).toLocaleDateString()}`,
                        resourceType: 'DELIVERY',
                        resourceId: delivery.id,
                        status: 'ACTIVE'
                    }
                })
            }

            return NextResponse.json({
                message: 'Delivery scheduled successfully',
                delivery
            }, { status: 201 })
        } catch (error) {
            console.error('Error creating delivery:', error)
            return NextResponse.json(
                { error: 'Failed to create delivery' },
                { status: 500 }
            )
        }
    }, {
        requiredRoles: ['MILL_MANAGER', 'LOGISTICS_PLANNER', 'SYSTEM_ADMIN']
    })
}
