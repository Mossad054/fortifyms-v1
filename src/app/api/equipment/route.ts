import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/lib/rbac'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/equipment
 * Get equipment list for a mill
 */
export async function GET(request: NextRequest) {
    return withAuth(async (user) => {
        const { searchParams } = new URL(request.url)
        const millId = searchParams.get('millId')
        const type = searchParams.get('type')
        const status = searchParams.get('status')

        try {
            const userProfile = await prisma.user.findUnique({
                where: { email: user.email! },
                select: { millId: true, role: true }
            })

            const where: any = {}

            // Role-based filtering
            if (userProfile?.role !== 'SYSTEM_ADMIN' && userProfile?.role !== 'FWGA_PROGRAM_MANAGER') {
                if (!userProfile?.millId) {
                    return NextResponse.json({ equipment: [] })
                }
                where.millId = userProfile.millId
            } else if (millId) {
                where.millId = millId
            }

            if (type) where.type = type
            if (status) where.status = status

            const equipment = await prisma.equipment.findMany({
                where,
                orderBy: { name: 'asc' },
                include: {
                    mill: {
                        select: {
                            id: true,
                            name: true,
                            code: true
                        }
                    },
                    maintenanceTasks: {
                        where: {
                            status: { in: ['PENDING', 'IN_PROGRESS'] }
                        },
                        orderBy: { dueDate: 'asc' },
                        take: 5
                    }
                }
            })

            return NextResponse.json({ equipment })
        } catch (error) {
            console.error('Error fetching equipment:', error)
            return NextResponse.json(
                { error: 'Failed to fetch equipment' },
                { status: 500 }
            )
        }
    })
}

/**
 * POST /api/equipment
 * Add new equipment to mill
 */
export async function POST(request: NextRequest) {
    return withAuth(async (user) => {
        try {
            const body = await request.json()
            const {
                name,
                type,
                manufacturer,
                model,
                serialNumber,
                installationDate,
                location,
                calibrationFrequency,
                specifications
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

            if (!name || !type) {
                return NextResponse.json(
                    { error: 'Name and type are required' },
                    { status: 400 }
                )
            }

            const equipment = await prisma.equipment.create({
                data: {
                    millId: userProfile.millId,
                    name,
                    type,
                    manufacturer,
                    model,
                    serialNumber,
                    installationDate: installationDate ? new Date(installationDate) : null,
                    location,
                    status: 'ACTIVE',
                    calibrationFrequency: calibrationFrequency || 90, // Default 90 days
                    specifications: specifications || {}
                }
            })

            // Create initial calibration schedule
            if (calibrationFrequency) {
                const nextCalibrationDate = new Date()
                nextCalibrationDate.setDate(nextCalibrationDate.getDate() + calibrationFrequency)

                await prisma.maintenanceTask.create({
                    data: {
                        equipmentId: equipment.id,
                        millId: userProfile.millId,
                        type: 'CALIBRATION',
                        title: `Calibration: ${name}`,
                        description: 'Regular calibration maintenance',
                        dueDate: nextCalibrationDate,
                        priority: 'MEDIUM',
                        status: 'PENDING'
                    }
                })
            }

            // Log the action
            await prisma.auditLog.create({
                data: {
                    userId: userProfile.id,
                    action: 'EQUIPMENT_CREATE',
                    resourceType: 'EQUIPMENT',
                    resourceId: equipment.id,
                    newValues: JSON.stringify(equipment),
                    ipAddress: request.ip || 'unknown',
                    userAgent: request.headers.get('user-agent') || 'unknown'
                }
            })

            return NextResponse.json({
                message: 'Equipment added successfully',
                equipment
            }, { status: 201 })
        } catch (error) {
            console.error('Error creating equipment:', error)
            return NextResponse.json(
                { error: 'Failed to create equipment' },
                { status: 500 }
            )
        }
    }, {
        requiredPermissions: ['manage:equipment']
    })
}
