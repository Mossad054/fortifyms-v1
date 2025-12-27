'use client'

import * as React from 'react'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Star, Trophy, AlertTriangle, TrendingUp, CheckCircle } from 'lucide-react'
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table'

// --- BACKEND / DATA LAYER ---

interface SupplierMetric {
    id: string
    name: string
    category: string
    rating: number
    onTimeRate: number
    qualityScore: number
    totalOrders: number
    preferred: boolean
    status: 'active' | 'probation' | 'inactive'
}

const SUPPLIER_DATA: SupplierMetric[] = [
    { id: 'SUP-001', name: 'Nairobi Millers Ltd', category: 'Grains', rating: 4.8, onTimeRate: 98, qualityScore: 99, totalOrders: 145, preferred: true, status: 'active' },
    { id: 'SUP-002', name: 'Mombasa Grains', category: 'Wheat', rating: 4.2, onTimeRate: 88, qualityScore: 95, totalOrders: 62, preferred: true, status: 'active' },
    { id: 'SUP-003', name: 'Coastal Packaging', category: 'Packaging', rating: 3.5, onTimeRate: 75, qualityScore: 90, totalOrders: 28, preferred: false, status: 'probation' },
    { id: 'SUP-004', name: 'Highland Logistics', category: 'Logistics', rating: 4.5, onTimeRate: 92, qualityScore: 96, totalOrders: 204, preferred: true, status: 'active' },
    { id: 'SUP-005', name: 'Kampala Millers', category: 'Oil', rating: 3.9, onTimeRate: 82, qualityScore: 88, totalOrders: 15, preferred: false, status: 'active' },
]

// --- FRONTEND COMPONENTS ---

export function SupplierPerformance() {
    const [selectedSupplier, setSelectedSupplier] = React.useState<SupplierMetric | null>(null)
    const [isProfileOpen, setIsProfileOpen] = React.useState(false)

    const handleViewProfile = (supplier: SupplierMetric) => {
        setSelectedSupplier(supplier)
        setIsProfileOpen(true)
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-gradient-to-br from-yellow-50 to-white border-yellow-100">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center gap-2 text-yellow-700">
                            <Trophy className="w-5 h-5" /> Top Supplier
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-gray-900">Nairobi Millers</div>
                        <p className="text-sm text-gray-500 mt-1">Highest rating (4.8/5.0) this quarter</p>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-green-50 to-white border-green-100">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center gap-2 text-green-700">
                            <TrendingUp className="w-5 h-5" /> Avg On-Time Rate
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-gray-900">92.4%</div>
                        <p className="text-sm text-gray-500 mt-1">Up 3.2% from last month</p>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-red-50 to-white border-red-100">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center gap-2 text-red-700">
                            <AlertTriangle className="w-5 h-5" /> Critical Issues
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-gray-900">2</div>
                        <p className="text-sm text-gray-500 mt-1">Suppliers on probation</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle>Supplier Scorecards</CardTitle>
                            <CardDescription>Detailed performance metrics per supplier</CardDescription>
                        </div>
                        <Button variant="outline">Export Report</Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Supplier Name</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Rating</TableHead>
                                <TableHead>On-Time Delivery</TableHead>
                                <TableHead>Quality Score</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {SUPPLIER_DATA.map(supplier => (
                                <TableRow key={supplier.id}>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-semibold flex items-center gap-2">
                                                {supplier.name}
                                                {supplier.preferred && <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-800">Preferred</Badge>}
                                            </span>
                                            <span className="text-xs text-gray-500">{supplier.id}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>{supplier.category}</TableCell>
                                    <TableCell>
                                        <Badge className={`
                                            ${supplier.status === 'active' ? 'bg-green-100 text-green-700' : ''}
                                            ${supplier.status === 'probation' ? 'bg-red-100 text-red-700' : ''}
                                            ${supplier.status === 'inactive' ? 'bg-gray-100 text-gray-700' : ''}
                                        `}>
                                            {supplier.status.toUpperCase()}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center text-yellow-500 font-bold">
                                            {supplier.rating} <Star className="w-4 h-4 ml-1 fill-current" />
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="w-[120px]">
                                            <div className="flex justify-between text-xs mb-1">
                                                <span className={supplier.onTimeRate < 90 ? 'text-red-600' : 'text-green-600 font-medium'}>
                                                    {supplier.onTimeRate}%
                                                </span>
                                            </div>
                                            <Progress value={supplier.onTimeRate} className={`h-2 ${supplier.onTimeRate < 90 ? 'bg-red-100' : 'bg-green-100'}`} />
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="w-[120px]">
                                            <div className="flex justify-between text-xs mb-1">
                                                <span className={supplier.qualityScore < 95 ? 'text-orange-600' : 'text-blue-600 font-medium'}>
                                                    {supplier.qualityScore}%
                                                </span>
                                            </div>
                                            <Progress value={supplier.qualityScore} className="h-2 bg-blue-100" />
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button size="sm" variant="ghost" onClick={() => handleViewProfile(supplier)}>View Profile</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
                <DialogContent className="max-w-4xl">
                    <DialogHeader>
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center text-xl font-bold text-gray-500">
                                {selectedSupplier?.name.charAt(0)}
                            </div>
                            <div>
                                <DialogTitle className="text-xl">{selectedSupplier?.name}</DialogTitle>
                                <DialogDescription>{selectedSupplier?.id} • {selectedSupplier?.category} Supplier</DialogDescription>
                            </div>
                            {selectedSupplier?.preferred && <Badge className="ml-auto bg-yellow-100 text-yellow-800 border-yellow-200">Preferred Supplier</Badge>}
                        </div>
                    </DialogHeader>

                    <div className="grid grid-cols-3 gap-6 py-6">
                        <Card className="col-span-1 border-none shadow-none bg-slate-50">
                            <CardHeader className="pb-2"><CardTitle className="text-sm">Contact Information</CardTitle></CardHeader>
                            <CardContent className="text-sm space-y-2">
                                <div><span className="font-semibold block">Primary contact:</span> John Supplier</div>
                                <div><span className="font-semibold block">Email:</span> john@{selectedSupplier?.name.toLowerCase().replace(/\s/g, '')}.com</div>
                                <div><span className="font-semibold block">Location:</span> Industrial Area, Nairobi</div>
                            </CardContent>
                        </Card>

                        <Card className="col-span-2 border-none shadow-none">
                            <CardHeader className="pb-2 flex flex-row items-center justify-between">
                                <CardTitle className="text-sm">Performance History (12 Months)</CardTitle>
                                <select className="text-xs border rounded p-1"><option>Last Year</option></select>
                            </CardHeader>
                            <CardContent>
                                <div className="h-40 flex items-end gap-2">
                                    {[65, 78, 82, 85, 90, 88, 92, 95, 94, 96, 95, 98].map((val, i) => (
                                        <div key={i} className="flex-1 bg-blue-100 hover:bg-blue-200 rounded-t transition-all relative group h-full flex items-end">
                                            <div style={{ height: `${val}%` }} className={`w-full ${val > 90 ? 'bg-green-500' : 'bg-blue-500'} rounded-t`}></div>
                                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10">{val}%</div>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex justify-between text-xs text-slate-400 mt-2">
                                    <span>Jan</span><span>Dec</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-4">
                        <h4 className="font-semibold text-sm">Active Certifications</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="border p-3 rounded-lg flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <CheckCircle className="text-green-500 w-5 h-5" />
                                    <div>
                                        <div className="font-medium text-sm">ISO 9001:2015</div>
                                        <div className="text-xs text-slate-500">Quality Management</div>
                                    </div>
                                </div>
                                <Badge variant="outline" className="text-green-600 bg-green-50">Valid</Badge>
                            </div>
                            <div className="border p-3 rounded-lg flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <CheckCircle className="text-green-500 w-5 h-5" />
                                    <div>
                                        <div className="font-medium text-sm">FSSC 22000</div>
                                        <div className="text-xs text-slate-500">Food Safety</div>
                                    </div>
                                </div>
                                <Badge variant="outline" className="text-green-600 bg-green-50">Valid</Badge>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <Button onClick={() => setIsProfileOpen(false)}>Close Profile</Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
