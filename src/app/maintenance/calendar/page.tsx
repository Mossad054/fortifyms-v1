'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, List } from 'lucide-react'

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

// Mock data for demonstration
const mockTasks = [
    { id: '1', date: new Date(2025, 11, 26), title: 'Doser Calibration - Line 2', priority: 'HIGH' },
    { id: '2', date: new Date(2025, 11, 28), title: 'Belt Inspection', priority: 'MEDIUM' },
    { id: '3', date: new Date(2025, 11, 30), title: 'Motor Maintenance', priority: 'LOW' },
]

export default function MaintenanceCalendarPage() {
    const router = useRouter()
    const [currentDate, setCurrentDate] = React.useState(new Date())
    const [selectedDate, setSelectedDate] = React.useState<Date | null>(null)

    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()

    function getDaysInMonth(year: number, month: number) {
        return new Date(year, month + 1, 0).getDate()
    }

    function getFirstDayOfMonth(year: number, month: number) {
        return new Date(year, month, 1).getDay()
    }

    function previousMonth() {
        setCurrentDate(new Date(year, month - 1))
    }

    function nextMonth() {
        setCurrentDate(new Date(year, month + 1))
    }

    function getTasksForDate(date: Date) {
        return mockTasks.filter(task =>
            task.date.getDate() === date.getDate() &&
            task.date.getMonth() === date.getMonth() &&
            task.date.getFullYear() === date.getFullYear()
        )
    }

    const daysInMonth = getDaysInMonth(year, month)
    const firstDay = getFirstDayOfMonth(year, month)
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)
    const blanks = Array.from({ length: firstDay }, (_, i) => i)

    return (
        <div className="container mx-auto py-6 max-w-[1400px]">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        <CalendarIcon className="h-8 w-8 text-purple-600" />
                        Maintenance Calendar
                    </h1>
                    <p className="text-gray-600 mt-1">Visual schedule of maintenance tasks</p>
                </div>
                <Button variant="outline" onClick={() => router.push('/maintenance/tasks')}>
                    <List className="h-4 w-4 mr-2" />
                    List View
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Calendar */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <CardTitle className="text-2xl">
                                {MONTHS[month]} {year}
                            </CardTitle>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" onClick={previousMonth}>
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
                                    Today
                                </Button>
                                <Button variant="outline" size="sm" onClick={nextMonth}>
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-7 gap-2">
                            {/* Day headers */}
                            {DAYS.map(day => (
                                <div key={day} className="text-center font-semibold text-sm text-gray-600 py-2">
                                    {day}
                                </div>
                            ))}

                            {/* Blank cells */}
                            {blanks.map(blank => (
                                <div key={`blank-${blank}`} className="aspect-square" />
                            ))}

                            {/* Day cells */}
                            {days.map(day => {
                                const date = new Date(year, month, day)
                                const tasks = getTasksForDate(date)
                                const isToday =
                                    date.getDate() === new Date().getDate() &&
                                    date.getMonth() === new Date().getMonth() &&
                                    date.getFullYear() === new Date().getFullYear()
                                const isSelected = selectedDate &&
                                    date.getDate() === selectedDate.getDate() &&
                                    date.getMonth() === selectedDate.getMonth() &&
                                    date.getFullYear() === selectedDate.getFullYear()

                                return (
                                    <div
                                        key={day}
                                        className={`
                                            aspect-square p-2 border rounded-lg cursor-pointer transition-all
                                            ${isToday ? 'border-purple-500 bg-purple-50' : 'border-gray-200'}
                                            ${isSelected ? 'ring-2 ring-purple-500' : ''}
                                            hover:bg-gray-50
                                        `}
                                        onClick={() => setSelectedDate(date)}
                                    >
                                        <div className="text-sm font-medium mb-1">{day}</div>
                                        <div className="space-y-1">
                                            {tasks.slice(0, 2).map(task => (
                                                <div
                                                    key={task.id}
                                                    className={`
                                                        text-xs px-1 py-0.5 rounded truncate
                                                        ${task.priority === 'HIGH' ? 'bg-red-100 text-red-700' : ''}
                                                        ${task.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700' : ''}
                                                        ${task.priority === 'LOW' ? 'bg-blue-100 text-blue-700' : ''}
                                                    `}
                                                >
                                                    {task.title}
                                                </div>
                                            ))}
                                            {tasks.length > 2 && (
                                                <div className="text-xs text-gray-500">
                                                    +{tasks.length - 2} more
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </CardContent>
                </Card>

                {/* Sidebar - Selected Date Tasks */}
                <Card>
                    <CardHeader>
                        <CardTitle>
                            {selectedDate ? selectedDate.toLocaleDateString() : 'Select a Date'}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {selectedDate ? (
                            <div className="space-y-3">
                                {getTasksForDate(selectedDate).length > 0 ? (
                                    getTasksForDate(selectedDate).map(task => (
                                        <div key={task.id} className="p-3 border rounded-lg">
                                            <div className="flex items-start justify-between mb-2">
                                                <p className="font-medium text-sm">{task.title}</p>
                                                <Badge
                                                    variant="outline"
                                                    className={
                                                        task.priority === 'HIGH' ? 'bg-red-100 text-red-700' :
                                                            task.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700' :
                                                                'bg-blue-100 text-blue-700'
                                                    }
                                                >
                                                    {task.priority}
                                                </Badge>
                                            </div>
                                            <Button size="sm" variant="outline" className="w-full">
                                                View Details
                                            </Button>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-8 text-gray-500">
                                        <CalendarIcon className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                                        <p className="text-sm">No tasks scheduled</p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                <p className="text-sm">Click on a date to view tasks</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
