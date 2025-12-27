'use client'

import * as React from 'react'
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import {
    Package, Clock, FileText, CheckCircle2,
    Truck, Search, Filter, AlertCircle, ShoppingBag
} from 'lucide-react'

// --- BACKEND / DATA LAYER ---

type OrderStatus = 'processing' | 'shipped' | 'delivered' | 'cancelled'
type RFPStatus = 'draft' | 'open' | 'closed' | 'evaluating'
type BidStatus = 'pending' | 'accepted' | 'rejected'

interface Order {
    id: string
    supplier: string
    items: string
    amount: number
    status: OrderStatus
    date: string
    deliveryEta: string
}

interface RFP {
    id: string
    title: string
    deadline: string
    status: RFPStatus
    bidsReceived: number
}

interface Bid {
    id: string
    rfpTitle: string
    supplier: string
    amount: number
    submittedDate: string
    status: BidStatus
}

// Mock Data Service
const MOCK_ORDERS: Order[] = [
    { id: 'ORD-2024-001', supplier: 'Nairobi Millers Ltd', items: 'Maize Flour (50T)', amount: 45000, status: 'shipped', date: '2024-12-20', deliveryEta: '2024-12-28' },
    { id: 'ORD-2024-002', supplier: 'Mombasa Grains', items: 'Wheat Flour (20T)', amount: 18000, status: 'processing', date: '2024-12-26', deliveryEta: '2025-01-05' },
    { id: 'ORD-2024-003', supplier: 'Kampala Millers', items: 'Cooking Oil (5000L)', amount: 12500, status: 'delivered', date: '2024-11-15', deliveryEta: '2024-11-20' },
    { id: 'ORD-2024-004', supplier: 'Nairobi Millers Ltd', items: 'Maize Flour (100T)', amount: 88000, status: 'delivered', date: '2024-10-01', deliveryEta: '2024-10-10' },
]

const MOCK_RFPS: RFP[] = [
    { id: 'RFP-25-001', title: 'Q1 2025 Maize Supply', deadline: '2025-01-15', status: 'open', bidsReceived: 4 },
    { id: 'RFP-25-002', title: 'Fortified Oil Procurement', deadline: '2025-01-20', status: 'draft', bidsReceived: 0 },
    { id: 'RFP-24-010', title: 'Emergency Wheat Relief', deadline: '2024-12-10', status: 'evaluating', bidsReceived: 8 },
]

const MOCK_BIDS: Bid[] = [
    { id: 'BID-001', rfpTitle: 'Emergency Wheat Relief', supplier: 'Grain Bulk Handlers', amount: 95000, submittedDate: '2024-12-09', status: 'pending' },
    { id: 'BID-002', rfpTitle: 'Emergency Wheat Relief', supplier: 'Uzuri Foods', amount: 92000, submittedDate: '2024-12-08', status: 'pending' },
]

// --- FRONTEND COMPONENTS ---

export function MyProcurements() {
    const [selectedOrder, setSelectedOrder] = React.useState<Order | null>(null)
    const [selectedRFP, setSelectedRFP] = React.useState<RFP | null>(null)
    const [selectedBid, setSelectedBid] = React.useState<Bid | null>(null)
    const [isTrackingOpen, setIsTrackingOpen] = React.useState(false)
    const [isManageRFPOpen, setIsManageRFPOpen] = React.useState(false)
    const [isEvaluateOpen, setIsEvaluateOpen] = React.useState(false)

    const [activeTab, setActiveTab] = React.useState('active-orders')
    const [searchTerm, setSearchTerm] = React.useState('')

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'processing': return 'bg-blue-100 text-blue-700'
            case 'shipped': return 'bg-purple-100 text-purple-700'
            case 'delivered': return 'bg-green-100 text-green-700'
            case 'cancelled': return 'bg-red-100 text-red-700'
            case 'open': return 'bg-green-100 text-green-700'
            case 'closed': return 'bg-gray-100 text-gray-700'
            case 'evaluating': return 'bg-blue-100 text-blue-700'
            case 'draft': return 'bg-yellow-100 text-yellow-700'
            default: return 'bg-gray-100 text-gray-700'
        }
    }

    // --- Handlers ---
    const handleTrack = (order: Order) => {
        setSelectedOrder(order)
        setIsTrackingOpen(true)
    }

    const handleManageRFP = (rfp: RFP) => {
        setSelectedRFP(rfp)
        setIsManageRFPOpen(true)
    }

    const handleEvaluateBid = (bid: Bid) => {
        setSelectedBid(bid)
        setIsEvaluateOpen(true)
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold">My Procurements</h2>
                    <p className="text-gray-500">Manage orders, track deliveries, and handle active bids.</p>
                </div>
                <div className="flex gap-2">
                    <div className="relative w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                            placeholder="Search orders, RFPs..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9 bg-white"
                        />
                    </div>
                    <Button variant="outline"><Filter className="w-4 h-4 mr-2" /> Filter</Button>
                </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="bg-white/50 p-1 border">
                    <TabsTrigger value="active-orders" className="flex items-center gap-2">
                        <Truck className="w-4 h-4" /> Active Orders
                    </TabsTrigger>
                    <TabsTrigger value="upcoming-rfps" className="flex items-center gap-2">
                        <FileText className="w-4 h-4" /> Upcoming RFPs
                    </TabsTrigger>
                    <TabsTrigger value="pending-bids" className="flex items-center gap-2">
                        <Clock className="w-4 h-4" /> Pending Bids
                    </TabsTrigger>
                    <TabsTrigger value="completed" className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" /> Completed (90d)
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="active-orders">
                    <Card>
                        <CardHeader>
                            <CardTitle>Active Orders</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Order ID</TableHead>
                                        <TableHead>Supplier</TableHead>
                                        <TableHead>Items</TableHead>
                                        <TableHead>Amount</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Delivery ETA</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {MOCK_ORDERS.filter(o => ['processing', 'shipped'].includes(o.status)).map(order => (
                                        <TableRow key={order.id}>
                                            <TableCell className="font-mono font-medium">{order.id}</TableCell>
                                            <TableCell className="font-semibold">{order.supplier}</TableCell>
                                            <TableCell>{order.items}</TableCell>
                                            <TableCell>${order.amount.toLocaleString()}</TableCell>
                                            <TableCell>{order.date}</TableCell>
                                            <TableCell className="text-blue-600 font-medium">{order.deliveryEta}</TableCell>
                                            <TableCell>
                                                <Badge className={getStatusColor(order.status)} variant="secondary">
                                                    {order.status.toUpperCase()}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Button size="sm" variant="ghost" onClick={() => handleTrack(order)}>Track</Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="upcoming-rfps">
                    <Card>
                        <CardHeader><CardTitle>Open & Draft RFPs</CardTitle></CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>RFP ID</TableHead>
                                        <TableHead>Title</TableHead>
                                        <TableHead>Deadline</TableHead>
                                        <TableHead>Bids Received</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {MOCK_RFPS.filter(r => ['open', 'draft'].includes(r.status)).map(rfp => (
                                        <TableRow key={rfp.id}>
                                            <TableCell className="font-mono">{rfp.id}</TableCell>
                                            <TableCell className="font-semibold">{rfp.title}</TableCell>
                                            <TableCell>{rfp.deadline}</TableCell>
                                            <TableCell>{rfp.bidsReceived}</TableCell>
                                            <TableCell>
                                                <Badge className={getStatusColor(rfp.status)} variant="secondary">
                                                    {rfp.status.toUpperCase()}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Button size="sm" variant="outline" onClick={() => handleManageRFP(rfp)}>Manage</Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="pending-bids">
                    <Card>
                        <CardHeader><CardTitle>Bids Awaiting Evaluation</CardTitle></CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>RFP Context</TableHead>
                                        <TableHead>Supplier</TableHead>
                                        <TableHead>Bid Amount</TableHead>
                                        <TableHead>Submitted</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {MOCK_BIDS.map(bid => (
                                        <TableRow key={bid.id}>
                                            <TableCell className="font-medium">{bid.rfpTitle}</TableCell>
                                            <TableCell>{bid.supplier}</TableCell>
                                            <TableCell>${bid.amount.toLocaleString()}</TableCell>
                                            <TableCell>{bid.submittedDate}</TableCell>
                                            <TableCell>
                                                <Badge className="bg-orange-100 text-orange-700">Action Required</Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Button size="sm" onClick={() => handleEvaluateBid(bid)}>Evaluate</Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="completed">
                    <Card>
                        <CardHeader><CardTitle>Completed Orders (Last 90 Days)</CardTitle></CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Order ID</TableHead>
                                        <TableHead>Supplier</TableHead>
                                        <TableHead>Items</TableHead>
                                        <TableHead>Amount</TableHead>
                                        <TableHead>Delivered Date</TableHead>
                                        <TableHead>Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {MOCK_ORDERS.filter(o => o.status === 'delivered').map(order => (
                                        <TableRow key={order.id}>
                                            <TableCell className="font-mono text-gray-500">{order.id}</TableCell>
                                            <TableCell>{order.supplier}</TableCell>
                                            <TableCell>{order.items}</TableCell>
                                            <TableCell>${order.amount.toLocaleString()}</TableCell>
                                            <TableCell>{order.date}</TableCell>
                                            <TableCell>
                                                <Badge className={getStatusColor(order.status)} variant="secondary">
                                                    {order.status.toUpperCase()}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* --- DIALOGS --- */}

            {/* 1. Track Order Dialog */}
            <Dialog open={isTrackingOpen} onOpenChange={setIsTrackingOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Track Order {selectedOrder?.id}</DialogTitle>
                        <DialogDescription>{selectedOrder?.items} from {selectedOrder?.supplier}</DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <div className="space-y-6 border-l-2 border-gray-200 ml-4 pl-6 relative">
                            <div className="relative">
                                <div className="absolute -left-[31px] bg-green-500 h-4 w-4 rounded-full border-2 border-white"></div>
                                <h4 className="text-sm font-bold text-gray-900">Order Placed</h4>
                                <p className="text-xs text-gray-500">{selectedOrder?.date}</p>
                            </div>
                            <div className="relative">
                                <div className={`absolute -left-[31px] ${selectedOrder?.status === 'shipped' || selectedOrder?.status === 'delivered' ? 'bg-green-500' : 'bg-gray-200'} h-4 w-4 rounded-full border-2 border-white`}></div>
                                <h4 className="text-sm font-bold text-gray-900">Dispatched</h4>
                                <p className="text-xs text-gray-500">Carrier: DHL Logistics</p>
                            </div>
                            <div className="relative">
                                <div className={`absolute -left-[31px] ${selectedOrder?.status === 'delivered' ? 'bg-green-500' : 'bg-gray-200'} h-4 w-4 rounded-full border-2 border-white`}></div>
                                <h4 className="text-sm font-bold text-gray-900">Delivered</h4>
                                <p className="text-xs text-gray-500">ETA: {selectedOrder?.deliveryEta}</p>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* 2. Manage RFP Dialog */}
            <Dialog open={isManageRFPOpen} onOpenChange={setIsManageRFPOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Manage RFP: {selectedRFP?.title}</DialogTitle>
                        <DialogDescription>Review specs, invite suppliers, or close RFP.</DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-4 py-4">
                        <div className="p-4 bg-gray-50 rounded">
                            <p className="text-xs text-gray-500">Deadline</p>
                            <p className="font-medium">{selectedRFP?.deadline}</p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded">
                            <p className="text-xs text-gray-500">Bids Received</p>
                            <p className="font-medium">{selectedRFP?.bidsReceived}</p>
                        </div>
                        <div className="col-span-2 space-y-2">
                            <h4 className="text-sm font-semibold">Shortlisted Suppliers</h4>
                            <div className="flex gap-2">
                                <Badge variant="outline">Nairobi Millers</Badge>
                                <Badge variant="outline">Mombasa Grains</Badge>
                                <Button size="sm" variant="ghost" className="h-5 text-blue-600">+ Invite More</Button>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsManageRFPOpen(false)}>Close</Button>
                        <Button onClick={() => setIsManageRFPOpen(false)}>Save Changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* 3. Evaluate Bid Dialog */}
            <Dialog open={isEvaluateOpen} onOpenChange={setIsEvaluateOpen}>
                <DialogContent className="max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>Evaluate Bid</DialogTitle>
                        <DialogDescription>Bid from {selectedBid?.supplier} for {selectedBid?.rfpTitle}</DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-8 py-4">
                        <div>
                            <h4 className="font-semibold mb-2">Bid Details</h4>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between border-b pb-1"><span>Bid Amount:</span> <span className="font-bold">${selectedBid?.amount.toLocaleString()}</span></div>
                                <div className="flex justify-between border-b pb-1"><span>Submitted:</span> <span>{selectedBid?.submittedDate}</span></div>
                                <div className="flex justify-between border-b pb-1"><span>Valid Until:</span> <span>2025-02-01</span></div>
                            </div>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-2">Supplier Scorecard</h4>
                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between text-xs mb-1"><span>Quality History</span> <span className="text-green-600">98%</span></div>
                                    <div className="h-2 bg-gray-100 rounded-full"><div className="h-2 bg-green-500 rounded-full w-[98%]"></div></div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-xs mb-1"><span>Price Competitiveness</span> <span className="text-yellow-600">Avg</span></div>
                                    <div className="h-2 bg-gray-100 rounded-full"><div className="h-2 bg-yellow-500 rounded-full w-[50%]"></div></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="destructive">Reject Bid</Button>
                        <Button variant="default" className="bg-green-600 hover:bg-green-700">Accept Bid</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

// Missing Import Fix
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
