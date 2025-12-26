// Report type definitions

export type ReportCategory = 'operational' | 'management' | 'regulatory'

export type ReportTemplate = {
    id: string
    name: string
    category: ReportCategory
    description: string
    icon: string
    sections: string[]
    estimatedTime: string
}

export type GeneratedReport = {
    id: string
    templateId: string
    name: string
    date: string
    type: string
    status: 'Ready' | 'Generating' | 'Failed'
    size?: string
    format: 'PDF' | 'Excel' | 'PowerPoint'
}

export type ScheduledReport = {
    id: string
    templateId: string
    name: string
    recurrence: 'daily' | 'weekly' | 'monthly' | 'quarterly'
    time: string
    recipients: string[]
    enabled: boolean
    lastRun?: string
    nextRun: string
}

// Mock report templates
export const REPORT_TEMPLATES: ReportTemplate[] = [
    // Operational Reports
    {
        id: 'daily-production',
        name: 'Daily Production Summary',
        category: 'operational',
        description: 'Total output by line/mill, QC results, issues encountered, target vs actual',
        icon: 'Factory',
        sections: ['Production Output', 'QC Results', 'Issues Log', 'Performance Metrics'],
        estimatedTime: '2-3 minutes',
    },
    {
        id: 'weekly-maintenance',
        name: 'Weekly Maintenance Report',
        category: 'operational',
        description: 'Completed maintenance activities, overdue tasks, equipment status',
        icon: 'Wrench',
        sections: ['Completed Tasks', 'Overdue Items', 'Equipment Status', 'Upcoming Schedule'],
        estimatedTime: '3-4 minutes',
    },
    {
        id: 'monthly-compliance',
        name: 'Monthly Compliance Report',
        category: 'operational',
        description: 'Audit status, non-conformances and resolutions, training completion',
        icon: 'Shield',
        sections: ['Audit Status', 'Non-Conformances', 'Training Records', 'Compliance Score'],
        estimatedTime: '4-5 minutes',
    },
    // Management Reports
    {
        id: 'monthly-performance',
        name: 'Monthly Performance Dashboard',
        category: 'management',
        description: 'Executive summary with key metrics, production/quality/compliance highlights, financial summary',
        icon: 'BarChart',
        sections: ['Executive Summary', 'Key Metrics', 'Highlights', 'Financial Overview', 'Issues & Resolutions'],
        estimatedTime: '5-6 minutes',
    },
    {
        id: 'quarterly-review',
        name: 'Quarterly Business Review',
        category: 'management',
        description: 'Comprehensive performance analysis, trends and forecasts, strategic recommendations',
        icon: 'TrendingUp',
        sections: ['Performance Analysis', 'Trends & Forecasts', 'Strategic Recommendations', 'Benchmarking'],
        estimatedTime: '8-10 minutes',
    },
    // Regulatory Reports
    {
        id: 'compliance-audit',
        name: 'Compliance Audit Report',
        category: 'regulatory',
        description: 'Detailed findings by section, evidence attachments, corrective actions, sign-off approvals',
        icon: 'FileCheck',
        sections: ['Audit Findings', 'Evidence Documentation', 'Corrective Actions', 'Approvals'],
        estimatedTime: '6-8 minutes',
    },
    {
        id: 'batch-production',
        name: 'Batch Production Report',
        category: 'regulatory',
        description: 'Batch-by-batch records, QC test results, traceability documentation for authorities',
        icon: 'Package',
        sections: ['Batch Records', 'QC Test Results', 'Traceability Data', 'Certifications'],
        estimatedTime: '4-5 minutes',
    },
]

// Mock generated reports
export const GENERATED_REPORTS: GeneratedReport[] = [
    { id: 'RPT-001', templateId: 'daily-production', name: 'Daily Production Summary - Dec 25', date: '2024-12-25', type: 'Production', status: 'Ready', size: '2.4 MB', format: 'PDF' },
    { id: 'RPT-002', templateId: 'monthly-compliance', name: 'Monthly Compliance Report - December', date: '2024-12-20', type: 'Compliance', status: 'Ready', size: '3.1 MB', format: 'PDF' },
    { id: 'RPT-003', templateId: 'weekly-maintenance', name: 'Weekly Maintenance Report - Week 51', date: '2024-12-22', type: 'Maintenance', status: 'Ready', size: '1.8 MB', format: 'Excel' },
    { id: 'RPT-004', templateId: 'batch-production', name: 'Batch Production Report - Q4 2024', date: '2024-12-15', type: 'Regulatory', status: 'Ready', size: '5.2 MB', format: 'PDF' },
    { id: 'RPT-005', templateId: 'monthly-performance', name: 'Monthly Performance Dashboard - November', date: '2024-12-01', type: 'Management', status: 'Ready', size: '4.7 MB', format: 'PowerPoint' },
]

// Mock scheduled reports
export const SCHEDULED_REPORTS: ScheduledReport[] = [
    {
        id: 'SCH-001',
        templateId: 'daily-production',
        name: 'Daily Production Summary - Auto',
        recurrence: 'daily',
        time: '08:00',
        recipients: ['manager@mill.com', 'supervisor@mill.com'],
        enabled: true,
        lastRun: '2024-12-25 08:00',
        nextRun: '2024-12-26 08:00',
    },
    {
        id: 'SCH-002',
        templateId: 'weekly-maintenance',
        name: 'Weekly Maintenance Report - Auto',
        recurrence: 'weekly',
        time: 'Monday 09:00',
        recipients: ['maintenance@mill.com'],
        enabled: true,
        lastRun: '2024-12-23 09:00',
        nextRun: '2024-12-30 09:00',
    },
    {
        id: 'SCH-003',
        templateId: 'monthly-compliance',
        name: 'Monthly Compliance Report - Auto',
        recurrence: 'monthly',
        time: '1st of month 10:00',
        recipients: ['compliance@mill.com', 'manager@mill.com'],
        enabled: false,
        nextRun: '2025-01-01 10:00',
    },
]
