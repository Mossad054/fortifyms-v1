import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/lib/rbac'
import { prisma } from '@/lib/prisma'
import { AlertType, AlertCategory, AlertSeverity, AlertStatus } from '@prisma/client'

/**
 * POST /api/compliance/audits/[id]/submit
 * Submit audit for review
 */
export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    return withAuth(async (user) => {
        try {
            const audit = await prisma.complianceAudit.findUnique({
                where: { id: params.id },
                include: {
                    mill: true,
                    template: true
                }
            })

            if (!audit) {
                return NextResponse.json(
                    { error: 'Audit not found' },
                    { status: 404 }
                )
            }

            if (audit.status !== 'IN_PROGRESS') {
                return NextResponse.json(
                    { error: 'Audit already submitted' },
                    { status: 400 }
                )
            }

            // Update status to submitted
            const updatedAudit = await prisma.complianceAudit.update({
                where: { id: params.id },
                data: {
                    status: 'SUBMITTED',
                    submittedAt: new Date(),
                    submittedBy: (await prisma.user.findUnique({ where: { email: user.email! } }))?.id
                }
            })

            // Create alert for inspector
            await prisma.alert.create({
                data: {
                    type: (audit.score && audit.score < 60) ? AlertType.CRITICAL_NON_COMPLIANCE : AlertType.COMPLIANCE_SCORE_DROP,
                    category: AlertCategory.COMPLIANCE,
                    severity: (audit.score && audit.score < 60) ? AlertSeverity.HIGH : AlertSeverity.MEDIUM,
                    title: 'New Audit Submitted for Review',
                    message: `${audit.mill.name} submitted compliance audit. Score: ${audit.score || 0}%`,
                    sourceType: 'COMPLIANCE_AUDIT',
                    sourceId: audit.id,
                    millId: audit.millId,
                    status: AlertStatus.ACTIVE
                }
            })

            // Log the action
            const dbUser = await prisma.user.findUnique({ where: { email: user.email! } })
            if (dbUser) {
                await prisma.auditLog.create({
                    data: {
                        userId: dbUser.id,
                        action: 'AUDIT_SUBMIT',
                        resourceType: 'COMPLIANCE_AUDIT',
                        resourceId: audit.id,
                        newValues: JSON.stringify({ status: 'SUBMITTED', score: audit.score }),
                        ipAddress: request.ip || 'unknown',
                        userAgent: request.headers.get('user-agent') || 'unknown'
                    }
                })
            }

            return NextResponse.json({
                message: 'Audit submitted successfully',
                audit: updatedAudit
            })
        } catch (error) {
            console.error('Error submitting audit:', error)
            return NextResponse.json(
                { error: 'Failed to submit audit' },
                { status: 500 }
            )
        }
    }, {
        requiredPermissions: ['submit:audits']
    })
}
