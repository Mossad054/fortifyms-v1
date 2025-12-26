'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MOCK_AUDIT_LOGS } from '@/lib/mock-data/compliance'
import { CheckCircle2, XCircle, AlertTriangle, Filter, Download, ChevronRight, Search } from 'lucide-react'

export function ComplianceMonitoring() {
    const [filter, setFilter] = React.useState('All')

    const stats = {
        total: MOCK_AUDIT_LOGS.length,
        certified: MOCK_AUDIT_LOGS.filter(a => a.overallResult === 'Certified').length,
        nonCompliant: MOCK_AUDIT_LOGS.filter(a => a.overallResult === 'Non-Compliant').length,
        avgScore: Math.round(MOCK_AUDIT_LOGS.reduce((acc, curr) => acc + curr.score, 0) / MOCK_AUDIT_LOGS.length)
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-white/50 border-zinc-200">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-zinc-500">Average Compliance</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-zinc-900">{stats.avgScore}%</div>
                        <p className="text-xs text-zinc-500 mt-1">Across all facilities</p>
                    </CardContent>
                </Card>
                <Card className="bg-white/50 border-zinc-200">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-zinc-500">Certified Mills</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{stats.certified}</div>
                        <p className="text-xs text-zinc-500 mt-1">Passing standard</p>
                    </CardContent>
                </Card>
                <Card className="bg-white/50 border-zinc-200">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-zinc-500">Non-Compliant</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">{stats.nonCompliant}</div>
                        <p className="text-xs text-zinc-500 mt-1">Requiring intervention</p>
                    </CardContent>
                </Card>
                <Card className="bg-white/50 border-zinc-200">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-zinc-500">Total Audits</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-zinc-900">{stats.total}</div>
                        <p className="text-xs text-zinc-500 mt-1">Last 30 days</p>
                    </CardContent>
                </Card>
            </div>

            {/* Audit Log Table */}
            <Card className="border-zinc-200 shadow-sm">
                <CardHeader className="border-b bg-zinc-50/50">
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle>Recent Audit Activity</CardTitle>
                            <CardDescription>Live feed of inspections and self-assessments</CardDescription>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="bg-white">
                                <Filter className="w-4 h-4 mr-2" /> Filter
                            </Button>
                            <Button variant="outline" size="sm" className="bg-white">
                                <Download className="w-4 h-4 mr-2" /> Export Log
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="divide-y">
                        {MOCK_AUDIT_LOGS.map((log) => (
                            <div key={log.id} className="p-4 hover:bg-zinc-50 transition-colors flex items-center justify-between group">
                                <div className="flex items-center gap-4">
                                    <div className={`p-2 rounded-full ${log.overallResult === 'Certified' ? 'bg-green-100' :
                                            log.overallResult === 'Non-Compliant' ? 'bg-red-100' : 'bg-yellow-100'
                                        }`}>
                                        {log.overallResult === 'Certified' ? <CheckCircle2 className="w-5 h-5 text-green-600" /> :
                                            log.overallResult === 'Non-Compliant' ? <XCircle className="w-5 h-5 text-red-600" /> :
                                                <AlertTriangle className="w-5 h-5 text-yellow-600" />}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-zinc-900">{log.millId}</span>
                                            <Badge variant="outline" className="text-xs font-normal text-zinc-500">{log.type}</Badge>
                                        </div>
                                        <div className="text-sm text-zinc-500">
                                            {log.templateId} • {new Date(log.completedDate || '').toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-8">
                                    <div className="text-right">
                                        <div className="text-sm font-medium text-zinc-900">Score: {log.score}%</div>
                                        <div className={`text-xs ${log.overallResult === 'Certified' ? 'text-green-600' : 'text-red-600'
                                            }`}>{log.overallResult}</div>
                                    </div>
                                    <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                                        Details <ChevronRight className="w-4 h-4 ml-1" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
