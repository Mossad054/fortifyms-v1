'use client'

import * as React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
    Calendar as CalendarIcon, ChevronLeft, ChevronRight, AlertTriangle, Clock, User
} from 'lucide-react'
import { MaintenanceTask } from './maintenance-types'

export function CentralMaintenanceCalendar({ tasks, onTaskSelect }: { tasks: MaintenanceTask[], onTaskSelect: (task: MaintenanceTask) => void }) {
    const [viewMode, setViewMode] = React.useState<'month' | 'week' | 'list'>('month')
    const [currentDate, setCurrentDate] = React.useState(new Date()) // Today

    // Filters
    const [filterType, setFilterType] = React.useState('All')
    const [filterPriority, setFilterPriority] = React.useState('All')

    // Filter Logic
    const filteredTasks = tasks.filter(t => {
        if (filterType !== 'All' && t.type !== filterType) return false
        if (filterPriority !== 'All' && t.priority !== filterPriority) return false
        return true
    })

    // Navigation
    const nextPeriod = () => {
        const newDate = new Date(currentDate)
        if (viewMode === 'month') newDate.setMonth(newDate.getMonth() + 1)
        else newDate.setDate(newDate.getDate() + 7)
        setCurrentDate(newDate)
    }

    const prevPeriod = () => {
        const newDate = new Date(currentDate)
        if (viewMode === 'month') newDate.setMonth(newDate.getMonth() - 1)
        else newDate.setDate(newDate.getDate() - 7)
        setCurrentDate(newDate)
    }

    // Reminders
    const overdueCount = tasks.filter(t => t.status === 'Overdue').length
    const upcomingCount = tasks.filter(t => t.priority === 'Critical' && t.status === 'Pending').length

    return (
        <div className="h-full flex flex-col space-y-4">
            {/* Header / Toolbar */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-lg border shadow-sm shrink-0">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm" onClick={prevPeriod}><ChevronLeft className="w-4 h-4" /></Button>
                        <span className="font-bold w-32 text-center text-zinc-900">
                            {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                        </span>
                        <Button variant="ghost" size="sm" onClick={nextPeriod}><ChevronRight className="w-4 h-4" /></Button>
                    </div>
                    <div className="flex bg-slate-100 p-1 rounded-lg">
                        <button className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${viewMode === 'month' ? 'bg-white shadow-sm' : 'text-muted-foreground'}`} onClick={() => setViewMode('month')}>Month</button>
                        <button className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${viewMode === 'week' ? 'bg-white shadow-sm' : 'text-muted-foreground'}`} onClick={() => setViewMode('week')}>Week</button>
                        <button className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${viewMode === 'list' ? 'bg-white shadow-sm' : 'text-muted-foreground'}`} onClick={() => setViewMode('list')}>List</button>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Select value={filterType} onValueChange={setFilterType}>
                        <SelectTrigger className="w-[130px] h-8 text-xs"><SelectValue placeholder="Type" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="All">All Types</SelectItem>
                            <SelectItem value="Calibration">Calibration</SelectItem>
                            <SelectItem value="Cleaning">Cleaning</SelectItem>
                            <SelectItem value="Inspection">Inspection</SelectItem>
                            <SelectItem value="Lubrication">Lubrication</SelectItem>
                            <SelectItem value="Replacement">Replacement</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select value={filterPriority} onValueChange={setFilterPriority}>
                        <SelectTrigger className="w-[100px] h-8 text-xs"><SelectValue placeholder="Priority" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="All">All Levels</SelectItem>
                            <SelectItem value="Critical">Critical</SelectItem>
                            <SelectItem value="High">High</SelectItem>
                            <SelectItem value="Medium">Medium</SelectItem>
                            <SelectItem value="Low">Low</SelectItem>
                        </SelectContent>
                    </Select>

                    {(overdueCount > 0 || upcomingCount > 0) && (
                        <div className="flex gap-2 ml-2 pl-2 border-l">
                            {overdueCount > 0 && (
                                <Badge variant="destructive" className="animate-pulse shadow-red-200 shadow-md">
                                    <AlertTriangle className="w-3 h-3 mr-1" /> {overdueCount} Overdue
                                </Badge>
                            )}
                            {upcomingCount > 0 && (
                                <Badge className="bg-orange-500 hover:bg-orange-600">
                                    <Clock className="w-3 h-3 mr-1" /> {upcomingCount} Urgent
                                </Badge>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Calendar Grid */}
            <Card className="flex-1 border-none shadow-sm overflow-hidden flex flex-col">
                <CardContent className="p-0 flex-1 flex flex-col relative">
                    {viewMode === 'month' && <MonthView currentDate={currentDate} tasks={filteredTasks} onSelect={onTaskSelect} />}
                    {viewMode === 'week' && <WeekView currentDate={currentDate} tasks={filteredTasks} onSelect={onTaskSelect} />}
                    {viewMode === 'list' && <ListView tasks={filteredTasks} onSelect={onTaskSelect} />}
                </CardContent>
            </Card>
        </div>
    )
}

// --- SUB-VIEWS ---

function MonthView({ currentDate, tasks, onSelect }: { currentDate: Date, tasks: MaintenanceTask[], onSelect: (t: MaintenanceTask) => void }) {
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay() // 0 = Sun

    const slots = []
    for (let i = 0; i < firstDay; i++) slots.push(null)
    for (let i = 1; i <= daysInMonth; i++) slots.push(i)

    const todayStr = new Date().toISOString().split('T')[0]

    return (
        <div className="h-full flex flex-col bg-slate-50">
            <div className="grid grid-cols-7 border-b bg-white">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                    <div key={d} className="p-2 text-center text-xs font-bold text-zinc-500 uppercase">{d}</div>
                ))}
            </div>
            <div className="grid grid-cols-7 flex-1 auto-rows-fr gap-px bg-zinc-200 overflow-y-auto">
                {slots.map((day, idx) => {
                    if (!day) return <div key={`empty-${idx}`} className="bg-slate-50/50" />
                    // This simple date construction might be off by timezone, but robust enough for demo
                    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
                    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}` // Simple ISO format attempt

                    // Filter tasks that match this day
                    // We match prefix to support timestamp strings if they start with YYYY-MM-DD
                    const dayTasks = tasks.filter(t => t.dueDate.startsWith(dateStr))
                    const isToday = day === new Date().getDate() && currentDate.getMonth() === new Date().getMonth() && currentDate.getFullYear() === new Date().getFullYear()

                    return (
                        <div key={day} className={`bg-white p-1 relative min-h-[80px] hover:bg-slate-50 transition-colors group`}>
                            <span className={`text-xs font-medium absolute top-1 right-1 w-6 h-6 flex items-center justify-center rounded-full ${isToday ? 'bg-blue-600 text-white' : 'text-zinc-500'}`}>
                                {day}
                            </span>
                            <div className="mt-6 flex flex-col gap-1">
                                {dayTasks.map(task => (
                                    <button
                                        key={task.id}
                                        onClick={() => onSelect(task)}
                                        className={`text-[10px] text-left px-1.5 py-1 rounded truncate border-l-2 font-medium transition-all hover:scale-[1.02] active:scale-95
                                            ${task.priority === 'Critical' ? 'bg-red-50 border-red-500 text-red-700' :
                                                task.status === 'Completed' ? 'bg-green-50 border-green-500 text-green-700 opacity-70' :
                                                    'bg-blue-50 border-blue-500 text-blue-700'}
                                        `}
                                    >
                                        {task.title}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

function WeekView({ currentDate, tasks, onSelect }: { currentDate: Date, tasks: MaintenanceTask[], onSelect: (t: MaintenanceTask) => void }) {
    const days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(currentDate)
        d.setDate(d.getDate() + i)
        return d
    })

    return (
        <div className="h-full bg-slate-50 grid grid-cols-7 gap-px border bg-zinc-200 overflow-hidden">
            {days.map(date => {
                const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
                const dayTasks = tasks.filter(t => t.dueDate.startsWith(dateStr))
                return (
                    <div key={dateStr} className="bg-white flex flex-col h-full">
                        <div className="p-2 border-b text-center bg-slate-50">
                            <div className="text-xs text-zinc-500 uppercase">{date.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                            <div className="font-bold text-lg">{date.getDate()}</div>
                        </div>
                        <div className="p-2 flex-1 space-y-2 overflow-y-auto">
                            {dayTasks.map(task => (
                                <div key={task.id} onClick={() => onSelect(task)} className="p-2 rounded border shadow-sm bg-white hover:border-blue-300 cursor-pointer text-xs">
                                    <div className="font-semibold truncate">{task.title}</div>
                                    <div className="text-zinc-500 truncate">{task.equipment}</div>
                                    {task.priority === 'Critical' && <Badge variant="destructive" className="mt-1 text-[8px] h-4">Critical</Badge>}
                                </div>
                            ))}
                            {dayTasks.length === 0 && <div className="text-[10px] text-zinc-300 text-center py-4 italic">No tasks</div>}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

function ListView({ tasks, onSelect }: { tasks: MaintenanceTask[], onSelect: (t: MaintenanceTask) => void }) {
    return (
        <div className="bg-white h-full overflow-y-auto">
            {tasks.length === 0 ? (
                <div className="p-8 text-center text-zinc-500">No tasks found matching criteria.</div>
            ) : (
                <div className="divide-y">
                    {tasks.sort((a, b) => a.dueDate.localeCompare(b.dueDate)).map(task => (
                        <div key={task.id} onClick={() => onSelect(task)} className="flex items-center justify-between p-4 hover:bg-slate-50 cursor-pointer group">
                            <div className="flex items-center gap-4">
                                <div className={`w-2 h-12 rounded-full ${task.status === 'Overdue' ? 'bg-red-500' :
                                        task.status === 'Completed' ? 'bg-green-500' : 'bg-blue-500'
                                    }`} />
                                <div>
                                    <div className="font-semibold text-zinc-900 group-hover:text-blue-700">{task.title}</div>
                                    <div className="text-sm text-zinc-500 flex items-center gap-2">
                                        <CalendarIcon className="w-3 h-3" /> {task.dueDate}
                                        <span>•</span>
                                        <Badge variant="outline" className="text-xs font-normal">{task.equipment}</Badge>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                {task.requirements?.personnel?.[0] && <div className="flex items-center text-xs text-zinc-500"><User className="w-3 h-3 mr-1" /> {task.requirements.personnel[0]}</div>}
                                <Badge className={
                                    task.priority === 'Critical' ? 'bg-red-100 text-red-700 hover:bg-red-200' :
                                        'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                }>{task.priority}</Badge>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
