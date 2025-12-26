'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import {
    Activity, ClipboardCheck, Factory, Play, AlertTriangle,
    ShieldCheck, Microscope, Wrench, GraduationCap, ArrowRight,
    TrendingUp, CheckCircle2, AlertOctagon, Calendar, CheckSquare,
    MoreHorizontal, Target
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, AreaChart, Area
} from 'recharts'
import { ScrollArea } from '@/components/ui/scroll-area'

// --- MOCK DATA ---
const KPI_DATA = [
    { label: "Today's Output", value: '1,350 kg', change: '-0.5%', trend: 'down', icon: Factory, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'QC Pass Rate', value: '98.5%', change: '+2.0%', trend: 'up', icon: ShieldCheck, color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'Efficiency', value: '94.2%', change: '+1.5%', trend: 'up', icon: Activity, color: 'text-purple-600', bg: 'bg-purple-100' },
    { label: 'Active Alerts', value: '2', change: '', trend: 'neutral', icon: AlertOctagon, color: 'text-red-600', bg: 'bg-red-100' },
]

const PRODUCTION_DATA = [
    { name: 'Mon', output: 1200, yield: 95 },
    { name: 'Tue', output: 1450, yield: 94 },
    { name: 'Wed', output: 1100, yield: 96 },
    { name: 'Thu', output: 1600, yield: 93 },
    { name: 'Fri', output: 1350, yield: 95 },
    { name: 'Sat', output: 900, yield: 97 },
]

const HISTORY_DATA = [
    { id: 'B-2024-089', product: 'Maize Flour', date: 'Today, 08:00 AM', status: 'In Progress', output: '450kg' },
    { id: 'B-2024-088', product: 'Maize Flour', date: 'Yesterday', status: 'Completed', output: '1,200kg' },
    { id: 'B-2024-087', product: 'Rice', date: 'Yesterday', status: 'Completed', output: '850kg' },
    { id: 'B-2024-086', product: 'Maize Flour', date: '2 days ago', status: 'Flagged', output: '1,100kg' },
]

const INITIAL_TASKS = [
    { id: 1, title: 'Iron Spot Test Due', desc: 'Line 2 - Scheduled QC', type: 'qc', priority: 'high', done: false },
    { id: 2, title: 'Doser Calibration', desc: 'Maintenance detected drift', type: 'maintenance', priority: 'critical', done: false },
    { id: 3, title: 'Sign-off Batch #B-088', desc: 'Missing shift supervisor signature', type: 'batch', priority: 'normal', done: false },
]

interface OverviewProps {
    setActiveTab: (tab: string) => void
}

export function OverviewCommandCenter({ setActiveTab }: OverviewProps) {
    const [tasks, setTasks] = React.useState(INITIAL_TASKS)

    const handleTaskComplete = (id: number) => {
        setTasks(tasks.map(t => t.id === id ? { ...t, done: true } : t))
        // In a real app, this would call an API
    }

    const activeTaskCount = tasks.filter(t => !t.done).length

    return (
        <div className="space-y-6 h-full flex flex-col">

            {/* 1. KPI GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 shrink-0">
                {KPI_DATA.map((kpi, i) => (
                    <Card key={i} className="hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">{kpi.label}</CardTitle>
                            <div className={`p-2 rounded-full ${kpi.bg}`}>
                                <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{kpi.value}</div>
                            {kpi.change && (
                                <p className={`text-xs flex items-center mt-1 ${kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                                    {kpi.trend === 'up' ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingUp className="w-3 h-3 mr-1 rotate-180" />}
                                    {kpi.change} from yesterday
                                </p>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* 2. QUICK ACTIONS CARD (SCROLLING BREAKER) */}
            <Card className="border-zinc-200 shadow-sm shrink-0">
                <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                        <h2 className="text-xl font-bold mb-1 text-zinc-900">Operator Command Center</h2>
                        <p className="text-zinc-500 text-sm">Select a workflow to begin operations.</p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <Button onClick={() => setActiveTab('production')} variant="outline" className="border-blue-200 hover:bg-blue-50 text-blue-700">
                            <Factory className="mr-2 h-4 w-4" /> Start Batch
                        </Button>
                        <Button onClick={() => setActiveTab('production')} variant="outline" className="border-green-200 hover:bg-green-50 text-green-700">
                            <Microscope className="mr-2 h-4 w-4" /> Record QC
                        </Button>
                        <Button onClick={() => setActiveTab('maintenance')} variant="outline" className="border-orange-200 hover:bg-orange-50 text-orange-700">
                            <Wrench className="mr-2 h-4 w-4" /> Maintenance
                        </Button>
                        <Button onClick={() => setActiveTab('diagnostics')} variant="outline" className="border-red-200 hover:bg-red-50 text-red-700">
                            <Activity className="mr-2 h-4 w-4" /> Diagnostics
                        </Button>
                        <Button onClick={() => setActiveTab('training')} variant="outline" className="border-purple-200 hover:bg-purple-50 text-purple-700">
                            <GraduationCap className="mr-2 h-4 w-4" /> Learn
                        </Button>
                    </div>
                </CardContent>
            </Card>


            {/* 3. CHARTS & HISTORY (50/50 ROW) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[300px] shrink-0">
                {/* Chart */}
                <Card className="flex flex-col">
                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                            <Activity className="w-4 h-4 text-blue-600" /> Output vs. Yield Trends
                        </CardTitle>
                        <CardDescription>7-Day Performance Analysis</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 min-h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={PRODUCTION_DATA}>
                                <defs>
                                    <linearGradient id="colorOutput" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={12} tickMargin={10} />
                                <YAxis axisLine={false} tickLine={false} fontSize={12} tickFormatter={(value) => `${value}kg`} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Area type="monotone" dataKey="output" stroke="#2563eb" fillOpacity={1} fill="url(#colorOutput)" strokeWidth={2} activeDot={{ r: 6 }} />
                                {/* Yield line could be a separate axis or just visual context, simplifying for mock */}
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Production History */}
                <Card className="flex flex-col">
                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                            <Factory className="w-4 h-4 text-purple-600" /> Recent Production
                        </CardTitle>
                        <CardDescription>Latest batch logs and status</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0 flex-1">
                        <ScrollArea className="h-[250px]">
                            <div className="divide-y">
                                {HISTORY_DATA.map(batch => (
                                    <div key={batch.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium text-sm text-zinc-900">{batch.product}</span>
                                                <Badge variant="outline" className="text-[10px] h-5 px-1.5">{batch.id}</Badge>
                                            </div>
                                            <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                                                <Calendar className="w-3 h-3" /> {batch.date}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <Badge className={`mb-1 ${batch.status === 'Completed' ? 'bg-green-100 text-green-700 hover:bg-green-100' : batch.status === 'Flagged' ? 'bg-red-100 text-red-700 hover:bg-red-100' : 'bg-blue-100 text-blue-700 hover:bg-blue-100'}`}>
                                                {batch.status}
                                            </Badge>
                                            <p className="text-xs font-medium text-zinc-600">{batch.output}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </CardContent>
                    <CardFooter className="border-t p-2">
                        <Button variant="ghost" size="sm" className="w-full text-xs" onClick={() => setActiveTab('production')}>View All Batches <ArrowRight className="w-3 h-3 ml-1" /></Button>
                    </CardFooter>
                </Card>
            </div>

            {/* 4. TASKS & ALERTS (Fills remaining height) */}
            <Card className="flex-1 flex flex-col border-orange-200 bg-orange-50/30">
                <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                        <CardTitle className="text-base flex items-center gap-2 text-orange-900">
                            <Target className="w-4 h-4 text-orange-600" /> Task & Alert Management
                        </CardTitle>
                        <Badge variant="secondary" className="bg-orange-100 text-orange-700">{activeTaskCount} Pending</Badge>
                    </div>
                    <CardDescription>Operational items satisfying "Intelligence Layer" summary.</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 overflow-auto p-4">
                    <div className="space-y-3">
                        {tasks.filter(t => !t.done).length === 0 ? (
                            <div className="text-center py-10 text-muted-foreground flex flex-col items-center">
                                <CheckCircle2 className="w-10 h-10 text-green-500 mb-3 opacity-50" />
                                <p>All caught up! No pending alerts.</p>
                            </div>
                        ) : (
                            tasks.filter(t => !t.done).map(task => (
                                <div key={task.id} className="bg-white border rounded-lg p-4 shadow-sm flex items-start gap-4">
                                    <div className={`mt-1 p-2 rounded-full ${task.priority === 'critical' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                                        {task.type === 'qc' ? <Microscope className="w-4 h-4" /> : task.type === 'maintenance' ? <Wrench className="w-4 h-4" /> : <ClipboardCheck className="w-4 h-4" />}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <h4 className="font-bold text-zinc-900">{task.title}</h4>
                                            {task.priority === 'critical' && <Badge variant="destructive" className="h-5 text-[10px]">CRITICAL</Badge>}
                                        </div>
                                        <p className="text-sm text-zinc-600 mt-1">{task.desc}</p>
                                        <div className="mt-3 flex gap-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="h-7 text-xs border-green-200 hover:bg-green-50 text-green-700"
                                                onClick={() => handleTaskComplete(task.id)}
                                            >
                                                <CheckSquare className="w-3 h-3 mr-1.5" /> Mark Done
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                className="h-7 text-xs"
                                                onClick={() => setActiveTab(task.type === 'qc' || task.type === 'batch' ? 'production' : task.type)}
                                            >
                                                View Details <ArrowRight className="w-3 h-3 ml-1" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
