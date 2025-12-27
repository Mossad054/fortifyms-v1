'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
    ShoppingCart, Truck, FileCheck, ArrowUpRight,
    BarChart, LayoutDashboard, FileText, Settings
} from 'lucide-react'
import { MyProcurements } from './components/my-procurements'
import { SupplierPerformance } from './components/supplier-performance'
import { SpendAnalytics } from './components/spend-analytics'
import { QADashboard } from './components/qa-dashboard'
import { BuyerReports } from './components/buyer-reports'
import { RFPListView, SpendAnalysisView } from './views'
import { NotificationCenter } from '@/components/ui/notification-center'

export default function BuyerDashboard() {
    const router = useRouter()
    const [activeTab, setActiveTab] = React.useState('overview')

    return (
        <div className="p-6 space-y-8 max-w-[1600px] mx-auto min-h-screen bg-[#F0EFEA]/30">

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 glass-panel p-6 rounded-2xl">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                        <ShoppingCart className="w-8 h-8 text-green-600" />
                        Procurement Portal
                    </h1>
                    <p className="text-gray-600 mt-2">Manage RFPs, orders, and supplier relationships</p>
                </div>
                <div className="flex gap-3 items-center">
                    <NotificationCenter />
                    <Button
                        variant="premium"
                        size="lg"
                        className="shadow-lg shadow-green-900/10"
                        onClick={() => router.push('/procurement/rfp/new')}
                    >
                        Create New RFP
                    </Button>
                </div>
            </div>

            {/* Main Tabs Navigation */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="grid w-full grid-cols-6 bg-white/60 p-1 backdrop-blur-md rounded-xl border border-white/20 shadow-sm">
                    <TabsTrigger
                        value="overview"
                        className="flex items-center gap-2 font-bold text-gray-600 data-[state=active]:bg-zinc-900 data-[state=active]:text-white transition-all"
                    >
                        <LayoutDashboard className="h-4 w-4" />
                        <span className="hidden lg:inline">Overview</span>
                    </TabsTrigger>
                    <TabsTrigger
                        value="procurements"
                        className="flex items-center gap-2 font-bold text-gray-600 data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all"
                    >
                        <ShoppingCart className="h-4 w-4" />
                        <span className="hidden lg:inline">Procurements</span>
                    </TabsTrigger>
                    <TabsTrigger
                        value="suppliers"
                        className="flex items-center gap-2 font-bold text-gray-600 data-[state=active]:bg-orange-500 data-[state=active]:text-white transition-all"
                    >
                        <Truck className="h-4 w-4" />
                        <span className="hidden lg:inline">Suppliers</span>
                    </TabsTrigger>
                    <TabsTrigger
                        value="spend"
                        className="flex items-center gap-2 font-bold text-gray-600 data-[state=active]:bg-green-600 data-[state=active]:text-white transition-all"
                    >
                        <BarChart className="h-4 w-4" />
                        <span className="hidden lg:inline">Analytics</span>
                    </TabsTrigger>
                    <TabsTrigger
                        value="qa"
                        className="flex items-center gap-2 font-bold text-gray-600 data-[state=active]:bg-purple-600 data-[state=active]:text-white transition-all"
                    >
                        <FileCheck className="h-4 w-4" />
                        <span className="hidden lg:inline">Quality</span>
                    </TabsTrigger>
                    <TabsTrigger
                        value="reports"
                        className="flex items-center gap-2 font-bold text-gray-600 data-[state=active]:bg-indigo-600 data-[state=active]:text-white transition-all"
                    >
                        <FileText className="h-4 w-4" />
                        <span className="hidden lg:inline">Reports</span>
                    </TabsTrigger>
                </TabsList>

                {/* --- OVERVIEW TAB --- */}
                <TabsContent value="overview" className="space-y-8">
                    {/* KPI Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <KPICard
                            title="Active RFPs"
                            value="5"
                            icon={FileCheck}
                            trend="+2 New"
                            color="blue"
                        />
                        <KPICard
                            title="Pending Deliveries"
                            value="12"
                            icon={Truck}
                            trend="3 Arriving Today"
                            color="orange"
                        />
                        <KPICard
                            title="Total Spend (YTD)"
                            value="$328k"
                            icon={BarChart}
                            trend="+12% vs Last Year"
                            color="green"
                        />
                    </div>

                    {/* Quick Actions Card */}
                    <Card className="border-green-200 shadow-sm">
                        <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                            <div>
                                <h2 className="text-xl font-bold mb-1 text-green-900">Procurement Actions</h2>
                                <p className="text-green-600 text-sm">Quick access to orders and suppliers.</p>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                <Button onClick={() => setActiveTab('procurements')} variant="outline" className="border-blue-200 hover:bg-blue-50 text-blue-700">
                                    <ShoppingCart className="mr-2 h-4 w-4" /> My Procurements
                                </Button>
                                <Button onClick={() => setActiveTab('suppliers')} variant="outline" className="border-orange-200 hover:bg-orange-50 text-orange-700">
                                    <Truck className="mr-2 h-4 w-4" /> Supplier Scorecards
                                </Button>
                                <Button onClick={() => setActiveTab('spend')} variant="outline" className="border-green-200 hover:bg-green-50 text-green-700">
                                    <BarChart className="mr-2 h-4 w-4" /> Make Decision
                                </Button>
                                <Button onClick={() => setActiveTab('qa')} variant="outline" className="border-purple-200 hover:bg-purple-50 text-purple-700">
                                    <FileCheck className="mr-2 h-4 w-4" /> Check Quality
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Integrated Views in Dashboard */}
                        <div className="col-span-2">
                            <RFPListView />
                        </div>
                        <div>
                            <SpendAnalysisView />
                        </div>
                    </div>
                </TabsContent>

                {/* --- MY PROCUREMENTS TAB --- */}
                <TabsContent value="procurements">
                    <MyProcurements />
                </TabsContent>

                {/* --- SUPPLIER PERFORMANCE TAB --- */}
                <TabsContent value="suppliers">
                    <SupplierPerformance />
                </TabsContent>

                {/* --- SPEND ANALYTICS TAB --- */}
                <TabsContent value="spend">
                    <SpendAnalytics />
                </TabsContent>

                {/* --- QUALITY ASSURANCE TAB --- */}
                <TabsContent value="qa">
                    <QADashboard />
                </TabsContent>

                {/* --- REPORTS TAB --- */}
                <TabsContent value="reports">
                    <BuyerReports />
                </TabsContent>

            </Tabs>
        </div>
    )
}

function KPICard({ title, value, icon: Icon, trend, color }: any) {
    const colorMap = {
        blue: 'bg-blue-50 text-blue-600',
        orange: 'bg-orange-50 text-orange-600',
        green: 'bg-green-50 text-green-600'
    }

    return (
        <Card className="glass-card border-none shadow-sm hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
                <div className="flex justify-between items-start">
                    <div className={`p-3 rounded-xl ${colorMap[color as keyof typeof colorMap]}`}>
                        <Icon className="w-6 h-6" />
                    </div>
                    <span className="flex items-center text-xs font-semibold text-green-700 bg-green-50 px-2 py-1 rounded-full">
                        <ArrowUpRight className="w-3 h-3 mr-1" />
                        {trend}
                    </span>
                </div>
                <div className="mt-4">
                    <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
                    <p className="text-sm text-gray-500 font-medium">{title}</p>
                </div>
            </CardContent>
        </Card>
    )
}
