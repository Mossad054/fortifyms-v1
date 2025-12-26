
export type BatchStatus = 'Pending' | 'In Progress' | 'Quality Check' | 'Completed' | 'Quarantined' | 'Rejected'

export type RawMaterial = {
    type: 'Maize' | 'Rice' | 'Wheat' | 'Other'
    grade: string
    lotNumber: string
    source: string // Supplier or Farm
    inputWeight: number // kg
}

export type FortificationSettings = {
    premixType: string
    premixLot: string
    manufacturer: string
    expiryDate: string
    targetLevel: string // e.g. "30 ppm"
    dosingRate: number // % or g/kg
    expectedUsage: number // kg (Calculated)
    actualUsage?: number // kg
    variance?: number // %
}

export type EquipmentSettings = {
    doserId: string
    doserSpeed: number // kg/hr or RPM
    calibrationDate: string
    mixerId: string
    mixingTime: number // minutes
    processParams?: {
        soakingTime?: number
        steamingPressure?: number
        dryingTemp?: number
        [key: string]: any
    }
}

export type ProductionOutput = {
    packagingDate: string
    storageLocation: string
    packagingType: '1kg' | '5kg' | '25kg' | '50kg' | 'Bulk'
    unitCount: number
    totalWeight: number // kg
    yieldPercentage?: number // %
}

export type QCStatus = 'Pass' | 'Marginal' | 'Fail' | 'Pending'

export type QCResult = {
    id: string
    batchId: string
    testType: 'Iron Spot' | 'Moisture' | 'Visual' | 'Titration' | 'Spectrophotometry'
    timestamp: string
    technician: string

    // Sampling
    method: 'Random' | 'Composite' | 'Timed'
    location: 'Start' | 'Middle' | 'End' | 'Random'

    // Result
    value: string | number
    unit?: string
    targetRange?: { min: number, max: number }

    status: QCStatus
    notes?: string
    photoUrl?: string

    // For external labs
    labName?: string
    certificateNumber?: string
}

export type ProductionBatch = {
    id: string // Format: MILL-LINE-DATE-SEQ
    millId: string
    lineId: string
    date: string
    shift: 'Morning' | 'Afternoon' | 'Night'
    operator: string

    // Phases
    rawMaterial: RawMaterial
    fortification: FortificationSettings
    equipment: EquipmentSettings
    output?: ProductionOutput

    // Status
    status: BatchStatus
    qcStatus: QCStatus

    // Compliance
    flagged?: boolean
    flagReason?: string
    correctiveActions?: string[]
}

// Mock Data for Dropdowns
export const PREMIX_TYPES = [
    { id: 'PM-001', name: 'Standard Maize Premix (WHO)', manufacturer: 'DSM' },
    { id: 'PM-002', name: 'Rice Fortificant (Extruded)', manufacturer: 'Bühler' },
]

export const PACKAGING_TYPES = ['1kg', '2kg', '5kg', '10kg', '25kg', '50kg', 'Bulk']
