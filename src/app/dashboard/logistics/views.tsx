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

// --- Logistics Analytics View ---
export function LogisticsAnalyticsView() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="hover:shadow-md transition-shadow">
                <CardHeader>
                    <CardTitle className="text-sm font-medium text-gray-500">Fleet Utilization</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">87%</div>
                    <p className="text-xs text-green-600 mt-1">+2.5% from last month</p>
                    <div className="h-2 bg-gray-100 rounded-full mt-3 w-full overflow-hidden">
                        <div className="h-full bg-blue-600 w-[87%]" />
                    </div>
                </CardContent>
            </Card>
            <Card className="hover:shadow-md transition-shadow">
                <CardHeader>
                    <CardTitle className="text-sm font-medium text-gray-500">On-Time Deliveries</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">94.2%</div>
                    <p className="text-xs text-green-600 mt-1">Target: 95%</p>
                    <div className="h-2 bg-gray-100 rounded-full mt-3 w-full overflow-hidden">
                        <div className="h-full bg-green-500 w-[94.2%]" />
                    </div>
                </CardContent>
            </Card>
            <Card className="hover:shadow-md transition-shadow">
                <CardHeader>
                    <CardTitle className="text-sm font-medium text-gray-500">Fuel Efficiency</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">4.2 km/L</div>
                    <p className="text-xs text-red-600 mt-1">-0.1 km/L from avg</p>
                    <div className="h-2 bg-gray-100 rounded-full mt-3 w-full overflow-hidden">
                        <div className="h-full bg-orange-500 w-[60%]" />
                    </div>
                </CardContent>
            </Card>

            <Card className="col-span-1 md:col-span-2 lg:col-span-3">
                <CardHeader>
                    <CardTitle>Delivery Performance History</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-64 flex items-end gap-4 px-4">
                        {[45, 60, 55, 70, 65, 80, 75, 85, 90, 88, 92, 95].map((h, i) => (
                            <div key={i} className="flex-1 bg-blue-50 hover:bg-blue-100 rounded-t-sm relative group h-full flex items-end transition-colors">
                                <div style={{ height: `${h}%` }} className="w-full bg-blue-600 rounded-t-sm relative">
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                        Week {i + 1}: {h} Deliveries
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-gray-500 px-2">
                        <span>Q1 Start</span>
                        <span>Q1 End</span>
                    </div>
                </CardContent>
            </Card>
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

    const history = [
        { id: 'DEL-8810', dest: 'Nairobi West', date: '2024-12-25', status: 'Completed', load: '10 MT Wheat' },
        { id: 'DEL-8805', dest: 'Nakuru North', date: '2024-12-24', status: 'Completed', load: '15 MT Maize' },
        { id: 'DEL-8792', dest: 'Eldoret East', date: '2024-12-23', status: 'Completed', load: '20 MT Rice' },
    ]

    return (
        <div className="space-y-6">
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

            <Card className="glass-card border-none shadow-sm">
                <CardHeader>
                    <CardTitle>Delivery History</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Delivery ID</TableHead>
                                <TableHead>Destination</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Load</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {history.map(h => (
                                <TableRow key={h.id}>
                                    <TableCell className="font-mono text-xs">{h.id}</TableCell>
                                    <TableCell className="font-medium">{h.dest}</TableCell>
                                    <TableCell>{h.date}</TableCell>
                                    <TableCell>{h.load}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="text-green-600 bg-green-50 border-green-200">
                                            {h.status}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}

// --- Fleet List View ---
export function FleetListView() {
    const [isAddVehicleOpen, setIsAddVehicleOpen] = React.useState(false)
    const [fleet, setFleet] = React.useState([
        { id: 'TRK-001', driver: 'John Doe', status: 'On Road', location: 'Nairobi Bypass', fuel: '78%' },
        { id: 'TRK-002', driver: 'Jane Smith', status: 'Available', location: 'Depot A', fuel: '100%' },
        { id: 'VAN-104', driver: 'Mike Ross', status: 'Maintenance', location: 'Workshop', fuel: 'N/A' },
        { id: 'TRK-005', driver: 'Harvey S.', status: 'On Road', location: 'Mombasa Rd', fuel: '45%' },
        { id: 'VAN-106', driver: 'Rachel Z.', status: 'Available', location: 'Depot B', fuel: '92%' },
    ])

    const handleAddVehicle = (e: React.FormEvent) => {
        e.preventDefault()
        // Mock addition
        const newVehicle = {
            id: `TRK-00${Math.floor(Math.random() * 100)}`,
            driver: 'New Driver',
            status: 'Available',
            location: 'Depot HQ',
            fuel: '100%'
        }
        setFleet([...fleet, newVehicle])
        setIsAddVehicleOpen(false)
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Fleet Management</h2>
                <Button onClick={() => setIsAddVehicleOpen(true)}>+ Add Vehicle</Button>
            </div>
            <Card className="glass-card border-none shadow-sm">
                <CardContent className="p-0">
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

            <Dialog open={isAddVehicleOpen} onOpenChange={setIsAddVehicleOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add New Vehicle</DialogTitle>
                        <DialogDescription>Register a new vehicle to the fleet.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleAddVehicle} className="space-y-4 py-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Vehicle Registration</label>
                            <Input placeholder="e.g. KCA 123X" required />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Vehicle Type</label>
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="truck">Heavy Truck (10T+)</SelectItem>
                                    <SelectItem value="van">Delivery Van</SelectItem>
                                    <SelectItem value="pickup">Pickup</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Assigned Driver</label>
                            <Input placeholder="Driver Name" />
                        </div>
                        <DialogFooter>
                            <Button variant="outline" type="button" onClick={() => setIsAddVehicleOpen(false)}>Cancel</Button>
                            <Button type="submit">Add Vehicle</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}

// Missing imports 
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
