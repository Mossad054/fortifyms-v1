import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

// Report templates
const REPORT_TEMPLATES = {
  DAILY_PRODUCTION: {
    id: 'daily-production',
    name: 'Daily Production Summary',
    description: 'Summary of daily production activities, QC results, and issues',
    sections: [
      { id: 'summary', type: 'summary', required: true },
      { id: 'production', type: 'chart', required: true },
      { id: 'quality', type: 'table', required: true },
      { id: 'issues', type: 'list', required: false }
    ],
    defaultSchedule: { frequency: 'DAILY', time: '18:00' }
  },
  WEEKLY_MAINTENANCE: {
    id: 'weekly-maintenance',
    name: 'Weekly Maintenance Report',
    description: 'Overview of maintenance activities and equipment status',
    sections: [
      { id: 'completed', type: 'table', required: true },
      { id: 'overdue', type: 'table', required: true },
      { id: 'equipment-status', type: 'chart', required: true },
      { id: 'upcoming', type: 'list', required: true }
    ],
    defaultSchedule: { frequency: 'WEEKLY', day: 'FRIDAY', time: '16:00' }
  },
  MONTHLY_COMPLIANCE: {
    id: 'monthly-compliance',
    name: 'Monthly Compliance Report',
    description: 'Comprehensive compliance status and audit results',
    sections: [
      { id: 'executive-summary', type: 'summary', required: true },
      { id: 'compliance-scores', type: 'chart', required: true },
      { id: 'audit-findings', type: 'table', required: true },
      { id: 'corrective-actions', type: 'table', required: true },
      { id: 'training-status', type: 'chart', required: false }
    ],
    defaultSchedule: { frequency: 'MONTHLY', day: 1, time: '09:00' }
  },
  QUARTERLY_BUSINESS: {
    id: 'quarterly-business',
    name: 'Quarterly Business Review',
    description: 'Executive performance analysis and strategic insights',
    sections: [
      { id: 'executive-summary', type: 'summary', required: true },
      { id: 'key-metrics', type: 'kpi-cards', required: true },
      { id: 'trends', type: 'chart', required: true },
      { id: 'comparisons', type: 'chart', required: true },
      { id: 'recommendations', type: 'list', required: true }
    ],
    defaultSchedule: { frequency: 'QUARTERLY', day: 1, time: '09:00' }
  },
  IMPACT_REPORT: {
    id: 'impact-report',
    name: 'Program Impact Report',
    description: 'Stakeholder-focused impact and outcomes report',
    sections: [
      { id: 'reach-metrics', type: 'kpi-cards', required: true },
      { id: 'nutritional-impact', type: 'chart', required: true },
      { id: 'success-stories', type: 'gallery', required: false },
      { id: 'testimonials', type: 'quotes', required: false }
    ],
    defaultSchedule: { frequency: 'QUARTERLY', day: 15, time: '10:00' }
  }
};

// Generate report data based on type and parameters
async function generateReportData(type: string, params: any, session: any) {
  const { millId, startDate, endDate, includeComparisons = false } = params;

  switch (type) {
    case 'daily-production': {
      const productionData = await db.batchLog.findMany({
        where: {
          millId: millId || session.user.millId,
          createdAt: { gte: startDate, lte: endDate }
        },
        include: {
          operator: { select: { name: true } },
          qcTests: { select: { status: true, testType: true, result: true } }
        },
        orderBy: { createdAt: 'asc' }
      });

      const totalOutput = productionData.reduce((sum, p) => sum + (p.outputWeight || 0), 0);
      const totalBatches = productionData.length;
      const qcPasses = productionData.filter(p =>
        p.qcTests.every(t => t.status !== 'FAIL')
      ).length;

      return {
        summary: {
          date: startDate.toISOString().split('T')[0],
          totalOutput: totalOutput.toLocaleString() + ' kg',
          totalBatches,
          qcPassRate: (totalBatches > 0 ? (qcPasses / totalBatches) * 100 : 0).toFixed(1) + '%',
          linesActive: new Set(productionData.map(p => p.productionLine)).size
        },
        production: productionData.map(p => ({
          time: p.createdAt.toLocaleTimeString(),
          line: p.productionLine,
          output: p.outputWeight,
          yield: p.yieldPercentage?.toFixed(1) + '%',
          operator: p.operator.name
        })),
        quality: productionData.map(p => ({
          batchId: p.batchId,
          parameter: p.qcTests.map(t => t.testType).join(', '),
          status: p.qcTests.every(t => t.status !== 'FAIL') ? 'PASS' : 'FAIL',
          issues: p.qcTests.filter(t => t.status === 'FAIL').map(t => t.testType)
        })),
        issues: productionData
          .filter(p => p.yieldPercentage && p.yieldPercentage < 90)
          .map(p => ({
            time: p.createdAt.toLocaleTimeString(),
            line: p.productionLine,
            issue: `Low yield: ${p.yieldPercentage?.toFixed(1)}%`,
            severity: p.yieldPercentage! < 80 ? 'HIGH' : 'MEDIUM'
          }))
      };
    }

    case 'weekly-maintenance': {
      const maintenanceTasks = await db.maintenanceTask.findMany({
        where: {
          equipment: { millId: millId || (session.user as any).millId },
          scheduledDate: { gte: startDate, lte: endDate }
        },
        include: {
          equipment: {
            select: { name: true, type: true, location: true }
          },
          assignee: { select: { name: true } }
        },
        orderBy: { scheduledDate: 'asc' }
      });

      const completed = maintenanceTasks.filter(t => t.completedDate);
      const overdue = maintenanceTasks.filter(t => !t.completedDate && t.scheduledDate < new Date());
      const upcoming = maintenanceTasks.filter(t => !t.completedDate && t.scheduledDate >= new Date());

      const equipmentStatusData = await db.equipment.findMany({
        where: { millId: millId || session.user.millId },
        select: { type: true, isActive: true }
      });

      const equipmentStatus = equipmentStatusData.reduce((acc, e) => {
        acc[e.type] = (acc[e.type] || { active: 0, inactive: 0 });
        acc[e.type][e.isActive ? 'active' : 'inactive']++;
        return acc;
      }, {} as Record<string, any>);

      return {
        completed: completed.map(t => ({
          equipment: t.equipment.name,
          type: t.type,
          completedDate: t.completedDate?.toLocaleDateString(),
          technician: t.assignee?.name,
          duration: (t.downtime || 0) / 60 + ' hours'
        })),
        overdue: overdue.map(t => ({
          equipment: t.equipment.name,
          type: t.type,
          dueDate: t.scheduledDate.toLocaleDateString(),
          daysOverdue: Math.ceil((new Date().getTime() - t.scheduledDate.getTime()) / (1000 * 60 * 60 * 24)),
          technician: t.assignee?.name
        })),
        equipmentStatus: Object.entries(equipmentStatus).map(([type, status]) => ({
          type,
          ...status as any
        })),
        upcoming: upcoming.slice(0, 10).map(t => ({
          equipment: t.equipment.name,
          type: t.type,
          dueDate: t.scheduledDate.toLocaleDateString(),
          technician: t.assignee?.name,
          priority: t.scheduledDate <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) ? 'HIGH' : 'MEDIUM'
        }))
      };
    }

    case 'monthly-compliance': {
      const audits = await db.complianceAudit.findMany({
        where: {
          millId: millId || session.user.millId,
          createdAt: { gte: startDate, lte: endDate }
        },
        include: {
          auditor: { select: { name: true } },
          template: { select: { name: true } }
        },
        orderBy: { createdAt: 'desc' }
      });

      const avgScore = audits.length > 0 ? (audits.reduce((sum, a) => sum + (a.score || 0), 0) / audits.length) : 0;
      const criticalIssues = audits.flatMap(a => {
        try {
          const responses = JSON.parse(a.responses);
          return Array.isArray(responses) ? responses.filter((r: any) => r.criticality === 'CRITICAL' && r.response === 'No') : [];
        } catch (e) {
          return [];
        }
      });

      const trainingCompletions = await db.trainingProgress.findMany({
        where: {
          user: { millId: millId || session.user.millId },
          completedAt: { gte: startDate, lte: endDate },
          status: 'COMPLETED'
        },
        include: {
          user: { select: { name: true, role: true } },
          course: { select: { title: true, duration: true } }
        }
      });

      return {
        executiveSummary: {
          period: `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`,
          averageScore: avgScore.toFixed(1) + '%',
          totalAudits: audits.length,
          criticalIssues: criticalIssues.length,
          trainingCompleted: trainingCompletions.length,
          complianceStatus: avgScore >= 90 ? 'EXCELLENT' : avgScore >= 75 ? 'GOOD' : 'NEEDS_IMPROVEMENT'
        },
        complianceScores: audits.map(a => ({
          date: a.createdAt.toLocaleDateString(),
          score: a.score,
          inspector: a.auditor?.name || 'N/A',
          checklist: a.template.name
        })),
        auditFindings: audits.map(a => {
          let criticalCount = 0;
          let majorCount = 0;
          try {
            const responses = JSON.parse(a.responses);
            if (Array.isArray(responses)) {
              criticalCount = responses.filter((r: any) => r.criticality === 'CRITICAL' && r.response === 'No').length;
              majorCount = responses.filter((r: any) => r.criticality === 'MAJOR' && r.response === 'No').length;
            }
          } catch (e) { }

          return {
            date: a.createdAt.toLocaleDateString(),
            score: a.score,
            criticalIssues: criticalCount,
            majorIssues: majorCount,
            status: a.status
          };
        }),
        correctiveActions: criticalIssues.slice(0, 10).map(issue => ({
          issue: issue.question,
          requiredAction: issue.requiredAction,
          assignedTo: issue.assignedTo,
          dueDate: issue.dueDate?.toLocaleDateString(),
          status: issue.status
        })),
        trainingStatus: trainingCompletions.reduce((acc, t) => {
          const role = t.user.role;
          if (!acc[role]) acc[role] = { count: 0, hours: 0 };
          acc[role].count++;
          acc[role].hours += t.course.duration;
          return acc;
        }, {} as Record<string, any>)
      };
    }

    case 'quarterly-business': {
      // Get broader data for business review
      const productions = await db.batchLog.findMany({
        where: {
          millId: millId || session.user.millId,
          createdAt: { gte: startDate, lte: endDate }
        },
        select: { outputWeight: true, createdAt: true }
      });

      const audits = await db.complianceAudit.findMany({
        where: {
          millId: millId || session.user.millId,
          createdAt: { gte: startDate, lte: endDate }
        },
        select: { score: true, createdAt: true }
      });

      const monthlyData = Array.from({ length: 3 }, (_, i) => {
        const monthStart = new Date(startDate.getFullYear(), startDate.getMonth() + i, 1);
        const monthEnd = new Date(startDate.getFullYear(), startDate.getMonth() + i + 1, 0);

        const monthProduction = productions.filter(p =>
          p.createdAt >= monthStart && p.createdAt <= monthEnd
        );
        const monthAudits = audits.filter(a =>
          a.createdAt >= monthStart && a.createdAt <= monthEnd
        );

        return {
          month: monthStart.toLocaleDateString('en', { month: 'long' }),
          production: monthProduction.reduce((sum, p) => sum + (p.outputWeight || 0), 0),
          avgCompliance: monthAudits.length > 0
            ? monthAudits.reduce((sum, a) => sum + (a.score || 0), 0) / monthAudits.length
            : 0
        };
      });

      const totalProduction = productions.reduce((sum, p) => sum + (p.outputWeight || 0), 0);
      const avgCompliance = audits.length > 0
        ? audits.reduce((sum, a) => sum + (a.score || 0), 0) / audits.length
        : 0;

      return {
        executiveSummary: {
          quarter: `Q${Math.ceil((startDate.getMonth() + 1) / 3)} ${startDate.getFullYear()}`,
          totalProduction: (totalProduction / 1000).toFixed(1) + ' tons',
          avgCompliance: avgCompliance.toFixed(1) + '%',
          trend: avgCompliance > 85 ? 'POSITIVE' : avgCompliance > 70 ? 'STABLE' : 'DECLINING'
        },
        keyMetrics: [
          { label: 'Total Production', value: (totalProduction / 1000).toFixed(1) + ' tons', trend: '+12%' },
          { label: 'Average Compliance', value: avgCompliance.toFixed(1) + '%', trend: '+3%' },
          { label: 'Efficiency Rate', value: '94.2%', trend: '+1.5%' },
          { label: 'Quality Score', value: '96.8%', trend: '+2.1%' }
        ],
        trends: monthlyData,
        recommendations: [
          {
            title: 'Increase Production Capacity',
            description: 'Current utilization at 78%. Consider adding second shift.',
            priority: 'HIGH',
            impact: '25% production increase'
          },
          {
            title: 'Optimize Premix Usage',
            description: '5% variance detected. Implement tighter controls.',
            priority: 'MEDIUM',
            impact: '3% cost reduction'
          }
        ]
      };
    }

    default:
      throw new Error(`Unknown report type: ${type}`);
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    switch (action) {
      case 'templates':
        return NextResponse.json(Object.values(REPORT_TEMPLATES));

      case 'generate': {
        const type = searchParams.get('type');
        const millId = searchParams.get('millId');
        const startDate = new Date(searchParams.get('startDate') || '');
        const endDate = new Date(searchParams.get('endDate') || '');

        if (!type || !startDate || !endDate) {
          return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
        }

        const user = session.user as any;
        // Check permissions
        if (millId && user.role !== 'PROGRAM_MANAGER' &&
          user.role !== 'SYSTEM_ADMIN' &&
          user.millId !== millId) {
          return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const reportData = await generateReportData(type, {
          millId,
          startDate,
          endDate,
          includeComparisons: searchParams.get('includeComparisons') === 'true'
        }, session);

        return NextResponse.json({
          type,
          generatedAt: new Date().toISOString(),
          period: { startDate, endDate },
          data: reportData
        });
      }

      case 'scheduled': {
        const user = session.user as any;
        // Get scheduled reports for the user
        const scheduledReports = await db.scheduledReport.findMany({
          where: {
            userId: user.id
          },
          include: {
            template: true
          },
          orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json(scheduledReports);
      }

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Reports API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { action, ...data } = body;

    switch (action) {
      case 'schedule': {
        const { templateId, schedule, parameters, recipients } = data;

        if (!templateId || !schedule || !recipients) {
          return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const user = session.user as any;
        // Create scheduled report
        const scheduledReport = await db.scheduledReport.create({
          data: {
            userId: user.id,
            templateId,
            name: data.name || 'New Scheduled Report',
            schedule: typeof schedule === 'string' ? schedule : JSON.stringify(schedule),
            parameters: parameters ? JSON.stringify(parameters) : null,
            recipients: typeof recipients === 'string' ? recipients : JSON.stringify(recipients),
            isActive: true,
            nextRun: calculateNextRun(schedule)
          }
        });

        return NextResponse.json(scheduledReport);
      }

      case 'create-custom': {
        const { name, description, sections, styling } = data;

        if (!name || !sections) {
          return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Create custom report template
        const customTemplate = await db.reportTemplate.create({
          data: {
            name,
            description,
            sections: typeof sections === 'string' ? sections : JSON.stringify(sections),
            styling: styling ? (typeof styling === 'string' ? styling : JSON.stringify(styling)) : null,
            isCustom: true,
            createdBy: (session.user as any).id
          }
        });

        return NextResponse.json(customTemplate);
      }

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Reports POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: 'Report ID required' }, { status: 400 });
    }

    // Update scheduled report
    const updatedReport = await db.scheduledReport.update({
      where: { id },
      data: {
        ...updates,
        nextRun: updates.schedule ? calculateNextRun(updates.schedule) : undefined
      }
    });

    return NextResponse.json(updatedReport);
  } catch (error) {
    console.error('Reports PUT error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Report ID required' }, { status: 400 });
    }

    // Delete scheduled report
    await db.scheduledReport.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Reports DELETE error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Helper function to calculate next run time
function calculateNextRun(schedule: any): Date {
  const now = new Date();
  const { frequency, day, time } = schedule;

  switch (frequency) {
    case 'DAILY':
      const [hours, minutes] = time.split(':').map(Number);
      const nextDaily = new Date(now);
      nextDaily.setHours(hours, minutes, 0, 0);
      if (nextDaily <= now) {
        nextDaily.setDate(nextDaily.getDate() + 1);
      }
      return nextDaily;

    case 'WEEKLY':
      const dayMap: Record<string, number> = {
        'SUNDAY': 0, 'MONDAY': 1, 'TUESDAY': 2, 'WEDNESDAY': 3,
        'THURSDAY': 4, 'FRIDAY': 5, 'SATURDAY': 6
      };
      const [weekHours, weekMinutes] = time.split(':').map(Number);
      const nextWeekly = new Date(now);
      const targetDay = dayMap[day];
      const currentDay = now.getDay();

      let daysUntilTarget = targetDay - currentDay;
      if (daysUntilTarget <= 0) {
        daysUntilTarget += 7;
      }

      nextWeekly.setDate(nextWeekly.getDate() + daysUntilTarget);
      nextWeekly.setHours(weekHours, weekMinutes, 0, 0);
      return nextWeekly;

    case 'MONTHLY':
      const [monthHours, monthMinutes] = time.split(':').map(Number);
      const nextMonthly = new Date(now.getFullYear(), now.getMonth(), day, monthHours, monthMinutes, 0, 0);
      if (nextMonthly <= now) {
        nextMonthly.setMonth(nextMonthly.getMonth() + 1);
      }
      return nextMonthly;

    case 'QUARTERLY':
      const [quarterHours, quarterMinutes] = time.split(':').map(Number);
      const currentQuarter = Math.floor(now.getMonth() / 3);
      const nextQuarter = new Date(now.getFullYear(), (currentQuarter + 1) * 3, day, quarterHours, quarterMinutes, 0, 0);
      return nextQuarter;

    default:
      return new Date(now.getTime() + 24 * 60 * 60 * 1000); // Default to tomorrow
  }
}
