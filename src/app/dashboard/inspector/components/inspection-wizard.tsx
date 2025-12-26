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
import { ChecklistTemplate, ChecklistItem, AuditResponse } from '@/lib/types/compliance-audit'
import { MOCK_TEMPLATES } from '@/lib/mock-data/compliance'

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
        // Determine non-compliance based on value
        let isNonCompliant = false
        if (value === 'No') isNonCompliant = true
        if (typeof value === 'string' && (value.includes('Negative') || value.includes('Poor'))) isNonCompliant = true

        setResponses(prev => ({
            ...prev,
            [itemId]: { ...prev[itemId], itemId, value, isNonCompliant }
        }))
    }

    const calculateResult = () => {
        // 1. Critical Failures Check
        const criticalFail = Object.values(responses).some(r => {
            let isCritical = false;
            activeTemplate.sections.forEach(s => s.items.forEach(i => {
                if (i.id === r.itemId && i.criticality === 'Critical') isCritical = true
            }))
            return isCritical && r.isNonCompliant
        })

        if (criticalFail) return 'Non-Compliant (Critical Failure)'

        // 2. Weighted Scoring
        let totalScore = 0
        let maxPossible = 0

        activeTemplate.sections.forEach(s => {
            s.items.forEach(i => {
                const weight = i.weight || 1
                maxPossible += weight

                const response = responses[i.id]
                // If responded and NOT non-compliant, add points
                // (Assuming un-answered items are 0 points)
                if (response && !response.isNonCompliant) {
                    totalScore += weight
                }
            })
        })

        const percent = maxPossible > 0 ? (totalScore / maxPossible) * 100 : 0

        if (percent >= 90) return 'Certified'
        if (percent >= 70) return 'Conditional Approval'
        return 'Non-Compliant'
    }

    const handleSubmit = () => {
        const result = calculateResult()
        toast.success("Inspection Logged", {
            description: `Mill: ${auditMeta.millId} • Result: ${result}`
        })
        onOpenChange(false)
        setStep('setup')
        setResponses({})
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl h-[90vh] flex flex-col p-0 bg-white">
                <DialogHeader className="p-6 border-b bg-zinc-900 text-white">
                    <div className="flex justify-between items-start">
                        <div>
                            <DialogTitle className="flex items-center gap-2 text-xl font-bold">
                                <Scale className="w-6 h-6 text-green-400" />
                                Official Regulatory Inspection
                            </DialogTitle>
                            <DialogDescription className="text-zinc-400 mt-1">
                                FWGA Authority • {activeTemplate.regulatoryReference}
                            </DialogDescription>
                        </div>
                        <Badge variant="outline" className="border-zinc-700 text-zinc-300">
                            {step === 'audit' ? 'IN PROGRESS' : step === 'summary' ? 'REVIEW' : 'SETUP'}
                        </Badge>
                    </div>
                </DialogHeader>

                <div className="flex-1 flex overflow-hidden">
                    {/* Setup Step */}
                    {step === 'setup' && (
                        <div className="p-8 w-full max-w-md mx-auto space-y-6 self-center">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Target Facility</Label>
                                    <Select onValueChange={v => setAuditMeta({ ...auditMeta, millId: v })}>
                                        <SelectTrigger><SelectValue placeholder="Select Mill" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="M-001">Unga Limited (Nairobi)</SelectItem>
                                            <SelectItem value="M-002">Mombasa Maize Millers</SelectItem>
                                            <SelectItem value="M-003">Pembe Flour Mills</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Commodity Line</Label>
                                    <Select value={auditMeta.commodity} onValueChange={v => setAuditMeta({ ...auditMeta, commodity: v })}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Maize Flour">Maize Flour</SelectItem>
                                            <SelectItem value="Rice">Rice</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Inspection Type</Label>
                                    <Select value={auditMeta.type} onValueChange={v => setAuditMeta({ ...auditMeta, type: v })}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Routine">Routine Annual</SelectItem>
                                            <SelectItem value="Spot Check">Spot Check</SelectItem>
                                            <SelectItem value="Re-Audit">Re-Audit (CAPA Follow-up)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <Button className="w-full bg-zinc-900" onClick={() => setStep('audit')} disabled={!auditMeta.millId}>
                                Initialize Protocol
                            </Button>
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
                                                                        variant={responses[item.id]?.value === 'Yes' ? 'default' : 'outline'}
                                                                        className={responses[item.id]?.value === 'Yes' ? "bg-green-600 hover:bg-green-700" : ""}
                                                                        onClick={() => handleAnswer(item.id, 'Yes')}
                                                                    >
                                                                        Yes
                                                                    </Button>
                                                                    <Button
                                                                        variant={responses[item.id]?.value === 'No' ? 'destructive' : 'outline'}
                                                                        onClick={() => handleAnswer(item.id, 'No')}
                                                                    >
                                                                        No
                                                                    </Button>
                                                                </div>
                                                            )}
                                                            
                                                            {item.type === 'MultipleChoice' && item.options && (
                                                                <div className="flex flex-wrap gap-2">
                                                                    {item.options.map(opt => (
                                                                        <Button
                                                                            key={opt}
                                                                            variant={responses[item.id]?.value === opt ? 'default' : 'outline'}
                                                                            onClick={() => handleAnswer(item.id, opt)}
                                                                            className="text-sm"
                                                                        >
                                                                            {opt}
                                                                        </Button>
                                                                    ))}
                                                                </div>
                                                            )}

                                                            {(item.type === 'Photo' || (item.requiredEvidence && item.requiredEvidence.includes('Photo'))) && (
                                                                <Button variant="outline" className="w-fit">
                                                                    <Camera className="w-4 h-4 mr-2" />
                                                                    {responses[item.id]?.evidenceUrls ? 'Photo Logged' : 'Capture Evidence'}
                                                                </Button>
                                                            )}
                                                            
                                                            {item.type === 'Numeric' && (
                                                                <div className="flex items-center gap-2">
                                                                    <Input 
                                                                        type="number" 
                                                                        placeholder="0.00" 
                                                                        className="w-24"
                                                                        onChange={(e) => handleAnswer(item.id, parseFloat(e.target.value))}
                                                                    />
                                                                    <span className="text-zinc-500 text-sm">{item.unit}</span>
                                                                </div>
                                                            )}
                                                        </div>

                                                        {/* Non-Compliance Reason */}
                                                        {responses[item.id]?.value === 'No' && (
                                                            <div className="animate-in fade-in slide-in-from-top-2">
                                                                <Label className="text-xs text-red-600 font-bold">OBSERVATION / DEVIATION</Label>
                                                                <Textarea className="mt-1.5 border-red-200 focus:ring-red-500" placeholder="Describe the non-conformance..." />
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex justify-end pt-8">
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
                                        <p className="font-bold text-lg text-blue-600">{calculateResult()}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4 justify-center">
                                <Button variant="outline" onClick={() => setStep('audit')}>Review Findings</Button>
                                <Button className="bg-zinc-900 px-8" onClick={handleSubmit}>
                                    Submit Official Record
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
