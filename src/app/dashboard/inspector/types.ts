// Inspector-specific type definitions

export type InspectorAssignment = {
    inspectorId: string
    inspectorName: string
    region: string[]
    country: string[]
    millIds: string[]
    commodities: ('Maize' | 'Rice' | 'Wheat')[]
    assignedDate: string
    active: boolean
}

export type PendingReview = {
    id: string
    type: 'audit_submission' | 'corrective_action' | 'verification_batch'
    millId: string
    millName: string
    region: string
    country: string
    submissionDate: string
    daysOutstanding: number
    riskLevel: 'critical' | 'major' | 'minor'
    status: 'awaiting_review' | 'clarification_requested' | 'escalated'
    deadline?: string
    summary: string
}

export type MillComplianceProfile = {
    millId: string
    millName: string
    location: { region: string, country: string }
    complianceScore: number
    trend: 'improving' | 'declining' | 'stable'
    certificationStatus: 'certified' | 'provisional' | 'suspended'
    lastAuditDate: string
    nextAuditDate: string
    activeAlerts: number
    openNonConformances: number
    qcPerformance: {
        passRate: number
        marginalRate: number
        failRate: number
    }
}

export type AuditDecision = {
    auditId: string
    inspectorId: string
    decision: 'approve' | 'reject' | 'escalate'
    justification: string
    requiredCorrections?: string[]
    deadline?: string
    digitalSignature?: string
    timestamp: string
    immutable: true
}

export type Escalation = {
    id: string
    sourceType: 'audit' | 'corrective_action' | 'systemic_risk'
    sourceId: string
    millId: string
    millName: string
    reason: string
    severity: 'critical' | 'high' | 'medium'
    escalatedTo: 'program_manager' | 'regional_authority' | 'mill_owner'
    escalatedBy: string
    escalatedAt: string
    status: 'pending' | 'acknowledged' | 'resolved'
    resolution?: string
}

export type NonConformance = {
    id: string
    millId: string
    dateRaised: string
    severity: 'minor' | 'major' | 'critical'
    description: string
    rootCause: string
    correctiveActions: string[]
    status: 'open' | 'closed'
    evidenceUrls?: string[]
    closedDate?: string
}

// Mock data for development
export const MOCK_PENDING_REVIEWS: PendingReview[] = [
    {
        id: 'REV-001',
        type: 'audit_submission',
        millId: 'MILL-042',
        millName: 'Golden Grain Mills',
        region: 'Central',
        country: 'Kenya',
        submissionDate: '2024-12-20',
        daysOutstanding: 6,
        riskLevel: 'critical',
        status: 'awaiting_review',
        deadline: '2024-12-27',
        summary: 'Q4 2024 compliance audit submission with 3 major findings requiring review'
    },
    {
        id: 'REV-002',
        type: 'corrective_action',
        millId: 'MILL-018',
        millName: 'Rift Valley Processors',
        region: 'Rift Valley',
        country: 'Kenya',
        submissionDate: '2024-12-18',
        daysOutstanding: 8,
        riskLevel: 'major',
        status: 'awaiting_review',
        summary: 'Response to NC-2024-156: Calibration drift corrective action plan'
    },
    {
        id: 'REV-003',
        type: 'verification_batch',
        millId: 'MILL-031',
        millName: 'Coastal Millers Ltd',
        region: 'Coast',
        country: 'Kenya',
        submissionDate: '2024-12-22',
        daysOutstanding: 4,
        riskLevel: 'major',
        status: 'awaiting_review',
        summary: 'Post-suspension verification batch - 5 consecutive batches for review'
    },
    {
        id: 'REV-004',
        type: 'audit_submission',
        millId: 'MILL-007',
        millName: 'Maize Masters Co',
        region: 'Western',
        country: 'Kenya',
        submissionDate: '2024-12-15',
        daysOutstanding: 11,
        riskLevel: 'critical',
        status: 'clarification_requested',
        summary: 'Annual certification audit - missing QC documentation'
    },
    {
        id: 'REV-005',
        type: 'corrective_action',
        millId: 'MILL-023',
        millName: 'Premium Flour Mills',
        region: 'Nairobi',
        country: 'Kenya',
        submissionDate: '2024-12-24',
        daysOutstanding: 2,
        riskLevel: 'minor',
        status: 'awaiting_review',
        summary: 'Minor documentation update - training records completion'
    },
]

export const MOCK_ASSIGNED_MILLS: MillComplianceProfile[] = [
    {
        millId: 'MILL-042',
        millName: 'Golden Grain Mills',
        location: { region: 'Central', country: 'Kenya' },
        complianceScore: 87,
        trend: 'declining',
        certificationStatus: 'certified',
        lastAuditDate: '2024-09-15',
        nextAuditDate: '2025-03-15',
        activeAlerts: 3,
        openNonConformances: 2,
        qcPerformance: {
            passRate: 89,
            marginalRate: 8,
            failRate: 3
        }
    },
    {
        millId: 'MILL-018',
        millName: 'Rift Valley Processors',
        location: { region: 'Rift Valley', country: 'Kenya' },
        complianceScore: 92,
        trend: 'stable',
        certificationStatus: 'certified',
        lastAuditDate: '2024-10-20',
        nextAuditDate: '2025-04-20',
        activeAlerts: 1,
        openNonConformances: 1,
        qcPerformance: {
            passRate: 94,
            marginalRate: 5,
            failRate: 1
        }
    },
    {
        millId: 'MILL-031',
        millName: 'Coastal Millers Ltd',
        location: { region: 'Coast', country: 'Kenya' },
        complianceScore: 68,
        trend: 'improving',
        certificationStatus: 'provisional',
        lastAuditDate: '2024-11-01',
        nextAuditDate: '2025-01-15',
        activeAlerts: 5,
        openNonConformances: 4,
        qcPerformance: {
            passRate: 78,
            marginalRate: 15,
            failRate: 7
        }
    },
    {
        millId: 'MILL-007',
        millName: 'Maize Masters Co',
        location: { region: 'Western', country: 'Kenya' },
        complianceScore: 95,
        trend: 'improving',
        certificationStatus: 'certified',
        lastAuditDate: '2024-08-10',
        nextAuditDate: '2025-02-10',
        activeAlerts: 0,
        openNonConformances: 0,
        qcPerformance: {
            passRate: 97,
            marginalRate: 3,
            failRate: 0
        }
    },
]
