export type EvidenceType = 'Photo' | 'Document' | 'Sign-off';

export interface Evidence {
    id: string;
    url: string;
    type: EvidenceType;
    itemId: string; // Links to ChecklistItem
    auditId: string;
    uploadedAt: string;
    uploadedBy: string; // userId
    metadata?: {
        geolocation?: {
            lat: number;
            lng: number;
            accuracy?: number;
        };
        device?: string;
        fileSize?: number;
        mimeType?: string;
        hash?: string;
    };
}
