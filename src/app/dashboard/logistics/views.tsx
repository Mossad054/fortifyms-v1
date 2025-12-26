'use client'

import * as React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Truck, MapPin, Package, Clock, ShieldCheck, User, Gauge } from 'lucide-react'

// --- Fleet Status View ---
export function FleetStatusView() {
    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="bg-blue-50/50 border-none">
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="p-2 bg-blue-100 rounded-full text-blue-600"><Truck className="w-5 h-5" /></div>
                        <div><p className="text-xs text-blue-700 font-bold uppercase">On Road</p><h3 className="text-xl font-bold">8 Vehicles</h3></div>
                    </CardContent>
                </Card>
                <Card className="bg-green-50/50 border-none">
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="p-2 bg-green-100 rounded-full text-green-600"><ShieldCheck className="w-5 h-5" /></div>
                        <div><p className="text-xs text-green-700 font-bold uppercase">Available</p><h3 className="text-xl font-bold">4 Vehicles</h3></div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

// --- Deliveries View ---
export function DeliveriesListView() {
    const deliveries = [
        { id: 'DEL-8821', dest: 'Regional Depot A', eta: '2 hrs', status: 'In Transit', load: '12 MT Rice' },
        { id: 'DEL-8824', dest: 'Kisumu Central', eta: '5 hrs', status: 'In Transit', load: '8 MT Maize' },
        { id: 'DEL-8829', dest: 'Mombasa Port', eta: 'Pending', status: 'Loading', load: '25 MT Premix' },
    ]

    return (
        <Card className="glass-card border-none shadow-sm">
            <CardHeader><CardTitle>Active Deliveries</CardTitle></CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {deliveries.map(d => (
                        <div key={d.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg bg-white/60 border border-white/50">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-gray-100 rounded text-gray-500"><Package className="w-4 h-4" /></div>
                                <div>
                                    <h4 className="font-bold text-gray-900">{d.dest}</h4>
                                    <p className="text-xs text-gray-500">{d.id} • {d.load}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 mt-2 sm:mt-0">
                                <div className="flex items-center text-xs text-gray-500 font-medium"><Clock className="w-3 h-3 mr-1" /> ETA: {d.eta}</div>
                                <Badge variant={d.status === 'In Transit' ? 'default' : 'secondary'} className={d.status === 'In Transit' ? 'bg-blue-600' : ''}>{d.status}</Badge>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}

// --- Fleet List View ---
export function FleetListView() {
    const fleet = [
        { id: 'TRK-001', driver: 'John Doe', status: 'On Road', location: 'Nairobi Bypass', fuel: '78%' },
        { id: 'TRK-002', driver: 'Jane Smith', status: 'Available', location: 'Depot A', fuel: '100%' },
        { id: 'VAN-104', driver: 'Mike Ross', status: 'Maintenance', location: 'Workshop', fuel: 'N/A' },
        { id: 'TRK-005', driver: 'Harvey S.', status: 'On Road', location: 'Mombasa Rd', fuel: '45%' },
        { id: 'VAN-106', driver: 'Rachel Z.', status: 'Available', location: 'Depot B', fuel: '92%' },
    ]

    return (
        <Card className="glass-card border-none shadow-sm mt-6">
            <CardHeader><CardTitle>Fleet Management</CardTitle></CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Vehicle ID</TableHead>
                            <TableHead>Driver</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Location</TableHead>
                            <TableHead>Fuel</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {fleet.map((vehicle) => (
                            <TableRow key={vehicle.id}>
                                <TableCell className="font-medium flex items-center gap-2">
                                    <Truck className="w-4 h-4 text-gray-400" />
                                    {vehicle.id}
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <User className="w-3 h-3 text-gray-400" /> {vehicle.driver}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant={vehicle.status === 'On Road' ? 'default' : vehicle.status === 'Available' ? 'secondary' : 'destructive'} className={vehicle.status === 'On Road' ? 'bg-blue-600' : ''}>
                                        {vehicle.status}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <MapPin className="w-3 h-3" /> {vehicle.location}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Gauge className="w-3 h-3" /> {vehicle.fuel}
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}
