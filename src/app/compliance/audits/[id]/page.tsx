'use client'

import * as React from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import {
    ArrowLeft, FileCheck, CheckCircle, XCircle, Clock,
    AlertTriangle, MessageSquare, FileText, User
} from 'lucide-react'

export default function AuditDetailPage() {
    const router = useRouter()
    const params = useParams()
    const auditId = params.id as string
    const [loading, setLoading] = React.useState(true)
    const [audit, setAudit] = React.useState<any>(null)
    const [annotation, setAnnotation] = React.useState('')
    const supabase = createClient()

    React.useEffect(() => {
        if (auditId) {
            loadAudit()
        }
    }, [auditId])

    async function loadAudit() {
        try {
            const response = await fetch(`/api/compliance/audits/${auditId}`)
            if (response.ok) {
                const data = await response.json()
                setAudit(data.audit)
            }
        } catch (error) {
            console.error('Error loading audit:', error)
        } finally {
            setLoading(false)
        }
    }

    function getStatusBadge(status: string) {
        const variants: Record<string, any> = {
            IN_PROGRESS: { variant: 'secondary', icon: Clock, label: 'In Progress', className: 'bg-blue-500' },
            SUBMITTED: { variant: 'default', icon: FileText, label: 'Submitted', className: 'bg-purple-500' },
            APPROVED: { variant: 'default', icon: CheckCircle, label: 'Approved', className: 'bg-green-500' },
            REJECTED: { variant: 'destructive', icon: XCircle, label: 'Rejected' },
            REVISION_REQUESTED: { variant: 'default', icon: AlertTriangle, label: 'Revision Requested', className: 'bg-yellow-500' }
        }
        const config = variants[status] || variants.IN_PROGRESS
        const Icon = config.icon
        return (
            <Badge className={config.className}>
                <Icon className="h-3 w-3 mr-1" />
                {config.label}
            </Badge>
        )
    }

    function getScoreBadge(score: number) {
        if (score >= 90) return <Badge className="bg-green-600 text-lg px-4 py-1">Excellent: {score}%</Badge>
        if (score >= 75) return <Badge className="bg-green-500 text-lg px-4 py-1">Good: {score}%</Badge>
        if (score >= 60) return <Badge className="bg-yellow-500 text-lg px-4 py-1">Needs Improvement: {score}%</Badge>
        return <Badge variant="destructive" className="text-lg px-4 py-1">Non-Compliant: {score}%</Badge>
    }

    async function handleAddAnnotation() {
        if (!annotation.trim()) return

        try {
            const response = await fetch(`/api/compliance/audits/${auditId}/annotations`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: annotation })
            })

            if (response.ok) {
                setAnnotation('')
                loadAudit() // Reload to get new annotation
            }
        } catch (error) {
            console.error('Error adding annotation:', error)
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-lg">Loading audit details...</div>
            </div>
        )
    }

    if (!audit) {
        return (
            <div className="container mx-auto py-6">
                <Card>
                    <CardContent className="py-12 text-center">
                        <FileCheck className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                        <p className="text-gray-600">Audit not found</p>
                        <Button className="mt-4" onClick={() => router.push('/compliance')}>
                            Back to Audits
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="container mx-auto py-6 max-w-[1400px]">
            {/* Header */}
            <Button
                variant="ghost"
                onClick={() => router.push('/compliance')}
                className="mb-4"
            >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Audits
            </Button>

            <div className="flex justify-between items-start mb-6">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <FileCheck className="h-8 w-8 text-green-600" />
                        {audit.template?.name} v{audit.template?.version}
                    </h1>
                    <p className="text-gray-600 mt-1">
                        {audit.mill?.name} • {new Date(audit.auditDate).toLocaleDateString()}
                    </p>
                </div>
                <div className="flex flex-col gap-2 items-end">
                    {getStatusBadge(audit.status)}
                    {audit.score !== null && getScoreBadge(audit.score)}
                </div>
            </div>

            <Tabs defaultValue="checklist" className="space-y-6">
                <TabsList>
                    <TabsTrigger value="checklist">Checklist</TabsTrigger>
                    <TabsTrigger value="summary">Summary</TabsTrigger>
                    <TabsTrigger value="annotations">Annotations ({audit.annotations?.length || 0})</TabsTrigger>
                    <TabsTrigger value="actions">Corrective Actions</TabsTrigger>
                </TabsList>

                <TabsContent value="checklist" className="space-y-6">
                    {audit.template?.sections?.map((section: any, sectionIndex: number) => (
                        <Card key={section.id}>
                            <CardHeader>
                                <CardTitle>{section.name}</CardTitle>
                                {section.description && (
                                    <CardDescription>{section.description}</CardDescription>
                                )}
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {section.items?.map((item: any, itemIndex: number) => {
                                        const response = audit.responses?.[item.id]
                                        return (
                                            <div key={item.id} className="p-4 border rounded-lg">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2">
                                                            <p className="font-medium">{item.text}</p>
                                                            {item.weight && <Badge variant="outline" className="text-[10px] h-5 px-1.5">{item.weight} pts</Badge>}
                                                        </div>
                                                        {item.hint && (
                                                            <p className="text-sm text-zinc-500 mt-1 italic">Note: {item.hint}</p>
                                                        )}
                                                    </div>
                                                    {response && (
                                                        <Badge variant={response.isCompliant ? 'default' : 'destructive'} className={response.isCompliant ? 'bg-green-600' : ''}>
                                                            {response.isCompliant ? 'Compliant' : 'Non-Compliant'}
                                                        </Badge>
                                                    )}
                                                </div>
                                                {response && (
                                                    <div className="mt-3 p-3 bg-gray-50 rounded-md">
                                                        <p className="text-sm">
                                                            <span className="font-medium">Response: </span>
                                                            {response.value || 'N/A'}
                                                        </p>
                                                        {response.notes && (
                                                            <p className="text-sm mt-2">
                                                                <span className="font-medium">Notes: </span>
                                                                {response.notes}
                                                            </p>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        )
                                    })}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </TabsContent>

                <TabsContent value="summary" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Audit Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div>
                                    <p className="text-sm text-gray-500">Mill</p>
                                    <p className="font-medium">{audit.mill?.name}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Audit Date</p>
                                    <p className="font-medium">{new Date(audit.auditDate).toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Auditor</p>
                                    <p className="font-medium">{audit.auditor?.name || 'N/A'}</p>
                                </div>
                                {audit.reviewer && (
                                    <div>
                                        <p className="text-sm text-gray-500">Reviewer</p>
                                        <p className="font-medium">{audit.reviewer.name}</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Compliance Score</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-center py-6">
                                    <div className="text-5xl font-bold text-gray-900 mb-2">
                                        {audit.score !== null ? `${audit.score}%` : 'N/A'}
                                    </div>
                                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden mt-4">
                                        <div
                                            className={`h-full ${audit.score >= 75 ? 'bg-green-500' : audit.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                            style={{ width: `${audit.score || 0}%` }}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Red Flags</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {audit.redFlags && audit.redFlags.length > 0 ? (
                                    <div className="space-y-2">
                                        {audit.redFlags.map((flag: string, index: number) => (
                                            <div key={index} className="flex items-start gap-2 text-sm">
                                                <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                                                <span>{flag}</span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-6 text-gray-500">
                                        <CheckCircle className="h-8 w-8 mx-auto text-green-500 mb-2" />
                                        <p className="text-sm">No red flags identified</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="annotations" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Add Annotation</CardTitle>
                            <CardDescription>Inspector notes and observations</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <Textarea
                                    placeholder="Add your notes, observations, or recommendations..."
                                    value={annotation}
                                    onChange={(e) => setAnnotation(e.target.value)}
                                    rows={4}
                                />
                                <Button onClick={handleAddAnnotation}>
                                    <MessageSquare className="h-4 w-4 mr-2" />
                                    Add Annotation
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {audit.annotations && audit.annotations.length > 0 ? (
                        <div className="space-y-4">
                            {audit.annotations.map((ann: any) => (
                                <Card key={ann.id}>
                                    <CardContent className="pt-6">
                                        <div className="flex items-start gap-3">
                                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold">
                                                {ann.inspector?.name?.charAt(0) || 'I'}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <p className="font-semibold">{ann.inspector?.name || 'Inspector'}</p>
                                                    <span className="text-sm text-gray-500">
                                                        {new Date(ann.createdAt).toLocaleString()}
                                                    </span>
                                                </div>
                                                <p className="text-gray-700">{ann.text}</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <Card>
                            <CardContent className="py-12 text-center">
                                <MessageSquare className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                                <p className="text-gray-600">No annotations yet</p>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>

                <TabsContent value="actions" className="space-y-6">
                    <Card>
                        <CardContent className="py-12 text-center">
                            <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                            <p className="text-gray-600">Corrective actions feature coming soon</p>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Action Buttons */}
            {audit.status === 'SUBMITTED' && (
                <div className="mt-6 flex gap-3 justify-end">
                    <Button variant="outline">
                        Request Revision
                    </Button>
                    <Button variant="destructive">
                        Reject
                    </Button>
                    <Button variant="default" className="bg-green-600 hover:bg-green-700">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Approve
                    </Button>
                </div>
            )}
        </div>
    )
}
