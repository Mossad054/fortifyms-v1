import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/lib/rbac'
import { prisma } from '@/lib/prisma'

/**
 * POST /api/compliance/audits/[id]/review
 * Inspector review and approve/reject audit
 */
export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    return withAuth(async (user) => {
        try {
            const body = await request.json()
            const { decision, comments, correctiveActions } = body

            if (!['APPROVED', 'REJECTED', 'REVISION_REQUESTED'].includes(decision)) {
                return NextResponse.json(
                    { error: 'Invalid decision. Must be APPROVED, REJECTED, or REVISION_REQUESTED' },
                    { status: 400 }
                )
            }

            const audit = await prisma.complianceAudit.findUnique({
                where: { id: params.id },
                include: { mill: true }
            })

            if (!audit) {
                return NextResponse.json(
                    { error: 'Audit not found' },
                    { status: 404 }
                )
            }

            if (audit.status !== 'SUBMITTED') {
                return NextResponse.json(
                    { error: 'Audit not in submitted status' },
                    { status: 400 }
                )
            }

            const userProfile = await prisma.user.findUnique({
                where: { email: user.email! }
            })

            const updatedAudit = await prisma.complianceAudit.update({
                where: { id: params.id },
                data: {
                    status: decision,
                    reviewedBy: userProfile?.id,
                    reviewedAt: new Date(),
                    reviewComments: comments,
                    correctiveActions: typeof correctiveActions === 'object' ? JSON.stringify(correctiveActions) : correctiveActions
                }
            })

            // Update mill certification status if approved
            if (decision === 'APPROVED' && audit.score && audit.score >= 75) {
                await prisma.mill.update({
                    where: { id: audit.millId },
                    data: {
                        certificationStatus: 'CERTIFIED',
                        certificationDate: new Date()
                    }
                })
            }

            // Create alert for mill
            await prisma.alert.create({
                data: {
                    type: 'AUDIT_REVIEWED',
                    category: 'COMPLIANCE',
                    severity: decision === 'APPROVED' ? 'LOW' : 'HIGH',
                    title: `Audit ${decision}`,
                    message: `Your compliance audit has been ${decision.toLowerCase()}. ${comments || ''}`,
                    sourceType: 'COMPLIANCE_AUDIT',
                    sourceId: audit.id,
                    millId: audit.millId,
                    status: 'ACTIVE' as any
                }
            })

            // Log the action
            if (userProfile) {
                await prisma.auditLog.create({
                    data: {
                        userId: userProfile.id,
                        action: 'AUDIT_REVIEW',
                        resourceType: 'COMPLIANCE_AUDIT',
                        resourceId: audit.id,
                        newValues: JSON.stringify({ decision, comments }),
                        ipAddress: request.ip || 'unknown',
                        userAgent: request.headers.get('user-agent') || 'unknown'
                    }
                })
            }

            return NextResponse.json({
                message: `Audit ${decision.toLowerCase()} successfully`,
                audit: updatedAudit
            })
        } catch (error) {
            console.error('Error reviewing audit:', error)
            return NextResponse.json(
                { error: 'Failed to review audit' },
                { status: 500 }
            )
        }
    }, {
        requiredRoles: ['INSPECTOR', 'PROGRAM_MANAGER', 'SYSTEM_ADMIN']
    })
}
