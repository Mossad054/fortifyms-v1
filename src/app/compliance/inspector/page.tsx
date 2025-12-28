'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
    ShieldCheck, AlertTriangle, MapPin, Calendar,
    ChevronRight, Activity, TrendingUp, LayoutDashboard, FileText, ClipboardCheck, Building2, Zap, Plus
} from 'lucide-react'
import { ScheduleView, AuditsView, FlagsView } from './views'
import { InspectorReporting } from './components/inspector-reporting'
import { PolicyViewer } from './components/policy-viewer'
import { TrainingRollout } from './components/training-rollout'
import { InspectionWizard } from './components/inspection-wizard'

import { AuditReviewQueue } from './components/audit-review-queue'
import { AuditReviewInterface } from './components/audit-review-interface'
import { Dialog, DialogContent } from '@/components/ui/dialog'

import { NotificationCenter } from '@/components/ui/notification-center'

export default function InspectorDashboard() {
    const router = useRouter()
    const [activeTab, setActiveTab] = React.useState('overview')
    const [showInspectionWizard, setShowInspectionWizard] = React.useState(false)
    const [selectedReviewAuditId, setSelectedReviewAuditId] = React.useState<string | null>(null)

    return (
        <div className="p-6 space-y-8 max-w-[1600px] mx-auto min-h-screen bg-[#F0EFEA]/30">

            {/* Header */}
            <InspectionWizard open={showInspectionWizard} onOpenChange={setShowInspectionWizard} />
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 glass-panel p-6 rounded-2xl">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                        <ShieldCheck className="w-8 h-8 text-green-600" />
                        Inspector Portal
                    </h1>
                    <p className="text-gray-600 mt-2">Manage audits, verify compliance, and track issues</p>
                </div>
                <div className="flex gap-3 items-center">
                    <NotificationCenter />
                    <Button variant="outline" className="bg-white/50" onClick={() => router.push('/analytics')}>
                        <MapPin className="w-4 h-4 mr-2" />
                        View Map
                    </Button>
                    <Button onClick={() => setShowInspectionWizard(true)} className="bg-zinc-900 text-white hover:bg-zinc-800">
                        <FileText className="w-4 h-4 mr-2" />
                        New Audit
                    </Button>
                </div>
            </div>

            {/* Main Tabs Navigation */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent flex flex-wrap lg:flex-nowrap gap-2">
                    <TabsTrigger
                        value="overview"
                        className="flex-1 rounded-t-lg rounded-b-none border-t border-x border-b-0 data-[state=active]:bg-[#0A3225] data-[state=active]:text-white data-[state=inactive]:bg-gray-100 data-[state=inactive]:text-gray-600 py-3"
                    >
                        Overview
                    </TabsTrigger>
                    <TabsTrigger
                        value="audits"
                        className="flex-1 rounded-t-lg rounded-b-none border-t border-x border-b-0 data-[state=active]:bg-[#0A3225] data-[state=active]:text-white data-[state=inactive]:bg-gray-100 data-[state=inactive]:text-gray-600 py-3"
                    >
                        Audits
                    </TabsTrigger>
                    <TabsTrigger
                        value="schedule"
                        className="flex-1 rounded-t-lg rounded-b-none border-t border-x border-b-0 data-[state=active]:bg-[#0A3225] data-[state=active]:text-white data-[state=inactive]:bg-gray-100 data-[state=inactive]:text-gray-600 py-3"
                    >
                        Schedule
                    </TabsTrigger>
                    <TabsTrigger
                        value="reports"
                        className="flex-1 rounded-t-lg rounded-b-none border-t border-x border-b-0 data-[state=active]:bg-[#0A3225] data-[state=active]:text-white data-[state=inactive]:bg-gray-100 data-[state=inactive]:text-gray-600 py-3"
                    >
                        Reports
                    </TabsTrigger>
                    <TabsTrigger
                        value="policy"
                        className="flex-1 rounded-t-lg rounded-b-none border-t border-x border-b-0 data-[state=active]:bg-[#0A3225] data-[state=active]:text-white data-[state=inactive]:bg-gray-100 data-[state=inactive]:text-gray-600 py-3"
                    >
                        Policy
                    </TabsTrigger>
                    <TabsTrigger
                        value="training"
                        className="flex-1 rounded-t-lg rounded-b-none border-t border-x border-b-0 data-[state=active]:bg-[#0A3225] data-[state=active]:text-white data-[state=inactive]:bg-gray-100 data-[state=inactive]:text-gray-600 py-3"
                    >
                        Training
                    </TabsTrigger>
                </TabsList>

                {/* --- OVERVIEW TAB --- */}
                <TabsContent value="overview" className="space-y-8">
                    {/* Top Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <Card className="glass-card border-none shadow-sm">
                            <CardContent className="p-4 flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Assigned Mills</p>
                                    <p className="text-2xl font-bold">12</p>
                                </div>
                                <Building2 className="w-8 h-8 text-[#0A3225]" />
                            </CardContent>
                        </Card>
                        <Card className="glass-card border-none shadow-sm">
                            <CardContent className="p-4 flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Pending Audits</p>
                                    <p className="text-2xl font-bold">3</p>
                                </div>
                                <ClipboardCheck className="w-8 h-8 text-amber-600" />
                            </CardContent>
                        </Card>
                        <Card className="glass-card border-none shadow-sm">
                            <CardContent className="p-4 flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Avg Compliance</p>
                                    <p className="text-2xl font-bold text-green-600">94%</p>
                                </div>
                                <Activity className="w-8 h-8 text-green-600" />
                            </CardContent>
                        </Card>
                        <Card className="glass-card border-none shadow-sm">
                            <CardContent className="p-4 flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Reports Due</p>
                                    <p className="text-2xl font-bold text-red-500">2</p>
                                </div>
                                <FileText className="w-8 h-8 text-red-500" />
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Schedule Summary */}
                        <div className="lg:col-span-2 space-y-6">

                            {/* Quick Actions Card */}
                            <Card className="border-indigo-200 shadow-sm bg-indigo-50/50">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <div>
                                            <h2 className="text-lg font-bold text-indigo-900">Inspector Toolkit</h2>
                                            <p className="text-indigo-600 text-sm">Quick actions to manage your day.</p>
                                        </div>
                                        <Zap className="w-6 h-6 text-indigo-400" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <Button onClick={() => setShowInspectionWizard(true)} className="justify-start bg-white text-indigo-700 hover:bg-indigo-50 border border-indigo-200">
                                            <Plus className="mr-2 h-4 w-4" /> New Inspection
                                        </Button>
                                        <Button onClick={() => setActiveTab('schedule')} variant="outline" className="justify-start border-indigo-200 text-indigo-700 bg-white hover:bg-indigo-50">
                                            <Calendar className="mr-2 h-4 w-4" /> Check Schedule
                                        </Button>
                                        <Button onClick={() => setActiveTab('reports')} variant="outline" className="justify-start border-indigo-200 text-indigo-700 bg-white hover:bg-indigo-50">
                                            <FileText className="mr-2 h-4 w-4" /> Submit Report
                                        </Button>
                                        <Button onClick={() => setActiveTab('policy')} variant="outline" className="justify-start border-indigo-200 text-indigo-700 bg-white hover:bg-indigo-50">
                                            <ShieldCheck className="mr-2 h-4 w-4" /> Policy Check
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>

                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                    <Calendar className="w-5 h-5 text-gray-500" />
                                    Upcoming Schedule Audits
                                </h2>
                                <Button variant="link" onClick={() => setActiveTab('schedule')}>View Full Schedule</Button>
                            </div>

                            {/* Custom Schedule List */}
                            <Card className="glass-card border-none shadow-sm">
                                <div className="divide-y">
                                    {[
                                        { mill: 'Golden Grain Mills', date: 'Dec 28, 2024', type: 'Surprise Audit', status: 'Confirmed', id: 'SCH-001' },
                                        { mill: 'Rift Valley Processors', date: 'Jan 03, 2025', type: 'Routine Inspection', status: 'Pending', id: 'SCH-002' },
                                        { mill: 'Coastal Millers Ltd', date: 'Jan 10, 2025', type: 'Follow-up', status: 'Confirmed', id: 'SCH-003' },
                                    ].map((audit, i) => (
                                        <div key={i} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                            <div className="flex items-center gap-4">
                                                <div className="bg-[#0A3225]/10 p-2 rounded-lg text-[#0A3225]">
                                                    <Calendar className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">{audit.mill}</p>
                                                    <div className="flex gap-2 text-sm text-muted-foreground">
                                                        <span>{audit.date}</span>
                                                        <span>•</span>
                                                        <span>{audit.type}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setActiveTab('audits')}
                                            >
                                                <ChevronRight className="w-5 h-5 text-gray-400" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </div>

                        {/* Sidebar Stats */}
                        <div className="space-y-6">
                            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5 text-gray-500" />
                                Compliance Alerts
                            </h2>
                            <FlagsView />

                            <Card className="glass-card border-none bg-green-50/50 border-green-100">
                                <CardContent className="p-6 text-center">
                                    <Activity className="w-8 h-8 text-green-600 mx-auto mb-3" />
                                    <div className="text-3xl font-bold text-gray-900">96%</div>
                                    <p className="text-sm text-green-700 font-medium">Regional Compliance Score</p>
                                    <div className="mt-4 h-2 bg-green-200 rounded-full overflow-hidden">
                                        <div className="h-full w-[96%] bg-green-500 rounded-full" />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </TabsContent>

                {/* --- AUDITS TAB --- */}
                <TabsContent value="audits">
                    <div className="space-y-6 max-w-5xl">
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="text-2xl font-bold">Audit Management</h2>
                                <p className="text-muted-foreground">Manage ongoing and past audits</p>
                            </div>
                            <Button onClick={() => setShowInspectionWizard(true)} className="bg-[#0A3225] text-white hover:bg-[#0A3225]/90">
                                <Plus className="w-4 h-4 mr-2" />
                                New Audit Draft
                            </Button>
                        </div>


                        <div className="flex flex-col gap-6">
                            {/* Self-Audit Reviews (Full Width) */}
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xl font-bold flex items-center gap-2">
                                        <ClipboardCheck className="w-5 h-5 text-[#0A3225]" />
                                        Self-Audit Review Queue
                                    </h3>
                                    <Badge variant="secondary" className="bg-[#0A3225]/10 text-[#0A3225]">3 Pending</Badge>
                                </div>
                                <Card className="glass-card border-none shadow-sm min-h-[500px] flex flex-col">
                                    <div className="p-4 bg-gray-50 border-b">
                                        <p className="text-sm text-gray-500">
                                            Review audits submitted by mill operators. Validate evidence and issue compliance certificates.
                                        </p>
                                    </div>
                                    <div className="p-4 flex-1 bg-gray-50/30">
                                        <AuditReviewQueue onSelectAudit={setSelectedReviewAuditId} />
                                    </div>
                                </Card>
                            </div>

                            {/* On-Site Audits & Drafts (Full Width) */}
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xl font-bold flex items-center gap-2">
                                        <MapPin className="w-5 h-5 text-green-600" />
                                        On-Site Inspections
                                    </h3>
                                </div>

                                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                                    {/* Left Column: Drafts */}
                                    <div className="xl:col-span-1">
                                        <Card className="glass-card border-none shadow-sm h-full">
                                            <div className="p-4 border-b flex justify-between items-center bg-yellow-50/50">
                                                <h3 className="font-semibold flex items-center gap-2">
                                                    <FileText className="w-4 h-4 text-yellow-600" />
                                                    Your Drafts
                                                </h3>
                                            </div>
                                            <div className="p-4">
                                                <div className="grid grid-cols-1 gap-4">
                                                    {/* Mock Draft Card */}
                                                    <div className="border rounded-lg p-4 bg-white hover:bg-yellow-50 cursor-pointer hover:shadow-md transition-all group" onClick={() => setShowInspectionWizard(true)}>
                                                        <div className="flex justify-between items-start mb-2">
                                                            <div className="flex items-center gap-2">
                                                                <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-200">DRAFT</Badge>
                                                                <span className="text-xs text-gray-400 group-hover:text-gray-600">Last edited: 2h ago</span>
                                                            </div>
                                                            <Button size="icon" variant="ghost" className="h-6 w-6"><ChevronRight className="w-4 h-4" /></Button>
                                                        </div>
                                                        <h4 className="font-bold text-gray-900">Rift Valley Processors</h4>
                                                        <p className="text-sm text-gray-600 mb-3">Routine Inspection • 45% Complete</p>
                                                        <div className="w-full bg-gray-100 rounded-full h-1.5 mb-2 overflow-hidden">
                                                            <div className="bg-yellow-500 h-1.5 rounded-full" style={{ width: '45%' }}></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>
                                    </div>

                                    {/* Right Column: Start New & History */}
                                    <div className="xl:col-span-2">
                                        <AuditsView />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Full Screen Audit Review Modal */}
                        <Dialog open={!!selectedReviewAuditId} onOpenChange={() => setSelectedReviewAuditId(null)}>
                            <DialogContent className="max-w-none w-screen h-screen m-0 rounded-none flex flex-col p-0 bg-white">
                                {selectedReviewAuditId && (
                                    <AuditReviewInterface
                                        auditId={selectedReviewAuditId}
                                        onBack={() => setSelectedReviewAuditId(null)}
                                    />
                                )}
                            </DialogContent>
                        </Dialog>
                    </div>
                </TabsContent>

                {/* --- SCHEDULE TAB --- */}
                <TabsContent value="schedule">
                    <div className="max-w-4xl">
                        <Card className="glass-card border-none shadow-sm">
                            <CardHeader>
                                <CardTitle>Full Inspection Schedule</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ScheduleView />
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* --- REPORTS TAB --- */}
                <TabsContent value="reports">
                    <InspectorReporting />
                </TabsContent>

                {/* --- POLICY TAB --- */}
                <TabsContent value="policy">
                    <PolicyViewer />
                </TabsContent>

                {/* --- TRAINING TAB --- */}
                <TabsContent value="training">
                    <TrainingRollout />
                </TabsContent>

            </Tabs>
        </div>
    )
}
