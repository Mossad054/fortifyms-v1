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
    ChevronRight, Activity, TrendingUp, LayoutDashboard, FileText, list
} from 'lucide-react'
import { ScheduleView, AuditsView, FlagsView } from './views'

export default function InspectorDashboard() {
    const router = useRouter()
    const [activeTab, setActiveTab] = React.useState('overview')

    return (
        <div className="p-6 space-y-8 max-w-[1600px] mx-auto min-h-screen bg-[#F0EFEA]/30">

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 glass-panel p-6 rounded-2xl">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                        <ShieldCheck className="w-8 h-8 text-green-600" />
                        Inspector Portal
                    </h1>
                    <p className="text-gray-600 mt-2">Manage audits, verify compliance, and track issues</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="bg-white/50" onClick={() => router.push('/analytics')}>
                        <MapPin className="w-4 h-4 mr-2" />
                        View Map
                    </Button>
                </div>
            </div>

            {/* Main Tabs Navigation */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="grid w-full grid-cols-3 md:w-[400px] bg-white/40 p-1 backdrop-blur-md rounded-xl border border-white/20 shadow-sm">
                    <TabsTrigger value="overview" className="flex items-center gap-2">
                        <LayoutDashboard className="h-4 w-4" />
                        Overview
                    </TabsTrigger>
                    <TabsTrigger value="audits" className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Audits
                    </TabsTrigger>
                    <TabsTrigger value="schedule" className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Schedule
                    </TabsTrigger>
                </TabsList>

                {/* --- OVERVIEW TAB --- */}
                <TabsContent value="overview" className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Schedule Summary */}
                    <div className="lg:col-span-2 space-y-6">
                        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-gray-500" />
                            Upcoming Schedule
                        </h2>
                        <ScheduleView />
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
                </TabsContent>

                {/* --- AUDITS TAB --- */}
                <TabsContent value="audits">
                    <div className="max-w-4xl">
                        <AuditsView />
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

            </Tabs>
        </div>
    )
}
