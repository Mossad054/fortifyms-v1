'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
    Activity, Building2, FileText, Map, Globe, TrendingUp, Download,
    BarChart3, Users, Package
} from 'lucide-react'
import { HeroMetrics } from './components/hero-metrics'
import { GeographicMap } from './components/geographic-map'
import { PerformanceTrends } from './components/performance-trends'
import { MillPerformanceAnalysis } from './components/mill-analysis'
import { InstitutionalSupply } from './components/institutional-supply'
import { PolicyAdvocacy } from './components/policy-advocacy'
import { ExportReporting } from './components/export-reporting'
import { ComplianceTemplates } from './components/compliance-templates'
import { ShieldCheck } from 'lucide-react'

import { ComplianceView } from './components/compliance-view'
import { NotificationCenter } from '@/components/ui/notification-center'

export default function ProgramManagerDashboard() {
    const router = useRouter()
    const [activeTab, setActiveTab] = React.useState('overview')

    return (
        <div className="p-6 space-y-8 max-w-[1800px] mx-auto min-h-screen bg-white">
            {/* Header */}
            <div className="flex justify-between items-center mb-2">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-premium-dark flex items-center gap-2">
                        <Globe className="w-8 h-8 text-primary/60" />
                        Program Manager Dashboard
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        National-level strategic oversight and program analytics
                    </p>
                </div>
                <div className="flex gap-3 items-center">
                    <NotificationCenter />
                    <Button variant="outline" className="bg-white">
                        <TrendingUp className="w-4 h-4 mr-2" />
                        Data Explorer
                    </Button>
                    <Button variant="default">
                        <Download className="w-4 h-4 mr-2" />
                        Generate Report
                    </Button>
                </div>
            </div>

            {/* Main Tabs Navigation */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="grid w-full grid-cols-8 lg:grid-cols-8 bg-white/60 p-1 backdrop-blur-md rounded-xl border border-white/20 shadow-sm">
                    <TabsTrigger
                        value="overview"
                        className="flex items-center gap-2 font-bold text-gray-600 data-[state=active]:bg-[#0A3225] data-[state=active]:text-white transition-all"
                    >
                        <Activity className="h-4 w-4" />
                        <span className="hidden lg:inline">Overview</span>
                    </TabsTrigger>
                    <TabsTrigger
                        value="geographic"
                        className="flex items-center gap-2 font-bold text-gray-600 data-[state=active]:bg-[#0A3225] data-[state=active]:text-white transition-all"
                    >
                        <Map className="h-4 w-4" />
                        <span className="hidden lg:inline">Geographic</span>
                    </TabsTrigger>
                    <TabsTrigger
                        value="trends"
                        className="flex items-center gap-2 font-bold text-gray-600 data-[state=active]:bg-[#0A3225] data-[state=active]:text-white transition-all"
                    >
                        <TrendingUp className="h-4 w-4" />
                        <span className="hidden lg:inline">Trends</span>
                    </TabsTrigger>
                    <TabsTrigger
                        value="mills"
                        className="flex items-center gap-2 font-bold text-gray-600 data-[state=active]:bg-[#0A3225] data-[state=active]:text-white transition-all"
                    >
                        <Building2 className="h-4 w-4" />
                        <span className="hidden lg:inline">Mills</span>
                    </TabsTrigger>
                    <TabsTrigger
                        value="supply"
                        className="flex items-center gap-2 font-bold text-gray-600 data-[state=active]:bg-[#0A3225] data-[state=active]:text-white transition-all"
                    >
                        <Package className="h-4 w-4" />
                        <span className="hidden lg:inline">Supply</span>
                    </TabsTrigger>
                    <TabsTrigger
                        value="policy"
                        className="flex items-center gap-2 font-bold text-gray-600 data-[state=active]:bg-[#0A3225] data-[state=active]:text-white transition-all"
                    >
                        <FileText className="h-4 w-4" />
                        <span className="hidden lg:inline">Policy</span>
                    </TabsTrigger>
                    <TabsTrigger
                        value="compliance"
                        className="flex items-center gap-2 font-bold text-gray-600 data-[state=active]:bg-[#0A3225] data-[state=active]:text-white transition-all"
                    >
                        <ShieldCheck className="h-4 w-4" />
                        <span className="hidden lg:inline">Compliance</span>
                    </TabsTrigger>
                    <TabsTrigger
                        value="reports"
                        className="flex items-center gap-2 font-bold text-gray-600 data-[state=active]:bg-[#0A3225] data-[state=active]:text-white transition-all"
                    >
                        <BarChart3 className="h-4 w-4" />
                        <span className="hidden lg:inline">Reports</span>
                    </TabsTrigger>
                </TabsList>

                {/* --- OVERVIEW TAB (PHASE 1) --- */}
                <TabsContent value="overview">
                    <HeroMetrics />

                    {/* Quick Actions Card */}
                    <Card className="border-sky-200 mt-6 shadow-sm">
                        <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                            <div>
                                <h2 className="text-xl font-bold mb-1 text-sky-900">Program Command Center</h2>
                                <p className="text-sky-600 text-sm">Access key program workflows and analytics.</p>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                <Button onClick={() => setActiveTab('trends')} variant="outline" className="border-sky-200 hover:bg-sky-50 text-sky-700">
                                    <TrendingUp className="mr-2 h-4 w-4" /> Data Explorer
                                </Button>
                                <Button onClick={() => setActiveTab('mills')} variant="outline" className="border-[#0A3225]/20 hover:bg-[#0A3225]/5 text-[#0A3225]">
                                    <Building2 className="mr-2 h-4 w-4" /> Mill Performance
                                </Button>
                                <Button onClick={() => setActiveTab('supply')} variant="outline" className="border-indigo-200 hover:bg-indigo-50 text-indigo-700">
                                    <Package className="mr-2 h-4 w-4" /> Regional Supply
                                </Button>
                                <Button onClick={() => setActiveTab('compliance')} variant="outline" className="border-teal-200 hover:bg-teal-50 text-teal-700">
                                    <ShieldCheck className="mr-2 h-4 w-4" /> Compliance Review
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* --- GEOGRAPHIC TAB (PHASE 2) --- */}
                <TabsContent value="geographic">
                    <GeographicMap />
                </TabsContent>

                {/* --- TRENDS TAB (PHASE 3) --- */}
                <TabsContent value="trends">
                    <PerformanceTrends />
                </TabsContent>

                {/* --- MILLS TAB (PHASE 4) --- */}
                <TabsContent value="mills">
                    <MillPerformanceAnalysis />
                </TabsContent>

                {/* --- SUPPLY TAB (PHASE 5) --- */}
                <TabsContent value="supply">
                    <InstitutionalSupply />
                </TabsContent>

                {/* --- POLICY TAB (PHASE 6) --- */}
                <TabsContent value="policy">
                    <PolicyAdvocacy />
                </TabsContent>

                {/* --- COMPLIANCE TAB (PHASE 7 - NEW) --- */}
                <TabsContent value="compliance">
                    <ComplianceView />
                </TabsContent>

                {/* --- REPORTS TAB (PHASE 8) --- */}
                <TabsContent value="reports">
                    <ExportReporting />
                </TabsContent>
            </Tabs>
        </div>
    )
}
