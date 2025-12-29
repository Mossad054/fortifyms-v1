import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/lib/rbac'
import { prisma } from '@/lib/prisma'
import { AlertType, AlertCategory, AlertSeverity, AlertStatus } from '@prisma/client'

/**
 * POST /api/maintenance/alerts
 * Create predictive maintenance alert
 */
export async function POST(request: NextRequest) {
    return withAuth(async (user) => {
        try {
            const body = await request.json()
            const {
                equipmentId,
                alertType,
                severity,
                metric,
                currentValue,
                threshold,
                description
            } = body

            const equipment = await prisma.equipment.findUnique({
                where: { id: equipmentId },
                select: { millId: true, name: true }
            })

            if (!equipment) {
                return NextResponse.json(
                    { error: 'Equipment not found' },
                    { status: 404 }
                )
            }

            // Create alert
            const alert = await prisma.alert.create({
                data: {
                    type: (alertType && (AlertType as any)[alertType]) || AlertType.EQUIPMENT_DRIFT,
                    category: AlertCategory.MAINTENANCE,
                    severity: (severity && (AlertSeverity as any)[severity]) || AlertSeverity.HIGH,
                    title: `Equipment Alert: ${equipment.name}`,
                    message: description || `${metric} detected: ${currentValue} (threshold: ${threshold})`,
                    sourceType: 'EQUIPMENT',
                    sourceId: equipmentId,
                    millId: equipment.millId,
                    status: AlertStatus.ACTIVE,
                    metadata: JSON.stringify({
                        metric,
                        currentValue,
                        threshold,
                        equipmentId
                    })
                }
            })

            // Create maintenance task if critical
            if (severity === 'CRITICAL') {
                const dueDate = new Date()
                dueDate.setHours(dueDate.getHours() + 2) // Due in 2 hours

                await prisma.maintenanceTask.create({
                    data: {
                        equipmentId,
                        millId: equipment.millId,
                        type: 'INSPECTION',
                        title: `URGENT: Investigate ${metric} anomaly`,
                        description: `${metric} detected at ${currentValue}, exceeding threshold of ${threshold}`,
                        dueDate,
                        priority: 'HIGH',
                        status: 'PENDING'
                    }
                })
            }

            return NextResponse.json({
                message: 'Maintenance alert created successfully',
                alert
            }, { status: 201 })
        } catch (error) {
            console.error('Error creating maintenance alert:', error)
            return NextResponse.json(
                { error: 'Failed to create maintenance alert' },
                { status: 500 }
            )
        }
    }, {
        requiredPermissions: ['manage:equipment']
    })
}

/**
 * GET /api/maintenance/alerts
 * Get maintenance alerts
 */
export async function GET(request: NextRequest) {
    return withAuth(async (user) => {
        const { searchParams } = new URL(request.url)
        const millId = searchParams.get('millId')
        const equipmentId = searchParams.get('equipmentId')

        try {
            const userProfile = await prisma.user.findUnique({
                where: { email: user.email! },
                select: { millId: true, role: true }
            })

            const where: any = {
                type: { in: [AlertType.EQUIPMENT_DRIFT, AlertType.CALIBRATION_OVERDUE, AlertType.MAINTENANCE_DUE] },
                status: AlertStatus.ACTIVE
            }

            if (userProfile?.role !== 'SYSTEM_ADMIN' && userProfile?.role !== 'PROGRAM_MANAGER') {
                if (userProfile?.millId) {
                    where.millId = userProfile.millId
                }
            } else if (millId) {
                where.millId = millId
            }

            if (equipmentId) {
                where.sourceId = equipmentId
                where.sourceType = 'EQUIPMENT'
            }

            const alerts = await prisma.alert.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                take: 50
            })

            return NextResponse.json({ alerts })
        } catch (error) {
            console.error('Error fetching maintenance alerts:', error)
            return NextResponse.json(
                { error: 'Failed to fetch maintenance alerts' },
                { status: 500 }
            )
        }
    })
}
