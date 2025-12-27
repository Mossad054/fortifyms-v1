'use client'

import * as React from 'react'
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { AlertCircle, CheckCircle2, FileText, Clock, Filter, ChevronRight, Search } from 'lucide-react'
import { MOCK_AUDIT_LOGS, MOCK_MILLS, MOCK_TEMPLATES } from '@/lib/mock-data/compliance'
import { AuditSession } from '@/lib/types/compliance-audit'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface AuditReviewQueueProps {
    onSelectAudit: (auditId: string) => void
}

export function AuditReviewQueue({ onSelectAudit }: AuditReviewQueueProps) {
    const [filterStatus, setFilterStatus] = React.useState('all')
    const [searchQuery, setSearchQuery] = React.useState('')

    // Filter audits that need review or were reviewed
    const audits = MOCK_AUDIT_LOGS.filter(a =>
        a.type === 'Self-Audit' &&
        (a.reviewStatus || a.status === 'Reviewing' || a.status === 'Submitted')
    )

    const filteredAudits = audits.filter(a => {
        const mill = MOCK_MILLS[a.millId]
        const millName = mill?.name?.toLowerCase() || ''
        const matchesSearch = millName.includes(searchQuery.toLowerCase()) || a.millId.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesStatus = filterStatus === 'all' ||
            (filterStatus === 'pending' && (!a.reviewStatus || a.reviewStatus === 'Pending')) ||
            (filterStatus === 'completed' && a.reviewStatus === 'Completed') ||
            (filterStatus === 'in-progress' && a.reviewStatus === 'InReview')

        return matchesSearch && matchesStatus
    })

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search mill or Audit ID..."
                        className="pl-8 bg-white"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                        <SelectTrigger className="w-[180px] bg-white">
                            <Filter className="w-4 h-4 mr-2" />
                            <SelectValue placeholder="Filter Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Reviews</SelectItem>
                            <SelectItem value="pending">Pending Review</SelectItem>
                            <SelectItem value="in-progress">In Progress</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {filteredAudits.length === 0 ? (
                    <div className="text-center py-12 bg-white/50 rounded-lg border border-dashed">
                        <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <h3 className="text-lg font-medium text-gray-900">No audits found</h3>
                        <p className="text-gray-500">Try adjusting your filters.</p>
                    </div>
                ) : (
                    filteredAudits.map((audit) => (
                        <AuditCard key={audit.id} audit={audit} onClick={() => onSelectAudit(audit.id)} />
                    ))
                )}
            </div>
        </div>
    )
}

function AuditCard({ audit, onClick }: { audit: AuditSession, onClick: () => void }) {
    const mill = MOCK_MILLS[audit.millId]
    const template = MOCK_TEMPLATES.find(t => t.id === audit.templateId)

    const getStatusColor = (status?: string) => {
        switch (status) {
            case 'Pending': return 'bg-amber-100 text-amber-700 border-amber-200'
            case 'InReview': return 'bg-blue-100 text-blue-700 border-blue-200'
            case 'Completed': return 'bg-green-100 text-green-700 border-green-200'
            default: return 'bg-gray-100 text-gray-700'
        }
    }

    return (
        <Card className="hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-transparent hover:border-l-blue-600" onClick={onClick}>
            <CardContent className="p-6">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline" className={getStatusColor(audit.reviewStatus || 'Pending')}>
                                {audit.reviewStatus === 'InReview' ? 'In Progress' : audit.reviewStatus || 'Pending Review'}
                            </Badge>
                            <span className="text-xs text-muted-foreground font-mono">{audit.id}</span>
                            <span className="text-xs text-muted-foreground">•</span>
                            <span className="text-xs text-muted-foreground">Submitted {new Date(audit.completedDate || '').toLocaleDateString()}</span>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">{mill?.name || audit.millId}</h3>
                        <p className="text-sm text-gray-600">{template?.title}</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 mt-4 md:mt-0">
                        <div className="text-center min-w-[60px]">
                            <p className="text-xs text-muted-foreground uppercase font-bold">Self-Score</p>
                            <p className={`text-2xl font-bold ${audit.score >= 90 ? 'text-green-600' : audit.score >= 70 ? 'text-amber-600' : 'text-red-600'}`}>
                                {audit.score}%
                            </p>
                        </div>
                        <div className="h-10 w-px bg-gray-200 hidden md:block" />
                        <div className="flex-1 min-w-[140px] space-y-2">
                            <div className="flex justify-between text-xs">
                                <span className="text-gray-500">Risk Level</span>
                                <span className={`font-medium ${mill?.riskLevel === 'High' ? 'text-red-600' : 'text-gray-900'}`}>{mill?.riskLevel}</span>
                            </div>
                            <div className="flex justify-between text-xs">
                                <span className="text-gray-500">Region</span>
                                <span className="font-medium text-gray-900">{mill?.region}</span>
                            </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
