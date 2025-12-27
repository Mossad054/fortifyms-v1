'use client'

import * as React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle2, XCircle, AlertTriangle, Camera, FileText, MapPin, Scale } from 'lucide-react'
import { toast } from 'sonner'
import { ChecklistTemplate, ChecklistItem, AuditResponse, AuditSchedule } from '@/lib/types/compliance-audit'
import { Evidence } from '@/lib/types/evidence'
import { MOCK_TEMPLATES, MOCK_SCHEDULES, MOCK_MILLS } from '@/lib/mock-data/compliance'
import { EvidenceUpload } from './evidence-upload'
import { calculateAuditResult } from '@/lib/utils/audit-calculator'

interface InspectionWizardProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function InspectionWizard({ open, onOpenChange }: InspectionWizardProps) {
    const [step, setStep] = React.useState('setup') // setup | audit | summary
    const [auditMeta, setAuditMeta] = React.useState({ millId: '', commodity: 'Maize Flour', type: 'Routine' })
    const [responses, setResponses] = React.useState<Record<string, AuditResponse>>({})
    const [activeSection, setActiveSection] = React.useState(0)

    // For demo, use the first template
    const activeTemplate = MOCK_TEMPLATES[0]

    const handleAnswer = (itemId: string, value: any) => {
        // Find the item config
        let item: ChecklistItem | undefined
        activeTemplate.sections.forEach(s => {
            const found = s.items.find(i => i.id === itemId)
            if (found) item = found
        })
        if (!item) return

        if (value === 'N/A') {
            setResponses(prev => ({
                ...prev,
                [itemId]: {
                    ...prev[itemId],
                    itemId,
                    value: 'N/A',
                    isNA: true,
                    score: 0,
                    maxScore: item.weight || 0,
                    isNonCompliant: false,
                    flagLevel: 'None'
                }
            }))
            return
        }

        let isNonCompliant = false
        let flagLevel: 'Red' | 'Yellow' | 'None' = 'None'
        let score = 0
        let deviationPercent = 0
        const maxScore = item.weight || 0

        // 1. Numeric Scoring (Sliding Scale)
        if (item.type === 'Numeric' && item.numericConfig && typeof value === 'number') {
            const { target, tolerancePercent = 0, min = -Infinity, max = Infinity } = item.numericConfig
            const tolerance = target * (tolerancePercent / 100)
            deviationPercent = ((value - target) / target) * 100

            if (value >= (target - tolerance) && value <= (target + tolerance)) {
                score = maxScore
            } else if (value >= min && value <= max) {
                score = maxScore * 0.5
                flagLevel = 'Yellow'
                isNonCompliant = true
            } else {
                score = 0
                flagLevel = 'Red'
                isNonCompliant = true
            }
        }
        // 2. Binary / Choice Scoring
        else {
            if (value === 'No' || (typeof value === 'string' && (value.includes('Negative') || value.includes('Poor')))) {
                score = 0
                isNonCompliant = true
                if (item.criticality === 'Critical') flagLevel = 'Red'
                else if (item.criticality === 'Major') flagLevel = 'Yellow'
            } else {
                score = maxScore
            }
        }

        setResponses(prev => ({
            ...prev,
            [itemId]: {
                ...prev[itemId],
                itemId,
                value,
                isNA: false,
                isNonCompliant,
                score,
                maxScore,
                flagLevel,
                deviationPercent
            }
        }))
    }

    const handleEvidenceUpload = (itemId: string, evidence: Evidence) => {
        setResponses(prev => ({
            ...prev,
            [itemId]: {
                ...prev[itemId],
                evidence: [...(prev[itemId]?.evidence || []), evidence]
            }
        }))
    }

    const handleEvidenceDelete = (itemId: string, evidenceId: string) => {
        setResponses(prev => ({
            ...prev,
            [itemId]: {
                ...prev[itemId],
                evidence: (prev[itemId]?.evidence || []).filter(e => e.id !== evidenceId)
            }
        }))
    }

    const calculateResult = () => {
        const result = calculateAuditResult(activeTemplate, responses)
        if (result.grade.includes('Non-Compliant')) return result.grade
        return `${result.grade} (${result.overallPercent.toFixed(1)}%)`
    }

    const auditResult = calculateAuditResult(activeTemplate, responses)


    const handleSubmit = () => {
        const result = calculateResult()
        toast.success("Audit Submitted", {
            description: `Mill: ${auditMeta.millId} • Result: ${result} • Sent to FGWA Manager`
        })
        onOpenChange(false)
        setStep('setup')
        setResponses({})
        // No routing to keep in current context
    }

    const handleSaveDraft = () => {
        toast.info("Draft Saved", {
            description: "Your progress has been saved locally."
        })
        // In a real app, this would persist the state
        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-none w-screen h-screen m-0 rounded-none flex flex-col p-0 bg-white">
                <DialogHeader className="p-6 border-b bg-zinc-900 text-white">
                    <div className="flex justify-between items-start">
                        <div>
                            <DialogTitle className="flex items-center gap-2 text-xl font-bold">
                                <Scale className="w-6 h-6 text-green-400" />
                                Official Regulatory Inspection
                            </DialogTitle>
                            <DialogDescription className="text-zinc-400 mt-1">
                                FWGA Authority • {activeTemplate.regulatoryReference} • v{activeTemplate.version}
                            </DialogDescription>
                        </div>
                        <Badge variant="outline" className="border-zinc-700 text-zinc-300">
                            {step === 'audit' ? 'IN PROGRESS' : step === 'summary' ? 'REVIEW' : 'SETUP'}
                        </Badge>
                    </div>
                </DialogHeader>

                <div className="flex-1 flex overflow-hidden">
                    {/* Step 1: Schedule Selection */}
                    {step === 'setup' && (
                        <div className="p-8 w-full max-w-3xl mx-auto space-y-6 self-center animate-in fade-in zoom-in-50">
                            <div className="text-center mb-8">
                                <h2 className="text-2xl font-bold">Assigned Inspection Schedules</h2>
                                <p className="text-zinc-500">Select a scheduled audit to initiate.</p>
                            </div>

                            <div className="grid gap-4">
                                {MOCK_SCHEDULES.map(schedule => {
                                    const mill = MOCK_MILLS[schedule.millId]
                                    const template = MOCK_TEMPLATES.find(t => t.id === schedule.templateId)
                                    return (
                                        <div
                                            key={schedule.id}
                                            onClick={() => {
                                                setAuditMeta({
                                                    millId: schedule.millId,
                                                    commodity: template?.commodity || 'Maize',
                                                    type: 'Official',
                                                    templateVersion: template?.version || '1.0.0'
                                                } as any)
                                                setStep('verify')
                                            }}
                                            className="bg-zinc-50 border p-4 rounded-xl flex items-center justify-between cursor-pointer hover:border-zinc-900 transition-colors group"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={`p-3 rounded-full ${schedule.status === 'Overdue' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                                                    <Scale className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-lg group-hover:text-zinc-900">{mill?.name || schedule.millId}</h4>
                                                    <p className="text-sm text-zinc-500">{template?.title}</p>
                                                    <div className="flex gap-2 mt-2 text-xs font-medium text-zinc-400">
                                                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {mill?.region}</span>
                                                        <span>•</span>
                                                        <span>{schedule.scheduledDate}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-end gap-2">
                                                <Badge variant={schedule.status === 'Overdue' ? 'destructive' : 'secondary'}>
                                                    {schedule.status === 'Pending' ? 'Scheduled' : schedule.status}
                                                </Badge>
                                                <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                    Select <CheckCircle2 className="w-4 h-4 ml-1" />
                                                </Button>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )}

                    {/* Step 2: Verification */}
                    {step === 'verify' && (
                        <div className="p-8 w-full max-w-lg mx-auto space-y-6 self-center animate-in slide-in-from-right-10">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <FileText className="w-8 h-8 text-zinc-600" />
                                </div>
                                <h2 className="text-2xl font-bold">Verify Protocol</h2>
                                <p className="text-zinc-500">Confirm audit parameters before loading.</p>
                            </div>

                            <div className="space-y-4 border rounded-xl p-4 bg-zinc-50">
                                <div className="flex justify-between py-2 border-b">
                                    <span className="text-sm text-zinc-500">Target Facility</span>
                                    <span className="font-medium text-right">{MOCK_MILLS[auditMeta.millId]?.name || auditMeta.millId}</span>
                                </div>
                                <div className="flex justify-between py-2 border-b">
                                    <span className="text-sm text-zinc-500">Protocol Standard</span>
                                    <span className="font-medium text-right">{activeTemplate.version}</span>
                                </div>
                                <div className="flex justify-between py-2">
                                    <span className="text-sm text-zinc-500">Total Checkpoints</span>
                                    <span className="font-medium text-right">{activeTemplate.sections.reduce((acc, s) => acc + s.items.length, 0)} Items</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <Button variant="outline" onClick={() => setStep('setup')}>Back</Button>
                                <Button className="bg-zinc-900" onClick={() => setStep('audit')}>
                                    Launch Checklist
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Audit Step */}
                    {step === 'audit' && (
                        <>
                            {/* Sidebar */}
                            <div className="w-64 bg-zinc-50 border-r p-4 space-y-2">
                                <h3 className="font-bold text-xs uppercase text-zinc-500 mb-4 px-2">Audit Sections</h3>
                                {activeTemplate.sections.map((section, idx) => (
                                    <button
                                        key={section.id}
                                        onClick={() => setActiveSection(idx)}
                                        className={`w-full text-left p-3 rounded-lg text-sm font-medium transition-colors ${idx === activeSection
                                            ? 'bg-zinc-900 text-white shadow-md'
                                            : 'text-zinc-600 hover:bg-zinc-100'
                                            }`}
                                    >
                                        <div className="flex justify-between items-center">
                                            {section.title}
                                            {idx < activeSection && <CheckCircle2 className="w-3 h-3 text-green-500" />}
                                        </div>
                                    </button>
                                ))}
                            </div>

                            {/* Main Content */}
                            <ScrollArea className="flex-1 p-8">
                                <div className="max-w-3xl mx-auto space-y-8">
                                    <div className="flex items-center justify-between border-b pb-4">
                                        <div>
                                            <h2 className="text-2xl font-bold text-zinc-900">
                                                {activeTemplate.sections[activeSection].title}
                                            </h2>
                                            <p className="text-zinc-500">
                                                Section {activeSection + 1} of {activeTemplate.sections.length}
                                            </p>
                                        </div>
                                        <Badge variant="outline" className="h-8 px-3">
                                            {activeTemplate.sections[activeSection].items.length} Checkpoints
                                        </Badge>
                                    </div>

                                    <div className="space-y-6">
                                        {activeTemplate.sections[activeSection].items.map(item => (
                                            <div key={item.id} className="bg-white p-6 rounded-xl border shadow-sm ring-1 ring-zinc-100">
                                                <div className="flex gap-4">
                                                    <div className={`p-2 rounded-lg h-fit ${item.criticality === 'Critical' ? 'bg-red-100 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
                                                        {item.criticality === 'Critical' ? <AlertTriangle className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                                                    </div>
                                                    <div className="flex-1 space-y-4">
                                                        <div>
                                                            <div className="flex justify-between items-start">
                                                                <div>
                                                                    <h4 className="font-bold text-zinc-900">{item.text}</h4>
                                                                    {item.hint && (
                                                                        <div className="mt-1.5 flex items-start gap-1.5 text-xs text-blue-600 bg-blue-50 p-2 rounded border border-blue-100">
                                                                            <AlertTriangle className="w-3 h-3 mt-0.5 shrink-0" />
                                                                            <span>{item.hint}</span>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <div className="flex flex-col gap-1 items-end ml-4">
                                                                    <Badge variant={item.criticality === 'Critical' ? 'destructive' : 'secondary'}>
                                                                        {item.criticality}
                                                                    </Badge>
                                                                    {item.weight && <span className="text-xs font-medium text-zinc-400">{item.weight} pts</span>}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Input Controls */}
                                                        <div className="flex items-center gap-4">
                                                            <div className="flex flex-col gap-3">
                                                                {item.type === 'YesNo' && (
                                                                    <div className="flex gap-2">
                                                                        <Button
                                                                            variant={responses[item.id]?.value === 'Yes' && !responses[item.id]?.isNA ? 'default' : 'outline'}
                                                                            className={responses[item.id]?.value === 'Yes' && !responses[item.id]?.isNA ? "bg-green-600 hover:bg-green-700" : ""}
                                                                            onClick={() => handleAnswer(item.id, 'Yes')}
                                                                            disabled={responses[item.id]?.isNA}
                                                                        >
                                                                            Yes
                                                                        </Button>
                                                                        <Button
                                                                            variant={responses[item.id]?.value === 'No' && !responses[item.id]?.isNA ? 'destructive' : 'outline'}
                                                                            onClick={() => handleAnswer(item.id, 'No')}
                                                                            disabled={responses[item.id]?.isNA}
                                                                        >
                                                                            No
                                                                        </Button>
                                                                        <Button
                                                                            variant={responses[item.id]?.isNA ? 'secondary' : 'outline'}
                                                                            onClick={() => handleAnswer(item.id, 'N/A')}
                                                                            className={responses[item.id]?.isNA ? "bg-zinc-800 text-white" : ""}
                                                                        >
                                                                            N/A
                                                                        </Button>
                                                                    </div>
                                                                )}

                                                                {item.type === 'MultipleChoice' && item.options && (
                                                                    <div className="flex flex-wrap gap-2">
                                                                        {item.options.map(opt => (
                                                                            <Button
                                                                                key={opt}
                                                                                variant={responses[item.id]?.value === opt && !responses[item.id]?.isNA ? 'default' : 'outline'}
                                                                                onClick={() => handleAnswer(item.id, opt)}
                                                                                disabled={responses[item.id]?.isNA}
                                                                                className="text-sm"
                                                                            >
                                                                                {opt}
                                                                            </Button>
                                                                        ))}
                                                                        <Button
                                                                            variant={responses[item.id]?.isNA ? 'secondary' : 'outline'}
                                                                            onClick={() => handleAnswer(item.id, 'N/A')}
                                                                            className={responses[item.id]?.isNA ? "bg-zinc-800 text-white" : ""}
                                                                        >
                                                                            N/A
                                                                        </Button>
                                                                    </div>
                                                                )}

                                                                {(item.type === 'Photo' || (item.requiredEvidence && item.requiredEvidence.includes('Photo'))) && (
                                                                    <div className="pt-2">
                                                                        <EvidenceUpload
                                                                            itemId={item.id}
                                                                            auditId={`AUD-${auditMeta.millId}`} // Simple ID for now
                                                                            existingEvidence={responses[item.id]?.evidence}
                                                                            onUpload={(ev) => handleEvidenceUpload(item.id, ev)}
                                                                            onDelete={(id) => handleEvidenceDelete(item.id, id)}
                                                                        />
                                                                    </div>
                                                                )}

                                                                {item.type === 'Numeric' && (
                                                                    <div className="flex items-center gap-2">
                                                                        <Input
                                                                            type="number"
                                                                            placeholder="0.00"
                                                                            className="w-24"
                                                                            onChange={(e) => handleAnswer(item.id, parseFloat(e.target.value))}
                                                                            disabled={responses[item.id]?.isNA}
                                                                            value={responses[item.id]?.value === 'N/A' ? '' : responses[item.id]?.value as any}
                                                                        />
                                                                        <span className="text-zinc-500 text-sm">{item.unit}</span>
                                                                        <Button
                                                                            variant={responses[item.id]?.isNA ? 'secondary' : 'outline'}
                                                                            onClick={() => handleAnswer(item.id, 'N/A')}
                                                                            className={responses[item.id]?.isNA ? "bg-zinc-800 text-white" : ""}
                                                                        >
                                                                            N/A
                                                                        </Button>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* N/A Justification */}
                                                        {responses[item.id]?.isNA && (
                                                            <div className="animate-in fade-in slide-in-from-top-2 p-4 bg-zinc-50 rounded-lg border border-zinc-200">
                                                                <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2 block">Justification for N/A (Required)</Label>
                                                                <Textarea
                                                                    className="bg-white border-zinc-200"
                                                                    placeholder="Describe why this regulatory requirement is not applicable to this facility..."
                                                                    value={responses[item.id]?.naJustification || ''}
                                                                    onChange={(e) => {
                                                                        setResponses(prev => ({
                                                                            ...prev,
                                                                            [item.id]: { ...prev[item.id], naJustification: e.target.value }
                                                                        }))
                                                                    }}
                                                                />
                                                            </div>
                                                        )}

                                                        {/* Non-Compliance Reason */}
                                                        {responses[item.id]?.value === 'No' && !responses[item.id]?.isNA && (
                                                            <div className="animate-in fade-in slide-in-from-top-2 p-4 bg-red-50 rounded-lg border border-red-100">
                                                                <Label className="text-[10px] font-bold uppercase tracking-widest text-red-600 mb-2 block">Observation / Deviation</Label>
                                                                <Textarea className="bg-white border-red-200 focus:ring-red-500" placeholder="Describe the non-conformance..." />
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex justify-between pt-8 border-t mt-8">
                                        <Button variant="outline" onClick={handleSaveDraft}>
                                            Save Draft & Exit
                                        </Button>
                                        <div className="flex gap-2">
                                            {activeSection < activeTemplate.sections.length - 1 ? (
                                                <Button onClick={() => setActiveSection(activeSection + 1)}>
                                                    Next Section
                                                </Button>
                                            ) : (
                                                <Button className="bg-green-600 hover:bg-green-700" onClick={() => setStep('summary')}>
                                                    Finalize Inspection
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </ScrollArea>
                        </>
                    )}

                    {/* Summary Step */}
                    {step === 'summary' && (
                        <div className="p-8 w-full max-w-2xl mx-auto self-center space-y-8 text-center animate-in zoom-in-50">
                            <div>
                                <h2 className="text-3xl font-black text-zinc-900">Inspection Complete</h2>
                                <p className="text-zinc-500">Summary of Findings</p>
                            </div>

                            <div className="bg-zinc-50 p-8 rounded-2xl border">
                                <div className="grid grid-cols-2 gap-8 text-left">
                                    <div>
                                        <p className="text-xs font-bold text-zinc-400 uppercase">Facility</p>
                                        <p className="font-bold text-lg">{auditMeta.millId}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-zinc-400 uppercase">Computed Grade</p>
                                        <p className="font-bold text-lg text-blue-600">{auditResult.grade}</p>
                                    </div>
                                </div>
                                <div className="mt-8 pt-6 border-t text-left">
                                    <div className="flex items-center justify-between p-3 bg-zinc-100 rounded-lg border border-zinc-200">
                                        <div className="flex items-center gap-2">
                                            <Scale className="w-4 h-4 text-zinc-500" />
                                            <div>
                                                <p className="text-[10px] font-bold text-zinc-500 uppercase">Calculation Hash (Immutability Lock)</p>
                                                <p className="text-xs font-mono text-zinc-600 font-bold">{auditResult.calculationHash}</p>
                                            </div>
                                        </div>
                                        <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200">VALIDATED</Badge>
                                    </div>
                                    <p className="mt-4 text-[10px] text-zinc-400 italic">
                                        This audit is now immutable. Any change to the responses or template v{activeTemplate.version} will void the calculation hash above.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-4 justify-center">
                                <Button variant="outline" onClick={() => setStep('audit')}>Review Findings</Button>
                                <Button variant="outline" onClick={handleSaveDraft}>Save Draft</Button>
                                <Button className="bg-zinc-900 px-8" onClick={handleSubmit}>
                                    Save and Submit
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
