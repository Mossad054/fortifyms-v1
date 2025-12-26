'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, FileText, CheckCircle, XCircle, Clock } from 'lucide-react'

export default function CompliancePage() {
    const router = useRouter()
    const [loading, setLoading] = React.useState(true)
    const [audits, setAudits] = React.useState<any[]>([])
    const supabase = createClient()

    React.useEffect(() => {
        loadAudits()
    }, [])

    async function loadAudits() {
        try {
            const response = await fetch('/api/compliance/audits')
            if (response.ok) {
                const data = await response.json()
                setAudits(data.audits)
            }
        } catch (error) {
            console.error('Error loading audits:', error)
        } finally {
            setLoading(false)
        }
    }

    function getStatusBadge(status: string) {
        const variants: Record<string, any> = {
            IN_PROGRESS: { variant: 'secondary', icon: Clock, label: 'In Progress' },
            SUBMITTED: { variant: 'default', icon: FileText, label: 'Submitted' },
            APPROVED: { variant: 'default', icon: CheckCircle, label: 'Approved', className: 'bg-green-500' },
            REJECTED: { variant: 'destructive', icon: XCircle, label: 'Rejected' },
            REVISION_REQUESTED: { variant: 'default', icon: Clock, label: 'Revision Requested', className: 'bg-yellow-500' }
        }

        const config = variants[status] || variants.IN_PROGRESS
        const Icon = config.icon

        return (
            <Badge variant={config.variant} className={config.className}>
                <Icon className="h-3 w-3 mr-1" />
                {config.label}
            </Badge>
        )
    }

    function getScoreBadge(score: number) {
        if (score >= 90) return <Badge className="bg-green-600">Excellent ({score}%)</Badge>
        if (score >= 75) return <Badge className="bg-green-500">Good ({score}%)</Badge>
        if (score >= 60) return <Badge className="bg-yellow-500">Needs Improvement ({score}%)</Badge>
        return <Badge variant="destructive">Non-Compliant ({score}%)</Badge>
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-lg">Loading...</div>
            </div>
        )
    }

    return (
        <div className="container mx-auto py-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold">Compliance Audits</h1>
                    <p className="text-gray-600 mt-1">Manage and track compliance audits</p>
                </div>
                <Button onClick={() => router.push('/compliance/audits/new')}>
                    <Plus className="h-4 w-4 mr-2" />
                    New Audit
                </Button>
            </div>

            <div className="grid gap-4">
                {audits.length === 0 ? (
                    <Card>
                        <CardContent className="py-12 text-center">
                            <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                            <p className="text-gray-600">No audits found. Create your first audit to get started.</p>
                            <Button className="mt-4" onClick={() => router.push('/compliance/audits/new')}>
                                Create Audit
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    audits.map((audit) => (
                        <Card
                            key={audit.id}
                            className="cursor-pointer hover:shadow-md transition-shadow"
                            onClick={() => router.push(`/compliance/audits/${audit.id}`)}
                        >
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <CardTitle className="text-lg">
                                            {audit.template?.name} v{audit.template?.version}
                                        </CardTitle>
                                        <CardDescription className="mt-1">
                                            {audit.mill?.name} • {new Date(audit.auditDate).toLocaleDateString()}
                                        </CardDescription>
                                    </div>
                                    <div className="flex flex-col gap-2 items-end">
                                        {getStatusBadge(audit.status)}
                                        {audit.score !== null && getScoreBadge(audit.score)}
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                    <div>
                                        <p className="text-gray-500">Auditor</p>
                                        <p className="font-medium">{audit.auditor?.name || 'N/A'}</p>
                                    </div>
                                    {audit.reviewer && (
                                        <div>
                                            <p className="text-gray-500">Reviewer</p>
                                            <p className="font-medium">{audit.reviewer.name}</p>
                                        </div>
                                    )}
                                    {audit.redFlags && audit.redFlags.length > 0 && (
                                        <div>
                                            <p className="text-gray-500">Red Flags</p>
                                            <p className="font-medium text-red-600">{audit.redFlags.length}</p>
                                        </div>
                                    )}
                                    {audit.submittedAt && (
                                        <div>
                                            <p className="text-gray-500">Submitted</p>
                                            <p className="font-medium">{new Date(audit.submittedAt).toLocaleDateString()}</p>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    )
}
