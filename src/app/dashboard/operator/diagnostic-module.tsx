
'use client'

import * as React from 'react'
import {
    Activity, AlertTriangle, CheckCircle2, ChevronRight,
    Camera, FileText, ArrowLeft, RefreshCw, Smartphone,
    Settings, Play, Thermometer, Gauge, Beaker, XCircle,
    AlertOctagon, Info, History, Eye, Calendar
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
import { motion, AnimatePresence } from 'framer-motion'
import { Progress } from '@/components/ui/progress'
import {
    Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"

// --- MOCK DATA ---
const LINES = ['Line 1 (High Speed)', 'Line 2 (Standard)', 'Line 3 (Manual)']
const EQUIPMENT_MODELS = {
    'Volumetric Doser': ['Model X-200', 'Model X-500 Pro'],
    'Continuous Mixer': ['MixMaster 3000', 'BlendPro V2'],
    'Premix Feeder': ['FeedRight A1', 'FeedRight A2']
}

// Scenarios based on symptoms
const DIAGNOSTIC_SCENARIOS = {
    doser_under: {
        title: 'Doser Under-Dosing',
        steps: [
            { id: 's1', q: 'Is the hopper level above 50%?', type: 'yes_no', expected: 'yes', why: 'Low head pressure causes irregular flow.' },
            { id: 's2', q: 'Check Augur Speed (RPM)', type: 'numeric', min: 100, max: 150, unit: 'RPM', why: 'Motor slip can reduce output.' },
            { id: 's3', q: 'Inspect Discharge Nozzle', type: 'check', desc: 'Is there caking or blockage?', why: 'Output restriction reduces dose weight.' }
        ]
    },
    doser_fluctuation: {
        title: 'Inconsistent Dosing Flow',
        steps: [
            { id: 's1', q: 'Check Bridge Breaker', type: 'yes_no', expected: 'yes', why: 'Bridging prevents consistent powder flow.' },
            { id: 's2', q: 'Input Vibration Level', type: 'numeric', min: 2.0, max: 5.0, unit: 'mm/s', why: 'Excessive vibration packs the powder.' }
        ]
    }
}

const HISTORY_DATA = [
    { id: 'd-102', date: '2024-12-25', time: '09:30 AM', equipment: 'Volumetric Doser', symptom: 'Under-Dosing', status: 'Escalated', tech: 'John D.' },
    { id: 'd-101', date: '2024-12-24', time: '02:15 PM', equipment: 'Premix Feeder', symptom: 'Blockage', status: 'Resolved', tech: 'Sarah M.' },
    { id: 'd-099', date: '2024-12-22', time: '11:00 AM', equipment: 'Continuous Mixer', symptom: 'Motor Heat', status: 'Resolved', tech: 'John D.' },
]

// --- COMPONENTS ---

export function DiagnosticModule({ onLaunchCalibration }: { onLaunchCalibration?: () => void }) {
    const [view, setView] = React.useState<'context' | 'symptoms' | 'wizard' | 'resolution'>('context')

    // Context State
    const [context, setContext] = React.useState({
        product: '',
        line: '',
        equipment: '',
        model: ''
    })

    // Diagnostic State
    const [selectedSymptom, setSelectedSymptom] = React.useState('')
    const [wizardData, setWizardData] = React.useState<any>(null)
    const [findings, setFindings] = React.useState<any[]>([])

    // History Modal State
    const [selectedHistory, setSelectedHistory] = React.useState<any>(null)

    const handleStart = (symptomKey: string) => {
        setSelectedSymptom(symptomKey)
        const scenario = (DIAGNOSTIC_SCENARIOS as any)[symptomKey]
        setWizardData(scenario)
        setFindings(scenario.steps.map((s: any) => ({ ...s, status: 'pending', value: null, feedback: null })))
        setView('wizard')
    }

    const reset = () => {
        setView('context')
        setContext({ product: '', line: '', equipment: '', model: '' })
        setWizardData(null)
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-140px)]">
            {/* Main Diagnostic Area (Left 2/3) */}
            <div className="lg:col-span-2 space-y-6">
                {/* Header / Breadcrumbs could go here */}

                <AnimatePresence mode='wait'>
                    {view === 'context' && (
                        <ContextSelector
                            context={context}
                            setContext={setContext}
                            onNext={() => setView('symptoms')}
                        />
                    )}
                    {view === 'symptoms' && (
                        <SymptomSelector
                            context={context}
                            onBack={() => setView('context')}
                            onSelect={handleStart}
                        />
                    )}
                    {view === 'wizard' && wizardData && (
                        <DiagnosticWizard
                            scenario={wizardData}
                            findings={findings}
                            setFindings={setFindings}
                            onBack={() => setView('symptoms')}
                            onComplete={() => setView('resolution')}
                        />
                    )}
                    {view === 'resolution' && (
                        <ResolutionHub
                            findings={findings}
                            context={context}
                            onRestart={reset}
                            onLaunchCalibration={onLaunchCalibration}
                        />
                    )}
                </AnimatePresence>
            </div>

            {/* Right Side Panel (History) */}
            <div className="space-y-6">
                <Card className="h-full border-none shadow-md bg-white/80 backdrop-blur-sm flex flex-col">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <History className="w-5 h-5 text-gray-500" />
                            Diagnostic History
                        </CardTitle>
                        <CardDescription>Recent troubleshooting sessions</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 overflow-auto p-4 pt-0">
                        <div className="space-y-3">
                            {HISTORY_DATA.map((item) => (
                                <div key={item.id} className="p-3 rounded-lg border bg-white hover:border-blue-300 transition-colors group">
                                    <div className="flex justify-between items-start mb-2">
                                        <Badge variant={item.status === 'Resolved' ? 'outline' : 'destructive'} className={item.status === 'Resolved' ? 'text-green-600 bg-green-50' : ''}>
                                            {item.status}
                                        </Badge>
                                        <span className="text-xs text-gray-400">{item.date}</span>
                                    </div>
                                    <h4 className="font-semibold text-sm text-gray-900 mb-1">{item.symptom}</h4>
                                    <p className="text-xs text-gray-500 mb-3">{item.equipment}</p>

                                    <Button variant="ghost" size="sm" className="w-full h-8 text-xs justify-between group-hover:bg-blue-50 group-hover:text-blue-600" onClick={() => setSelectedHistory(item)}>
                                        View Details <ChevronRight className="w-3 h-3" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                    <CardFooter className="border-t p-4">
                        <Button variant="outline" className="w-full text-xs">View All Logs</Button>
                    </CardFooter>
                </Card>
            </div>

            {/* Detail Dialog */}
            <Dialog open={!!selectedHistory} onOpenChange={(open) => !open && setSelectedHistory(null)}>
                <DialogContent className="max-w-xl">
                    <DialogHeader>
                        <DialogTitle>Diagnostic Record #{selectedHistory?.id}</DialogTitle>
                        <DialogDescription>
                            Performed on {selectedHistory?.date} at {selectedHistory?.time} by {selectedHistory?.tech}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-3 bg-slate-50 rounded-lg">
                                <Label className="text-xs text-gray-500">Equipment</Label>
                                <p className="font-medium text-sm">{selectedHistory?.equipment}</p>
                            </div>
                            <div className="p-3 bg-slate-50 rounded-lg">
                                <Label className="text-xs text-gray-500">Symptom</Label>
                                <p className="font-medium text-sm text-red-600">{selectedHistory?.symptom}</p>
                            </div>
                        </div>

                        <div className="rounded-md border p-4">
                            <h4 className="font-medium mb-3 flex items-center gap-2"><FileText className="w-4 h-4" /> Steps Taken</h4>
                            <div className="space-y-3 pl-2 border-l-2 border-slate-200">
                                <div className="text-sm">
                                    <span className="text-green-600 font-bold">✔</span> Hopper Level Check <span className="text-gray-400 mx-2">-</span> <span className="text-gray-600">Passed</span>
                                </div>
                                <div className="text-sm">
                                    <span className="text-green-600 font-bold">✔</span> Motor RPM <span className="text-gray-400 mx-2">-</span> <span className="text-gray-600">120 RPM (Normal)</span>
                                </div>
                                <div className="text-sm">
                                    <span className="text-red-500 font-bold">X</span> Nozzle Inspection <span className="text-gray-400 mx-2">-</span> <span className="text-red-600 font-medium">Blockage Found</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-blue-50 p-4 rounded-lg flex gap-3 text-sm text-blue-900">
                            <Info className="w-4 h-4 mt-0.5 text-blue-600" />
                            <p>
                                <strong>Outcome:</strong> {selectedHistory?.status === 'Resolved' ? 'Issue was resolved on-site.' : 'Issue escalated to maintenance.'}
                            </p>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}

function ContextSelector({ context, setContext, onNext }: any) {
    const isComplete = context.product && context.line && context.equipment && context.model

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="h-full">
            <Card className="border-none shadow-md bg-white h-full flex flex-col">
                <CardHeader className="bg-zinc-50 border-b pb-4 rounded-t-xl">
                    <CardTitle className="flex items-center gap-2">
                        <Settings className="w-6 h-6 text-primary" />
                        New Diagnostic Session
                    </CardTitle>
                    <CardDescription>Configure the context to start troubleshooting</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 flex-1">
                    <div className="space-y-2">
                        <Label>Fortified Product</Label>
                        <Select onValueChange={(v) => setContext({ ...context, product: v })} value={context.product}>
                            <SelectTrigger><SelectValue placeholder="Select Product" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Maize">Maize Flour</SelectItem>
                                <SelectItem value="Rice">Rice</SelectItem>
                                <SelectItem value="Wheat">Wheat Flour</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Production Line</Label>
                        <Select onValueChange={(v) => setContext({ ...context, line: v })} value={context.line}>
                            <SelectTrigger><SelectValue placeholder="Select Line" /></SelectTrigger>
                            <SelectContent>
                                {LINES.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Equipment Type</Label>
                        <Select onValueChange={(v) => setContext({ ...context, equipment: v, model: '' })} value={context.equipment}>
                            <SelectTrigger><SelectValue placeholder="Select Equipment" /></SelectTrigger>
                            <SelectContent>
                                {Object.keys(EQUIPMENT_MODELS).map(e => <SelectItem key={e} value={e}>{e}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Equipment Model</Label>
                        <Select
                            onValueChange={(v) => setContext({ ...context, model: v })}
                            value={context.model}
                            disabled={!context.equipment}
                        >
                            <SelectTrigger><SelectValue placeholder="Select Model" /></SelectTrigger>
                            <SelectContent>
                                {context.equipment && (EQUIPMENT_MODELS as any)[context.equipment]?.map((m: string) => (
                                    <SelectItem key={m} value={m}>{m}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-end p-6 border-t bg-zinc-50 rounded-b-xl">
                    <Button size="lg" onClick={onNext} disabled={!isComplete} className="w-full md:w-auto">
                        Start <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                </CardFooter>
            </Card>
        </motion.div>
    )
}

function SymptomSelector({ context, onBack, onSelect }: any) {
    return (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <Button variant="ghost" onClick={onBack} className="mb-4 pl-0 hover:pl-2 transition-all">
                <ArrowLeft className="w-4 h-4 mr-2" /> Change Context
            </Button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="md:col-span-2 bg-gradient-to-r from-blue-600 to-indigo-700 text-white border-none">
                    <CardHeader>
                        <CardTitle>What issue are you observing?</CardTitle>
                        <CardDescription className="text-blue-100">
                            Context: {context.product} • {context.line} • {context.equipment} ({context.model})
                        </CardDescription>
                    </CardHeader>
                </Card>

                <div
                    onClick={() => onSelect('doser_under')}
                    className="bg-white p-6 rounded-xl border shadow-sm hover:shadow-md hover:border-blue-300 cursor-pointer transition-all group"
                >
                    <div className="flex items-start justify-between mb-4">
                        <div className="p-3 bg-orange-100 text-orange-600 rounded-lg group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                            <Gauge className="w-6 h-6" />
                        </div>
                        <ChevronRight className="w-5 h-5 text-zinc-300 group-hover:text-blue-500" />
                    </div>
                    <h3 className="font-bold text-zinc-900 mb-1">Under-Dosing / Low Flow</h3>
                    <p className="text-sm text-zinc-500">Output weight is strictly below the target tolerance.</p>
                </div>

                <div
                    onClick={() => onSelect('doser_fluctuation')}
                    className="bg-white p-6 rounded-xl border shadow-sm hover:shadow-md hover:border-blue-300 cursor-pointer transition-all group"
                >
                    <div className="flex items-start justify-between mb-4">
                        <div className="p-3 bg-red-100 text-red-600 rounded-lg group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                            <Activity className="w-6 h-6" />
                        </div>
                        <ChevronRight className="w-5 h-5 text-zinc-300 group-hover:text-blue-500" />
                    </div>
                    <h3 className="font-bold text-zinc-900 mb-1">Inconsistent / Fluctuating</h3>
                    <p className="text-sm text-zinc-500">Flow rate spikes or drops randomly during operation.</p>
                </div>
            </div>
        </motion.div>
    )
}

function DiagnosticWizard({ scenario, findings, setFindings, onBack, onComplete }: any) {
    const [stepIndex, setStepIndex] = React.useState(0)
    const currentStep = findings[stepIndex]

    const handleUpdate = (val: any) => {
        const updated = [...findings]
        let feedback = null

        // Range Logic
        if (currentStep.type === 'numeric') {
            if (val >= currentStep.min && val <= currentStep.max) {
                feedback = 'normal'
            } else {
                feedback = 'deviation'
            }
        } else if (currentStep.type === 'yes_no') {
            feedback = val === currentStep.expected ? 'normal' : 'deviation'
        }

        updated[stepIndex] = { ...currentStep, value: val, status: 'completed', feedback }
        setFindings(updated)
    }

    const nextStep = () => {
        if (stepIndex < findings.length - 1) setStepIndex(stepIndex + 1)
        else onComplete()
    }

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col">
            <div className="mb-6 flex items-center justify-between">
                <Button variant="ghost" onClick={onBack} size="sm"><ArrowLeft className="w-4 h-4 mr-2" /> Cancel Diagnosis</Button>
                <div className="text-sm font-medium text-zinc-500">Step {stepIndex + 1} of {findings.length}</div>
            </div>

            <Card className="flex-1 shadow-lg border-zinc-200 overflow-hidden flex flex-col">
                <div className="h-2 bg-zinc-100">
                    <motion.div
                        className="h-full bg-blue-600"
                        initial={{ width: 0 }}
                        animate={{ width: `${((stepIndex) / findings.length) * 100}%` }}
                    />
                </div>

                <CardContent className="p-8 flex-1 flex flex-col">
                    <div className="flex-1">
                        <Badge variant="outline" className="mb-4 text-zinc-500 border-zinc-300">{scenario.title}</Badge>
                        <h2 className="text-3xl font-bold text-zinc-900 mb-4">{currentStep.q}</h2>

                        {/* Educational Context */}
                        <div className="bg-blue-50 border border-blue-100 text-blue-800 p-4 rounded-lg mb-8 flex gap-3 items-start">
                            <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
                            <div>
                                <span className="font-bold block text-sm mb-1">Why check this?</span>
                                <p className="text-sm opacity-90">{currentStep.why}</p>
                            </div>
                        </div>

                        {/* Inputs */}
                        <div className="max-w-md">
                            {currentStep.type === 'yes_no' && (
                                <div className="grid grid-cols-2 gap-4">
                                    <Button
                                        variant={currentStep.value === 'yes' ? 'default' : 'outline'}
                                        className="h-20 text-lg"
                                        onClick={() => handleUpdate('yes')}
                                    >
                                        YES
                                    </Button>
                                    <Button
                                        variant={currentStep.value === 'no' ? 'default' : 'outline'}
                                        className="h-20 text-lg"
                                        onClick={() => handleUpdate('no')}
                                    >
                                        NO
                                    </Button>
                                </div>
                            )}

                            {currentStep.type === 'numeric' && (
                                <div className="space-y-4">
                                    <div className="flex gap-4">
                                        <Input
                                            type="number"
                                            className="h-14 text-xl font-bold font-mono"
                                            placeholder={`Target: ${currentStep.min}-${currentStep.max}`}
                                            onChange={(e) => handleUpdate(parseFloat(e.target.value))}
                                        />
                                        <div className="flex items-center text-zinc-500 font-bold">{currentStep.unit}</div>
                                    </div>
                                    {/* Real-time Feedback */}
                                    {currentStep.feedback && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className={`p-3 rounded-lg flex items-center gap-2 font-bold ${currentStep.feedback === 'normal' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
                                        >
                                            {currentStep.feedback === 'normal' ? <CheckCircle2 className="w-5 h-5" /> : <AlertOctagon className="w-5 h-5" />}
                                            {currentStep.feedback === 'normal' ? 'Result Within Range' : `Deviation Detected (Target: ${currentStep.min}-${currentStep.max})`}
                                        </motion.div>
                                    )}
                                </div>
                            )}

                            {currentStep.type === 'check' && (
                                <Button
                                    className={`w-full h-16 text-lg justify-start px-6 ${currentStep.value === 'done' ? 'bg-green-600 hover:bg-green-700' : ''}`}
                                    onClick={() => handleUpdate('done')}
                                >
                                    {currentStep.value === 'done' ? <CheckCircle2 className="w-6 h-6 mr-3" /> : <div className="w-6 h-6 border-2 border-white/30 rounded mr-3" />}
                                    {currentStep.value === 'done' ? 'Check Completed' : 'Confirm Check Performed'}
                                </Button>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-end pt-6 mt-6 border-t">
                        <Button size="lg" disabled={!currentStep.value} onClick={nextStep}>
                            {stepIndex === findings.length - 1 ? 'Finish Diagnosis' : 'Next Step'} <ChevronRight className="w-5 h-5 ml-2" />
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    )
}

function ResolutionHub({ findings, context, onRestart, onLaunchCalibration }: any) {
    const issues = findings.filter((f: any) => f.feedback === 'deviation' || (f.type === 'check' && f.desc.includes('blockage') && f.value === 'done')) // Simple deviation logic
    const [notes, setNotes] = React.useState('')
    const [photos, setPhotos] = React.useState<string[]>([])

    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setPhotos([...photos, e.target.files[0].name])
        }
    }

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto space-y-6">
            <Card className="bg-zinc-900 text-white border-zinc-800">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        {issues.length > 0 ? <AlertTriangle className="text-red-500" /> : <CheckCircle2 className="text-green-500" />}
                        Diagnostic Result: {issues.length > 0 ? `${issues.length} Anomalies Found` : 'No Issues Detected'}
                    </CardTitle>
                    <CardDescription className="text-zinc-400">Context: {context.equipment} ({context.model})</CardDescription>
                </CardHeader>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader><CardTitle>Findings Summary</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        {findings.map((f: any, i: number) => (
                            <div key={i} className={`p-3 rounded border flex justify-between items-center ${f.feedback === 'deviation' ? 'bg-red-50 border-red-100' : 'bg-white'}`}>
                                <div>
                                    <p className="font-medium text-sm text-zinc-900">{f.q}</p>
                                    <p className="text-xs text-zinc-500">Input: {f.value} {f.unit}</p>
                                </div>
                                {f.feedback === 'deviation' && <Badge variant="destructive">Fail</Badge>}
                                {f.feedback === 'normal' && <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">Pass</Badge>}
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader><CardTitle>Corrective Actions</CardTitle></CardHeader>
                    <CardContent>
                        {issues.length > 0 ? (
                            <div className="space-y-4">
                                <div className="p-4 bg-orange-50 border border-orange-100 rounded-lg">
                                    <h4 className="font-bold text-orange-800 mb-2 flex items-center"><Wrench className="w-4 h-4 mr-2" /> Recommended: Re-Calibration</h4>
                                    <p className="text-sm text-orange-700">The deviation in output suggests the doser is out of spec. Please run a full calibration cycle.</p>
                                    <Button size="sm" className="mt-4 bg-orange-600 hover:bg-orange-700" onClick={onLaunchCalibration}>Launch Calibration Task</Button>
                                </div>
                                <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg">
                                    <h4 className="font-bold text-blue-800 mb-2">Secondary: Clean Nozzle</h4>
                                    <p className="text-sm text-blue-700">Ensure no caking is obstructing flow.</p>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-8 text-zinc-500">
                                <CheckCircle2 className="w-12 h-12 mx-auto mb-3 text-green-500" />
                                <p>All checks passed. You may resume normal operation.</p>
                                <Button className="mt-4" onClick={onRestart}>Return to Dashboard</Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Evidence & Escalate (Only if issues found) */}
            {issues.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Escalation & Evidence</CardTitle>
                        <CardDescription>Upload photos and report to manager if unresolved.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Notes</Label>
                            <Textarea placeholder="Explain what persists..." value={notes} onChange={e => setNotes(e.target.value)} />
                        </div>
                        <div className="flex gap-4 flex-wrap">
                            <div className="relative">
                                <Input type="file" id="evidence-upload" className="hidden" onChange={handlePhotoUpload} />
                                <Button variant="outline" onClick={() => document.getElementById('evidence-upload')?.click()}>
                                    <Camera className="w-4 h-4 mr-2" /> Add Photo Evidence
                                </Button>
                            </div>
                            {photos.map((p, i) => <Badge key={i} variant="secondary">{p}</Badge>)}
                        </div>
                    </CardContent>
                    <CardFooter className="bg-red-50 border-t border-red-100 p-4 rounded-b-xl flex justify-between items-center">
                        <div className="text-red-800 text-sm font-medium flex items-center">
                            <AlertOctagon className="w-4 h-4 mr-2" />
                            Issue critical for production?
                        </div>
                        <Button variant="destructive">Escalate to Manager</Button>
                    </CardFooter>
                </Card>
            )}
        </motion.div>
    )
}

function Wrench(props: any) { return <Settings {...props} /> } // Fallback icon
