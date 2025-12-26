export type CommodityType = 'Maize Flour' | 'Rice' | 'Wheat Flour' | 'Salt' | 'Oil';
import { Evidence } from './evidence';
export type FortificationMethod = 'Continuous Dosing' | 'Batch Blending' | 'FRK Blending';
export type Criticality = 'Critical' | 'Major' | 'Minor';
export type ResponseType = 'YesNo' | 'Numeric' | 'Dropdown' | 'Text' | 'Photo' | 'Document' | 'MultipleChoice';
export type AuditStatus = 'Pending' | 'In Progress' | 'Submitted' | 'Reviewing' | 'Approved' | 'Rejected' | 'CAPA Required';

export interface ConditionalLogic {
    triggerItemId: string;
    triggerValue: string | boolean | number;
    action: 'show' | 'require';
}

export interface ChecklistItem {
    id: string;
    sectionId: string;
    text: string;
    description?: string;
    hint?: string; // "What to look for" or "Inspector Note"
    type: ResponseType;
    options?: string[]; // For Dropdown or MultipleChoice
    numericConfig?: {
        target: number;
        tolerancePercent?: number; // e.g. 10% -> +/- 10% of target is COMPLIANT
        min?: number; // Absolute min (below = Critical Fail)
        max?: number; // Absolute max (above = Critical Fail)
        unit: string;
    };
    unit?: string; // For Numeric
    criticality: Criticality;
    weight?: number; // Points assigned if compliant
    requiredEvidence?: ('Photo' | 'Document')[];
    conditional?: ConditionalLogic;
}

export interface ChecklistSection {
    id: string;
    title: string;
    description?: string;
    items: ChecklistItem[];
    weight?: number; // For scoring
    minimumPassThreshold?: number; // e.g., 70 for 70%
}

export interface ChecklistTemplate {
    id: string;
    title: string;
    version: string;
    commodity: CommodityType;
    fortificationMethod?: FortificationMethod[];
    regulatoryReference: string;
    sections: ChecklistSection[];
    status: 'Draft' | 'Published' | 'Archived';
    createdAt: string;
    updatedAt: string;
}

export interface AuditResponse {
    itemId: string;
    value: string | number | boolean;
    notes?: string;
    evidence?: Evidence[];
    isNonCompliant?: boolean;
    flagLevel?: 'Red' | 'Yellow' | 'None'; // Auto-calculated based on logic
    score?: number; // Points earned
    maxScore?: number; // Points possible
    isNA?: boolean;
    naJustification?: string;
    deviationPercent?: number; // Deviation from target for numeric items
}

export interface AuditFlag {
    id: string;
    auditId: string;
    itemId: string;
    severity: 'Red' | 'Yellow';
    message: string;
    generatedAt: string;
}

export interface AuditSchedule {
    id: string;
    millId: string;
    templateId: string;
    scheduledDate: string; // ISO Date
    assignedInspectorId: string;
    status: 'Pending' | 'Overdue' | 'Completed';
}

export interface AuditSession {
    id: string;
    scheduleId?: string; // Link to schedule
    templateId: string;
    millId: string;
    inspectorId?: string; // Null for self-audit
    operatorId?: string; // For self-audit
    type: 'Self-Audit' | 'Official Inspection' | 'Spot Check';
    status: AuditStatus;
    startDate: string;
    completedDate?: string;
    responses: Record<string, AuditResponse>; // Keyed by itemId
    score: number;
    criticalFailures: string[]; // List of Critical Item IDs failed
    overallResult: 'Certified' | 'Conditionally Approved' | 'Non-Compliant';
    location?: { lat: number; lng: number };
    templateVersion: string;
    templateSnapshot?: ChecklistTemplate; // Complete template at time of audit
    isLocked?: boolean; // Prevents further changes to responses
    isFinalized?: boolean; // Audit complete and score locked
    calculatedAt?: string;
    calculationHash?: string; // Integrity check
}
