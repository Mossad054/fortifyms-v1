export type CommodityType = 'Maize Flour' | 'Rice' | 'Wheat Flour' | 'Salt' | 'Oil';
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
    evidenceUrls?: string[];
    isNonCompliant?: boolean;
}

export interface AuditSession {
    id: string;
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
}
