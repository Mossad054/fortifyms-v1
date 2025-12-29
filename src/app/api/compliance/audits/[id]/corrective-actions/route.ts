import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/lib/rbac'
import { prisma } from '@/lib/prisma'

/**
 * POST /api/compliance/audits/[id]/corrective-actions
 * Add corrective action to audit
 */
export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    return withAuth(async (user) => {
        try {
            const body = await request.json()
            const {
                description,
                rootCause,
                correctiveAction,
                preventiveAction,
                assignedTo,
                dueDate,
                priority
            } = body

            const userProfile = await prisma.user.findUnique({
                where: { email: user.email! }
            })

            if (!userProfile) {
                return NextResponse.json(
                    { error: 'User profile not found' },
                    { status: 400 }
                )
            }

            // Get current audit
            const audit = await prisma.complianceAudit.findUnique({
                where: { id: params.id },
                select: { correctiveActions: true }
            })

            if (!audit) {
                return NextResponse.json(
                    { error: 'Audit not found' },
                    { status: 404 }
                )
            }

            const newAction = {
                id: `CA-${Date.now()}`,
                description,
                rootCause,
                correctiveAction,
                preventiveAction,
                assignedTo,
                dueDate,
                priority: priority || 'MEDIUM',
                status: 'PENDING',
                createdBy: userProfile.id,
                createdAt: new Date().toISOString()
            }

            const actions = typeof audit.correctiveActions === 'string'
                ? JSON.parse(audit.correctiveActions)
                : (audit.correctiveActions || [])

            const updatedActions = [...(actions as any[]), newAction]

            await prisma.complianceAudit.update({
                where: { id: params.id },
                data: {
                    correctiveActions: JSON.stringify(updatedActions)
                }
            })

            // Create alert for assigned user
            if (assignedTo) {
                await prisma.alert.create({
                    data: {
                        type: 'CORRECTIVE_ACTION_ASSIGNED',
                        category: 'COMPLIANCE',
                        severity: priority === 'HIGH' ? 'HIGH' : 'MEDIUM',
                        title: 'Corrective Action Assigned',
                        message: `You have been assigned a corrective action: ${description}`,
                        sourceType: 'COMPLIANCE_AUDIT',
                        sourceId: params.id,
                        status: 'ACTIVE' as any
                    }
                })
            }

            return NextResponse.json({
                message: 'Corrective action added successfully',
                action: newAction
            }, { status: 201 })
        } catch (error) {
            console.error('Error adding corrective action:', error)
            return NextResponse.json(
                { error: 'Failed to add corrective action' },
                { status: 500 }
            )
        }
    })
}

/**
 * PATCH /api/compliance/audits/[id]/corrective-actions
 * Update corrective action status
 */
export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    return withAuth(async (user) => {
        try {
            const body = await request.json()
            const { actionId, status, completionNotes, completionEvidence } = body

            const audit = await prisma.complianceAudit.findUnique({
                where: { id: params.id },
                select: { correctiveActions: true }
            })

            if (!audit) {
                return NextResponse.json(
                    { error: 'Audit not found' },
                    { status: 404 }
                )
            }

            const actions = typeof audit.correctiveActions === 'string'
                ? JSON.parse(audit.correctiveActions)
                : (audit.correctiveActions || [])

            const actionIndex = (actions as any[]).findIndex(a => a.id === actionId)

            if (actionIndex === -1) {
                return NextResponse.json(
                    { error: 'Corrective action not found' },
                    { status: 404 }
                )
            }

            actions[actionIndex] = {
                ...actions[actionIndex],
                status,
                completionNotes,
                completionEvidence,
                completedAt: status === 'COMPLETED' ? new Date().toISOString() : null
            }

            await prisma.complianceAudit.update({
                where: { id: params.id },
                data: {
                    correctiveActions: JSON.stringify(actions)
                }
            })

            return NextResponse.json({
                message: 'Corrective action updated successfully',
                action: actions[actionIndex]
            })
        } catch (error) {
            console.error('Error updating corrective action:', error)
            return NextResponse.json(
                { error: 'Failed to update corrective action' },
                { status: 500 }
            )
        }
    })
}
