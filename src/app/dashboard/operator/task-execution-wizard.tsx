'use client'

import * as React from 'react'
import {
    ArrowLeft, CheckCircle2, Clock, Hammer, AlertTriangle, ShieldCheck,
    Camera, Upload, FileText, ChevronRight, Save, User, Settings, Wrench
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { motion, AnimatePresence } from 'framer-motion'
import { MaintenanceTask, TaskStep } from './maintenance-types'

export function TaskExecutionWizard({ task, onBack, onComplete }: { task: MaintenanceTask, onBack: () => void, onComplete: (notes: string, status: 'Completed' | 'Escalated', evidence?: any) => void }) {
    const [phase, setPhase] = React.useState<'prep' | 'execute' | 'evidence'>('prep')
    const [elapsed, setElapsed] = React.useState(0)

    // State
    const [stepState, setStepState] = React.useState<TaskStep[]>(task.steps.map(s => ({ ...s })))
    const [notes, setNotes] = React.useState('')
    const [checklist, setChecklist] = React.useState({ loto: false, ppe: false, areaClear: false })
    const [evidence, setEvidence] = React.useState<{ photo?: string, partsUsed: string[] }>({ partsUsed: [] })

    // Timer
    React.useEffect(() => {
        const timer = setInterval(() => setElapsed(e => e + 1), 1000)
        return () => clearInterval(timer)
    }, [])

    const formatTime = (s: number) => {
        const m = Math.floor(s / 60)
        const sec = s % 60
        return `${m}:${sec.toString().padStart(2, '0')}`
    }

    const toggleStep = (id: string) => {
        setStepState(stepState.map(s => s.id === id ? { ...s, completed: !s.completed } : s))
    }

    const updateMeasurement = (id: string, value: number) => {
        setStepState(stepState.map(s => s.id === id ? { ...s, calibrationValue: value } : s))
    }

    const prepReady = checklist.loto && checklist.ppe && checklist.areaClear
    const execReady = stepState.every(s => s.completed)

    return (
        <div className="h-full flex flex-col space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between shrink-0 mb-2">
                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="sm" onClick={onBack}><ArrowLeft className="w-4 h-4 mr-2" /> Exit</Button>
                    <div>
                        <h2 className="text-xl font-bold text-zinc-900">{task.title}</h2>
                        <div className="flex items-center gap-2 text-sm text-zinc-500">
                            <Badge variant="outline">{task.equipment}</Badge>
                            <span>•</span>
                            <span className="font-mono bg-slate-100 px-2 rounded py-0.5 flex items-center gap-1"><Clock className="w-3 h-3" /> {formatTime(elapsed)}</span>
                        </div>
                    </div>
                </div>

                {/* Phase Stepper */}
                <div className="flex bg-slate-100 p-1 rounded-lg">
                    {['prep', 'execute', 'evidence'].map((p, i) => (
                        <div key={p} className={`px-4 py-1.5 rounded-md text-xs font-semibold capitalize flex items-center gap-2 ${phase === p ? 'bg-white shadow-sm text-blue-700' : 'text-zinc-400'}`}>
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${phase === p ? 'bg-blue-100' : 'bg-slate-200'}`}>
                                {i + 1}
                            </div>
                            {p === 'prep' ? 'Preparation' : p === 'execute' ? 'Execution' : 'Completion'}
                        </div>
                    ))}
                </div>
            </div>

            <Card className="flex-1 flex flex-col overflow-hidden border-none shadow-sm">
                <AnimatePresence mode="wait">
                    {phase === 'prep' && (
                        <motion.div key="prep" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex-1 flex flex-col">
                            <CardHeader className="text-center pb-2">
                                <CardTitle>Pre-Maintenance Checks</CardTitle>
                                <CardDescription>Verify safety protocols and resource availability before proceeding.</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1 overflow-y-auto p-8 max-w-4xl mx-auto w-full space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <h3 className="font-semibold text-zinc-900 flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-green-600" /> Safety Checklist</h3>
                                        <div className="space-y-3 bg-red-50 p-4 rounded-lg border border-red-100">
                                            <div className="flex items-center space-x-2">
                                                <Checkbox id="loto" checked={checklist.loto} onCheckedChange={(c) => setChecklist({ ...checklist, loto: !!c })} />
                                                <label htmlFor="loto" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer">Lockout / Tagout Applied</label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Checkbox id="ppe" checked={checklist.ppe} onCheckedChange={(c) => setChecklist({ ...checklist, ppe: !!c })} />
                                                <label htmlFor="ppe" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer">Unsafe Area Cleared (PPE On)</label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Checkbox id="clear" checked={checklist.areaClear} onCheckedChange={(c) => setChecklist({ ...checklist, areaClear: !!c })} />
                                                <label htmlFor="clear" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer">Work Area Inspected</label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <h3 className="font-semibold text-zinc-900 flex items-center gap-2"><Hammer className="w-5 h-5 text-blue-600" /> Required Resources</h3>
                                        <div className="bg-slate-50 p-4 rounded-lg border space-y-4">
                                            <div>
                                                <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider block mb-2">Parts</span>
                                                <div className="flex flex-wrap gap-2">
                                                    {task.requirements?.parts.map(p => <Badge key={p} variant="secondary" className="bg-white border">{p}</Badge>) || <span className="text-sm text-zinc-400 italic">None</span>}
                                                </div>
                                            </div>
                                            <div>
                                                <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider block mb-2">Tools</span>
                                                <div className="flex flex-wrap gap-2">
                                                    {task.requirements?.tools.map(p => <Badge key={p} variant="secondary" className="bg-white border">{p}</Badge>) || <span className="text-sm text-zinc-400 italic">Standard Kit</span>}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="justify-center border-t py-6">
                                <Button size="lg" disabled={!prepReady} onClick={() => setPhase('execute')} className="w-64">
                                    Start Task <ChevronRight className="w-4 h-4 ml-2" />
                                </Button>
                            </CardFooter>
                        </motion.div>
                    )}

                    {phase === 'execute' && (
                        <motion.div key="execute" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex-1 flex flex-col bg-slate-50/50">
                            <div className="flex-1 overflow-y-auto p-6 max-w-5xl mx-auto w-full">
                                <div className="grid gap-4">
                                    {stepState.map((step, idx) => (
                                        <div key={step.id} className={`p-4 bg-white border rounded-xl shadow-sm transition-all ${step.completed ? 'opacity-80' : 'ring-1 ring-blue-100'}`}>
                                            <div className="flex items-start gap-4">
                                                <div className="flex flex-col items-center gap-2 pt-1">
                                                    <div className="text-xs font-bold text-zinc-400">#{idx + 1}</div>
                                                    <Checkbox
                                                        checked={step.completed}
                                                        onCheckedChange={() => toggleStep(step.id)}
                                                        className="h-6 w-6 border-2 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                                                    />
                                                </div>
                                                <div className="flex-1 space-y-3">
                                                    <div className={`text-base font-medium ${step.completed ? 'text-zinc-500 line-through' : 'text-zinc-900'}`}>
                                                        {step.text}
                                                    </div>

                                                    {step.isCalibration && (
                                                        <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 flex flex-wrap items-center gap-6 animate-in fade-in slide-in-from-top-2">
                                                            <div>
                                                                <span className="text-xs text-blue-700 block mb-1 font-semibold">Target Value</span>
                                                                <Badge variant="outline" className="bg-white font-mono text-sm">{step.calibrationTarget} g</Badge>
                                                            </div>
                                                            <div className="flex-1 max-w-xs">
                                                                <span className="text-xs text-blue-700 block mb-1 font-semibold">Recorded Measurement</span>
                                                                <div className="flex items-center gap-2">
                                                                    <Input
                                                                        type="number"
                                                                        placeholder="0.00"
                                                                        className={`font-mono bg-white ${step.calibrationValue ? 'border-green-300 ring-green-100' : ''}`}
                                                                        value={step.calibrationValue || ''}
                                                                        onChange={(e) => updateMeasurement(step.id, parseFloat(e.target.value))}
                                                                    />
                                                                    <span className="text-sm font-medium text-blue-900">g</span>
                                                                </div>
                                                            </div>
                                                            {step.calibrationValue && step.calibrationTarget && Math.abs(step.calibrationValue - step.calibrationTarget) > (step.calibrationTarget * 0.05) && (
                                                                <div className="text-xs text-red-600 flex items-center gap-1 font-medium bg-red-100 px-2 py-1 rounded">
                                                                    <AlertTriangle className="w-3 h-3" /> Deviation Detected
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <CardFooter className="justify-between border-t py-4 bg-white shrink-0">
                                <Button variant="ghost" onClick={() => setPhase('prep')}>Back</Button>
                                <Button onClick={() => setPhase('evidence')} disabled={!execReady}>
                                    Next: Evidence & Review <ChevronRight className="w-4 h-4 ml-2" />
                                </Button>
                            </CardFooter>
                        </motion.div>
                    )}

                    {phase === 'evidence' && (
                        <motion.div key="evidence" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex-1 flex flex-col">
                            <CardContent className="flex-1 overflow-y-auto p-8 max-w-3xl mx-auto w-full space-y-8">
                                <div className="text-center">
                                    <CheckCircle2 className="w-12 h-12 mx-auto text-green-500 mb-4" />
                                    <h3 className="text-2xl font-bold text-zinc-900">Task Complete</h3>
                                    <p className="text-zinc-500">Capture final evidence to close this ticket.</p>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label>Parts Consumed</Label>
                                        <div className="p-4 border rounded-lg bg-slate-50 min-h-[120px]">
                                            {task.requirements?.parts.map(p => (
                                                <div key={p} className="flex items-center gap-2 mb-2">
                                                    <Checkbox id={`used-${p}`} checked onCheckedChange={() => { }} />
                                                    <label htmlFor={`used-${p}`} className="text-sm">{p}</label>
                                                </div>
                                            ))}
                                            <div className="flex items-center gap-2 mt-4 text-zinc-500 text-sm cursor-not-allowed">
                                                <Plus className="w-4 h-4" /> Add unplanned part
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Evidence Upload *</Label>
                                        <div className="border-2 border-dashed rounded-lg h-[120px] flex flex-col items-center justify-center text-zinc-400 hover:bg-slate-50 cursor-pointer bg-slate-50/50">
                                            <Camera className="w-6 h-6 mb-2" />
                                            <span className="text-xs font-medium">Click to Attach Photo</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Final Notes / Technicians Log</Label>
                                    <Textarea
                                        placeholder="Record any difficulties, observations, or follow-up recommendations..."
                                        className="min-h-[100px]"
                                        value={notes}
                                        onChange={e => setNotes(e.target.value)}
                                    />
                                </div>
                            </CardContent>
                            <CardFooter className="justify-between border-t py-4 bg-white shrink-0">
                                <Button variant="ghost" onClick={() => setPhase('execute')}>Back to Steps</Button>
                                <div className="flex gap-2">
                                    <Button variant="outline" className="border-red-200 text-red-700 hover:bg-red-50" onClick={() => onComplete(notes, 'Escalated')}>Escalate Issue</Button>
                                    <Button className="bg-green-600 hover:bg-green-700 w-32" onClick={() => onComplete(notes, 'Completed')}>
                                        <Save className="w-4 h-4 mr-2" /> Submit
                                    </Button>
                                </div>
                            </CardFooter>
                        </motion.div>
                    )}
                </AnimatePresence>
            </Card>
        </div>
    )
}

function Plus({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M5 12h14" />
            <path d="M12 5v14" />
        </svg>
    )
}
