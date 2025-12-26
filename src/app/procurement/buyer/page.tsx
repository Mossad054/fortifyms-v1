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
import { RFPListView, SpendAnalysisView } from './views'

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
                <Button
                    variant="premium"
                    size="lg"
                    className="shadow-lg shadow-green-900/10"
                    onClick={() => router.push('/procurement/rfp/new')}
                >
                    Create New RFP
                </Button>
            </div>

            {/* Main Tabs Navigation */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="grid w-full grid-cols-4 md:w-[600px] bg-white/40 p-1 backdrop-blur-md rounded-xl border border-white/20 shadow-sm">
                    <TabsTrigger value="overview" className="flex items-center gap-2">
                        <LayoutDashboard className="h-4 w-4" />
                        Overview
                    </TabsTrigger>
                    <TabsTrigger value="rfps" className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        RFPs
                    </TabsTrigger>
                    <TabsTrigger value="spend" className="flex items-center gap-2">
                        <BarChart className="h-4 w-4" />
                        Analytics
                    </TabsTrigger>
                    <TabsTrigger value="settings" className="flex items-center gap-2">
                        <Settings className="h-4 w-4" />
                        Settings
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

                {/* --- RFPS TAB --- */}
                <TabsContent value="rfps">
                    <RFPListView />
                </TabsContent>

                {/* --- SPEND TAB --- */}
                <TabsContent value="spend">
                    <SpendAnalysisView />
                </TabsContent>

                {/* --- SETTINGS TAB --- */}
                <TabsContent value="settings">
                    <Card><CardContent className="p-10 text-center text-muted-foreground">Supplier Management & preferences coming soon.</CardContent></Card>
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
