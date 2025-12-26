'use client'

import * as React from 'react'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
    CheckCircle, XCircle, AlertTriangle, Clock, Package,
    ChevronRight, FileText, Beaker, Scale, Factory
} from 'lucide-react'
import { ProductionBatch, QCResult } from '../operator/production-types'

// Mock data for pending batches
const PENDING_BATCHES: ProductionBatch[] = [
    {
        id: 'B-2024-001',
        millId: 'MILL-001',
        lineId: 'Line 1',
        date: '2024-12-25',
        shift: 'Morning',
        operator: 'John Doe',
        rawMaterial: {
            type: 'Maize',
            grade: 'Grade A',
            lotNumber: 'LOT-M-2024-123',
            source: 'Farm Coop A',
            inputWeight: 1000
        },
        fortification: {
            premixType: 'Standard Maize Premix (WHO)',
            premixLot: 'PM-BATCH-99',
            manufacturer: 'DSM',
            expiryDate: '2025-06-01',
            targetLevel: '30 ppm',
            dosingRate: 0.05,
            expectedUsage: 0.5,
            actualUsage: 0.52,
            variance: 4
        },
        equipment: {
            doserId: 'DOSER-A1',
            doserSpeed: 150,
            calibrationDate: '2024-12-20',
            mixerId: 'MIXER-M1',
            mixingTime: 15,
            processParams: {
                soakingTime: 4,
                dryingTemp: 60
            }
        },
        output: {
            packagingDate: '2024-12-25',
            storageLocation: 'Warehouse A',
            packagingType: '25kg',
            unitCount: 40,
            totalWeight: 980,
            yieldPercentage: 98
        },
        status: 'Quality Check',
        qcStatus: 'Pass'
    },
    {
        id: 'B-2024-002',
        millId: 'MILL-001',
        lineId: 'Line 2',
        date: '2024-12-25',
        shift: 'Afternoon',
        operator: 'Sarah Smith',
        rawMaterial: {
            type: 'Rice',
            grade: 'Premium',
            lotNumber: 'LOT-R-2024-456',
            source: 'Supplier XYZ',
            inputWeight: 800
        },
        fortification: {
            premixType: 'Rice Fortificant (Extruded)',
            premixLot: 'PM-R-2024-88',
            manufacturer: 'Bühler',
            expiryDate: '2025-08-01',
            targetLevel: '25 ppm',
            dosingRate: 0.04,
            expectedUsage: 0.32,
            actualUsage: 0.35,
            variance: 9.4
        },
        equipment: {
            doserId: 'DOSER-B2',
            doserSpeed: 120,
            calibrationDate: '2024-12-18',
            mixerId: 'MIXER-R2',
            mixingTime: 12
        },
        output: {
            packagingDate: '2024-12-25',
            storageLocation: 'Warehouse B',
            packagingType: '5kg',
            unitCount: 150,
            totalWeight: 750,
            yieldPercentage: 93.75
        },
        status: 'Quality Check',
        qcStatus: 'Marginal',
        flagged: true,
        flagReason: 'Premix variance >5%'
    }
]

const MOCK_QC_RESULTS: Record<string, QCResult[]> = {
    'B-2024-001': [
        {
            id: 'QC-001-1',
            batchId: 'B-2024-001',
            testType: 'Iron Spot',
            timestamp: '2024-12-25 10:30',
            technician: 'Lab Tech A',
            method: 'Composite',
            location: 'Middle',
            value: 'Positive',
            status: 'Pass'
        },
        {
            id: 'QC-001-2',
            batchId: 'B-2024-001',
            testType: 'Moisture',
            timestamp: '2024-12-25 11:00',
            technician: 'Lab Tech A',
            method: 'Random',
            location: 'Random',
            value: 12.3,
            unit: '%',
            targetRange: { min: 10, max: 14.5 },
            status: 'Pass'
        }
    ],
    'B-2024-002': [
        {
            id: 'QC-002-1',
            batchId: 'B-2024-002',
            testType: 'Iron Spot',
            timestamp: '2024-12-25 15:45',
            technician: 'Lab Tech B',
            method: 'Composite',
            location: 'End',
            value: 'Positive',
            status: 'Pass'
        },
        {
            id: 'QC-002-2',
            batchId: 'B-2024-002',
            testType: 'Moisture',
            timestamp: '2024-12-25 16:00',
            technician: 'Lab Tech B',
            method: 'Random',
            location: 'Middle',
            value: 14.2,
            unit: '%',
            targetRange: { min: 10, max: 14.5 },
            status: 'Marginal',
            notes: 'Close to upper limit'
        }
    ]
}

export function BatchApprovalModule() {
    const [selectedBatch, setSelectedBatch] = React.useState<ProductionBatch | null>(null)
    const [action, setAction] = React.useState<'approve' | 'hold' | 'reject' | null>(null)
    const [justification, setJustification] = React.useState('')

    const handleAction = (actionType: 'approve' | 'hold' | 'reject') => {
        setAction(actionType)
    }

    const handleSubmit = () => {
        console.log('Action:', action, 'Batch:', selectedBatch?.id, 'Justification:', justification)
        // TODO: API call to /api/batches/[id]/approve|hold|reject
        setSelectedBatch(null)
        setAction(null)
        setJustification('')
    }

    return (
        <div className="space-y-6">
            {/* Pending Approvals Queue */}
            <Card className="glass-card border-none shadow-sm">
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle className="flex items-center gap-2">
                            <Clock className="w-5 h-5 text-orange-600" />
                            Pending Batch Approvals
                        </CardTitle>
                        <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                            {PENDING_BATCHES.length} Awaiting Review
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {PENDING_BATCHES.map(batch => (
                            <div
                                key={batch.id}
                                className={`border rounded-lg p-4 hover:bg-slate-50 transition-colors cursor-pointer ${batch.flagged ? 'border-l-4 border-l-orange-500' : ''
                                    }`}
                                onClick={() => setSelectedBatch(batch)}
                            >
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <Badge variant="outline" className="font-mono bg-white">
                                                {batch.id}
                                            </Badge>
                                            <Badge className={
                                                batch.qcStatus === 'Pass' ? 'bg-green-100 text-green-700' :
                                                    batch.qcStatus === 'Marginal' ? 'bg-yellow-100 text-yellow-700' :
                                                        'bg-red-100 text-red-700'
                                            }>
                                                QC: {batch.qcStatus}
                                            </Badge>
                                            {batch.flagged && (
                                                <Badge variant="outline" className="bg-orange-50 text-orange-700">
                                                    <AlertTriangle className="w-3 h-3 mr-1" />
                                                    Flagged
                                                </Badge>
                                            )}
                                        </div>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                                            <div>
                                                <span className="text-muted-foreground">Product:</span>
                                                <span className="ml-2 font-medium">{batch.rawMaterial.type}</span>
                                            </div>
                                            <div>
                                                <span className="text-muted-foreground">Line:</span>
                                                <span className="ml-2 font-medium">{batch.lineId}</span>
                                            </div>
                                            <div>
                                                <span className="text-muted-foreground">Yield:</span>
                                                <span className="ml-2 font-medium">{batch.output?.yieldPercentage}%</span>
                                            </div>
                                            <div>
                                                <span className="text-muted-foreground">Date:</span>
                                                <span className="ml-2 font-medium">{batch.date}</span>
                                            </div>
                                        </div>
                                        {batch.flagReason && (
                                            <div className="mt-2 text-sm text-orange-700 flex items-center gap-1">
                                                <AlertTriangle className="w-3 h-3" />
                                                {batch.flagReason}
                                            </div>
                                        )}
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-gray-400" />
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Batch Detail Modal */}
            {selectedBatch && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setSelectedBatch(null)}>
                    <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
                        {/* Modal Header */}
                        <div className="p-6 border-b bg-slate-50">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Batch Approval Review</h2>
                                    <div className="flex items-center gap-3">
                                        <Badge variant="outline" className="font-mono text-base">
                                            {selectedBatch.id}
                                        </Badge>
                                        <Badge className={
                                            selectedBatch.qcStatus === 'Pass' ? 'bg-green-100 text-green-700' :
                                                selectedBatch.qcStatus === 'Marginal' ? 'bg-yellow-100 text-yellow-700' :
                                                    'bg-red-100 text-red-700'
                                        }>
                                            QC: {selectedBatch.qcStatus}
                                        </Badge>
                                    </div>
                                </div>
                                <Button variant="ghost" onClick={() => setSelectedBatch(null)}>✕</Button>
                            </div>
                        </div>

                        {/* Modal Content */}
                        <ScrollArea className="flex-1 p-6">
                            <div className="space-y-6">
                                {/* Batch Metadata */}
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    <InfoCard icon={Factory} label="Line" value={selectedBatch.lineId} />
                                    <InfoCard icon={Package} label="Product" value={selectedBatch.rawMaterial.type} />
                                    <InfoCard icon={Clock} label="Shift" value={selectedBatch.shift} />
                                    <InfoCard icon={Scale} label="Input Weight" value={`${selectedBatch.rawMaterial.inputWeight} kg`} />
                                    <InfoCard icon={Scale} label="Output Weight" value={`${selectedBatch.output?.totalWeight} kg`} />
                                    <InfoCard icon={CheckCircle} label="Yield" value={`${selectedBatch.output?.yieldPercentage}%`} />
                                </div>

                                {/* Fortification Details */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg">Fortification Parameters</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Premix Type:</span>
                                            <span className="font-medium">{selectedBatch.fortification.premixType}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Dosing Rate:</span>
                                            <span className="font-medium">{selectedBatch.fortification.dosingRate}%</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Expected Usage:</span>
                                            <span className="font-medium">{selectedBatch.fortification.expectedUsage} kg</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Actual Usage:</span>
                                            <span className="font-medium">{selectedBatch.fortification.actualUsage} kg</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Variance:</span>
                                            <span className={`font-bold ${(selectedBatch.fortification.variance || 0) > 5 ? 'text-orange-600' : 'text-green-600'
                                                }`}>
                                                {selectedBatch.fortification.variance}%
                                            </span>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* QC Test Results */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg flex items-center gap-2">
                                            <Beaker className="w-5 h-5" />
                                            QC Test Results
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-3">
                                            {MOCK_QC_RESULTS[selectedBatch.id]?.map(test => (
                                                <div key={test.id} className="border rounded-lg p-3">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <div>
                                                            <span className="font-bold text-gray-900">{test.testType}</span>
                                                            <p className="text-xs text-muted-foreground">{test.timestamp} • {test.technician}</p>
                                                        </div>
                                                        <Badge className={
                                                            test.status === 'Pass' ? 'bg-green-100 text-green-700' :
                                                                test.status === 'Marginal' ? 'bg-yellow-100 text-yellow-700' :
                                                                    'bg-red-100 text-red-700'
                                                        }>
                                                            {test.status}
                                                        </Badge>
                                                    </div>
                                                    <div className="text-sm">
                                                        <span className="text-muted-foreground">Result: </span>
                                                        <span className="font-medium">{test.value}{test.unit}</span>
                                                        {test.targetRange && (
                                                            <span className="text-muted-foreground ml-2">
                                                                (Target: {test.targetRange.min}-{test.targetRange.max}{test.unit})
                                                            </span>
                                                        )}
                                                    </div>
                                                    {test.notes && (
                                                        <p className="text-xs text-muted-foreground mt-1">{test.notes}</p>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Action Selection */}
                                {!action && (
                                    <div className="flex gap-3">
                                        <Button className="flex-1 bg-green-600 hover:bg-green-700" onClick={() => handleAction('approve')}>
                                            <CheckCircle className="w-4 h-4 mr-2" />
                                            Approve & Release
                                        </Button>
                                        <Button className="flex-1 bg-orange-600 hover:bg-orange-700" onClick={() => handleAction('hold')}>
                                            <AlertTriangle className="w-4 h-4 mr-2" />
                                            Hold
                                        </Button>
                                        <Button className="flex-1 bg-red-600 hover:bg-red-700" onClick={() => handleAction('reject')}>
                                            <XCircle className="w-4 h-4 mr-2" />
                                            Reject
                                        </Button>
                                    </div>
                                )}

                                {/* Justification Form */}
                                {action && (
                                    <Card className="border-2 border-blue-200 bg-blue-50/50">
                                        <CardHeader>
                                            <CardTitle className="text-lg">
                                                {action === 'approve' ? 'Approval Notes' : 'Justification Required'}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div>
                                                <Label htmlFor="justification">
                                                    {action === 'approve' ? 'Optional notes:' : 'Please provide justification:'}
                                                </Label>
                                                <Textarea
                                                    id="justification"
                                                    value={justification}
                                                    onChange={(e) => setJustification(e.target.value)}
                                                    placeholder={
                                                        action === 'approve' ? 'Add any notes or conditions...' :
                                                            action === 'hold' ? 'Explain reason for hold and required actions...' :
                                                                'Explain reason for rejection and corrective actions...'
                                                    }
                                                    rows={4}
                                                    className="mt-2"
                                                />
                                            </div>
                                            <div className="flex gap-3">
                                                <Button onClick={handleSubmit} className="flex-1">
                                                    Confirm {action === 'approve' ? 'Approval' : action === 'hold' ? 'Hold' : 'Rejection'}
                                                </Button>
                                                <Button variant="outline" onClick={() => setAction(null)}>
                                                    Cancel
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}
                            </div>
                        </ScrollArea>
                    </div>
                </div>
            )}
        </div>
    )
}

function InfoCard({ icon: Icon, label, value }: { icon: any, label: string, value: string }) {
    return (
        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
            <div className="p-2 bg-white rounded-lg">
                <Icon className="w-4 h-4 text-gray-600" />
            </div>
            <div>
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="font-bold text-gray-900">{value}</p>
            </div>
        </div>
    )
}
