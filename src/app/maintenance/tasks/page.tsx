'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Plus, Calendar, Search, CheckCircle, Clock, AlertTriangle } from 'lucide-react'

export default function MaintenanceTasksPage() {
    const router = useRouter()
    const [loading, setLoading] = React.useState(true)
    const [tasks, setTasks] = React.useState<any[]>([])
    const [filter, setFilter] = React.useState<string>('ALL')
    const supabase = createClient()

    React.useEffect(() => {
        loadTasks()
    }, [])

    async function loadTasks() {
        try {
            const response = await fetch('/api/maintenance/tasks')
            if (response.ok) {
                const data = await response.json()
                setTasks(data.tasks || [])
            }
        } catch (error) {
            console.error('Error loading tasks:', error)
        } finally {
            setLoading(false)
        }
    }

    async function handleCompleteTask(taskId: string) {
        try {
            const response = await fetch(`/api/maintenance/tasks/${taskId}/complete`, {
                method: 'POST'
            })
            if (response.ok) {
                loadTasks() // Reload tasks
            }
        } catch (error) {
            console.error('Error completing task:', error)
        }
    }

    function getStatusBadge(status: string) {
        const variants: Record<string, any> = {
            PENDING: { className: 'bg-yellow-500', icon: Clock, label: 'Pending' },
            IN_PROGRESS: { className: 'bg-[#0A3225]/50', icon: Clock, label: 'In Progress' },
            COMPLETED: { className: 'bg-green-500', icon: CheckCircle, label: 'Completed' },
            OVERDUE: { className: 'bg-red-500', icon: AlertTriangle, label: 'Overdue' },
        }
        const config = variants[status] || variants.PENDING
        const Icon = config.icon
        return (
            <Badge className={config.className}>
                <Icon className="h-3 w-3 mr-1" />
                {config.label}
            </Badge>
        )
    }

    function getPriorityBadge(priority: string) {
        const colors: Record<string, string> = {
            HIGH: 'bg-red-100 text-red-700',
            MEDIUM: 'bg-yellow-100 text-yellow-700',
            LOW: 'bg-[#0A3225]/10 text-[#0A3225]',
        }
        return <Badge variant="outline" className={colors[priority] || ''}>{priority}</Badge>
    }

    const filteredTasks = filter === 'ALL' ? tasks : tasks.filter(t => t.status === filter)

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-lg">Loading maintenance tasks...</div>
            </div>
        )
    }

    return (
        <div className="container mx-auto py-6 max-w-[1400px]">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        <Calendar className="h-8 w-8 text-orange" />
                        Maintenance Tasks
                    </h1>
                    <p className="text-gray-600 mt-1">Schedule and track equipment maintenance</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => router.push('/maintenance/calendar')}>
                        <Calendar className="h-4 w-4 mr-2" />
                        Calendar View
                    </Button>
                    <Button variant="premium">
                        <Plus className="h-4 w-4 mr-2" />
                        New Task
                    </Button>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 mb-6 overflow-x-auto">
                {['ALL', 'PENDING', 'IN_PROGRESS', 'COMPLETED', 'OVERDUE'].map((status) => (
                    <Button
                        key={status}
                        variant={filter === status ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setFilter(status)}
                        className="whitespace-nowrap"
                    >
                        {status.replace('_', ' ')}
                        {status === 'ALL' && ` (${tasks.length})`}
                    </Button>
                ))}
            </div>

            {/* Tasks List */}
            <div className="space-y-4">
                {filteredTasks.length === 0 ? (
                    <Card>
                        <CardContent className="py-12 text-center">
                            <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                            <p className="text-gray-600">No maintenance tasks found</p>
                            <Button className="mt-4">
                                Create First Task
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    filteredTasks.map((task) => (
                        <Card key={task.id} className="hover:shadow-md transition-shadow">
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            {getStatusBadge(task.status)}
                                            {getPriorityBadge(task.priority)}
                                        </div>
                                        <CardTitle className="text-lg">{task.title}</CardTitle>
                                        <CardDescription className="mt-1">
                                            {task.equipment?.name} • {task.type}
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-gray-600 mb-4">{task.description}</p>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                                    <div>
                                        <p className="text-gray-500">Scheduled Date</p>
                                        <p className="font-medium">
                                            {task.scheduledDate ? new Date(task.scheduledDate).toLocaleDateString() : 'Not scheduled'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">Assigned To</p>
                                        <p className="font-medium">{task.assignedTo?.name || 'Unassigned'}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">Estimated Duration</p>
                                        <p className="font-medium">{task.estimatedDurationHours || 'N/A'} hours</p>
                                    </div>
                                    {task.completedAt && (
                                        <div>
                                            <p className="text-gray-500">Completed</p>
                                            <p className="font-medium">{new Date(task.completedAt).toLocaleDateString()}</p>
                                        </div>
                                    )}
                                </div>

                                <div className="flex gap-2">
                                    {task.status !== 'COMPLETED' && (
                                        <Button
                                            size="sm"
                                            variant="default"
                                            onClick={() => handleCompleteTask(task.id)}
                                        >
                                            <CheckCircle className="h-3 w-3 mr-1" />
                                            Mark Complete
                                        </Button>
                                    )}
                                    <Button size="sm" variant="outline">
                                        View Details
                                    </Button>
                                    {task.equipment && (
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => router.push(`/equipment/${task.equipmentId}`)}
                                        >
                                            View Equipment
                                        </Button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    )
}
