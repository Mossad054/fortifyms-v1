'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
    CartesianGrid, PieChart, Pie, Cell
} from 'recharts'
import {
    ArrowUpRight, Factory, Scale, FileCheck,
    Truck, AlertCircle, ChevronRight, Download, BarChart3, FileText
} from 'lucide-react'
import { ProductionView, ComplianceView, AlertsView } from './views'
import { AnalyticsView, ReportsView } from './analytics-views'
import { BatchApprovalModule } from './batch-approval'

const COLORS = ['#10b981', '#f59e0b', '#ef4444', '#3b82f6'];

const complianceData = [
    { name: 'Compliant', value: 85 },
    { name: 'Minor Issues', value: 10 },
    { name: 'Non-Compliant', value: 5 },
]

const productionTrend = [
    { name: 'Week 1', maize: 4000, rice: 2400 },
    { name: 'Week 2', maize: 3000, rice: 1398 },
    { name: 'Week 3', maize: 2000, rice: 9800 },
    { name: 'Week 4', maize: 2780, rice: 3908 },
]

export default function ManagerDashboard() {
    const router = useRouter()
    const [activeTab, setActiveTab] = React.useState('overview')

    return (
        <div className="p-6 space-y-6 max-w-[1600px] mx-auto min-h-screen bg-white">

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-premium-dark flex items-center gap-2">
                        Mill Management Portal
                        <Badge variant="outline" className="text-sm font-normal bg-green-50 text-green-700 border-green-200">
                            <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
                            Operational
                        </Badge>
                    </h1>
                    <p className="text-muted-foreground mt-1">Real-time production and compliance insights</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="bg-white" onClick={() => window.print()}>
                        <Download className="w-4 h-4 mr-2" />
                        Export Report
                    </Button>
                </div>
            </div>

            {/* Main Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="grid w-full grid-cols-7 bg-white/40 p-1 backdrop-blur-md rounded-xl border border-white/20 shadow-sm">
                    <TabsTrigger value="overview" className="flex items-center justify-center gap-2 data-[state=active]:bg-[#0A3225] data-[state=active]:text-white transition-all">
                        <BarChart3 className="h-4 w-4" />
                        <span className="hidden lg:inline">Overview</span>
                    </TabsTrigger>
                    <TabsTrigger value="approvals" className="flex items-center justify-center gap-2 data-[state=active]:bg-[#0A3225] data-[state=active]:text-white transition-all">
                        <FileCheck className="h-4 w-4" />
                        <span className="hidden lg:inline">Approvals</span>
                    </TabsTrigger>
                    <TabsTrigger value="production" className="flex items-center justify-center gap-2 data-[state=active]:bg-[#0A3225] data-[state=active]:text-white transition-all">
                        <Factory className="h-4 w-4" />
                        <span className="hidden lg:inline">Production</span>
                    </TabsTrigger>
                    <TabsTrigger value="compliance" className="flex items-center justify-center gap-2 data-[state=active]:bg-[#0A3225] data-[state=active]:text-white transition-all">
                        <Scale className="h-4 w-4" />
                        <span className="hidden lg:inline">Compliance</span>
                    </TabsTrigger>
                    <TabsTrigger value="analytics" className="flex items-center justify-center gap-2 data-[state=active]:bg-[#0A3225] data-[state=active]:text-white transition-all">
                        <BarChart3 className="h-4 w-4" />
                        <span className="hidden lg:inline">Analytics</span>
                    </TabsTrigger>
                    <TabsTrigger value="alerts" className="flex items-center justify-center gap-2 data-[state=active]:bg-[#0A3225] data-[state=active]:text-white transition-all">
                        <AlertCircle className="h-4 w-4" />
                        <span className="hidden lg:inline">Alerts</span>
                    </TabsTrigger>
                    <TabsTrigger value="reports" className="flex items-center justify-center gap-2 data-[state=active]:bg-[#0A3225] data-[state=active]:text-white transition-all">
                        <FileText className="h-4 w-4" />
                        <span className="hidden lg:inline">Reports</span>
                    </TabsTrigger>
                </TabsList>

                {/* --- OVERVIEW TAB --- */}
                <TabsContent value="overview" className="space-y-6">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                        <StatCard
                            title="Total Production"
                            value="128.5 MT"
                            change="+8.2%"
                            changeType="positive"
                            icon={Factory}
                        />
                        <StatCard
                            title="Avg. Compliance"
                            value="94.2%"
                            change="+1.5%"
                            changeType="positive"
                            icon={Scale}
                        />
                        <StatCard
                            title="Active Alerts"
                            value="2"
                            change="High Priority"
                            changeType="negative"
                            icon={AlertCircle}
                        />
                        <StatCard
                            title="Logistics"
                            value="12 Orders"
                            change="On Time"
                            changeType="positive"
                            icon={Truck}
                        />
                    </div>

                    {/* Quick Actions Card */}
                    <Card className="border-[#0A3225]/20 shadow-sm">
                        <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                            <div>
                                <h2 className="text-xl font-bold mb-1 text-[#0A3225]">Management Actions</h2>
                                <p className="text-[#0A3225] text-sm">Direct access to mill operations.</p>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                <Button onClick={() => setActiveTab('approvals')} variant="outline" className="border-[#0A3225]/20 hover:bg-[#0A3225]/5 text-[#0A3225]">
                                    <FileCheck className="mr-2 h-4 w-4" /> Approve Batches
                                </Button>
                                <Button onClick={() => setActiveTab('production')} variant="outline" className="border-orange-200 hover:bg-orange-50 text-orange-700">
                                    <Factory className="mr-2 h-4 w-4" /> Production Logs
                                </Button>
                                <Button onClick={() => setActiveTab('compliance')} variant="outline" className="border-green-200 hover:bg-green-50 text-green-700">
                                    <Scale className="mr-2 h-4 w-4" /> Compliance Check
                                </Button>
                                <Button onClick={() => setActiveTab('analytics')} variant="outline" className="border-orange/20 hover:bg-orange/5 text-orange">
                                    <BarChart3 className="mr-2 h-4 w-4" /> View Analytics
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Chart Area */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <Card className="col-span-2 glass-card border-none shadow-sm">
                            <CardHeader>
                                <CardTitle>Production Trends</CardTitle>
                            </CardHeader>
                            <CardContent className="h-[350px] min-w-0">
                                <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                                    <BarChart data={productionTrend} barGap={8}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e5e5" />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                        <YAxis axisLine={false} tickLine={false} />
                                        <Tooltip contentStyle={{ borderRadius: '8px', border: 'none' }} />
                                        <Bar dataKey="maize" name="Maize Flour" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                        <Bar dataKey="rice" name="Fortified Rice" fill="#10b981" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        <Card className="glass-card border-none shadow-sm">
                            <CardHeader>
                                <CardTitle>Compliance Status</CardTitle>
                            </CardHeader>
                            <CardContent className="h-[350px] relative min-w-0">
                                <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                                    <PieChart>
                                        <Pie
                                            data={complianceData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={80}
                                            outerRadius={110}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {complianceData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                    <span className="text-3xl font-bold text-gray-900">92%</span>
                                    <span className="text-xs text-muted-foreground uppercase tracking-wider">Overall Score</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* --- APPROVALS TAB --- */}
                <TabsContent value="approvals">
                    <BatchApprovalModule />
                </TabsContent>

                {/* --- PRODUCTION TAB --- */}
                <TabsContent value="production">
                    <ProductionView />
                </TabsContent>

                {/* --- COMPLIANCE TAB --- */}
                <TabsContent value="compliance">
                    <ComplianceView />
                </TabsContent>

                {/* --- ANALYTICS TAB --- */}
                <TabsContent value="analytics">
                    <AnalyticsView />
                </TabsContent>

                {/* --- ALERTS TAB --- */}
                <TabsContent value="alerts">
                    <AlertsView />
                </TabsContent>

                {/* --- REPORTS TAB --- */}
                <TabsContent value="reports">
                    <ReportsView />
                </TabsContent>

            </Tabs>
        </div>
    )
}

function StatCard({ title, value, change, changeType, icon: Icon }: any) {
    return (
        <Card className="glass-card border-none shadow-sm hover:shadow-lg transition-all">
            <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-gray-50 rounded-xl text-gray-600">
                        <Icon className="w-6 h-6" />
                    </div>
                    <span className={`flex items-center text-xs font-semibold px-2.5 py-1 rounded-full ${changeType === 'positive' ? 'bg-green-50 text-green-700' :
                        changeType === 'negative' ? 'bg-red-50 text-red-700' : 'bg-gray-100 text-gray-600'
                        }`}>
                        {changeType === 'positive' && <ArrowUpRight className="w-3 h-3 mr-1" />}
                        {change}
                    </span>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-1 tracking-tight">{value}</h3>
                <p className="text-sm text-gray-500 font-medium">{title}</p>
            </CardContent>
        </Card>
    )
}
