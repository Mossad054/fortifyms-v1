'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
    ShieldCheck, FileText, Building2, MapPin, AlertTriangle,
    BarChart3, Download, Settings, ChevronRight, Calculator, Calendar, ClipboardCheck, Activity, Zap, Plus
} from 'lucide-react'
import { PendingReviewsQueue } from './components/pending-reviews'
import { AssignedMillsView } from './components/assigned-mills'
import { RegionalOverviewView } from './components/regional-overview'
import { InspectorReporting } from './components/inspector-reporting'
import { PolicyViewer } from './components/policy-viewer'
import { TrainingRollout } from './components/training-rollout'

import { InspectionWizard } from './components/inspection-wizard'

export default function InspectorDashboard() {
    const router = useRouter()
    const [activeTab, setActiveTab] = React.useState('overview')
    const [showInspectionWizard, setShowInspectionWizard] = React.useState(false)

    return (
        <div className="p-6 space-y-8 max-w-[1600px] mx-auto min-h-screen bg-white">
            <InspectionWizard open={showInspectionWizard} onOpenChange={setShowInspectionWizard} />
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-premium-dark flex items-center gap-2">
                        <ShieldCheck className="w-8 h-8 text-green-600" />
                        Inspector Portal
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Regulatory inspection and compliance oversight
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button onClick={() => setShowInspectionWizard(true)} className="bg-zinc-900 text-white hover:bg-zinc-800">
                        <ShieldCheck className="w-4 h-4 mr-2" />
                        Start Inspection
                    </Button>
                    <Button variant="outline" className="bg-white">
                        <MapPin className="w-4 h-4 mr-2" />
                        Regional Map
                    </Button>
                    <Button variant="outline" className="bg-white">
                        <Download className="w-4 h-4 mr-2" />
                        Export Evidence
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
                <TabsContent value="overview" className="space-y-6">
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

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Upcoming Schedule Audits */}
                        <Card className="glass-card border-none shadow-sm lg:col-span-2">
                            <div className="p-6 border-b flex justify-between items-center">
                                <h3 className="text-lg font-semibold">Upcoming Schedule Audits</h3>
                                <Button variant="outline" size="sm" onClick={() => setActiveTab('schedule')}>
                                    View Full Schedule
                                </Button>
                            </div>
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

                        {/* Quick Actions */}
                        <div className="space-y-6">
                            <Card className="glass-card border-none shadow-sm bg-[#0A3225]/5/50">
                                <div className="p-6">
                                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                                        <Zap className="w-4 h-4 text-[#0A3225]" />
                                        Quick Actions
                                    </h3>
                                    <div className="space-y-2">
                                        <Button className="w-full justify-start bg-white hover:bg-white/80 text-[#0A3225] border-[#0A3225]/20" variant="outline" onClick={() => setShowInspectionWizard(true)}>
                                            <Plus className="w-4 h-4 mr-2" />
                                            Start New Inspection Due Today
                                        </Button>
                                        <Button className="w-full justify-start bg-white hover:bg-white/80 text-gray-700 border-gray-200" variant="outline" onClick={() => setActiveTab('reports')}>
                                            <FileText className="w-4 h-4 mr-2" />
                                            Submit Weekly Report
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>

                    {/* Pending Reviews / Tasks */}
                    <div>
                        <h3 className="text-lg font-semibold mb-3">Pending Action Items</h3>
                        <PendingReviewsQueue />
                    </div>
                </TabsContent>

                {/* --- AUDITS TAB --- */}
                <TabsContent value="audits">
                    <div className="space-y-6">
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

                        {/* Recent Drafts Section */}
                        <Card className="glass-card border-none shadow-sm">
                            <div className="p-6 border-b">
                                <h3 className="text-lg font-semibold">Your Drafts</h3>
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {/* Mock Draft Card */}
                                    <div className="border rounded-lg p-4 bg-yellow-50/50 border-yellow-200 cursor-pointer hover:shadow-md transition-all" onClick={() => setShowInspectionWizard(true)}>
                                        <div className="flex justify-between items-start mb-2">
                                            <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-200">DRAFT</Badge>
                                            <span className="text-xs text-gray-500">Last edited: 2h ago</span>
                                        </div>
                                        <h4 className="font-bold text-gray-900">Rift Valley Processors</h4>
                                        <p className="text-sm text-gray-600 mb-4">Routine Inspection • 45% Complete</p>
                                        <div className="w-full bg-gray-200 rounded-full h-1.5 mb-2">
                                            <div className="bg-yellow-500 h-1.5 rounded-full" style={{ width: '45%' }}></div>
                                        </div>
                                        <Button size="sm" variant="outline" className="w-full bg-white">Continue Audit</Button>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* Completed Audits History - Reusing Regional/Reporting view concept or placeholder */}
                        <Card className="glass-card border-none shadow-sm">
                            <div className="p-6 border-b">
                                <h3 className="text-lg font-semibold">Recently Submitted</h3>
                            </div>
                            <div className="divide-y">
                                {['Golden Grain Mills', 'Nairobi Flour', 'Mombasa Maize'].map((mill, i) => (
                                    <div key={i} className="p-4 flex items-center justify-between hover:bg-slate-50">
                                        <div>
                                            <p className="font-medium">{mill}</p>
                                            <p className="text-xs text-muted-foreground">Submitted: Dec {20 - i}, 2024</p>
                                        </div>
                                        <Badge variant="outline" className="text-green-600 bg-green-50 border-green-200">Approved</Badge>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>
                </TabsContent>

                {/* --- SCHEDULE TAB --- */}
                <TabsContent value="schedule">
                    <AssignedMillsView />
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
