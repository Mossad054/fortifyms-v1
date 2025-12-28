'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MOCK_AUDIT_LOGS } from '@/lib/mock-data/compliance'
import { CheckCircle2, XCircle, AlertTriangle, Filter, Download, ChevronRight, Search, Clock, ShieldCheck, MapPin, Calendar, FileText, Activity } from 'lucide-react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Progress } from "@/components/ui/progress"

// Helper type for mock logs if not fully defined
type AuditLog = typeof MOCK_AUDIT_LOGS[0]

export function ComplianceMonitoring() {
    const [filter, setFilter] = React.useState('All')
    const [selectedAudit, setSelectedAudit] = React.useState<AuditLog | null>(null)
    const [showAuditDialog, setShowAuditDialog] = React.useState(false)

    const stats = {
        total: MOCK_AUDIT_LOGS.length,
        certified: MOCK_AUDIT_LOGS.filter(a => a.overallResult === 'Certified').length,
        nonCompliant: MOCK_AUDIT_LOGS.filter(a => a.overallResult === 'Non-Compliant').length,
        avgScore: Math.round(MOCK_AUDIT_LOGS.reduce((acc, curr) => acc + curr.score, 0) / MOCK_AUDIT_LOGS.length)
    }

    const openAuditDetails = (log: AuditLog) => {
        setSelectedAudit(log)
        setShowAuditDialog(true)
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
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="opacity-100 transition-opacity text-[#0A3225] hover:text-[#0A3225] hover:bg-[#0A3225]/5 z-10 relative"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            openAuditDetails(log)
                                        }}
                                    >
                                        Details <ChevronRight className="w-4 h-4 ml-1" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Audit Detail Dialog */}
            <Dialog open={showAuditDialog} onOpenChange={setShowAuditDialog}>
                <DialogContent className="max-w-3xl h-[85vh] flex flex-col p-0 gap-0">
                    <div className="p-6 border-b bg-gray-50/50">
                        <DialogHeader>
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <Badge variant="outline" className="bg-white">{selectedAudit?.type}</Badge>
                                        <span className="text-sm text-muted-foreground">{selectedAudit?.completedDate ? new Date(selectedAudit.completedDate).toLocaleDateString() : 'Date N/A'}</span>
                                    </div>
                                    <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                                        {selectedAudit?.millId} Audit Report
                                        {selectedAudit?.overallResult === 'Certified' && <CheckCircle2 className="w-6 h-6 text-green-600" />}
                                        {selectedAudit?.overallResult === 'Non-Compliant' && <XCircle className="w-6 h-6 text-red-600" />}
                                    </DialogTitle>
                                    <DialogDescription>
                                        Reference ID: {selectedAudit?.id} • Template: {selectedAudit?.templateId}
                                    </DialogDescription>
                                </div>
                                <div className="text-center bg-white p-3 rounded-xl border shadow-sm">
                                    <div className="text-3xl font-black">{selectedAudit?.score}%</div>
                                    <div className={`text-xs font-medium uppercase mt-1 ${selectedAudit?.overallResult === 'Certified' ? 'text-green-600' : 'text-red-600'
                                        }`}>{selectedAudit?.overallResult}</div>
                                </div>
                            </div>
                        </DialogHeader>
                    </div>

                    <Tabs defaultValue="overview" className="flex-1 flex flex-col overflow-hidden">
                        <div className="px-6 border-b">
                            <TabsList className="bg-transparent h-12 w-full justify-start gap-6 rounded-none p-0">
                                <TabsTrigger value="overview" className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:shadow-none rounded-none px-0 pb-3 bg-transparent">Overview</TabsTrigger>
                                <TabsTrigger value="findings" className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:shadow-none rounded-none px-0 pb-3 bg-transparent">Findings & CAPA</TabsTrigger>
                                <TabsTrigger value="evidence" className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:shadow-none rounded-none px-0 pb-3 bg-transparent">Evidence</TabsTrigger>
                            </TabsList>
                        </div>

                        <ScrollArea className="flex-1 bg-gray-50/30">
                            <div className="p-6">
                                <TabsContent value="overview" className="mt-0 space-y-6">
                                    <div className="grid grid-cols-2 gap-4">
                                        <Card>
                                            <CardHeader className="pb-2">
                                                <CardTitle className="text-sm font-medium text-muted-foreground">Facility Details</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="space-y-2 text-sm">
                                                    <div className="flex items-center gap-2">
                                                        <MapPin className="w-4 h-4 text-gray-400" />
                                                        <span>Processing Plant A, Nairobi Industrial Area</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <ShieldCheck className="w-4 h-4 text-gray-400" />
                                                        <span>License: LIC-2024-8892</span>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                        <Card>
                                            <CardHeader className="pb-2">
                                                <CardTitle className="text-sm font-medium text-muted-foreground">Inspector</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-[#0A3225]/10 flex items-center justify-center text-[#0A3225] font-bold">JD</div>
                                                    <div>
                                                        <div className="font-semibold">Jane Doe</div>
                                                        <div className="text-xs text-muted-foreground">Lead Inspector, KEBS</div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>

                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="text-base">Section Performance</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            {[
                                                { label: 'Premix Handling', score: 92 },
                                                { label: 'Production Process', score: 85 },
                                                { label: 'Quality Control', score: 78 },
                                                { label: 'Documentation', score: 95 }
                                            ].map(item => (
                                                <div key={item.label} className="space-y-1">
                                                    <div className="flex justify-between text-sm">
                                                        <span>{item.label}</span>
                                                        <span className="font-medium">{item.score}%</span>
                                                    </div>
                                                    <Progress value={item.score} className={item.score < 80 ? 'bg-red-100 [&>div]:bg-red-500' : 'bg-green-100 [&>div]:bg-green-500'} />
                                                </div>
                                            ))}
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                <TabsContent value="findings" className="mt-0 space-y-4">
                                    <div className="flex items-center gap-2 mb-4 p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-sm">
                                        <AlertTriangle className="w-4 h-4" />
                                        <span>3 Major Non-Conformances identified needing immediate attention.</span>
                                    </div>

                                    {[1, 2, 3].map((i) => (
                                        <Card key={i} className="border-l-4 border-l-red-500">
                                            <CardContent className="p-4 pt-4">
                                                <div className="flex justify-between items-start mb-2">
                                                    <Badge variant="destructive">Major NC</Badge>
                                                    <span className="text-xs text-muted-foreground">ID: NC-2024-00{i}</span>
                                                </div>
                                                <h4 className="font-bold text-sm mb-1">Inadequate Premix Storage Conditions</h4>
                                                <p className="text-sm text-gray-600 mb-4">
                                                    Temperature logs indicate storage area exceeded 30°C for 4 consecutive days.
                                                </p>

                                                <Separator className="my-3" />

                                                <div className="bg-slate-50 p-3 rounded-lg text-sm space-y-2">
                                                    <div className="font-medium flex items-center gap-2 text-slate-700">
                                                        <Activity className="w-4 h-4" /> Corrective Action Plan
                                                    </div>
                                                    <p className="text-slate-600">Install additional ventilation and temperature monitoring system by end of month.</p>
                                                    <div className="flex justify-between items-center text-xs mt-2">
                                                        <span className="text-[#0A3225] font-medium">Status: In Progress</span>
                                                        <span className="text-slate-400">Due: Jan 15, 2025</span>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </TabsContent>

                                <TabsContent value="evidence" className="mt-0">
                                    <div className="grid grid-cols-3 gap-2">
                                        {[1, 2, 3, 4, 5, 6].map((i) => (
                                            <div key={i} className="aspect-square bg-slate-200 rounded-lg flex items-center justify-center text-slate-400 relative group cursor-pointer overflow-hidden">
                                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-medium">
                                                    View
                                                </div>
                                                <FileText className="w-8 h-8" />
                                            </div>
                                        ))}
                                    </div>
                                </TabsContent>
                            </div>
                        </ScrollArea>
                    </Tabs>

                    <div className="p-4 border-t bg-white flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setShowAuditDialog(false)}>Close</Button>
                        <Button>
                            <Download className="w-4 h-4 mr-2" /> Download Full Report
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
