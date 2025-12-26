'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    AlertTriangle, Bell, CheckCircle, Clock, XCircle, Filter
} from 'lucide-react'

const mockAlerts = [
    {
        id: '1',
        type: 'MAINTENANCE',
        severity: 'HIGH',
        title: 'Doser Calibration Due',
        description: 'Line 2 doser calibration is overdue by 3 days',
        equipment: 'Doser Unit - L2',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        status: 'ACTIVE'
    },
    {
        id: '2',
        type: 'QUALITY',
        severity: 'CRITICAL',
        title: 'QC Test Failed',
        description: 'Batch MILL-L1-20231225-001 failed iron content test',
        equipment: 'Production Line 1',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        status: 'ACTIVE'
    },
    {
        id: '3',
        type: 'COMPLIANCE',
        severity: 'MEDIUM',
        title: 'Audit Submission Pending',
        description: 'Monthly compliance audit due in 2 days',
        equipment: 'N/A',
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
        status: 'ACTIVE'
    },
]

export default function MaintenanceAlertsPage() {
    const router = useRouter()
    const [alerts, setAlerts] = React.useState(mockAlerts)
    const [filter, setFilter] = React.useState<string>('ALL')

    function getSeverityBadge(severity: string) {
        const variants: Record<string, any> = {
            CRITICAL: { className: 'bg-red-600', icon: XCircle },
            HIGH: { className: 'bg-orange-500', icon: AlertTriangle },
            MEDIUM: { className: 'bg-yellow-500', icon: Clock },
            LOW: { className: 'bg-blue-500', icon: Bell },
        }
        const config = variants[severity] || variants.MEDIUM
        const Icon = config.icon
        return (
            <Badge className={config.className}>
                <Icon className="h-3 w-3 mr-1" />
                {severity}
            </Badge>
        )
    }

    function getTypeBadge(type: string) {
        const colors: Record<string, string> = {
            MAINTENANCE: 'bg-purple-100 text-purple-700',
            QUALITY: 'bg-red-100 text-red-700',
            COMPLIANCE: 'bg-blue-100 text-blue-700',
            PRODUCTION: 'bg-green-100 text-green-700',
        }
        return <Badge variant="outline" className={colors[type] || ''}>{type}</Badge>
    }

    const filteredAlerts = filter === 'ALL' ? alerts : alerts.filter(a => a.type === filter)

    return (
        <div className="container mx-auto py-6 max-w-[1200px]">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        <Bell className="h-8 w-8 text-orange-600" />
                        Alerts & Notifications
                    </h1>
                    <p className="text-gray-600 mt-1">Monitor and manage system alerts</p>
                </div>
                <Button variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                </Button>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 mb-6 overflow-x-auto">
                {['ALL', 'MAINTENANCE', 'QUALITY', 'COMPLIANCE', 'PRODUCTION'].map((type) => (
                    <Button
                        key={type}
                        variant={filter === type ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setFilter(type)}
                        className="whitespace-nowrap"
                    >
                        {type}
                        {type === 'ALL' && ` (${alerts.length})`}
                    </Button>
                ))}
            </div>

            {/* Alerts List */}
            <div className="space-y-4">
                {filteredAlerts.length === 0 ? (
                    <Card>
                        <CardContent className="py-12 text-center">
                            <CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-4" />
                            <p className="text-gray-600">No active alerts. All systems operational!</p>
                        </CardContent>
                    </Card>
                ) : (
                    filteredAlerts.map((alert) => (
                        <Card key={alert.id} className="hover:shadow-md transition-shadow">
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            {getSeverityBadge(alert.severity)}
                                            {getTypeBadge(alert.type)}
                                        </div>
                                        <CardTitle className="text-lg">{alert.title}</CardTitle>
                                        <p className="text-sm text-gray-600 mt-1">{alert.description}</p>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm mb-4">
                                    <div>
                                        <p className="text-gray-500">Equipment</p>
                                        <p className="font-medium">{alert.equipment}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">Created</p>
                                        <p className="font-medium">{alert.createdAt.toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">Status</p>
                                        <Badge variant={alert.status === 'ACTIVE' ? 'destructive' : 'default'}>
                                            {alert.status}
                                        </Badge>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button size="sm" variant="default">
                                        Acknowledge
                                    </Button>
                                    <Button size="sm" variant="outline">
                                        View Details
                                    </Button>
                                    <Button size="sm" variant="ghost">
                                        Dismiss
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    )
}
