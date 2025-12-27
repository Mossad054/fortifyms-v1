
export interface ReportTemplate {
    id: string
    name: string
    description: string
    format: 'pdf' | 'excel' | 'pptx'
    category: 'executive' | 'operational' | 'compliance' | 'donor'
    sections: string[]
    lastGenerated?: string
    popularity: number
}

export interface ScheduledReport {
    id: string
    templateId: string
    templateName: string
    frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly'
    recipients: string[]
    nextRun: string
    status: 'active' | 'paused'
    lastRun?: string
}

// In-memory store for session persistence
export let REPORT_TEMPLATES: ReportTemplate[] = [
    {
        id: 'TPL-001',
        name: 'Executive Summary Dashboard',
        description: 'High-level KPIs and trends for leadership',
        format: 'pdf',
        category: 'executive',
        sections: ['Hero Metrics', 'Compliance Trends', 'Geographic Overview', 'Policy Impact'],
        lastGenerated: '2024-12-20',
        popularity: 95
    },
    {
        id: 'TPL-002',
        name: 'Mill Performance Report',
        description: 'Detailed mill-by-mill analysis with benchmarking',
        format: 'excel',
        category: 'operational',
        sections: ['Top Performers', 'At-Risk Mills', 'Benchmarking', 'Recommendations'],
        lastGenerated: '2024-12-19',
        popularity: 88
    },
    {
        id: 'TPL-003',
        name: 'Donor Impact Presentation',
        description: 'Visual presentation for donor reporting',
        format: 'pptx',
        category: 'donor',
        sections: ['Program Reach', 'Nutritional Outcomes', 'SDG Alignment', 'Success Stories'],
        lastGenerated: '2024-12-18',
        popularity: 92
    },
    {
        id: 'TPL-004',
        name: 'Compliance Audit Report',
        description: 'Regulatory compliance and QC analysis',
        format: 'pdf',
        category: 'compliance',
        sections: ['Compliance Rates', 'QC Failures', 'Corrective Actions', 'Training Gaps'],
        lastGenerated: '2024-12-21',
        popularity: 85
    },
    {
        id: 'TPL-005',
        name: 'Procurement Analytics',
        description: 'Institutional supply and buyer analytics',
        format: 'excel',
        category: 'operational',
        sections: ['RFP Activity', 'Delivery Performance', 'Buyer Satisfaction', 'Market Coverage'],
        lastGenerated: '2024-12-20',
        popularity: 78
    },
]

export const SCHEDULED_REPORTS: ScheduledReport[] = [
    {
        id: 'SCH-001',
        templateId: 'TPL-001',
        templateName: 'Executive Summary Dashboard',
        frequency: 'weekly',
        recipients: ['director@fwga.org', 'pm@fwga.org'],
        nextRun: '2024-12-27',
        status: 'active',
        lastRun: '2024-12-20'
    },
    {
        id: 'SCH-002',
        templateId: 'TPL-003',
        templateName: 'Donor Impact Presentation',
        frequency: 'monthly',
        recipients: ['donors@fwga.org', 'communications@fwga.org'],
        nextRun: '2025-01-01',
        status: 'active',
        lastRun: '2024-12-01'
    },
    {
        id: 'SCH-003',
        templateId: 'TPL-004',
        templateName: 'Compliance Audit Report',
        frequency: 'quarterly',
        recipients: ['compliance@fwga.org', 'legal@fwga.org'],
        nextRun: '2025-01-15',
        status: 'paused',
        lastRun: '2024-10-15'
    },
]

export const addTemplate = (template: ReportTemplate) => {
    REPORT_TEMPLATES = [template, ...REPORT_TEMPLATES]
}
