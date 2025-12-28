import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/lib/rbac'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/analytics/dashboard
 * Get dashboard analytics
 */
export async function GET(request: NextRequest) {
    return withAuth(async (user) => {
        const { searchParams } = new URL(request.url)
        const millId = searchParams.get('millId')
        const startDate = searchParams.get('startDate')
        const endDate = searchParams.get('endDate')

        try {
            const userProfile = await prisma.user.findUnique({
                where: { email: user.email! },
                select: { millId: true, role: true }
            })

            const where: any = {}

            // Role-based filtering
            if (userProfile?.role !== 'SYSTEM_ADMIN' && userProfile?.role !== 'PROGRAM_MANAGER') {
                if (userProfile?.millId) {
                    where.millId = userProfile.millId
                }
            } else if (millId) {
                where.millId = millId
            }

            if (startDate && endDate) {
                where.productionDate = {
                    gte: new Date(startDate),
                    lte: new Date(endDate)
                }
            }

            // Get production metrics
            const batches = await prisma.batchLog.findMany({ where })

            const totalBatches = batches.length
            const totalProduction = batches.reduce((sum, b) => sum + (b.actualOutputWeight || 0), 0)
            const avgYield = batches.length > 0
                ? batches.reduce((sum, b) => sum + (b.yieldPercentage || 0), 0) / batches.length
                : 0

            // QC metrics
            const qcPass = batches.filter(b => b.qcStatus === 'PASS' || b.qcStatus === 'EXCELLENT').length
            const qcPassRate = totalBatches > 0 ? (qcPass / totalBatches) * 100 : 0

            // Compliance metrics
            const audits = await prisma.complianceAudit.findMany({
                where: { millId: where.millId },
                orderBy: { auditDate: 'desc' },
                take: 10
            })

            const avgComplianceScore = audits.length > 0
                ? audits.reduce((sum, a) => sum + a.score, 0) / audits.length
                : 0

            // Maintenance metrics
            const maintenanceTasks = await prisma.maintenanceTask.findMany({
                where: { millId: where.millId }
            })

            const overdueMaintenance = maintenanceTasks.filter(
                t => t.status !== 'COMPLETED' && new Date(t.dueDate) < new Date()
            ).length

            // Active alerts
            const activeAlerts = await prisma.alert.findMany({
                where: {
                    millId: where.millId,
                    status: 'ACTIVE'
                }
            })

            return NextResponse.json({
                production: {
                    totalBatches,
                    totalProduction,
                    avgYield: Math.round(avgYield * 10) / 10
                },
                quality: {
                    qcPassRate: Math.round(qcPassRate * 10) / 10,
                    totalTests: batches.reduce((sum, b) => sum + (b.qcTests?.length || 0), 0)
                },
                compliance: {
                    avgScore: Math.round(avgComplianceScore * 10) / 10,
                    totalAudits: audits.length,
                    certified: audits.filter(a => a.status === 'APPROVED').length
                },
                maintenance: {
                    totalTasks: maintenanceTasks.length,
                    completed: maintenanceTasks.filter(t => t.status === 'COMPLETED').length,
                    overdue: overdueMaintenance
                },
                alerts: {
                    total: activeAlerts.length,
                    critical: activeAlerts.filter(a => a.severity === 'CRITICAL').length,
                    high: activeAlerts.filter(a => a.severity === 'HIGH').length
                }
            })
        } catch (error) {
            console.error('Error fetching analytics:', error)
            return NextResponse.json(
                { error: 'Failed to fetch analytics' },
                { status: 500 }
            )
        }
    })
}
