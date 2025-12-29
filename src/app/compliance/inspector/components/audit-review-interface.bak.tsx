'use client'

import * as React from 'react'
import { Card, CardHeader, CardContent, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import {
    CheckCircle2, XCircle, AlertTriangle, Eye, ArrowLeft,
    ZoomIn, MessageSquare, Flag, Download, Maximize2
} from 'lucide-react'
import { MOCK_AUDIT_LOGS, MOCK_MILLS, MOCK_TEMPLATES } from '@/lib/mock-data/compliance'
import { AuditSession, ChecklistItem, ReviewAction, AuditResponse } from '@/lib/types/compliance-audit'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import Image from 'next/image'

interface AuditReviewInterfaceProps {
    auditId: string
    onBack: () => void
}

export function AuditReviewInterface({ auditId, onBack }: AuditReviewInterfaceProps) {
    const audit = MOCK_AUDIT_LOGS.find(a => a.id === auditId)
    const template = MOCK_TEMPLATES.find(t => t.id === audit?.templateId)
    const mill = MOCK_MILLS[audit?.millId || '']

    // Local state for review progress
    const [responses, setResponses] = React.useState<Record<string, AuditResponse>>(audit?.responses || {})
    const [selectedImage, setSelectedImage] = React.useState<string | null>(null)
    const [reviewDecision, setReviewDecision] = React.useState<ReviewAction | null>(null)
    const [finalComments, setFinalComments] = React.useState('')

    if (!audit || !template) return <div>Audit not found</div>

    const handleItemAction = (itemId: string, action: 'Ok' | 'Flagged' | 'ActionRequired') => {
        setResponses(prev => ({
            ...prev,
            [itemId]: {
                ...prev[itemId],
                reviewStatus: action
            }
        }))
    }

    const handleItemComment = (itemId: string, comment: string) => {
        setResponses(prev => ({
            ...prev,
            [itemId]: {
                ...prev[itemId],
                reviewerComment: comment
            }
        }))
    }

    const calculateReviewProgress = () => {
        const totalItems = Object.keys(responses).length
        const reviewedItems = Object.values(responses).filter(r => r.reviewStatus).length
        return Math.round((reviewedItems / totalItems) * 100) || 0
    }

    const handleSubmitReview = () => {
        if (!reviewDecision) return

        toast.success("Review Submitted", {
            description: `Audit ${auditId} marked as ${reviewDecision}`
        })
        // In real app, would save to DB here
        onBack()
    }

    return (
        <div className="flex flex-col h-[calc(100vh-100px)]">
            {/* Header */}
            <div className="bg-white border-b p-4 flex justify-between items-center shadow-sm">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={onBack}>
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div>
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            {mill.name}
                            <Badge variant="outline">{audit.type}</Badge>
                        </h2>
                        <p className="text-sm text-gray-500">ID: {auditId} • Submitted: {new Date(audit.completedDate || '').toLocaleDateString()}</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-right mr-4">
                        <p className="text-xs text-muted-foreground font-bold uppercase">Review Progress</p>
                        <p className="text-lg font-bold text-[#0A3225]">{calculateReviewProgress()}%</p>
                    </div>
                    <Button disabled={!reviewDecision} onClick={handleSubmitReview} className="bg-zinc-900 text-white">
                        Submit Review
                    </Button>
                </div>
            </div>

            {/* Main Content - Split View */}
            <div className="flex flex-1 overflow-hidden bg-gray-50/50">
                {/* Left: Checklist Items */}
                <div className="w-1/2 border-r bg-white flex flex-col">
                    <div className="p-4 border-b bg-gray-50">
                        <h3 className="font-semibold text-gray-900">Audit Checklist</h3>
                    </div>
                    <ScrollArea className="flex-1 p-4">
                        <div className="space-y-8 pb-10">
                            {template.sections.map(section => (
                                <div key={section.id} className="space-y-4">
                                    <h4 className="font-bold text-gray-800 border-b pb-2 sticky top-0 bg-white z-10">{section.title}</h4>
                                    {section.items.map(item => {
                                        const response = responses[item.id]
                                        if (!response) return null
                                        return (
                                            <div key={item.id} className={`p-4 rounded-lg border ${response.reviewStatus === 'Flagged' ? 'bg-red-50 border-red-200' : response.reviewStatus === 'ActionRequired' ? 'bg-amber-50 border-amber-200' : 'bg-white border-gray-100'}`}>
                                                <div className="flex justify-between items-start mb-2">
                                                    <div className="max-w-[80%]">
                                                        <p className="text-sm font-medium text-gray-900">{item.text}</p>
                                                        {item.hint && <p className="text-xs text-gray-500 mt-1">{item.hint}</p>}
                                                    </div>
                                                    <Badge variant={response.reviewStatus === 'Ok' ? 'default' : 'secondary'} className={response.reviewStatus === 'Ok' ? 'bg-green-100 text-green-700 hover:bg-green-200' : ''}>
                                                        {item.criticality}
                                                    </Badge>
                                                </div>

                                                <div className="bg-gray-50 p-3 rounded-md mb-3 flex justify-between items-center">
                                                    <span className="text-sm font-mono text-gray-500">Response:</span>
                                                    <span className="font-bold text-gray-900">{response.value.toString()}</span>
                                                </div>

                                                {/* Inspector Actions */}
                                                <div className="flex gap-2 mt-2">
                                                    <Button
                                                        size="sm"
                                                        variant={response.reviewStatus === 'Ok' ? 'default' : 'outline'}
                                                        className={response.reviewStatus === 'Ok' ? 'bg-green-600 hover:bg-green-700' : 'text-green-600 border-green-200'}
                                                        onClick={() => handleItemAction(item.id, 'Ok')}
                                                    >
                                                        <CheckCircle2 className="w-4 h-4 mr-1" />
                                                        Verify
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant={response.reviewStatus === 'ActionRequired' ? 'default' : 'outline'}
                                                        className={response.reviewStatus === 'ActionRequired' ? 'bg-amber-500 hover:bg-amber-600' : 'text-amber-600 border-amber-200'}
                                                        onClick={() => handleItemAction(item.id, 'ActionRequired')}
                                                    >
                                                        <AlertTriangle className="w-4 h-4 mr-1" />
                                                        Flag
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant={response.reviewStatus === 'Flagged' ? 'default' : 'outline'}
                                                        className={response.reviewStatus === 'Flagged' ? 'bg-red-600 hover:bg-red-700' : 'text-red-600 border-red-200'}
                                                        onClick={() => handleItemAction(item.id, 'Flagged')}
                                                    >
                                                        <XCircle className="w-4 h-4 mr-1" />
                                                        Reject
                                                    </Button>
                                                </div>

                                                <div className="mt-3">
                                                    <Input
                                                        placeholder="Add reviewer comment..."
                                                        className="text-xs h-8 bg-white"
                                                        value={response.reviewerComment || ''}
                                                        onChange={(e) => handleItemComment(item.id, e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                </div>

                {/* Right: Evidence & Decision */}
                <div className="w-1/2 flex flex-col h-full bg-slate-50">
                    {/* Evidence Panel */}
                    <div className="flex-1 p-6 overflow-y-auto">
                        <div className="mb-6 flex justify-between items-center">
                            <h3 className="font-semibold text-gray-900">Submitted Evidence</h3>
                            <Button variant="outline" size="sm">
                                <Download className="w-4 h-4 mr-2" /> Download All
                            </Button>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {Object.values(responses).flatMap(r => r.evidence || []).map((ev, i) => (
                                <Card key={i} className="overflow-hidden group cursor-pointer hover:shadow-lg transition-all" onClick={() => setSelectedImage(ev.url)}>
                                    <div className="relative aspect-video bg-gray-200">
                                        <Image
                                            src={ev.url}
                                            alt="Evidence"
                                            fill
                                            className="object-cover"
                                        />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                            <ZoomIn className="text-white opacity-0 group-hover:opacity-100 w-8 h-8 drop-shadow-lg transform scale-50 group-hover:scale-100 transition-all duration-300" />
                                        </div>
                                    </div>
                                    <div className="p-3 text-xs text-gray-600 border-t bg-white">
                                        <div className="font-semibold mb-1">Evidence for Item {ev.itemId}</div>
                                        {responses[ev.itemId]?.notes || ''}
                                    </div>
                                </Card>
                            ))}
                            {Object.values(responses).flatMap(r => r.evidence || []).length === 0 && (
                                <div className="col-span-2 text-center py-12 text-gray-400 border-2 border-dashed rounded-lg">
                                    No evidence uploaded for this audit.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Decision Panel (Stick to bottom) */}
                    <div className="p-6 bg-white border-t shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-20">
                        <h3 className="font-semibold text-gray-900 mb-4">Review Decision</h3>
                        <div className="space-y-4">
                            <Textarea
                                placeholder="Final Review Notes..."
                                value={finalComments}
                                onChange={(e) => setFinalComments(e.target.value)}
                            />
                            <div className="flex flex-wrap gap-3">
                                <DecisionButton
                                    active={reviewDecision === 'Approve'}
                                    onClick={() => setReviewDecision('Approve')}
                                    label="Approve Compliance"
                                    color="bg-green-600"
                                />
                                <DecisionButton
                                    active={reviewDecision === 'ApproveWithConditions'}
                                    onClick={() => setReviewDecision('ApproveWithConditions')}
                                    label="Approve w/ Conditions"
                                    color="bg-[#0A3225]"
                                />
                                <DecisionButton
                                    active={reviewDecision === 'RequestRevision'}
                                    onClick={() => setReviewDecision('RequestRevision')}
                                    label="Request Revision"
                                    color="bg-amber-500"
                                />
                                <DecisionButton
                                    active={reviewDecision === 'ScheduleSiteVisit'}
                                    onClick={() => setReviewDecision('ScheduleSiteVisit')}
                                    label="Schedule Site Visit"
                                    color="bg-orange"
                                />
                                <DecisionButton
                                    active={reviewDecision === 'Reject'}
                                    onClick={() => setReviewDecision('Reject')}
                                    label="Reject / Non-Compliant"
                                    color="bg-red-600"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Image Preview Modal */}
            <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
                <DialogContent className="max-w-4xl p-0 overflow-hidden bg-black/95 border-none text-white">
                    <div className="relative w-full h-[80vh] flex items-center justify-center">
                        {selectedImage && (
                            <Image
                                src={selectedImage}
                                alt="Full Evidence"
                                fill
                                className="object-contain"
                            />
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}

function DecisionButton({ active, onClick, label, color }: { active: boolean, onClick: () => void, label: string, color: string }) {
    return (
        <Button
            variant={active ? 'default' : 'outline'}
            className={`${active ? color : 'hover:bg-gray-50'}`}
            onClick={onClick}
        >
            {active && <CheckCircle2 className="w-4 h-4 mr-2" />}
            {label}
        </Button>
    )
}
