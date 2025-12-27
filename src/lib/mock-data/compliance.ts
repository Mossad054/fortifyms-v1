import { ChecklistTemplate, AuditSession, AuditSchedule, AuditFlag } from '@/lib/types/compliance-audit'

export const MOCK_TEMPLATES: ChecklistTemplate[] = [
    {
        id: 'T-MAIZE-EXT',
        title: 'Mills Inspection Protocol: Maize Flour Fortification',
        version: 'KS-EAS-768:2019 (Rev 2)',
        commodity: 'Maize Flour',
        regulatoryReference: 'Public Health (Food Handling) Rules & KS EAS 768',
        status: 'Published',
        createdAt: '2024-01-15',
        updatedAt: '2024-12-26',
        sections: [
            // SECTION 1: PREMIX STORAGE & HANDLING
            {
                id: 'S1',
                title: '1. Premix Storage & Handling',
                description: 'Verification of premix quality protection and inventory control.',
                minimumPassThreshold: 80, // Section threshold
                items: [
                    {
                        id: '1.1',
                        sectionId: 'S1',
                        text: 'Is the premix stored in a cool, dry location away from direct sunlight?',
                        type: 'YesNo',
                        criticality: 'Critical',
                        weight: 10,
                        requiredEvidence: ['Photo'],
                        hint: 'Inspect storage room. Temp should be < 25°C. No windows allowing direct UV exposure.'
                    },
                    {
                        id: '1.2',
                        sectionId: 'S1',
                        text: 'Is the storage area secured with limited access?',
                        type: 'YesNo',
                        criticality: 'Minor',
                        weight: 2,
                        hint: 'Check for locks and access logs.'
                    },
                    {
                        id: '1.3',
                        sectionId: 'S1',
                        text: 'Is Stock Rotation (FIFO) being strictly practiced?',
                        type: 'YesNo',
                        criticality: 'Major',
                        weight: 5,
                        hint: 'Check expiry dates. Oldest stock should be at the front.'
                    },
                    {
                        id: '1.4',
                        sectionId: 'S1',
                        text: 'Are opened boxes resealed immediately after use?',
                        type: 'YesNo',
                        criticality: 'Major',
                        weight: 5,
                        hint: 'Premix is hygroscopic. Check for clumping in open boxes.'
                    }
                ]
            },
            // SECTION 2: DOSING EQUIPMENT
            {
                id: 'S2',
                title: '2. Dosing Equipment',
                description: 'Assessment of micro-doser condition and calibration.',
                minimumPassThreshold: 70,
                items: [
                    {
                        id: '2.1',
                        sectionId: 'S2',
                        text: 'Is a functional Micro-Doser installed?',
                        type: 'YesNo',
                        criticality: 'Critical',
                        weight: 10,
                        requiredEvidence: ['Photo'],
                        hint: 'Equipment must be present and powered on.'
                    },
                    {
                        id: '2.2',
                        sectionId: 'S2',
                        text: 'Is the doser interlocked with the main flour feed?',
                        type: 'YesNo',
                        criticality: 'Major',
                        weight: 5,
                        hint: 'Doser should stop automatically if the flour screw stops.'
                    },
                    {
                        id: '2.3',
                        sectionId: 'S2',
                        text: 'When was the last calibration performed?',
                        type: 'Dropdown',
                        options: ['This Shift', 'Yesterday', 'Last Week', '> 1 Week Ago', 'Never'],
                        criticality: 'Major',
                        weight: 5,
                        hint: 'Check calibration logsheet.'
                    },
                    {
                        id: '2.4',
                        sectionId: 'S2',
                        text: 'Perform a Spot Check Calibration (g/min). Record result:',
                        type: 'Numeric',
                        unit: 'g/min',
                        criticality: 'Critical',
                        weight: 10,
                        hint: 'Collect premix for 60 seconds and weigh it.',
                        numericConfig: {
                            target: 150,
                            tolerancePercent: 10, // 135-165 is good.
                            min: 100, // < 100 is Critical Failure
                            max: 200, // > 200 is Critical Failure
                            unit: 'g/min'
                        }
                    }
                ]
            },
            // SECTION 3: MIXING & BLENDING
            {
                id: 'S3',
                title: '3. Mixing & Blending',
                description: 'Ensuring homogeneity of the final product.',
                items: [
                    {
                        id: '3.1',
                        sectionId: 'S3',
                        text: 'Is the dosing point distinct from the mixing point?',
                        type: 'YesNo',
                        criticality: 'Minor',
                        weight: 2,
                        hint: 'Premix should be added before the mixing screw/conveyor.'
                    },
                    {
                        id: '3.2',
                        sectionId: 'S3',
                        text: 'Are there signs of "dead spots" or accumulation in the mixer?',
                        type: 'YesNo',
                        criticality: 'Major',
                        weight: 5,
                        hint: 'Inspect mixing screw for caked material.'
                    }
                ]
            },
            // SECTION 4: QUALITY CONTROL
            {
                id: 'S4',
                title: '4. Quality Control (QC)',
                description: 'Verification of internal testing and rapid assays.',
                minimumPassThreshold: 75,
                items: [
                    {
                        id: '4.1',
                        sectionId: 'S4',
                        text: 'Is the Iron Spot Test being performed hourly?',
                        type: 'YesNo',
                        criticality: 'Critical',
                        weight: 10,
                        requiredEvidence: ['Document'],
                        hint: 'Review the QC Bench Logbook for today/yesterday.'
                    },
                    {
                        id: '4.2',
                        sectionId: 'S4',
                        text: 'Observe an Iron Spot Test now. Result?',
                        type: 'MultipleChoice',
                        options: ['Strong Positive (Deep Red)', 'Weak Positive (Light Pink)', 'Negative (No Color)'],
                        criticality: 'Critical',
                        weight: 10,
                        requiredEvidence: ['Photo'],
                        hint: 'Witness the test procedure.'
                    },
                    {
                        id: '4.3',
                        sectionId: 'S4',
                        text: 'Are composite samples collected for external lab analysis?',
                        type: 'YesNo',
                        criticality: 'Major',
                        weight: 5,
                        hint: 'Check sample retention room.'
                    }
                ]
            },
            // SECTION 5: RECORD KEEPING
            {
                id: 'S5',
                title: '5. Record Keeping',
                description: 'Traceability and production data verification.',
                items: [
                    {
                        id: '5.1',
                        sectionId: 'S5',
                        text: 'Are premix inventory records reconciled with production volume?',
                        type: 'YesNo',
                        criticality: 'Major',
                        weight: 8,
                        hint: 'Perform a quick mass balance check.'
                    },
                    {
                        id: '5.2',
                        sectionId: 'S5',
                        text: 'Are production records legible and signed by supervisor?',
                        type: 'YesNo',
                        criticality: 'Minor',
                        weight: 2
                    }
                ]
            },
            // SECTION 6: FACILITY & HYGIENE
            {
                id: 'S6',
                title: '6. Facility & Hygiene',
                description: 'General sanitary conditions impacting food safety.',
                items: [
                    {
                        id: '6.1',
                        sectionId: 'S6',
                        text: 'General sanitation of the fortification area?',
                        type: 'MultipleChoice',
                        options: ['Excellent', 'Good', 'Fair', 'Poor'],
                        criticality: 'Major',
                        weight: 5
                    },
                    {
                        id: '6.2',
                        sectionId: 'S6',
                        text: 'Is there evidence of pests/rodents near premix storage?',
                        type: 'YesNo',
                        criticality: 'Critical',
                        weight: 10,
                        requiredEvidence: ['Photo'],
                        hint: 'Look for droppings or gnaw marks.'
                    }
                ]
            },
            // SECTION 7: PACKAGING & LABELING
            {
                id: 'S7',
                title: '7. Packaging & Labeling',
                description: 'Consumer information compliance.',
                items: [
                    {
                        id: '7.1',
                        sectionId: 'S7',
                        text: 'Is the "Fortified" logo clearly visible on primary packaging?',
                        type: 'YesNo',
                        criticality: 'Critical',
                        weight: 10,
                        requiredEvidence: ['Photo']
                    },
                    {
                        id: '7.2',
                        sectionId: 'S7',
                        text: 'Are micronutrients listed in the ingredients panel?',
                        type: 'YesNo',
                        criticality: 'Major',
                        weight: 5
                    }
                ]
            }
        ]
    }
]

export const MOCK_MILLS: Record<string, { name: string, region: string, complianceScore: number, riskLevel: string, lastAuditDate: string }> = {
    'M-001': { name: 'Unga Limited (Nairobi)', region: 'Nairobi', complianceScore: 95, riskLevel: 'Low', lastAuditDate: '2024-11-15' },
    'M-002': { name: 'Mombasa Maize Millers', region: 'Coast', complianceScore: 88, riskLevel: 'Medium', lastAuditDate: '2024-10-20' },
    'M-003': { name: 'Pembe Flour Mills', region: 'Nairobi', complianceScore: 76, riskLevel: 'Medium', lastAuditDate: '2024-12-01' },
    'MILL-042': { name: 'Golden Grain Mills', region: 'Central', complianceScore: 92, riskLevel: 'Low', lastAuditDate: '2024-09-10' },
    'MILL-018': { name: 'Rift Valley Processors', region: 'Rift Valley', complianceScore: 65, riskLevel: 'High', lastAuditDate: '2024-08-05' },
    'MILL-031': { name: 'Coastal Millers Ltd', region: 'Coast', complianceScore: 81, riskLevel: 'Medium', lastAuditDate: '2024-11-22' },
    'MILL-007': { name: 'Maize Masters Co', region: 'Western', complianceScore: 70, riskLevel: 'High', lastAuditDate: '2024-07-30' },
    'MILL-023': { name: 'Premium Flour Mills', region: 'Nairobi', complianceScore: 98, riskLevel: 'Low', lastAuditDate: '2024-12-10' }
}

// Helper to create detailed responses
const createResponse = (id: string, val: any, notes = '', evidenceCount = 0): any => ({
    itemId: id,
    value: val,
    notes,
    evidence: evidenceCount > 0 ? Array(evidenceCount).fill(0).map((_, i) => ({
        id: `EV-${Math.random().toString(36).substr(2, 9)}`,
        type: 'Photo',
        url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=200',
        uploadedAt: new Date().toISOString(),
        notes: 'Evidence photo'
    })) : []
})

export const MOCK_AUDIT_LOGS: AuditSession[] = [
    // 1. Pending Review (Self-Audit) - Needs Verification
    {
        id: 'REV-001',
        templateId: 'T-MAIZE-EXT',
        millId: 'MILL-018', // Rift Valley Processors (High Risk)
        operatorId: 'OP-RVP-01',
        type: 'Self-Audit',
        status: 'Reviewing',
        reviewStatus: 'Pending',
        startDate: '2024-12-26T08:00:00',
        completedDate: '2024-12-26T10:30:00',
        score: 92, // Surprisingly high for high risk mill
        criticalFailures: [],
        overallResult: 'Certified',
        templateVersion: 'KS-EAS-768:2019 (Rev 2)',
        responses: {
            '1.1': createResponse('1.1', 'Yes', 'Storage conditions improved', 2),
            '2.1': createResponse('2.1', 'Yes', 'New doser installed', 1),
            '2.4': createResponse('2.4', 152, 'Spot check within range'),
            '4.1': createResponse('4.1', 'Yes', 'Logs updated'),
            '4.2': createResponse('4.2', 'Strong Positive (Deep Red)', 'Test conducted at 9am', 1)
        }
    },
    // 2. Pending Review (Self-Audit) - Good Mill
    {
        id: 'REV-002',
        templateId: 'T-MAIZE-EXT',
        millId: 'M-001', // Unga Limited
        operatorId: 'OP-UNGA-05',
        type: 'Self-Audit',
        status: 'Reviewing',
        reviewStatus: 'Pending',
        startDate: '2024-12-27T09:15:00',
        completedDate: '2024-12-27T11:00:00',
        score: 98,
        criticalFailures: [],
        overallResult: 'Certified',
        templateVersion: 'KS-EAS-768:2019 (Rev 2)',
        responses: {
            '1.1': createResponse('1.1', 'Yes', '', 1),
            '2.1': createResponse('2.1', 'Yes', '', 1),
            '2.4': createResponse('2.4', 150),
            '4.1': createResponse('4.1', 'Yes'),
            '4.2': createResponse('4.2', 'Strong Positive (Deep Red)', '', 1)
        }
    },
    // 3. In Progress Review - Inspector mid-way
    {
        id: 'REV-003',
        templateId: 'T-MAIZE-EXT',
        millId: 'MILL-031', // Coastal Millers
        operatorId: 'OP-CML-03',
        type: 'Self-Audit',
        status: 'Reviewing',
        reviewStatus: 'InReview',
        reviewerId: 'INS-005',
        startDate: '2024-12-25T14:00:00',
        completedDate: '2024-12-25T16:00:00',
        score: 78,
        criticalFailures: [],
        overallResult: 'Conditionally Approved',
        templateVersion: 'KS-EAS-768:2019 (Rev 2)',
        responses: {
            '1.1': { ...createResponse('1.1', 'Yes', '', 1), reviewStatus: 'Ok' },
            '2.1': { ...createResponse('2.1', 'Yes', '', 1), reviewStatus: 'Ok' },
            '2.4': { ...createResponse('2.4', 110, 'Low end of tolerance'), reviewStatus: 'Flagged', reviewerComment: 'This is dangerously close to the limit.' },
            '4.2': { ...createResponse('4.2', 'Weak Positive (Light Pink)', 'Reagent might be old', 1), reviewStatus: 'ActionRequired', reviewerComment: 'Please check reagent expiry.' }
        }
    },
    // 4. Completed Review - Follow-up Scheduled
    {
        id: 'REV-004',
        templateId: 'T-MAIZE-EXT',
        millId: 'MILL-007', // Maize Masters
        operatorId: 'OP-MM-02',
        type: 'Self-Audit',
        status: 'Follow-Up Scheduled',
        reviewStatus: 'Completed',
        reviewerId: 'INS-005',
        reviewDecision: 'ScheduleSiteVisit',
        reviewNotes: 'Discrepancy in doser calibration data vs productivity.',
        reviewCompletedAt: '2024-12-24T10:00:00',
        startDate: '2024-12-23T08:00:00',
        completedDate: '2024-12-23T09:30:00',
        score: 85,
        criticalFailures: [],
        overallResult: 'Certified',
        templateVersion: 'KS-EAS-768:2019 (Rev 2)',
        responses: {}
    },
    // 5. Historical On-Site Audit
    {
        id: 'AUD-2024-101',
        templateId: 'T-MAIZE-EXT',
        millId: 'M-001',
        inspectorId: 'INS-005',
        type: 'Official Inspection',
        status: 'Approved',
        startDate: '2024-11-15T09:00:00',
        completedDate: '2024-11-15T13:00:00',
        score: 96,
        criticalFailures: [],
        overallResult: 'Certified',
        templateVersion: 'KS-EAS-768:2019 (Rev 2)',
        responses: {}
    }
]

export const MOCK_SCHEDULES: AuditSchedule[] = [
    {
        id: 'SCH-2024-001',
        millId: 'M-001',
        templateId: 'T-MAIZE-EXT',
        scheduledDate: '2025-01-10',
        assignedInspectorId: 'INS-005',
        status: 'Pending'
    },
    {
        id: 'SCH-2024-002',
        millId: 'M-002',
        templateId: 'T-MAIZE-EXT',
        scheduledDate: '2025-01-12',
        assignedInspectorId: 'INS-005',
        status: 'Pending'
    },
    {
        id: 'SCH-2024-003',
        millId: 'M-003',
        templateId: 'T-MAIZE-EXT',
        scheduledDate: '2024-12-28',
        assignedInspectorId: 'INS-005',
        status: 'Overdue'
    }
]


