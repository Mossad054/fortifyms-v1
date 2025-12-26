'use client'

import * as React from 'react'
import {
    AlertTriangle, CheckCircle2, Clock, Calendar, Plus,
    Filter, ChevronRight, ArrowLeft, Camera, FileText,
    Wrench, Activity, AlertOctagon, User, Send, Settings,
    Thermometer, Gauge, XCircle, Zap, BarChart3, Siren, ShieldCheck, Hammer
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
    Dialog, DialogContent, DialogDescription, DialogFooter,
    DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { AnimatePresence } from 'framer-motion'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

// --- IMPORTS ---
import { MaintenanceRegistry } from './maintenance-registry'
import { CentralMaintenanceCalendar } from './maintenance-calendar'
import { TaskExecutionWizard } from './task-execution-wizard'
import { MaintenanceApproval } from './maintenance-approval'
import { MaintenanceTask } from './maintenance-types'

// --- MOCK DATA ---
export const INITIAL_TASKS: MaintenanceTask[] = [
    {
        id: 't1',
        title: 'Daily Doser Calibration',
        product: 'Maize',
        equipment: 'Volumetric Doser A',
        type: 'Calibration',
        priority: 'Critical',
        status: 'Pending',
        dueDate: '2024-10-18', // Changed to ISO date for calendar
        requirements: {
            personnel: ['Senior Technician', 'Quality Officer'],
            parts: ['Doser Washer Set #4'],
            tools: ['Calibrated Scale (IS-200)', 'Spanner Set 12mm']
        },
        steps: [
            { id: 's0', text: 'Perform Lockout/Tagout (LOTO) procedure on Doser A', completed: false },
            { id: 's1', text: 'Clean doser nozzle and hopper thoroughly', completed: false },
            { id: 's2', text: 'Fill hopper with premix (>50% Level)', completed: false },
            { id: 's3', text: 'Run doser for 60s and weigh output', completed: false, isCalibration: true, calibrationTarget: 50 },
            { id: 's4', text: 'Verify weight is within tolerance (+/- 2%)', completed: false }
        ]
    },
    {
        id: 't2',
        title: 'Mixer Paddle Inspection',
        product: 'Rice',
        equipment: 'Continuous Blender',
        type: 'Inspection',
        priority: 'High',
        status: 'Pending',
        dueDate: '2024-10-18',
        requirements: {
            personnel: ['Mechanical Technician'],
            parts: ['Replacement Paddle Bolt (Optional)'],
            tools: ['Inspection Light', 'Feeler Gauge']
        },
        steps: [
            { id: 's1', text: 'Lockout/Tagout mixer power source', completed: false },
            { id: 's2', text: 'Open main inspection hatch securely', completed: false },
            { id: 's3', text: 'Check paddle tip clearance (<2mm gap)', completed: false },
            { id: 's4', text: 'Inspect shaft seals for leakage', completed: false }
        ]
    }
]

export function MaintenanceModule({ initialMode = 'dashboard', initialTaskType }: { initialMode?: 'dashboard' | 'execute' | 'schedule' | 'registry' | 'approval', initialTaskType?: 'Calibration' | 'Repair' | 'Inspection' }) {
    const [view, setView] = React.useState<'dashboard' | 'execute' | 'schedule' | 'registry' | 'manual-report' | 'approval'>(initialMode)
    const [tasks, setTasks] = React.useState<MaintenanceTask[]>(INITIAL_TASKS)
    const [activeTaskId, setActiveTaskId] = React.useState<string | null>(null)

    // Effect to handle prop changes if the parent changes them dynamically
    React.useEffect(() => {
        if (initialMode) setView(initialMode)
    }, [initialMode])

    // Predictive Maintenance Logic: Simulating drift detection
    React.useEffect(() => {
        const driftTimer = setTimeout(() => {
            // Only trigger if not already present
            if (!tasks.some(t => t.type === 'Predictive Alert')) {
                const alertTask: MaintenanceTask = {
                    id: `pred-${Date.now()}`,
                    title: 'Predictive Alert: Doser Drift Detected',
                    product: 'Maize',
                    equipment: 'Volumetric Doser A',
                    type: 'Predictive Alert',
                    priority: 'High',
                    status: 'Pending',
                    dueDate: new Date().toISOString().split('T')[0],
                    alertDetails: {
                        issue: 'Output variance +7% > calibrated value (sustained 4h)',
                        recommendation: 'Recalibrate doser immediately. Check for premix blockage.',
                        urgency: 'High'
                    },
                    requirements: {
                        personnel: ['Technician'],
                        parts: [],
                        tools: ['Standard Calibration Kit']
                    },
                    steps: [
                        { id: 'ps1', text: 'Acknowledge Alert', completed: false },
                        { id: 'ps2', text: 'Perform Immediate Calibration', completed: false, isCalibration: true, calibrationTarget: 50 },
                        { id: 'ps3', text: 'Verify Sensor Readings Normalized', completed: false }
                    ]
                }
                setTasks(prev => [alertTask, ...prev])
            }
        }, 15000) // Trigger after 15s for demo

        return () => clearTimeout(driftTimer)
    }, [tasks])

    const activeTask = tasks.find(t => t.id === activeTaskId)

    const handleCreateTask = (newTask: MaintenanceTask) => {
        setTasks([newTask, ...tasks])
        setView('dashboard')
    }

    const handleCompleteTask = (taskId: string, notes: string, status: 'Completed' | 'Escalated') => {
        setTasks(tasks.map(t => t.id === taskId ? { ...t, status: status, notes } : t))
        setView('dashboard')
    }

    return (
        <div className="space-y-6 flex flex-col h-full min-h-[600px]">
            <AnimatePresence mode='wait'>
                {view === 'dashboard' && (
                    <MaintenanceDashboard
                        tasks={tasks}
                        onCreate={() => setView('schedule')}
                        onReport={() => setView('manual-report')}
                        onExecute={(id: string) => { setActiveTaskId(id); setView('execute') }}
                        onOpenRegistry={() => setView('registry')}
                        onOpenApproval={() => setView('approval')}
                    />
                )}
                {view === 'registry' && (
                    <MaintenanceRegistry onBack={() => setView('dashboard')} />
                )}
                {view === 'schedule' && (
                    <TaskScheduler
                        defaultType={initialTaskType}
                        onCancel={() => setView('dashboard')}
                        onSave={handleCreateTask}
                    />
                )}
                {view === 'manual-report' && (
                    <ManualReportForm
                        onCancel={() => setView('dashboard')}
                        onSubmit={(task) => handleCreateTask(task)}
                    />
                )}
                {view === 'execute' && activeTask && (
                    <TaskExecutionWizard
                        task={activeTask}
                        onBack={() => setView('dashboard')}
                        onComplete={(notes, status) => handleCompleteTask(activeTask.id, notes, status)}
                    />
                )}
                {view === 'approval' && (
                    <MaintenanceApproval
                        tasks={tasks}
                        onApprove={(id, notes) => handleCompleteTask(id, notes, 'Completed')} // Use Completed for approve for now
                        onReject={(id, notes) => handleCompleteTask(id, notes, 'Pending')} // Revert to pending
                    />
                )}
            </AnimatePresence>
        </div>
    )
}

function MaintenanceDashboard({ tasks, onCreate, onReport, onExecute, onOpenRegistry, onOpenApproval }: any) {
    const [filterProduct, setFilterProduct] = React.useState('All')
    const [viewMode, setViewMode] = React.useState<'list' | 'calendar'>('list')

    // Derived state
    const criticalCount = tasks.filter((t: any) => t.priority === 'Critical' && t.status === 'Pending').length
    const predictiveAlerts = tasks.filter((t: any) => t.type === 'Predictive Alert' && t.status === 'Pending')

    const filteredTasks = tasks.filter((t: any) => {
        const matchProduct = filterProduct === 'All' || t.product === filterProduct
        const matchStatus = t.status === 'Pending' || t.status === 'In Progress'
        return matchProduct && matchStatus
    })

    return (
        <div className="space-y-6 flex flex-col h-full">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 shrink-0">
                <Card className="bg-white border-zinc-200 shadow-sm cursor-pointer hover:border-blue-300 transition-colors" onClick={onOpenRegistry}>
                    <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-zinc-500">Equipment Registry</CardTitle></CardHeader>
                    <CardContent className="flex items-center justify-between">
                        <div className="text-2xl font-bold text-zinc-900">32</div>
                        <Settings className="w-5 h-5 text-gray-400" />
                    </CardContent>
                </Card>
                <Card className={`border-zinc-200 shadow-sm ${predictiveAlerts.length > 0 ? 'bg-orange-50 border-orange-200' : 'bg-white'}`}>
                    <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-zinc-500">Predictive Alerts</CardTitle></CardHeader>
                    <CardContent className="flex items-center justify-between">
                        <div className={`text-2xl font-bold ${predictiveAlerts.length > 0 ? 'text-orange-600' : 'text-zinc-900'}`}>{predictiveAlerts.length}</div>
                        <Siren className={`w-5 h-5 ${predictiveAlerts.length > 0 ? 'text-orange-500 animate-pulse' : 'text-gray-400'}`} />
                    </CardContent>
                </Card>
                <Card className={`border-zinc-200 shadow-sm ${criticalCount > 0 ? 'bg-red-50 border-red-100' : 'bg-white'}`}>
                    <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-zinc-500">Critical Issues</CardTitle></CardHeader>
                    <CardContent>
                        <div className={`text-2xl font-bold ${criticalCount > 0 ? 'text-red-600' : 'text-zinc-900'}`}>{criticalCount}</div>
                    </CardContent>
                </Card>
                <Card className="bg-white border-zinc-200 shadow-sm cursor-pointer hover:border-blue-300 transition-colors" onClick={onOpenApproval}>
                    <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-zinc-500">Approvals</CardTitle></CardHeader>
                    <CardContent className="flex items-center justify-between">
                        <div className="text-2xl font-bold text-zinc-900">{tasks.filter((t: any) => t.status === 'Completed' || t.status === 'Escalated').length}</div>
                        <ShieldCheck className="w-5 h-5 text-gray-400" />
                    </CardContent>
                </Card>
            </div>

            {/* Main Content */}
            <Card className="border-none shadow-sm flex-1 flex flex-col overflow-hidden min-h-[400px]">
                <CardHeader className="flex flex-row items-center justify-between shrink-0 py-4">
                    <div>
                        <CardTitle>Maintenance Schedule</CardTitle>
                        <CardDescription>Tasks, alerts, and preventive actions</CardDescription>
                    </div>
                    <div className="flex gap-2">
                        <div className="flex bg-slate-100 p-1 rounded-lg">
                            <button className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${viewMode === 'list' ? 'bg-white shadow-sm' : 'text-muted-foreground'}`} onClick={() => setViewMode('list')}>List</button>
                            <button className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${viewMode === 'calendar' ? 'bg-white shadow-sm' : 'text-muted-foreground'}`} onClick={() => setViewMode('calendar')}>Calendar</button>
                        </div>
                        <Button variant="outline" className="border-red-200 text-red-700 hover:bg-red-50" onClick={onReport}>
                            <AlertTriangle className="w-4 h-4 mr-2" /> Report Issue
                        </Button>
                        <Button onClick={onCreate}><Plus className="w-4 h-4 mr-2" /> Schedule</Button>
                    </div>
                </CardHeader>
                <CardContent className="flex-1 overflow-hidden p-0 relative">
                    {viewMode === 'list' ? (
                        <div className="h-full flex flex-col p-6 pt-0">
                            <Tabs value={filterProduct} onValueChange={setFilterProduct} className="mb-4 shrink-0">
                                <TabsList>
                                    <TabsTrigger value="All">All Products</TabsTrigger>
                                    <TabsTrigger value="Maize">Maize</TabsTrigger>
                                    <TabsTrigger value="Rice">Rice</TabsTrigger>
                                </TabsList>
                            </Tabs>
                            <ScrollArea className="flex-1 pr-4 -mr-4">
                                <div className="space-y-3 pb-20 pr-4">
                                    {predictiveAlerts.map((task: any) => (
                                        <div key={task.id} className="border-l-4 border-l-orange-500 bg-orange-50 p-4 rounded-r-xl shadow-sm mb-4 animate-in slide-in-from-left-2">
                                            <div className="flex justify-between items-start">
                                                <div className="flex gap-3">
                                                    <div className="mt-1 bg-orange-200 p-2 rounded-full text-orange-700"><Zap className="w-5 h-5" /></div>
                                                    <div>
                                                        <h4 className="font-bold text-orange-900">{task.title}</h4>
                                                        <p className="text-sm text-orange-800 mt-1">{task.alertDetails?.issue}</p>
                                                        <p className="text-xs text-orange-700 mt-2 font-medium">Recommendation: {task.alertDetails?.recommendation}</p>
                                                        <div className="flex gap-2 mt-3">
                                                            <Button size="sm" className="bg-orange-600 hover:bg-orange-700 text-white border-none" onClick={() => onExecute(task.id)}>
                                                                Respond Now <ChevronRight className="w-4 h-4 ml-1" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                                <Badge variant="outline" className="bg-white border-orange-200 text-orange-700">Predictive Alert</Badge>
                                            </div>
                                        </div>
                                    ))}

                                    {filteredTasks.filter((t: any) => t.type !== 'Predictive Alert').map((task: any) => (
                                        <div key={task.id} className="flex items-center justify-between p-4 bg-white border rounded-xl hover:shadow-md transition-all group">
                                            <div className="flex items-center gap-4">
                                                <div className={`p-3 rounded-full ${task.type === 'Calibration' ? 'bg-blue-100 text-blue-600' :
                                                    task.priority === 'Critical' ? 'bg-red-100 text-red-600' : 'bg-zinc-100 text-zinc-600'
                                                    }`}>
                                                    {task.type === 'Calibration' ? <Activity className="w-5 h-5" /> : <Wrench className="w-5 h-5" />}
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-zinc-900 group-hover:text-primary transition-colors">{task.title}</h4>
                                                    <div className="flex gap-2 text-xs text-zinc-500 mt-1">
                                                        <Badge variant="outline" className="font-normal">{task.equipment}</Badge>
                                                        <span className="flex items-center text-orange-600 bg-orange-50 px-1 rounded"><Calendar className="w-3 h-3 mr-1" /> {task.dueDate}</span>
                                                        {task.priority === 'Critical' && <Badge variant="destructive" className="h-5 px-1.5 text-[10px]">Critical</Badge>}
                                                    </div>
                                                </div>
                                            </div>
                                            {task.status === 'Completed' ? (
                                                <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100">Completed</Badge>
                                            ) : (
                                                <Button size="sm" variant="ghost" className="hover:bg-slate-100" onClick={() => onExecute(task.id)}>Start <ChevronRight className="w-4 h-4 ml-1" /></Button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </ScrollArea>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col">
                            <CentralMaintenanceCalendar tasks={tasks} onTaskSelect={(t) => onExecute(t.id)} />
                        </div>
                    )}
                </CardContent>
            </Card >
        </div>
    )
}

function TaskScheduler({ onCancel, onSave, defaultType = 'Repair' }: { onCancel: () => void, onSave: (task: MaintenanceTask) => void, defaultType?: string }) {
    const [title, setTitle] = React.useState('')
    const [equipment, setEquipment] = React.useState('')
    const [priority, setPriority] = React.useState<'Low' | 'Medium' | 'High' | 'Critical'>('Medium')

    // New Advanced Fields
    const [duration, setDuration] = React.useState('60')
    const [selectedSlot, setSelectedSlot] = React.useState<string | null>(null)

    // Mock Recommended Slots (Point 3: Maintenance Windows Optimization)
    const recommendedSlots = [
        { id: 'slot1', date: 'Tomorrow, 10:00 AM', reason: 'Production Downtime (Planned)', score: 98 },
        { id: 'slot2', date: 'Fri, 2:00 PM', reason: 'Low Line Utilization', score: 85 },
        { id: 'slot3', date: 'Sat, 8:00 AM', reason: 'Non-Production Hours', score: 95 },
    ]

    const handleSubmit = () => {
        onSave({
            id: `new-${Date.now()}`,
            title,
            product: 'General',
            equipment,
            type: (defaultType as any),
            priority,
            status: 'Pending',
            dueDate: selectedSlot ? selectedSlot.split(',')[0] : new Date().toISOString().split('T')[0],
            requirements: {
                personnel: ['Assigned Technician'],
                parts: ['Standard Kit'],
                tools: ['Basic Tools']
            },
            steps: [{ id: 's1', text: 'Inspect and assess', completed: false }]
        })
    }

    return (
        <div className="h-full flex items-center justify-center p-4">
            <Card className="w-full max-w-4xl shadow-xl border-t-4 border-t-blue-600 h-[90vh] flex flex-col">
                <CardHeader className="shrink-0">
                    <CardTitle className="text-xl">Schedule Maintenance Task</CardTitle>
                    <CardDescription>Create a new work order with optimized timing suggestions.</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 overflow-y-auto space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Left Column: Basic Details */}
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <Label>Task Title</Label>
                                <Input placeholder="e.g. Replace Doser Seals" value={title} onChange={e => setTitle(e.target.value)} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Equipment</Label>
                                    <Select onValueChange={setEquipment}>
                                        <SelectTrigger><SelectValue placeholder="Select Asset" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Volumetric Doser A">Volumetric Doser A</SelectItem>
                                            <SelectItem value="Mixer">Mixer</SelectItem>
                                            <SelectItem value="Feeder">Feeder</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Est. Duration (min)</Label>
                                    <Input type="number" value={duration} onChange={e => setDuration(e.target.value)} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Priority Level</Label>
                                <div className="grid grid-cols-4 gap-2">
                                    {['Low', 'Medium', 'High', 'Critical'].map((p) => (
                                        <div key={p}
                                            onClick={() => setPriority(p as any)}
                                            className={`cursor-pointer border rounded-lg p-2 text-center text-sm transition-all ${priority === p ? 'bg-slate-900 text-white ring-2 ring-slate-900 ring-offset-1' : 'hover:bg-slate-50'}`}
                                        >
                                            {p}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Required Resources</Label>
                                <div className="bg-slate-50 p-3 rounded-md border text-xs text-zinc-600 space-y-2">
                                    <div className="flex justify-between">
                                        <span>Available Personnel:</span>
                                        <span className="text-green-600 font-bold">3 Techs On-Site</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Parts Availability:</span>
                                        <span className="text-green-600 font-bold">In Stock</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: AI Optimization */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="p-1.5 bg-purple-100 text-purple-700 rounded-md"><Zap className="w-4 h-4" /></div>
                                <h3 className="font-semibold text-zinc-900">Optimization Engine</h3>
                            </div>

                            <div className="space-y-3">
                                <Label>Recommended Time Slots</Label>
                                {recommendedSlots.map(slot => (
                                    <div
                                        key={slot.id}
                                        onClick={() => setSelectedSlot(slot.date)}
                                        className={`p-3 rounded-lg border cursor-pointer hover:border-purple-300 transition-all ${selectedSlot === slot.date ? 'bg-purple-50 border-purple-500 ring-1 ring-purple-500' : 'bg-white'}`}
                                    >
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <div className="font-bold text-zinc-800">{slot.date}</div>
                                                <div className="text-xs text-zinc-500 mt-0.5">{slot.reason}</div>
                                            </div>
                                            <Badge variant="secondary" className="bg-purple-100 text-purple-700">{slot.score}% Optimal</Badge>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-white px-2 text-muted-foreground">Or Manual Selection</span>
                                </div>
                            </div>

                            <div className="pt-2">
                                <Input type="date" className="w-full" />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Detailed Instructions</Label>
                        <Textarea className="min-h-[80px]" placeholder="Add specific notes, error codes, or SOP references..." />
                    </div>
                </CardContent>
                <CardFooter className="justify-between border-t p-6 bg-slate-50 rounded-b-xl shrink-0">
                    <Button variant="ghost" onClick={onCancel}>Cancel</Button>
                    <Button size="lg" onClick={handleSubmit} disabled={!title || !equipment} className="bg-blue-600 hover:bg-blue-700 px-8">
                        Confirm Schedule
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}

function ManualReportForm({ onCancel, onSubmit }: { onCancel: () => void, onSubmit: (t: MaintenanceTask) => void }) {
    const [equipment, setEquipment] = React.useState('')
    const [issue, setIssue] = React.useState('')
    const [severity, setSeverity] = React.useState<'Minor' | 'Moderate' | 'Severe'>('Minor')

    const handleSubmit = () => {
        onSubmit({
            id: `rep-${Date.now()}`,
            title: `Reported Issue: ${equipment}`,
            product: 'General',
            equipment,
            type: 'Repair',
            priority: severity === 'Severe' ? 'Critical' : severity === 'Moderate' ? 'High' : 'Medium',
            status: 'Pending',
            dueDate: 'Immediate',
            notes: issue,
            steps: [{ id: 'r1', text: 'Investigate reported issue', completed: false }]
        })
    }

    return (
        <div className="h-full flex items-center justify-center p-4">
            <Card className="w-full max-w-lg shadow-xl border-t-4 border-t-red-600">
                <CardHeader>
                    <div className="flex items-center gap-2 text-red-600 mb-2">
                        <AlertTriangle className="w-5 h-5" />
                        <span className="font-bold uppercase text-xs tracking-wider">Issue Report</span>
                    </div>
                    <CardTitle>Report Equipment Issue</CardTitle>
                    <CardDescription>Manually log an observation or malfunction when sensors are unavailable.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Affected Equipment</Label>
                        <Select onValueChange={setEquipment}>
                            <SelectTrigger><SelectValue placeholder="Select Equipment" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Volumetric Doser A">Volumetric Doser A</SelectItem>
                                <SelectItem value="Batch Mixer">Batch Mixer</SelectItem>
                                <SelectItem value="Conveyor Belt">Conveyor Belt</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Observed Symptoms</Label>
                        <Textarea
                            placeholder="e.g. 'Unusual grinding noise', 'Output inconsistency'..."
                            className="min-h-[100px]"
                            value={issue}
                            onChange={e => setIssue(e.target.value)}
                        />
                    </div>
                    <div className="space-y-3">
                        <Label>Severity Assessment</Label>
                        <RadioGroup defaultValue="Minor" onValueChange={(v: any) => setSeverity(v)} className="flex gap-4">
                            <div className="flex items-center space-x-2 border p-3 rounded-lg flex-1 hover:bg-slate-50 cursor-pointer">
                                <RadioGroupItem value="Minor" id="s1" />
                                <Label htmlFor="s1" className="cursor-pointer">Minor</Label>
                            </div>
                            <div className="flex items-center space-x-2 border p-3 rounded-lg flex-1 hover:bg-slate-50 cursor-pointer">
                                <RadioGroupItem value="Moderate" id="s2" />
                                <Label htmlFor="s2" className="cursor-pointer">Moderate</Label>
                            </div>
                            <div className="flex items-center space-x-2 border p-3 rounded-lg flex-1 hover:bg-red-50 border-red-200 cursor-pointer">
                                <RadioGroupItem value="Severe" id="s3" className="text-red-600" />
                                <Label htmlFor="s3" className="text-red-600 font-bold cursor-pointer">Severe</Label>
                            </div>
                        </RadioGroup>
                    </div>
                    <div className="pt-2">
                        <Label className="mb-2 block">Evidence (Optional)</Label>
                        <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-zinc-400 gap-2 hover:bg-slate-50 cursor-pointer transition-colors bg-slate-50/50">
                            <Camera className="w-6 h-6" />
                            <span className="text-xs">Upload Photo/Video</span>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="justify-between border-t p-6 bg-slate-50 rounded-b-xl">
                    <Button variant="ghost" onClick={onCancel}>Cancel</Button>
                    <Button className="bg-red-600 hover:bg-red-700" onClick={handleSubmit} disabled={!equipment || !issue}>Submit Report</Button>
                </CardFooter>
            </Card>
        </div>
    )
}


