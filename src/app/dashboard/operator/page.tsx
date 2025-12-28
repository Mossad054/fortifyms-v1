'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
    AreaChart, Area, CartesianGrid
} from 'recharts'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    ArrowUpRight, ArrowDownRight, Package, CheckCircle2,
    AlertTriangle, Clock, Activity, TrendingUp, Factory, QrCode, ClipboardCheck, Bell,
    Search, Menu, User, Play, Pause, RotateCcw, ChevronRight, Calendar
} from 'lucide-react'
import { BatchesListView } from './views'
import { DiagnosticsView, MaintenanceView, TrainingView } from './extended-views'
import { BatchProductionModule, QCControlModule, TraceabilityModule } from './production-modules'
import { OverviewCommandCenter } from './overview-view'

// Mock Data
const productionData = [
    { name: 'Mon', output: 1200, yield: 95 },
    { name: 'Tue', output: 1450, yield: 94 },
    { name: 'Wed', output: 1100, yield: 96 },
    { name: 'Thu', output: 1600, yield: 93 },
    { name: 'Fri', output: 1350, yield: 95 },
    { name: 'Sat', output: 900, yield: 97 },
]

function NotificationCenter() {
    const alerts = [
        { id: 1, title: 'Compliance Alert', msg: 'Doser calibration overdue by 2 days.', type: 'critical', time: '2h ago' },
        { id: 2, title: 'New Course', msg: 'Advanced Premix Handling module available.', type: 'info', time: '5h ago' },
        { id: 3, title: 'System Update', msg: 'Maintenance scheduled for tonight.', type: 'default', time: '1d ago' },
    ]

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative rounded-full w-10 h-10">
                    <Bell className="w-6 h-6 text-zinc-600" />
                    <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>
                    <div className="flex justify-between items-center">
                        <span>Notifications</span>
                        <span className="text-xs text-muted-foreground font-normal">3 unread</span>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="max-h-[300px] overflow-y-auto">
                    {alerts.map(alert => (
                        <DropdownMenuItem key={alert.id} className="cursor-pointer flex flex-col items-start p-3 focus:bg-zinc-50">
                            <div className="flex w-full justify-between items-start mb-1">
                                <span className={`font-medium text-sm ${alert.type === 'critical' ? 'text-red-600' : 'text-zinc-900'}`}>
                                    {alert.title}
                                </span>
                                <span className="text-xs text-muted-foreground">{alert.time}</span>
                            </div>
                            <p className="text-xs text-zinc-500 leading-snug line-clamp-2">
                                {alert.msg}
                            </p>
                        </DropdownMenuItem>
                    ))}
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="justify-center text-xs text-muted-foreground cursor-pointer">
                    Mark all as read
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default function OperatorDashboard() {
    const [activeTab, setActiveTab] = React.useState('overview')
    const [maintenanceProps, setMaintenanceProps] = React.useState({})

    const handleCalibrationLaunch = () => {
        setMaintenanceProps({ initialMode: 'schedule', initialTaskType: 'Calibration' })
        setActiveTab('maintenance')
    }

    return (
        <div className="p-6 space-y-6 max-w-[1600px] mx-auto min-h-screen bg-white">
            {/* Header Section */}
            <div className="flex justify-between items-center mb-2">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-premium-dark">Operator Workspace</h1>
                    <p className="text-muted-foreground mt-1">Manage production, QC, and tracking from one place</p>
                </div>
                <div className="flex items-center gap-4">
                    <Badge variant="outline" className="px-3 py-1 bg-white/50 backdrop-blur-sm border-primary/20">
                        <Clock className="w-3 h-3 mr-2" />
                        Shift A: 06:00 - 14:00
                    </Badge>
                    <NotificationCenter />
                </div>
            </div>

            {/* Main Tabs Navigation */}
            <Tabs value={activeTab} onValueChange={(v) => { setActiveTab(v); setMaintenanceProps({}) }} className="space-y-6">
                <TabsList className="grid w-full grid-cols-6 lg:grid-cols-6 bg-white/60 p-1 backdrop-blur-md rounded-xl border border-white/20 shadow-sm">
                    <TabsTrigger
                        value="overview"
                        className="flex items-center gap-2 font-bold text-gray-600 data-[state=active]:bg-[#0A3225] data-[state=active]:text-white transition-all"
                    >
                        <Activity className="h-4 w-4" />
                        <span className="hidden lg:inline">Overview</span>
                    </TabsTrigger>
                    <TabsTrigger
                        value="production"
                        className="flex items-center gap-2 font-bold text-gray-600 data-[state=active]:bg-[#0A3225] data-[state=active]:text-white transition-all"
                    >
                        <Factory className="h-4 w-4" />
                        <span className="hidden lg:inline">Production</span>
                    </TabsTrigger>
                    <TabsTrigger
                        value="traceability"
                        className="flex items-center gap-2 font-bold text-gray-600 data-[state=active]:bg-[#0A3225] data-[state=active]:text-white transition-all"
                    >
                        <QrCode className="h-4 w-4" />
                        <span className="hidden lg:inline">Traceability</span>
                    </TabsTrigger>
                    <TabsTrigger
                        value="diagnostics"
                        className="flex items-center gap-2 font-bold text-gray-600 data-[state=active]:bg-[#0A3225] data-[state=active]:text-white transition-all"
                    >
                        <ArrowUpRight className="h-4 w-4" />
                        <span className="hidden lg:inline">Diagnostics</span>
                    </TabsTrigger>
                    <TabsTrigger
                        value="maintenance"
                        className="flex items-center gap-2 font-bold text-gray-600 data-[state=active]:bg-[#0A3225] data-[state=active]:text-white transition-all"
                    >
                        <AlertTriangle className="h-4 w-4" />
                        <span className="hidden lg:inline">Maintenance</span>
                    </TabsTrigger>
                    <TabsTrigger
                        value="training"
                        className="flex items-center gap-2 font-bold text-gray-600 data-[state=active]:bg-[#0A3225] data-[state=active]:text-white transition-all"
                    >
                        <CheckCircle2 className="h-4 w-4" />
                        <span className="hidden lg:inline">Training</span>
                    </TabsTrigger>
                </TabsList>

                {/* --- OVERVIEW TAB --- */}
                <TabsContent value="overview" className="h-[calc(100vh-200px)]">
                    <OverviewCommandCenter setActiveTab={(tab) => { setActiveTab(tab); setMaintenanceProps({}) }} />
                </TabsContent>

                {/* --- PRODUCTION TAB (Batch & QC Merged) --- */}
                <TabsContent value="production" className="h-[calc(100vh-200px)]">
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 h-full">
                        <BatchProductionModule />
                        <QCControlModule />
                    </div>
                </TabsContent>

                {/* --- TRACEABILITY TAB --- */}
                <TabsContent value="traceability">
                    <TraceabilityModule />
                </TabsContent>

                {/* --- DIAGNOSTICS TAB --- */}
                <TabsContent value="diagnostics">
                    <DiagnosticsView onNavigateToMaintenance={handleCalibrationLaunch} />
                </TabsContent>

                {/* --- MAINTENANCE TAB --- */}
                <TabsContent value="maintenance">
                    <MaintenanceView {...maintenanceProps} />
                </TabsContent>

                {/* --- TRAINING TAB --- */}
                <TabsContent value="training">
                    <TrainingView />
                </TabsContent>

            </Tabs>
        </div>
    )
}
