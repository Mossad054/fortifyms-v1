export type MaintenanceTask = {
    id: string
    title: string
    product: 'Maize' | 'Rice' | 'General'
    equipment: string
    type: 'Calibration' | 'Repair' | 'Inspection' | 'Cleaning' | 'Predictive Alert' | 'Lubrication' | 'Replacement'
    priority: 'Critical' | 'High' | 'Medium' | 'Low'
    status: 'Pending' | 'In Progress' | 'Completed' | 'Escalated' | 'Overdue'
    dueDate: string
    steps: TaskStep[]
    notes?: string
    alertDetails?: {
        issue: string
        recommendation: string
        urgency: 'High' | 'Medium' | 'Low'
    }
    requirements?: {
        personnel: string[]
        parts: string[]
        tools: string[]
    }
}

export type TaskStep = {
    id: string
    text: string
    completed: boolean
    isCalibration?: boolean
    calibrationTarget?: number
    calibrationValue?: number
}
