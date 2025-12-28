'use client'

import * as React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle2, AlertTriangle, Camera, UploadCloud, ChevronRight, ChevronLeft, Flag } from 'lucide-react'
import { toast } from 'sonner'
import { ChecklistTemplate, ChecklistItem, AuditResponse } from '@/lib/types/compliance-audit'
import { MOCK_TEMPLATES } from '@/lib/mock-data/compliance'

interface SelfAuditModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function SelfAuditModal({ open, onOpenChange }: SelfAuditModalProps) {
    const [step, setStep] = React.useState(0) // 0 = Intro, 1...N = Sections, N+1 = Summary
    const [responses, setResponses] = React.useState<Record<string, AuditResponse>>({})
    const [auditScore, setAuditScore] = React.useState(0)

    // Use the first template for demo
    const activeTemplate = MOCK_TEMPLATES[0]
    const sections = activeTemplate.sections || []
    const totalSteps = sections.length + 2 // Intro + Sections + Summary

    const handleResponse = (itemId: string, value: any) => {
        setResponses(prev => ({
            ...prev,
            [itemId]: { ...prev[itemId], itemId, value }
        }))
    }

    const calculateScore = () => {
        let passed = 0
        let total = 0
        sections.forEach(s => {
            s.items.forEach(i => {
                total++
                const resp = responses[i.id]?.value
                if (resp === 'Yes' || (typeof resp === 'number' && resp > 0)) {
                    passed++
                }
            })
        })
        return Math.round((passed / total) * 100) || 0
    }

    const handleNext = () => {
        if (step === sections.length) {
            setAuditScore(calculateScore())
        }
        setStep(Math.min(step + 1, totalSteps - 1))
    }

    const handleBack = () => setStep(Math.max(step - 1, 0))

    const handleSubmit = () => {
        toast.success("Self-Audit Submitted Successfully", {
            description: `Audit Score: ${auditScore}%. Corrective actions logged.`
        })
        onOpenChange(false)
        setStep(0)
        setResponses({})
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl h-[80vh] flex flex-col p-0 gap-0 bg-zinc-50 overflow-hidden">
                {/* Header */}
                <div className="bg-white p-6 border-b flex justify-between items-center">
                    <div>
                        <DialogTitle className="flex items-center gap-2 text-xl font-bold text-zinc-900">
                            <CheckCircle2 className="w-5 h-5 text-green-600" />
                            {activeTemplate.title}
                        </DialogTitle>
                        <DialogDescription className="mt-1">
                            Reference: {activeTemplate.regulatoryReference} • Version {activeTemplate.version}
                        </DialogDescription>
                    </div>
                    <Badge variant="outline" className="text-xs bg-slate-50 font-mono">
                        Step {step + 1} / {totalSteps}
                    </Badge>
                </div>

                {/* Progress Bar */}
                <Progress value={((step + 1) / totalSteps) * 100} className="h-1 rounded-none bg-zinc-200" indicatorClassName="bg-green-600" />

                {/* Content Area */}
                <ScrollArea className="flex-1 p-6">
                    <div className="max-w-2xl mx-auto">
                        {step === 0 && (
                            <div className="text-center space-y-6 py-8">
                                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                                    <CheckCircle2 className="w-10 h-10 text-green-600" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-zinc-900 mb-2">Ready to Start Self-Audit?</h3>
                                    <p className="text-zinc-500 max-w-md mx-auto">
                                        This internal audit checks your readiness for official inspection.
                                        Critical failures will trigger required corrective actions (CAPA).
                                    </p>
                                </div>

                                <div className="bg-white p-4 rounded-xl border shadow-sm text-left max-w-sm mx-auto">
                                    <h4 className="font-bold text-sm mb-3">Audit Scope:</h4>
                                    <ul className="space-y-2 text-sm text-zinc-600">
                                        <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-zinc-400" /> Premix Storage & Condition</li>
                                        <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-zinc-400" /> Equipment Calibration</li>
                                        <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-zinc-400" /> Production Records</li>
                                        <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-zinc-400" /> QC Validation</li>
                                    </ul>
                                </div>
                            </div>
                        )}

                        {step > 0 && step <= sections.length && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-300">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-8 h-8 rounded-full bg-zinc-900 text-white flex items-center justify-center font-bold text-sm">
                                        {step}
                                    </div>
                                    <h3 className="text-xl font-bold text-zinc-900">{sections[step - 1].title}</h3>
                                </div>

                                <div className="space-y-6">
                                    {sections[step - 1].items.map((item) => (
                                        <div key={item.id} className={`bg-white p-5 rounded-xl border-l-4 shadow-sm space-y-4 ${item.criticality === 'Critical' ? 'border-red-500' : 'border-zinc-200'}`}>
                                            <div className="flex justify-between items-start gap-4">
                                                <div className="space-y-1">
                                                    <Label className="text-base font-semibold text-zinc-800">{item.text}</Label>
                                                    {item.hint && <p className="text-xs text-zinc-500 italic">{item.hint}</p>}
                                                </div>
                                                {item.criticality === 'Critical' && (
                                                    <Badge variant="destructive" className="h-6 gap-1 px-2">
                                                        <AlertTriangle className="w-3 h-3" /> Critical
                                                    </Badge>
                                                )}
                                            </div>

                                            {/* Input Area */}
                                            <div className="pl-1">
                                                {item.type === 'YesNo' && (
                                                    <RadioGroup
                                                        className="flex gap-4"
                                                        value={responses[item.id]?.value as string}
                                                        onValueChange={v => handleResponse(item.id, v)}
                                                    >
                                                        <div className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-slate-50 cursor-pointer w-24 justify-center">
                                                            <RadioGroupItem value="Yes" id={`yes-${item.id}`} />
                                                            <Label htmlFor={`yes-${item.id}`} className="cursor-pointer font-medium text-green-700">Yes</Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-slate-50 cursor-pointer w-24 justify-center">
                                                            <RadioGroupItem value="No" id={`no-${item.id}`} />
                                                            <Label htmlFor={`no-${item.id}`} className="cursor-pointer font-medium text-red-700">No</Label>
                                                        </div>
                                                    </RadioGroup>
                                                )}

                                                {item.type === 'Numeric' && (
                                                    <div className="flex items-center gap-2 max-w-[200px]">
                                                        <Input
                                                            type="number"
                                                            placeholder="0.00"
                                                            value={responses[item.id]?.value as string || ''}
                                                            onChange={e => handleResponse(item.id, parseFloat(e.target.value))}
                                                        />
                                                        <span className="text-sm font-medium text-zinc-500 bg-slate-100 px-3 py-2 rounded-md">{item.unit || 'Units'}</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Evidence Section */}
                                            {item.requiredEvidence && (
                                                <div className="pt-2 border-t">
                                                    <Button variant="outline" size="sm" className="w-full border-dashed text-zinc-500 gap-2 h-10 hover:bg-[#0A3225]/5 hover:text-[#0A3225] hover:border-[#0A3225]/20">
                                                        <Camera className="w-4 h-4" />
                                                        {responses[item.id]?.evidenceUrls ? 'Evidence Attached' : 'Capture Required Evidence'}
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {step === sections.length + 1 && (
                            <div className="text-center space-y-8 animate-in zoom-in-50">
                                <div>
                                    <h3 className="text-2xl font-bold text-zinc-900 mb-2">Audit Summary</h3>
                                    <p className="text-zinc-500">Review your results before final submission.</p>
                                </div>

                                <div className="flex justify-center">
                                    <div className="relative w-40 h-40 flex items-center justify-center">
                                        <svg className="w-full h-full transform -rotate-90">
                                            <circle cx="80" cy="80" r="70" stroke="#eee" strokeWidth="12" fill="none" />
                                            <circle
                                                cx="80" cy="80" r="70"
                                                stroke={auditScore >= 80 ? '#22c55e' : auditScore >= 50 ? '#eab308' : '#ef4444'}
                                                strokeWidth="12" fill="none"
                                                strokeDasharray="440"
                                                strokeDashoffset={440 - (440 * auditScore) / 100} // Simple offset calculation mock
                                                className="transition-all duration-1000 ease-out"
                                            />
                                        </svg>
                                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                                            <span className="text-4xl font-black text-zinc-900">{auditScore}%</span>
                                            <span className="text-xs uppercase font-bold text-zinc-500 mt-1">Compliance</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-slate-50 p-6 rounded-xl text-left border">
                                    <h4 className="font-bold text-zinc-900 mb-4 flex items-center gap-2">
                                        <Flag className="w-4 h-4" /> Detected Issues
                                    </h4>
                                    {Object.keys(responses).filter(k => responses[k].value === 'No').length > 0 ? (
                                        <ul className="space-y-3">
                                            {Object.keys(responses).filter(k => responses[k].value === 'No').map(k => {
                                                const section = sections.find(s => s.items.find(i => i.id === k))
                                                const item = section?.items.find(i => i.id === k)
                                                return (
                                                    <li key={k} className="flex items-start gap-3 bg-white p-3 rounded-lg border shadow-sm">
                                                        <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                                                        <div>
                                                            <p className="font-semibold text-sm text-zinc-900">{item?.text}</p>
                                                            <p className="text-xs text-red-600 font-medium mt-1">Corrective Action Required</p>
                                                        </div>
                                                    </li>
                                                )
                                            })}
                                        </ul>
                                    ) : (
                                        <div className="text-center py-4 text-zinc-500 italic">No issues detected. Excellent work!</div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </ScrollArea>

                {/* Footer */}
                <DialogFooter className="bg-white p-4 border-t gap-3">
                    <Button variant="outline" onClick={handleBack} disabled={step === 0}>
                        <ChevronLeft className="w-4 h-4 mr-2" /> Back
                    </Button>
                    {step === totalSteps - 1 ? (
                        <Button className="bg-zinc-900 hover:bg-zinc-800 w-32" onClick={handleSubmit}>
                            Submit Audit
                        </Button>
                    ) : (
                        <Button className="w-32" onClick={handleNext}>
                            Next <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
