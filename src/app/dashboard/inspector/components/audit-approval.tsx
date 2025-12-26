'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Checkbox } from '@/components/ui/checkbox'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import {
    CheckCircle, XCircle, AlertTriangle, FileText, Image,
    Download, MessageSquare, Clock, Package, Beaker
} from 'lucide-react'
import { PendingReview } from '../types'

type AuditReviewProps = {
    reviewId: string
    onClose: () => void
}

export function AuditApprovalWorkflow({ reviewId, onClose }: AuditReviewProps) {
    const router = useRouter()
    const [decision, setDecision] = React.useState<'approve' | 'reject' | 'escalate' | null>(null)
    const [justification, setJustification] = React.useState('')
    const [requiredCorrections, setRequiredCorrections] = React.useState<string[]>([])
    const [newCorrection, setNewCorrection] = React.useState('')
    const [deadline, setDeadline] = React.useState('')
    const [showConfirmation, setShowConfirmation] = React.useState(false)

    // Mock audit data - in real app, fetch from API
    const auditData = {
        id: reviewId,
        millName: 'Golden Grain Mills',
        millId: 'MILL-042',
        auditType: 'Q4 2024 Compliance Audit',
        submissionDate: '2024-12-20',
        auditor: 'John Kamau',
        findings: [
            {
                id: 'F-001',
                severity: 'major',
                category: 'Calibration',
                description: 'Doser A1 calibration overdue by 15 days',
                evidence: ['photo1.jpg', 'calibration-log.pdf'],
                recommendation: 'Immediate recalibration required'
            },
            {
                id: 'F-002',
                severity: 'major',
                category: 'Documentation',
                description: 'Missing QC records for 3 batches in November',
                evidence: ['batch-log.xlsx'],
                recommendation: 'Implement daily QC checklist verification'
            },
            {
                id: 'F-003',
                severity: 'minor',
                category: 'Training',
                description: '2 operators pending refresher training',
                evidence: ['training-matrix.pdf'],
                recommendation: 'Schedule training within 30 days'
            }
        ],
        qcSummary: {
            totalBatches: 45,
            passRate: 89,
            marginalRate: 8,
            failRate: 3
        },
        attachments: [
            { name: 'Audit Report.pdf', size: '2.4 MB', type: 'pdf' },
            { name: 'QC Results.xlsx', size: '156 KB', type: 'excel' },
            { name: 'Evidence Photos.zip', size: '8.2 MB', type: 'zip' }
        ]
    }

    const handleAddCorrection = () => {
        if (newCorrection.trim()) {
            setRequiredCorrections([...requiredCorrections, newCorrection.trim()])
            setNewCorrection('')
        }
    }

    const handleRemoveCorrection = (index: number) => {
        setRequiredCorrections(requiredCorrections.filter((_, i) => i !== index))
    }

    const handleSubmitDecision = () => {
        // Validate
        if (!decision) return
        if ((decision === 'reject' || decision === 'escalate') && !justification.trim()) {
            alert('Justification is required for rejection or escalation')
            return
        }

        // TODO: API call to submit decision
        console.log('Submitting decision:', {
            reviewId,
            decision,
            justification,
            requiredCorrections: decision === 'reject' ? requiredCorrections : undefined,
            deadline: decision === 'reject' ? deadline : undefined,
            timestamp: new Date().toISOString()
        })

        setShowConfirmation(true)
    }

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'critical': return 'bg-red-100 text-red-700 border-red-200'
            case 'major': return 'bg-orange-100 text-orange-700 border-orange-200'
            case 'minor': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
            default: return 'bg-gray-100 text-gray-700 border-gray-200'
        }
    }

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-7xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="p-6 border-b bg-gradient-to-r from-green-50 to-blue-50">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-1">
                                Audit Review & Approval
                            </h2>
                            <p className="text-sm text-gray-600">
                                {auditData.millName} • {auditData.auditType}
                            </p>
                        </div>
                        <Button variant="ghost" onClick={onClose}>✕</Button>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 overflow-hidden flex">
                    {/* Left Panel - Audit Report */}
                    <div className="flex-1 border-r overflow-y-auto">
                        <ScrollArea className="h-full">
                            <div className="p-6 space-y-6">
                                {/* Audit Summary */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg">Audit Summary</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <p className="text-gray-500">Mill ID</p>
                                                <p className="font-semibold">{auditData.millId}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-500">Submission Date</p>
                                                <p className="font-semibold">{auditData.submissionDate}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-500">Auditor</p>
                                                <p className="font-semibold">{auditData.auditor}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-500">Total Findings</p>
                                                <p className="font-semibold">{auditData.findings.length}</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Findings */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg">Audit Findings</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        {auditData.findings.map((finding) => (
                                            <div key={finding.id} className="border-l-4 border-l-orange-500 bg-orange-50/30 rounded-lg p-4">
                                                <div className="flex items-start justify-between mb-2">
                                                    <div className="flex items-center gap-2">
                                                        <Badge variant="outline" className="font-mono text-xs">
                                                            {finding.id}
                                                        </Badge>
                                                        <Badge className={getSeverityColor(finding.severity)}>
                                                            {finding.severity.toUpperCase()}
                                                        </Badge>
                                                        <Badge variant="outline">{finding.category}</Badge>
                                                    </div>
                                                </div>
                                                <h4 className="font-semibold text-gray-900 mb-2">
                                                    {finding.description}
                                                </h4>
                                                <p className="text-sm text-gray-600 mb-3">
                                                    <strong>Recommendation:</strong> {finding.recommendation}
                                                </p>
                                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                                    <Image className="w-3 h-3" />
                                                    {finding.evidence.length} evidence file(s)
                                                </div>
                                            </div>
                                        ))}
                                    </CardContent>
                                </Card>

                                {/* QC Performance */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg">QC Performance Summary</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-4 gap-4">
                                            <div className="text-center">
                                                <p className="text-2xl font-bold text-gray-900">
                                                    {auditData.qcSummary.totalBatches}
                                                </p>
                                                <p className="text-xs text-gray-500">Total Batches</p>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-2xl font-bold text-green-600">
                                                    {auditData.qcSummary.passRate}%
                                                </p>
                                                <p className="text-xs text-gray-500">Pass Rate</p>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-2xl font-bold text-yellow-600">
                                                    {auditData.qcSummary.marginalRate}%
                                                </p>
                                                <p className="text-xs text-gray-500">Marginal</p>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-2xl font-bold text-red-600">
                                                    {auditData.qcSummary.failRate}%
                                                </p>
                                                <p className="text-xs text-gray-500">Fail Rate</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Attachments */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg">Evidence Attachments</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                        {auditData.attachments.map((file, idx) => (
                                            <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                <div className="flex items-center gap-3">
                                                    <FileText className="w-5 h-5 text-gray-600" />
                                                    <div>
                                                        <p className="font-medium text-sm">{file.name}</p>
                                                        <p className="text-xs text-gray-500">{file.size}</p>
                                                    </div>
                                                </div>
                                                <Button size="sm" variant="ghost">
                                                    <Download className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        ))}
                                    </CardContent>
                                </Card>
                            </div>
                        </ScrollArea>
                    </div>

                    {/* Right Panel - Decision */}
                    <div className="w-[400px] overflow-y-auto bg-gray-50">
                        <ScrollArea className="h-full">
                            <div className="p-6 space-y-6">
                                <div>
                                    <h3 className="font-bold text-lg mb-4">Inspector Decision</h3>

                                    {/* Decision Buttons */}
                                    <div className="space-y-3">
                                        <Button
                                            className={`w-full justify-start ${decision === 'approve' ? 'bg-green-600' : 'bg-green-500'}`}
                                            onClick={() => setDecision('approve')}
                                        >
                                            <CheckCircle className="w-5 h-5 mr-2" />
                                            Approve & Release
                                        </Button>
                                        <Button
                                            className={`w-full justify-start ${decision === 'reject' ? 'bg-red-600' : 'bg-red-500'}`}
                                            onClick={() => setDecision('reject')}
                                        >
                                            <XCircle className="w-5 h-5 mr-2" />
                                            Reject
                                        </Button>
                                        <Button
                                            className={`w-full justify-start ${decision === 'escalate' ? 'bg-orange-600' : 'bg-orange-500'}`}
                                            onClick={() => setDecision('escalate')}
                                        >
                                            <AlertTriangle className="w-5 h-5 mr-2" />
                                            Escalate to Program Manager
                                        </Button>
                                    </div>
                                </div>

                                {/* Justification */}
                                {decision && (
                                    <div className="space-y-4">
                                        <div>
                                            <Label htmlFor="justification">
                                                Justification {(decision === 'reject' || decision === 'escalate') && <span className="text-red-500">*</span>}
                                            </Label>
                                            <Textarea
                                                id="justification"
                                                value={justification}
                                                onChange={(e) => setJustification(e.target.value)}
                                                placeholder={
                                                    decision === 'approve' ? 'Optional notes...' :
                                                        decision === 'reject' ? 'Explain reasons for rejection...' :
                                                            'Explain reasons for escalation...'
                                                }
                                                rows={4}
                                                className="mt-2"
                                            />
                                        </div>

                                        {/* Required Corrections (for Reject) */}
                                        {decision === 'reject' && (
                                            <div>
                                                <Label>Required Corrections</Label>
                                                <div className="mt-2 space-y-2">
                                                    {requiredCorrections.map((correction, idx) => (
                                                        <div key={idx} className="flex items-start gap-2 p-2 bg-white rounded border">
                                                            <span className="flex-1 text-sm">{correction}</span>
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                onClick={() => handleRemoveCorrection(idx)}
                                                            >
                                                                ✕
                                                            </Button>
                                                        </div>
                                                    ))}
                                                    <div className="flex gap-2">
                                                        <input
                                                            type="text"
                                                            value={newCorrection}
                                                            onChange={(e) => setNewCorrection(e.target.value)}
                                                            placeholder="Add correction..."
                                                            className="flex-1 px-3 py-2 border rounded text-sm"
                                                            onKeyPress={(e) => e.key === 'Enter' && handleAddCorrection()}
                                                        />
                                                        <Button size="sm" onClick={handleAddCorrection}>Add</Button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Deadline (for Reject) */}
                                        {decision === 'reject' && (
                                            <div>
                                                <Label htmlFor="deadline">Compliance Deadline</Label>
                                                <input
                                                    id="deadline"
                                                    type="date"
                                                    value={deadline}
                                                    onChange={(e) => setDeadline(e.target.value)}
                                                    className="mt-2 w-full px-3 py-2 border rounded"
                                                />
                                            </div>
                                        )}

                                        {/* Digital Signature Placeholder */}
                                        <div className="border-t pt-4">
                                            <Label>Digital Signature</Label>
                                            <div className="mt-2 p-4 border-2 border-dashed rounded-lg text-center text-sm text-gray-500">
                                                <p>Signature capture will be implemented in Phase 5</p>
                                                <p className="text-xs mt-1">Inspector: [Current User]</p>
                                            </div>
                                        </div>

                                        {/* Submit Button */}
                                        <Button
                                            className="w-full"
                                            size="lg"
                                            onClick={handleSubmitDecision}
                                            disabled={!decision || ((decision === 'reject' || decision === 'escalate') && !justification.trim())}
                                        >
                                            Submit Decision
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </ScrollArea>
                    </div>
                </div>
            </div>

            {/* Confirmation Dialog */}
            <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Decision Submitted</DialogTitle>
                        <DialogDescription>
                            Your {decision} decision has been recorded and logged in the audit trail.
                        </DialogDescription>
                    </DialogHeader>
                    <Button onClick={() => {
                        setShowConfirmation(false)
                        onClose()
                        router.push('/dashboard/inspector')
                    }}>
                        Return to Dashboard
                    </Button>
                </DialogContent>
            </Dialog>
        </div>
    )
}
