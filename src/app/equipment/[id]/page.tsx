'use client'

import * as React from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
    ArrowLeft, Wrench, Calendar, FileText, AlertTriangle,
    CheckCircle, Clock, Edit, Trash
} from 'lucide-react'

export default function EquipmentDetailPage() {
    const router = useRouter()
    const params = useParams()
    const equipmentId = params.id as string
    const [loading, setLoading] = React.useState(true)
    const [equipment, setEquipment] = React.useState<any>(null)
    const supabase = createClient()

    React.useEffect(() => {
        if (equipmentId) {
            loadEquipment()
        }
    }, [equipmentId])

    async function loadEquipment() {
        try {
            const response = await fetch(`/api/equipment/${equipmentId}`)
            if (response.ok) {
                const data = await response.json()
                setEquipment(data.equipment)
            }
        } catch (error) {
            console.error('Error loading equipment:', error)
        } finally {
            setLoading(false)
        }
    }

    function getStatusBadge(status: string) {
        const variants: Record<string, any> = {
            OPERATIONAL: { className: 'bg-green-500', label: 'Operational' },
            MAINTENANCE: { className: 'bg-yellow-500', label: 'Under Maintenance' },
            BROKEN: { className: 'bg-red-500', label: 'Broken' },
            RETIRED: { className: 'bg-gray-500', label: 'Retired' },
        }
        const config = variants[status] || variants.OPERATIONAL
        return <Badge className={config.className}>{config.label}</Badge>
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-lg">Loading equipment details...</div>
            </div>
        )
    }

    if (!equipment) {
        return (
            <div className="container mx-auto py-6">
                <Card>
                    <CardContent className="py-12 text-center">
                        <Wrench className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                        <p className="text-gray-600">Equipment not found</p>
                        <Button className="mt-4" onClick={() => router.push('/equipment')}>
                            Back to Equipment
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="container mx-auto py-6 max-w-[1400px]">
            {/* Header */}
            <Button
                variant="ghost"
                onClick={() => router.push('/equipment')}
                className="mb-4"
            >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Equipment
            </Button>

            <div className="flex justify-between items-start mb-6">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <Wrench className="h-8 w-8 text-blue-600" />
                        {equipment.name}
                    </h1>
                    <p className="text-gray-600 mt-1">
                        {equipment.type} • {equipment.location || 'Location not set'}
                    </p>
                </div>
                <div className="flex gap-2">
                    {getStatusBadge(equipment.status)}
                    <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="overview" className="space-y-6">
                <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="maintenance">Maintenance History</TabsTrigger>
                    <TabsTrigger value="calibration">Calibration</TabsTrigger>
                    <TabsTrigger value="performance">Performance</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Equipment Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <p className="text-sm text-gray-500">Manufacturer</p>
                                    <p className="font-medium">{equipment.manufacturer || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Model</p>
                                    <p className="font-medium">{equipment.model || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Serial Number</p>
                                    <p className="font-medium">{equipment.serialNumber || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Type</p>
                                    <p className="font-medium">{equipment.type}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Location</p>
                                    <p className="font-medium">{equipment.location || 'N/A'}</p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Installation & Lifecycle</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <p className="text-sm text-gray-500">Installation Date</p>
                                    <p className="font-medium">
                                        {equipment.installationDate ? new Date(equipment.installationDate).toLocaleDateString() : 'N/A'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Warranty Expiry</p>
                                    <p className="font-medium">
                                        {equipment.warrantyExpiryDate ? new Date(equipment.warrantyExpiryDate).toLocaleDateString() : 'N/A'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Expected Lifespan</p>
                                    <p className="font-medium">{equipment.expectedLifespanYears || 'N/A'} years</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Purchase Cost</p>
                                    <p className="font-medium">${equipment.purchaseCost?.toLocaleString() || 'N/A'}</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {equipment.notes && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Notes</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-700">{equipment.notes}</p>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>

                <TabsContent value="maintenance" className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold">Maintenance History</h2>
                        <Button onClick={() => router.push('/maintenance/tasks')}>
                            <Calendar className="h-4 w-4 mr-2" />
                            Schedule Maintenance
                        </Button>
                    </div>

                    {equipment.maintenanceTasks && equipment.maintenanceTasks.length > 0 ? (
                        <div className="space-y-4">
                            {equipment.maintenanceTasks.map((task: any) => (
                                <Card key={task.id}>
                                    <CardHeader>
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <CardTitle className="text-lg">{task.title}</CardTitle>
                                                <CardDescription>
                                                    {task.scheduledDate ? new Date(task.scheduledDate).toLocaleDateString() : 'Not scheduled'}
                                                </CardDescription>
                                            </div>
                                            <Badge variant={task.status === 'COMPLETED' ? 'default' : 'secondary'} className={task.status === 'COMPLETED' ? 'bg-green-600' : ''}>
                                                {task.status}
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-gray-600">{task.description}</p>
                                        {task.completedAt && (
                                            <p className="text-sm text-gray-500 mt-2">
                                                Completed: {new Date(task.completedAt).toLocaleDateString()}
                                            </p>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <Card>
                            <CardContent className="py-12 text-center">
                                <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                                <p className="text-gray-600">No maintenance history recorded</p>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>

                <TabsContent value="calibration" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Calibration Schedule</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="text-sm text-gray-500">Last Calibration</p>
                                <p className="font-medium text-lg">
                                    {equipment.lastCalibrationDate ? new Date(equipment.lastCalibrationDate).toLocaleDateString() : 'Never'}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Next Calibration Due</p>
                                <p className="font-medium text-lg">
                                    {equipment.nextCalibrationDate ? new Date(equipment.nextCalibrationDate).toLocaleDateString() : 'Not scheduled'}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Calibration Frequency</p>
                                <p className="font-medium">{equipment.calibrationFrequencyDays || 'N/A'} days</p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="performance" className="space-y-6">
                    <Card>
                        <CardContent className="py-12 text-center">
                            <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                            <p className="text-gray-600">Performance metrics coming soon</p>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
