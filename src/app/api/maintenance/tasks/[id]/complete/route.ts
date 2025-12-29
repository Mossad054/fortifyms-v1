import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/lib/rbac'
import { prisma } from '@/lib/prisma'

/**
 * POST /api/maintenance/tasks/[id]/complete
 * Complete a maintenance task
 */
export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    return withAuth(async (user) => {
        try {
            const body = await request.json()
            const {
                completionNotes,
                calibrationReadings,
                partsReplaced,
                evidence
            } = body

            const userProfile = await prisma.user.findUnique({
                where: { email: user.email! },
                select: { id: true }
            })

            if (!userProfile) {
                return NextResponse.json(
                    { error: 'User profile not found' },
                    { status: 400 }
                )
            }

            const task = await prisma.maintenanceTask.findUnique({
                where: { id: params.id },
                include: { equipment: true }
            })

            if (!task) {
                return NextResponse.json(
                    { error: 'Task not found' },
                    { status: 404 }
                )
            }

            if (task.status === 'COMPLETED') {
                return NextResponse.json(
                    { error: 'Task already completed' },
                    { status: 400 }
                )
            }

            // Update task
            const updatedTask = await prisma.maintenanceTask.update({
                where: { id: params.id },
                data: {
                    status: 'COMPLETED',
                    completedDate: new Date(),
                    notes: completionNotes,
                    calibrationData: calibrationReadings ? JSON.stringify(calibrationReadings) : null,
                    partsReplaced: partsReplaced ? JSON.stringify(partsReplaced) : null,
                    evidence: evidence ? JSON.stringify(evidence) : null
                }
            })

            // Update equipment last calibration if this was a calibration task
            if (task.type === 'CALIBRATION') {
                await prisma.equipment.update({
                    where: { id: task.equipmentId },
                    data: {
                        lastCalibration: new Date(),
                        isActive: true
                    }
                })

                // Create next calibration task if recurring
                if (task.recurrence) {
                    const nextDueDate = new Date()
                    nextDueDate.setDate(nextDueDate.getDate() + task.recurrence)

                    await prisma.maintenanceTask.create({
                        data: {
                            equipmentId: task.equipmentId,
                            millId: task.millId,
                            type: task.type,
                            title: task.title,
                            description: task.description,
                            dueDate: nextDueDate,
                            priority: task.priority,
                            status: 'PENDING',
                            recurrence: task.recurrence
                        }
                    })
                }
            }

            // Log the action
            await prisma.auditLog.create({
                data: {
                    userId: userProfile.id,
                    action: 'MAINTENANCE_COMPLETE',
                    resourceType: 'MAINTENANCE_TASK',
                    resourceId: task.id,
                    newValues: JSON.stringify({ status: 'COMPLETED', notes: completionNotes }),
                    ipAddress: request.ip || 'unknown',
                    userAgent: request.headers.get('user-agent') || 'unknown'
                }
            })

            return NextResponse.json({
                message: 'Maintenance task completed successfully',
                task: updatedTask
            })
        } catch (error) {
            console.error('Error completing maintenance task:', error)
            return NextResponse.json(
                { error: 'Failed to complete maintenance task' },
                { status: 500 }
            )
        }
    }, {
        requiredPermissions: ['log:maintenance']
    })
}
