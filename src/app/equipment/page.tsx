'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Plus, Wrench, Search, Calendar, AlertTriangle, CheckCircle } from 'lucide-react'

export default function EquipmentPage() {
    const router = useRouter()
    const [loading, setLoading] = React.useState(true)
    const [equipment, setEquipment] = React.useState<any[]>([])
    const [searchTerm, setSearchTerm] = React.useState('')
    const supabase = createClient()

    React.useEffect(() => {
        loadEquipment()
    }, [])

    async function loadEquipment() {
        try {
            const response = await fetch('/api/equipment')
            if (response.ok) {
                const data = await response.json()
                setEquipment(data.equipment || [])
            }
        } catch (error) {
            console.error('Error loading equipment:', error)
        } finally {
            setLoading(false)
        }
    }

    const filteredEquipment = equipment.filter(item =>
        item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.location?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    function getStatusBadge(status: string) {
        const variants: Record<string, any> = {
            OPERATIONAL: { className: 'bg-green-500', label: 'Operational', icon: CheckCircle },
            MAINTENANCE: { className: 'bg-yellow-500', label: 'Maintenance', icon: Wrench },
            BROKEN: { className: 'bg-red-500', label: 'Broken', icon: AlertTriangle },
            RETIRED: { className: 'bg-gray-500', label: 'Retired' },
        }
        const config = variants[status] || variants.OPERATIONAL
        const Icon = config.icon
        return (
            <Badge className={config.className}>
                {Icon && <Icon className="h-3 w-3 mr-1" />}
                {config.label}
            </Badge>
        )
    }

    function getCalibrationBadge(nextCalibration: string) {
        const daysUntil = Math.ceil((new Date(nextCalibration).getTime() - Date.now()) / (1000 * 60 * 60 * 24))

        if (daysUntil < 0) {
            return <Badge variant="destructive">Overdue by {Math.abs(daysUntil)} days</Badge>
        } else if (daysUntil <= 7) {
            return <Badge className="bg-orange-500">Due in {daysUntil} days</Badge>
        } else if (daysUntil <= 30) {
            return <Badge className="bg-yellow-500">Due in {daysUntil} days</Badge>
        }
        return <Badge variant="secondary">Next: {new Date(nextCalibration).toLocaleDateString()}</Badge>
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-lg">Loading equipment...</div>
            </div>
        )
    }

    return (
        <div className="container mx-auto py-6 max-w-[1400px]">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        <Wrench className="h-8 w-8 text-[#0A3225]" />
                        Equipment Registry
                    </h1>
                    <p className="text-gray-600 mt-1">Manage mill equipment and calibration schedules</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => router.push('/maintenance/calendar')}>
                        <Calendar className="h-4 w-4 mr-2" />
                        Calendar
                    </Button>
                    <Button variant="premium">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Equipment
                    </Button>
                </div>
            </div>

            {/* Search */}
            <div className="flex gap-4 mb-6">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Search equipment..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>
            </div>

            {/* Equipment Grid */}
            <div className="grid gap-4">
                {filteredEquipment.length === 0 ? (
                    <Card>
                        <CardContent className="py-12 text-center">
                            <Wrench className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                            <p className="text-gray-600">
                                {searchTerm ? 'No equipment matches your search.' : 'No equipment found. Add your first equipment to get started.'}
                            </p>
                            <Button className="mt-4">
                                Add First Equipment
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    filteredEquipment.map((item) => (
                        <Card
                            key={item.id}
                            className="cursor-pointer hover:shadow-lg transition-all"
                            onClick={() => router.push(`/equipment/${item.id}`)}
                        >
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <CardTitle className="text-lg flex items-center gap-2">
                                            <Wrench className="h-5 w-5 text-[#0A3225]" />
                                            {item.name}
                                        </CardTitle>
                                        <CardDescription className="mt-1">
                                            {item.type} • {item.location || 'Location not set'}
                                        </CardDescription>
                                    </div>
                                    <div className="flex flex-col gap-2 items-end">
                                        {getStatusBadge(item.status)}
                                        {item.nextCalibrationDate && getCalibrationBadge(item.nextCalibrationDate)}
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                                    <div>
                                        <p className="text-gray-500">Manufacturer</p>
                                        <p className="font-medium">{item.manufacturer || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">Model</p>
                                        <p className="font-medium">{item.model || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">Serial Number</p>
                                        <p className="font-medium">{item.serialNumber || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">Install Date</p>
                                        <p className="font-medium">
                                            {item.installationDate ? new Date(item.installationDate).toLocaleDateString() : 'N/A'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">Last Maintenance</p>
                                        <p className="font-medium">
                                            {item.lastMaintenanceDate ? new Date(item.lastMaintenanceDate).toLocaleDateString() : 'Never'}
                                        </p>
                                    </div>
                                </div>

                                {item.notes && (
                                    <div className="mt-4 p-3 bg-gray-50 rounded-md">
                                        <p className="text-sm text-gray-700">{item.notes}</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    )
}
