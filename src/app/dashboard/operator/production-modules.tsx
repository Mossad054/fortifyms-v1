'use client'

import * as React from 'react'
import {
    Activity, ClipboardCheck, Factory, MoreHorizontal,
    Plus, Search, AlertTriangle, ArrowRight,
    Calendar, User, CheckCircle2, XCircle, Clock,
    ChevronRight, ArrowLeft, ShieldCheck, Microscope,
    AlertOctagon, Info, QrCode, Share2, Download
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { ScrollArea } from '@/components/ui/scroll-area'
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { motion, AnimatePresence } from 'framer-motion'
import { Progress } from '@/components/ui/progress'

// --- MOCK DATA ---
const ACTIVE_BATCHES = [
    { id: 'B-2024-089', product: 'Maize Flour', line: 'Line 2', status: 'In Progress', startTime: '08:00 AM', progress: 45, operator: 'John D.' },
    { id: 'B-2024-090', product: 'Rice', line: 'Line 1', status: 'Pending', startTime: '10:30 AM', progress: 0, operator: 'Sarah M.' },
]

const QC_TESTS = [
    { id: 'QC-112', test: 'Iron Spot Test', batch: 'B-2024-089', time: '09:15 AM', status: 'Pass', result: 'Positive reaction' },
    { id: 'QC-111', test: 'Moisture Analysis', batch: 'B-2024-089', time: '08:30 AM', status: 'Pass', result: '11.5%' },
    { id: 'QC-110', test: 'Visual Inspection', batch: 'B-2024-088', time: 'Yesterday', status: 'Fail', result: 'Discoloration found' },
]

// --- BATCH MODULE ---


// ... imports (retaining existing imports, added new ones)
import {
    ProductionBatch, QCResult, QCStatus, PREMIX_TYPES, PACKAGING_TYPES,
    RawMaterial, FortificationSettings, EquipmentSettings
} from './production-types'

// --- CONSTANTS ---
const STEPS = [
    { id: 'init', title: 'Initialization' },
    { id: 'raw', title: 'Raw Materials' },
    { id: 'fort', title: 'Fortification' },
    { id: 'equip', title: 'Equipment' },
    { id: 'process', title: 'Process Params' },
    { id: 'start', title: 'Confirmation' }
]

export function BatchProductionModule() {
    const [view, setView] = React.useState<'overview' | 'wizard' | 'detail'>('overview')
    const [selectedBatch, setSelectedBatch] = React.useState<ProductionBatch | null>(null)
    const [batches, setBatches] = React.useState<ProductionBatch[]>([])

    // Wizard State
    const [step, setStep] = React.useState(0)
    const [formData, setFormData] = React.useState<Partial<ProductionBatch>>({
        id: `KEN001-L1-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-001`,
        status: 'Pending',
        rawMaterial: { type: 'Maize', grade: 'Grade 1', lotNumber: '', source: '', inputWeight: 0 },
        fortification: { premixType: '', premixLot: '', manufacturer: '', expiryDate: '', targetLevel: 'Standard', dosingRate: 0, expectedUsage: 0 },
        equipment: { doserId: '', doserSpeed: 0, calibrationDate: '', mixerId: '', mixingTime: 0 }
    })

    // Calculations
    React.useEffect(() => {
        if (formData.rawMaterial?.inputWeight && formData.fortification?.dosingRate) {
            const expected = (formData.rawMaterial.inputWeight * (formData.fortification.dosingRate / 100))
            setFormData(prev => ({
                ...prev,
                fortification: { ...prev.fortification!, expectedUsage: parseFloat(expected.toFixed(3)) }
            }))
        }
    }, [formData.rawMaterial?.inputWeight, formData.fortification?.dosingRate])

    const handleNext = () => setStep(s => Math.min(s + 1, STEPS.length - 1))
    const handleBack = () => setStep(s => Math.max(s - 1, 0))

    const handleStartBatch = () => {
        const newBatch = {
            ...formData,
            status: 'In Progress',
            date: new Date().toISOString()
        } as ProductionBatch
        setBatches([newBatch, ...batches])
        setView('overview')
        setStep(0)
    }

    return (
        <Card className="h-full flex flex-col overflow-hidden border-zinc-200 shadow-sm transition-all hover:shadow-md">
            <AnimatePresence mode='wait'>
                {view === 'overview' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col h-full">
                        <CardHeader className="pb-2">
                            <div className="flex justify-between items-center">
                                <CardTitle className="flex items-center gap-2">
                                    <Factory className="w-5 h-5 text-[#0A3225]" />
                                    Active Batches
                                </CardTitle>
                                <Button size="sm" onClick={() => setView('wizard')}>
                                    <Plus className="w-4 h-4 mr-2" /> Start Batch
                                </Button>
                            </div>
                            <CardDescription>Manage daily production and traceability</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1 overflow-auto space-y-4 p-4">
                            {/* Empty State / List */}
                            {batches.length === 0 ? (
                                <div className="text-center py-12 border-2 border-dashed rounded-xl bg-slate-50/50">
                                    <Factory className="w-12 h-12 mx-auto text-zinc-300 mb-2" />
                                    <p className="text-zinc-500 font-medium">No active batches</p>
                                    <button onClick={() => setView('wizard')} className="text-[#0A3225] text-sm hover:underline mt-1">Start daily production</button>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {batches.map(batch => (
                                        <div key={batch.id} onClick={() => { setSelectedBatch(batch); setView('detail') }} className="border rounded-lg p-4 hover:bg-slate-50 cursor-pointer shadow-sm">
                                            <div className="flex justify-between items-start mb-2">
                                                <Badge variant="outline" className="font-mono text-xs bg-white">{batch.id}</Badge>
                                                <Badge className="bg-[#0A3225]/10 text-[#0A3225] hover:bg-blue-200">{batch.status}</Badge>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4 text-sm mt-3">
                                                <div>
                                                    <span className="text-xs text-zinc-500 block">Product</span>
                                                    <span className="font-semibold">{batch.rawMaterial.type}</span>
                                                </div>
                                                <div>
                                                    <span className="text-xs text-zinc-500 block">Input</span>
                                                    <span>{batch.rawMaterial.inputWeight} kg</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </motion.div>
                )}

                {view === 'wizard' && (
                    <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="flex flex-col h-full">
                        <CardHeader className="bg-slate-50 border-b relative">
                            <Button variant="ghost" size="sm" className="absolute left-4 top-4 h-8 w-8 p-0" onClick={() => setView('overview')}><ArrowLeft className="w-4 h-4" /></Button>
                            <div className="text-center">
                                <CardTitle className="text-lg">New Batch: Step {step + 1} of {STEPS.length}</CardTitle>
                                <CardDescription>{STEPS[step].title}</CardDescription>
                            </div>
                            {/* Stepper */}
                            <div className="flex justify-center gap-1 mt-4">
                                {STEPS.map((s, i) => (
                                    <div key={s.id} className={`h-1 w-8 rounded-full transition-all ${i <= step ? 'bg-[#0A3225]' : 'bg-slate-200'}`} />
                                ))}
                            </div>
                        </CardHeader>

                        <CardContent className="flex-1 overflow-auto p-6 max-w-2xl mx-auto w-full">
                            {step === 0 && (
                                <div className="space-y-4 animate-in slide-in-from-right-4 fade-in">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Line Selection</Label>
                                            <Select onValueChange={v => setFormData({ ...formData, lineId: v })}>
                                                <SelectTrigger><SelectValue placeholder="Select Line" /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Line 1">Line 1 (Maize)</SelectItem>
                                                    <SelectItem value="Line 2">Line 2 (Rice)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Shift</Label>
                                            <Select onValueChange={v => setFormData({ ...formData, shift: v as any })}>
                                                <SelectTrigger><SelectValue placeholder="Select Shift" /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Morning">Morning</SelectItem>
                                                    <SelectItem value="Afternoon">Afternoon</SelectItem>
                                                    <SelectItem value="Night">Night</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Operator Name</Label>
                                        <Input value={formData.operator} onChange={e => setFormData({ ...formData, operator: e.target.value })} placeholder="Confirm your name" />
                                    </div>
                                </div>
                            )}

                            {step === 1 && (
                                <div className="space-y-4 animate-in slide-in-from-right-4 fade-in">
                                    <h3 className="font-semibold text-zinc-900 border-b pb-2">Raw Material Intake</h3>
                                    <div className="space-y-2">
                                        <Label>Crop Type</Label>
                                        <Select onValueChange={v => setFormData({ ...formData, rawMaterial: { ...formData.rawMaterial!, type: v as any } })}>
                                            <SelectTrigger><SelectValue placeholder="Select Crop" /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Maize">Maize (White)</SelectItem>
                                                <SelectItem value="Wheat">Wheat</SelectItem>
                                                <SelectItem value="Rice">Rice</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Lot Number</Label>
                                            <Input placeholder="Supplier Lot #" value={formData.rawMaterial?.lotNumber} onChange={e => setFormData(prev => ({ ...prev, rawMaterial: { ...prev.rawMaterial!, lotNumber: e.target.value } }))} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Input Weight (kg)</Label>
                                            <Input type="number" placeholder="0.00" value={formData.rawMaterial?.inputWeight || ''} onChange={e => setFormData(prev => ({ ...prev, rawMaterial: { ...prev.rawMaterial!, inputWeight: parseFloat(e.target.value) } }))} />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {step === 2 && (
                                <div className="space-y-4 animate-in slide-in-from-right-4 fade-in">
                                    <h3 className="font-semibold text-zinc-900 border-b pb-2">Fortification Params</h3>
                                    <div className="space-y-2">
                                        <Label>Premix Type</Label>
                                        <Select onValueChange={v => setFormData(prev => ({ ...prev, fortification: { ...prev.fortification!, premixType: v } }))}>
                                            <SelectTrigger><SelectValue placeholder="Select Premix" /></SelectTrigger>
                                            <SelectContent>
                                                {PREMIX_TYPES.map(p => <SelectItem key={p.id} value={p.name}>{p.name} ({p.manufacturer})</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Premix Lot #</Label>
                                            <Input placeholder="Scan Lot" value={formData.fortification?.premixLot} onChange={e => setFormData(prev => ({ ...prev, fortification: { ...prev.fortification!, premixLot: e.target.value } }))} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Dosing Rate (%)</Label>
                                            <Input type="number" step="0.01" value={formData.fortification?.dosingRate || ''} onChange={e => setFormData(prev => ({ ...prev, fortification: { ...prev.fortification!, dosingRate: parseFloat(e.target.value) } }))} />
                                        </div>
                                    </div>
                                    {formData.fortification?.expectedUsage ? (
                                        <div className="bg-[#0A3225]/5 border border-blue-100 p-3 rounded-md text-sm text-[#0A3225]">
                                            Expected Premix Usage: <span className="font-bold">{formData.fortification.expectedUsage} kg</span>
                                            <div className="text-xs text-[#0A3225] mt-1">Based on {formData.rawMaterial?.inputWeight}kg input. Ensure hopper is filled.</div>
                                        </div>
                                    ) : null}
                                </div>
                            )}

                            {step === 3 && (
                                <div className="space-y-4 animate-in slide-in-from-right-4 fade-in">
                                    <h3 className="font-semibold text-zinc-900 border-b pb-2">Equipment Setup</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Doser ID</Label>
                                            <Input placeholder="Doser 1" value={formData.equipment?.doserId} onChange={e => setFormData(prev => ({ ...prev, equipment: { ...prev.equipment!, doserId: e.target.value } }))} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Feeder Speed (RPM)</Label>
                                            <Input type="number" value={formData.equipment?.doserSpeed || ''} onChange={e => setFormData(prev => ({ ...prev, equipment: { ...prev.equipment!, doserSpeed: parseFloat(e.target.value) } }))} />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Mixer Setting</Label>
                                        <Select onValueChange={v => setFormData(prev => ({ ...prev, equipment: { ...prev.equipment!, mixerId: v } }))}>
                                            <SelectTrigger><SelectValue placeholder="Select Mixer" /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Mixer A">Mixer A (High Speed)</SelectItem>
                                                <SelectItem value="Mixer B">Mixer B (Paddle)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="bg-orange-50 p-3 rounded-md border border-orange-100 flex gap-2">
                                        <AlertTriangle className="w-5 h-5 text-orange-600 flex-shrink-0" />
                                        <div className="text-xs text-orange-800">
                                            <strong>Verify Calibration:</strong> Last calibration for {formData.equipment?.doserId || 'this unit'} was 5 days ago. Within tolerance.
                                        </div>
                                    </div>
                                </div>
                            )}

                            {step === 4 && (
                                <div className="space-y-4 animate-in slide-in-from-right-4 fade-in">
                                    <h3 className="font-semibold text-zinc-900 border-b pb-2">Process Parameters</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Soaking Time (hrs)</Label>
                                            <Input type="number" placeholder="4" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Drying Temp (°C)</Label>
                                            <Input type="number" placeholder="60" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Notes / Observations</Label>
                                        <Textarea placeholder="Any deviations or manual adjustments..." />
                                    </div>
                                </div>
                            )}

                            {step === 5 && (
                                <div className="space-y-6 animate-in slide-in-from-right-4 fade-in text-center py-8">
                                    <div className="bg-green-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-green-100">
                                        <CheckCircle2 className="w-10 h-10 text-green-600" />
                                    </div>
                                    <h3 className="text-xl font-bold text-zinc-900">Ready to Start Production?</h3>
                                    <p className="text-zinc-500 max-w-sm mx-auto">
                                        Batch ID <strong>{formData.id}</strong> will be generated. This action logs the start time and locks initial parameters.
                                    </p>

                                    <div className="bg-slate-50 p-4 rounded-lg text-left max-w-sm mx-auto space-y-2 text-sm border">
                                        <div className="flex justify-between">
                                            <span className="text-zinc-500">Product:</span>
                                            <span className="font-medium">{formData.rawMaterial?.type}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-zinc-500">Input:</span>
                                            <span className="font-medium">{formData.rawMaterial?.inputWeight} kg</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-zinc-500">Premix:</span>
                                            <span className="font-medium">{formData.fortification?.premixType}</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </CardContent>

                        <CardFooter className="border-t p-4 flex justify-between bg-white">
                            <Button variant="outline" onClick={handleBack} disabled={step === 0}>Back</Button>
                            {step === STEPS.length - 1 ? (
                                <Button className="bg-green-600 hover:bg-green-700 w-32" onClick={handleStartBatch}>Start Batch</Button>
                            ) : (
                                <Button className="w-32" onClick={handleNext}>Next <ChevronRight className="w-4 h-4 ml-1" /></Button>
                            )}
                        </CardFooter>
                    </motion.div>
                )}

                {/* Detail View Placeholder - would use 'selectedBatch' */}
                {view === 'detail' && selectedBatch && (
                    <div className="p-4"><Button onClick={() => setView('overview')}>Back</Button></div>
                )}
            </AnimatePresence>
        </Card>
    )
}


// --- QC MODULE ---


import { SelfAuditModal } from './components/self-audit-modal'

export function QCControlModule() {
    const [view, setView] = React.useState<'overview' | 'record' | 'detail'>('overview')
    const [selectedTest, setSelectedTest] = React.useState<QCResult | null>(null)
    const [showCorrectionDialog, setShowCorrectionDialog] = React.useState(false)
    const [showSelfAudit, setShowSelfAudit] = React.useState(false)
    const [tests, setTests] = React.useState<QCResult[]>([
        { id: 'QC-112', batchId: 'B-2024-089', testType: 'Iron Spot', timestamp: '09:15 AM', status: 'Pass', value: 'Positive', method: 'Random', location: 'Middle', technician: 'Jane D.' },
        { id: 'QC-113', batchId: 'B-2024-089', testType: 'Moisture', timestamp: '10:00 AM', status: 'Fail', value: '16.5', unit: '%', method: 'Composite', location: 'End', technician: 'John S.' }
    ])

    // ... (rest of state items, keeping generic rest)
    // Test Form State
    const [formData, setFormData] = React.useState<Partial<QCResult>>({
        testType: 'Iron Spot',
        status: 'Pending',
        method: 'Random',
        location: 'Middle'
    })

    const handleSave = () => {
        // Auto-grading Logic (Mock)
        let determinedStatus: QCStatus = 'Pass'
        if (formData.testType === 'Moisture' && Number(formData.value) > 15) determinedStatus = 'Fail'
        if (formData.testType === 'Iron Spot' && formData.value === 'Negative') determinedStatus = 'Fail'

        const newTest: QCResult = {
            ...formData,
            id: `QC-${Date.now()}`,
            timestamp: new Date().toLocaleTimeString(),
            technician: 'Current User',
            status: determinedStatus
        } as QCResult

        setTests([newTest, ...tests])
        setView('overview')
    }

    const handlePhotoUpload = () => {
        setFormData({ ...formData, photoUrl: 'mock-photo-url.jpg' })
    }

    return (
        <Card className="h-full flex flex-col overflow-hidden border-zinc-200 shadow-sm transition-all hover:shadow-md">
            <SelfAuditModal open={showSelfAudit} onOpenChange={setShowSelfAudit} />
            <AnimatePresence mode='wait'>
                {view === 'overview' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col h-full">
                        <CardHeader className="pb-2">
                            <div className="flex justify-between items-center">
                                <CardTitle className="flex items-center gap-2">
                                    <ClipboardCheck className="w-5 h-5 text-green-600" />
                                    Quality Control
                                </CardTitle>
                                <div className="flex gap-2">
                                    <Button size="sm" variant="outline" onClick={() => setShowSelfAudit(true)} className="border-[#0A3225]/20 text-[#0A3225] hover:bg-[#0A3225]/5">
                                        <ShieldCheck className="w-4 h-4 mr-2" /> Self Audit
                                    </Button>
                                    <Button size="sm" onClick={() => setView('record')} className="bg-green-600 hover:bg-green-700">
                                        <Plus className="w-4 h-4 mr-2" /> Record Test
                                    </Button>
                                </div>
                            </div>
                            <CardDescription>Track compliance and safety checks</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1 overflow-auto space-y-4 p-4">
                            {/* Reminders */}
                            <div className="flex gap-2 mb-2">
                                <Badge variant="outline" className="border-red-200 bg-red-50 text-red-700 flex items-center gap-1">
                                    <Clock className="w-3 h-3" /> Due: Iron Spot (Line 1)
                                </Badge>
                            </div>

                            {/* Recent Tests List */}
                            <div className="space-y-3">
                                {tests.map(test => (
                                    <div
                                        key={test.id}
                                        className="border rounded-lg p-3 hover:bg-slate-50 cursor-pointer transition-colors group flex items-start gap-3"
                                        onClick={() => { setSelectedTest(test); setView('detail') }}
                                    >
                                        {test.status === 'Pass'
                                            ? <div className="mt-1 bg-green-100 p-1.5 rounded-full"><CheckCircle2 className="w-4 h-4 text-green-600" /></div>
                                            : <div className="mt-1 bg-red-100 p-1.5 rounded-full"><XCircle className="w-4 h-4 text-red-600" /></div>
                                        }
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <h4 className="font-bold text-sm text-zinc-900">{test.testType}</h4>
                                                <span className="text-xs text-muted-foreground">{test.timestamp}</span>
                                            </div>
                                            <p className="text-xs text-zinc-500 mb-1">{test.batchId} • {test.value} {test.unit}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </motion.div>
                )}

                {view === 'record' && (
                    <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="flex flex-col h-full">
                        <CardHeader className="bg-slate-50 border-b">
                            <div className="flex items-center gap-2">
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setView('overview')}><ArrowLeft className="w-4 h-4" /></Button>
                                <CardTitle className="text-lg">Record QC Result</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6 space-y-4 overflow-auto flex-1">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Test Type <span className="text-red-500">*</span></Label>
                                    <Select onValueChange={(v) => setFormData({ ...formData, testType: v as any })}>
                                        <SelectTrigger><SelectValue placeholder="Select Test" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Iron Spot">Iron Spot Test</SelectItem>
                                            <SelectItem value="Moisture">Moisture Analysis</SelectItem>
                                            <SelectItem value="Visual">Visual Inspection</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Select Batch <span className="text-red-500">*</span></Label>
                                    <Input placeholder="Batch ID (e.g. B-2024-089)" value={formData.batchId} onChange={e => setFormData({ ...formData, batchId: e.target.value })} />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Sampling Method</Label>
                                    <Select onValueChange={(v) => setFormData({ ...formData, method: v as any })}>
                                        <SelectTrigger><SelectValue placeholder="e.g. Random" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Random">Random Grab</SelectItem>
                                            <SelectItem value="Composite">Composite</SelectItem>
                                            <SelectItem value="Timed">Timed Interval</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Point of Testing</Label>
                                    <Select onValueChange={(v) => setFormData({ ...formData, location: v as any })}>
                                        <SelectTrigger><SelectValue placeholder="e.g. Middle" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Start">Start of Run</SelectItem>
                                            <SelectItem value="Middle">Middle of Run</SelectItem>
                                            <SelectItem value="End">End of Run</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Result Value <span className="text-red-500">*</span></Label>
                                {formData.testType === 'Iron Spot' ? (
                                    <Select onValueChange={v => setFormData({ ...formData, value: v })}>
                                        <SelectTrigger><SelectValue placeholder="Select Result" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Positive">Positive (Pass)</SelectItem>
                                            <SelectItem value="Negative">Negative (Fail)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                ) : (
                                    <div className="flex gap-2">
                                        <Input type="number" placeholder="0.00" value={formData.value || ''} onChange={e => setFormData({ ...formData, value: e.target.value })} />
                                        <div className="p-2 bg-slate-100 rounded text-sm text-zinc-500 w-16 text-center pt-2.5">%</div>
                                    </div>
                                )}
                                {formData.testType === 'Moisture' && (
                                    <p className="text-xs text-muted-foreground">Target: &lt; 14.5% </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label>Photo Evidence</Label>
                                <div className="border border-dashed rounded-lg p-4 flex flex-col items-center justify-center gap-2 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer" onClick={handlePhotoUpload}>
                                    {formData.photoUrl ? (
                                        <div className="flex items-center gap-2 text-green-600">
                                            <CheckCircle2 className="w-5 h-5" />
                                            <span className="text-sm font-medium">Photo Attached</span>
                                        </div>
                                    ) : (
                                        <>
                                            <CameraIcon className="w-6 h-6 text-slate-400" />
                                            <span className="text-sm text-slate-500">Tap to Capture / Upload Photo</span>
                                        </>
                                    )}
                                </div>
                            </div>

                        </CardContent>
                        <CardFooter className="border-t p-4">
                            <Button className="w-full bg-green-600 hover:bg-green-700" onClick={handleSave}>
                                Submit Result
                            </Button>
                        </CardFooter>
                    </motion.div>
                )}

                {view === 'detail' && selectedTest && (
                    <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="flex flex-col h-full">
                        <CardHeader className="bg-slate-50 border-b pb-4">
                            <div className="flex items-center gap-2 mb-2">
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setView('overview')}><ArrowLeft className="w-4 h-4" /></Button>
                                <Badge variant={selectedTest.status === 'Pass' ? 'outline' : 'destructive'} className={selectedTest.status === 'Pass' ? 'text-green-600 border-green-200 bg-green-50' : ''}>
                                    {selectedTest.status}
                                </Badge>
                            </div>
                            <CardTitle className="text-xl">{selectedTest.testType}</CardTitle>
                            <CardDescription className="flex flex-col gap-1 mt-1">
                                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {selectedTest.timestamp}</span>
                                <span className="flex items-center gap-1"><Factory className="w-3 h-3" /> {selectedTest.batchId}</span>
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6 overflow-auto flex-1">
                            {/* Validation Fields Grid */}
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div className="p-3 bg-slate-50 rounded-lg">
                                    <span className="text-xs text-muted-foreground block mb-1">Sampling Method</span>
                                    <span className="font-medium">{selectedTest.method}</span>
                                </div>
                                <div className="p-3 bg-slate-50 rounded-lg">
                                    <span className="text-xs text-muted-foreground block mb-1">Point of Testing</span>
                                    <span className="font-medium">{selectedTest.location}</span>
                                </div>
                            </div>

                            <div className="border rounded-lg p-4">
                                <Label className="text-xs text-muted-foreground uppercase tracking-wider mb-2 block">Result / Observation</Label>
                                <p className="text-base font-medium">{selectedTest.value} {selectedTest.unit}</p>
                            </div>

                            <div>
                                <h4 className="font-bold text-sm mb-2 flex items-center gap-2"><ShieldCheck className="w-4 h-4" /> FSMS Validation</h4>
                                <p className="text-sm text-muted-foreground">
                                    This test validates critical limit compliance for fortification.
                                    {selectedTest.status === 'Pass' ? ' No deviations detected.' : ' Deviation requires root cause analysis.'}
                                </p>
                            </div>

                            {selectedTest.status === 'Fail' && (
                                <div className="mt-4">
                                    <Button variant="outline" className="w-full border-red-200 text-red-600 hover:bg-red-50" onClick={() => setShowCorrectionDialog(true)}>
                                        <AlertTriangle className="w-4 h-4 mr-2" /> View Corrective Actions
                                    </Button>
                                </div>
                            )}

                            {/* Correction Dialog */}
                            <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 transition-opacity ${showCorrectionDialog ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
                                <div className="bg-white rounded-lg p-6 max-w-md w-full m-4 shadow-xl">
                                    <h3 className="text-lg font-bold mb-2 text-red-700 flex items-center gap-2">
                                        <AlertTriangle className="w-5 h-5" /> Corrective Actions Required
                                    </h3>
                                    <p className="text-sm text-zinc-600 mb-4">
                                        Based on the failure of <strong>{selectedTest.testType}</strong>, immediate steps are required per FSMS Protocol #404:
                                    </p>
                                    <ul className="space-y-2 mb-6 text-sm">
                                        <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5"></div>Stop dosing unit immediately.</li>
                                        <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5"></div>Segregate affected batch {selectedTest.batchId}.</li>
                                        <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5"></div>Perform full calibration check.</li>
                                        <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5"></div>Retest 3 previous batch samples.</li>
                                    </ul>
                                    <Button className="w-full" onClick={() => setShowCorrectionDialog(false)}>I Acknowledge & Will Execute</Button>
                                </div>
                            </div>

                        </CardContent>
                    </motion.div>
                )}
            </AnimatePresence>
        </Card>
    )
}

// --- TRACEABILITY MODULE ---

export function TraceabilityModule() {
    const [view, setView] = React.useState<'list' | 'certificate'>('list')
    const [selectedBatch, setSelectedBatch] = React.useState<string | null>(null)
    const [showQR, setShowQR] = React.useState<string | null>(null)

    const COMPLETED_BATCHES = [
        { id: 'B-2024-001', product: 'Maize Flour Grade 1', date: '2024-12-20', status: 'Released', qr: 'mock-qr-001' },
        { id: 'B-2024-002', product: 'Rice Fortified', date: '2024-12-21', status: 'Released', qr: 'mock-qr-002' },
        { id: 'B-2024-003', product: 'Wheat Flour', date: '2024-12-22', status: 'Quarantined', qr: null },
    ]

    return (
        <Card className="h-full flex flex-col overflow-hidden border-zinc-200 shadow-sm transition-all hover:shadow-md">
            <AnimatePresence mode='wait'>
                {view === 'list' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col h-full">
                        <CardHeader className="pb-2">
                            <div className="flex justify-between items-center">
                                <CardTitle className="flex items-center gap-2">
                                    <QrCode className="w-5 h-5 text-orange" />
                                    Traceability & Certs
                                </CardTitle>
                                <Button size="sm" variant="outline">
                                    <Search className="w-4 h-4 mr-2" /> Search Batch
                                </Button>
                            </div>
                            <CardDescription>Generate CoA and Traceability QR codes</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1 overflow-auto space-y-4 p-4">
                            <div className="space-y-3">
                                {COMPLETED_BATCHES.map(batch => (
                                    <div key={batch.id} className="border rounded-lg p-4 hover:bg-slate-50 transition-colors flex justify-between items-center">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <Badge variant="outline" className="font-mono bg-white">{batch.id}</Badge>
                                                <Badge className={batch.status === 'Released' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}>{batch.status}</Badge>
                                            </div>
                                            <div className="text-sm font-medium">{batch.product}</div>
                                            <div className="text-xs text-muted-foreground">{batch.date}</div>
                                        </div>
                                        <div className="flex gap-2">
                                            {batch.status === 'Released' && (
                                                <>
                                                    <Button size="sm" variant="outline" className="h-8" onClick={() => setShowQR(batch.id)}>
                                                        <QrCode className="w-3 h-3 mr-1" /> QR
                                                    </Button>
                                                    <Button size="sm" className="h-8 bg-orange hover:bg-purple-700" onClick={() => { setSelectedBatch(batch.id); setView('certificate') }}>
                                                        <ClipboardCheck className="w-3 h-3 mr-1" /> CoA
                                                    </Button>
                                                </>
                                            )}
                                            {batch.status !== 'Released' && (
                                                <span className="text-xs italic text-zinc-400 p-2">CoA Locked</span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </motion.div>
                )}

                {view === 'certificate' && (
                    <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="flex flex-col h-full bg-slate-50">
                        <CardHeader className="bg-white border-b pb-4">
                            <div className="flex items-center gap-2 mb-2">
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setView('list')}><ArrowLeft className="w-4 h-4" /></Button>
                                <span className="font-semibold text-sm text-zinc-500">Digital Certificate Preview</span>
                            </div>
                        </CardHeader>
                        <CardContent className="p-8 overflow-auto flex-1 flex justify-center">
                            <div className="bg-white border shadow-lg p-8 max-w-lg w-full relative">
                                {/* Watermark */}
                                <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
                                    <ShieldCheck className="w-64 h-64" />
                                </div>

                                <div className="text-center border-b-2 border-zinc-800 pb-4 mb-6">
                                    <h1 className="text-2xl font-bold font-serif text-zinc-900">CERTIFICATE OF ANALYSIS</h1>
                                    <p className="text-sm text-zinc-600 uppercase tracking-widest mt-1">Fortified Food Product</p>
                                </div>

                                <div className="space-y-4 text-sm">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <span className="block text-xs text-zinc-500 uppercase">Batch Number</span>
                                            <span className="font-mono font-bold text-base">{selectedBatch}</span>
                                        </div>
                                        <div>
                                            <span className="block text-xs text-zinc-500 uppercase">Production Date</span>
                                            <span className="font-medium">2024-12-20</span>
                                        </div>
                                    </div>

                                    <div>
                                        <span className="block text-xs text-zinc-500 uppercase mb-1">Product Description</span>
                                        <span className="font-medium block border p-2 bg-slate-50">Premium Fortified Maize Flour (Grade 1)</span>
                                    </div>

                                    <div className="pt-4">
                                        <span className="block text-xs text-zinc-500 uppercase mb-2 font-bold">Fortification Profile</span>
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="border-b text-xs text-zinc-500">
                                                    <th className="py-1">Micronutrient</th>
                                                    <th className="py-1">Method</th>
                                                    <th className="py-1">Result</th>
                                                    <th className="py-1">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr className="border-b border-zinc-100">
                                                    <td className="py-2">Iron</td>
                                                    <td className="py-2 text-xs text-zinc-500">Spectro</td>
                                                    <td className="py-2 font-mono">23 ppm</td>
                                                    <td className="py-2 text-green-600 text-xs font-bold">PASS</td>
                                                </tr>
                                                <tr className="border-b border-zinc-100">
                                                    <td className="py-2">Vitamin A</td>
                                                    <td className="py-2 text-xs text-zinc-500">HPLC</td>
                                                    <td className="py-2 font-mono">1.2 mg/kg</td>
                                                    <td className="py-2 text-green-600 text-xs font-bold">PASS</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>

                                    <div className="pt-8 flex justify-between items-end">
                                        <div className="text-center">
                                            <div className="w-32 border-b border-zinc-400 mb-1"></div>
                                            <span className="text-xs text-zinc-400">Quality Manager Signature</span>
                                        </div>
                                        <div className="w-20 h-20 bg-zinc-900 text-white flex items-center justify-center p-1">
                                            {/* Mock QR */}
                                            <QrCode className="w-16 h-16" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="bg-white border-t p-4 flex justify-end gap-2">
                            <Button variant="outline"><Share2 className="w-4 h-4 mr-2" /> Share</Button>
                            <Button><Download className="w-4 h-4 mr-2" /> Download PDF</Button>
                        </CardFooter>
                    </motion.div>
                )}

                {/* QR Dialog Mock */}
                {showQR && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowQR(null)}>
                        <div className="bg-white p-6 rounded-xl shadow-2xl text-center max-w-sm mx-4 animate-in zoom-in-50" onClick={e => e.stopPropagation()}>
                            <h3 className="font-bold text-lg mb-4">Batch Traceability QR</h3>
                            <div className="bg-white p-4 border rounded-lg inline-block mb-4 shadow-inner">
                                <QrCode className="w-48 h-48 text-zinc-900" />
                            </div>
                            <p className="text-sm text-zinc-500 mb-6">Scan to verify origin and nutritional content.</p>
                            <Button className="w-full" onClick={() => setShowQR(null)}>Close</Button>
                        </div>
                    </div>
                )}
            </AnimatePresence>
        </Card>
    )
}

function CameraIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
            <circle cx="12" cy="13" r="3" />
        </svg>
    )
}
