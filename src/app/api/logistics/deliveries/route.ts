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
                where.poId = { in: orders.map(o => o.id) }
            }

            const deliveries = await prisma.delivery.findMany({
                where,
                orderBy: { scheduledDate: 'asc' },
                include: {
                    purchaseOrder: {
                        include: {
                            mill: {
                                select: {
                                    id: true,
                                    name: true,
                                    region: true
                                }
                            },
                            buyer: {
                                select: {
                                    organizationName: true
                                }
                            }
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
                poId,
                scheduledDate,
                locationId,
                quantity,
                driverId,
                vehicleInfo,
                notes
            } = body

            if (!poId || !scheduledDate || !locationId || quantity === undefined) {
                return NextResponse.json(
                    { error: 'PO ID, scheduled date, location ID, and quantity are required' },
                    { status: 400 }
                )
            }

            const delivery = await prisma.delivery.create({
                data: {
                    poId,
                    scheduledDate: new Date(scheduledDate),
                    locationId,
                    quantity: parseFloat(quantity),
                    driverId,
                    vehicleInfo: typeof vehicleInfo === 'object' ? JSON.stringify(vehicleInfo) : vehicleInfo,
                    status: 'SCHEDULED',
                    conditionNotes: notes
                },
                include: {
                    purchaseOrder: {
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
                        category: 'LOGISTICS',
                        severity: 'MEDIUM',
                        title: 'Delivery Assigned',
                        message: `Delivery to ${(delivery as any).purchaseOrder.buyer.organizationName} scheduled for ${new Date(scheduledDate).toLocaleDateString()}`,
                        sourceType: 'DELIVERY',
                        sourceId: delivery.id,
                        status: 'ACTIVE' as any
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
