import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/lib/rbac'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/maintenance/tasks
 * Get maintenance tasks
 */
export async function GET(request: NextRequest) {
    return withAuth(async (user) => {
        const { searchParams } = new URL(request.url)
        const millId = searchParams.get('millId')
        const equipmentId = searchParams.get('equipmentId')
        const status = searchParams.get('status')
        const type = searchParams.get('type')
        const overdue = searchParams.get('overdue')

        try {
            const userProfile = await prisma.user.findUnique({
                where: { email: user.email! },
                select: { millId: true, role: true }
            })

            const where: any = {}

            // Role-based filtering
            if (userProfile?.role !== 'SYSTEM_ADMIN' && userProfile?.role !== 'PROGRAM_MANAGER') {
                if (!userProfile?.millId) {
                    return NextResponse.json({ tasks: [] })
                }
                where.millId = userProfile.millId
            } else if (millId) {
                where.millId = millId
            }

            if (equipmentId) where.equipmentId = equipmentId
            if (status) where.status = status
            if (type) where.type = type

            if (overdue === 'true') {
                where.scheduledDate = { lt: new Date() }
                where.status = { in: ['SCHEDULED', 'IN_PROGRESS'] }
            }

            const tasks = await prisma.maintenanceTask.findMany({
                where,
                orderBy: { scheduledDate: 'asc' },
                include: {
                    equipment: {
                        select: {
                            id: true,
                            name: true,
                            type: true
                        }
                    },
                    assignee: {
                        select: {
                            id: true,
                            name: true
                        }
                    }
                }
            })

            return NextResponse.json({ tasks })
        } catch (error) {
            console.error('Error fetching maintenance tasks:', error)
            return NextResponse.json(
                { error: 'Failed to fetch maintenance tasks' },
                { status: 500 }
            )
        }
    })
}

/**
 * POST /api/maintenance/tasks
 * Create maintenance task
 */
export async function POST(request: NextRequest) {
    return withAuth(async (user) => {
        try {
            const body = await request.json()
            const {
                equipmentId,
                type,
                title,
                description,
                scheduledDate,
                priority,
                assignedTo
            } = body

            const userProfile = await prisma.user.findUnique({
                where: { email: user.email! },
                select: { id: true, millId: true }
            })

            if (!userProfile?.millId) {
                return NextResponse.json(
                    { error: 'User not associated with a mill' },
                    { status: 400 }
                )
            }

            if (!equipmentId || !type || !title || !scheduledDate || !assignedTo) {
                return NextResponse.json(
                    { error: 'Equipment, type, title, scheduled date, and assigned user are required' },
                    { status: 400 }
                )
            }

            const task = await prisma.maintenanceTask.create({
                data: {
                    equipmentId,
                    millId: userProfile.millId,
                    type,
                    title,
                    description,
                    scheduledDate: new Date(scheduledDate),
                    priority: priority || 'MEDIUM',
                    status: 'SCHEDULED',
                    assignedTo,
                    createdBy: userProfile.id
                },
                include: {
                    equipment: true,
                    assignee: {
                        select: {
                            id: true,
                            name: true,
                            email: true
                        }
                    }
                }
            })

            // Create alert for assigned user
            if (assignedTo) {
                const daysUntilDue = Math.ceil((new Date(scheduledDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))

                await prisma.alert.create({
                    data: {
                        type: 'CALIBRATION_DUE',
                        category: 'MAINTENANCE',
                        severity: daysUntilDue <= 7 ? 'HIGH' : 'MEDIUM',
                        title: 'Maintenance Task Assigned',
                        message: `${type}: ${title} - Due in ${daysUntilDue} days`,
                        sourceType: 'MAINTENANCE_TASK',
                        sourceId: task.id,
                        millId: userProfile.millId,
                        status: 'ACTIVE' as any
                    }
                })
            }

            return NextResponse.json({
                message: 'Maintenance task created successfully',
                task
            }, { status: 201 })
        } catch (error) {
            console.error('Error creating maintenance task:', error)
            return NextResponse.json(
                { error: 'Failed to create maintenance task' },
                { status: 500 }
            )
        }
    }, {
        requiredPermissions: ['manage:equipment']
    })
}
