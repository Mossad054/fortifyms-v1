'use client'

import * as React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,

    TableHeader,
    TableRow,
} from '@/components/ui/table'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import {
    Package, TrendingUp, DollarSign, Clock, AlertCircle,
    CheckCircle2, Star, Download, MapPin, Users
} from 'lucide-react'
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

// Mock procurement data
const PROCUREMENT_METRICS = {
    rfpsPosted: 45,
    contractsAwarded: 38,
    totalContractValue: 4500000,
    avgContractSize: 118421,
    onTimeDeliveryRate: 92,
    qualityIssueRate: 3,
}

const PROCUREMENT_TREND = [
    { month: 'Jul', rfps: 6, contracts: 5, value: 580000 },
    { month: 'Aug', rfps: 7, contracts: 6, value: 720000 },
    { month: 'Sep', rfps: 8, contracts: 7, value: 850000 },
    { month: 'Oct', rfps: 9, contracts: 8, value: 920000 },
    { month: 'Nov', rfps: 7, contracts: 6, value: 680000 },
    { month: 'Dec', rfps: 8, contracts: 6, value: 750000 },
]

const DELIVERY_TRACKING = [
    { id: 'DEL-156', buyer: 'Nairobi Primary Schools', mill: 'MILL-001', volume: 45000, status: 'delivered', onTime: true, qualityIssue: false, deliveryDate: '2024-12-15' },
    { id: 'DEL-157', buyer: 'Coast Schools Network', mill: 'MILL-002', volume: 32000, status: 'in_transit', onTime: true, qualityIssue: false, deliveryDate: '2024-12-20' },
    { id: 'DEL-158', buyer: 'Kenyatta Hospital', mill: 'MILL-001', volume: 28000, status: 'delivered', onTime: false, qualityIssue: false, deliveryDate: '2024-12-10' },
    { id: 'DEL-159', buyer: 'WFP Relief Center', mill: 'MILL-006', volume: 25000, status: 'delivered', onTime: true, qualityIssue: true, deliveryDate: '2024-12-12' },
]

const BUYER_ANALYTICS = [
    { buyer: 'Nairobi Primary Schools', type: 'school', orders: 12, volume: 540000, satisfaction: 4.8, repeatRate: 100 },
    { buyer: 'Coast Schools Network', type: 'school', orders: 8, volume: 256000, satisfaction: 4.5, repeatRate: 88 },
    { buyer: 'Kenyatta Hospital', type: 'hospital', orders: 6, volume: 168000, satisfaction: 4.7, repeatRate: 100 },
    { buyer: 'Rift Valley Hospitals', type: 'hospital', orders: 5, volume: 190000, satisfaction: 4.6, repeatRate: 80 },
    { buyer: 'WFP Relief Center', type: 'relief_agency', orders: 7, volume: 175000, satisfaction: 4.4, repeatRate: 86 },
]

const VOLUME_BY_REGION = [
    { region: 'Nairobi', volume: 680000, coverage: 95 },
    { region: 'Coast', volume: 320000, coverage: 78 },
    { region: 'Rift Valley', volume: 520000, coverage: 85 },
    { region: 'Western', volume: 280000, coverage: 65 },
    { region: 'Central', volume: 450000, coverage: 88 },
]

const MARKET_COVERAGE = [
    { region: 'Nairobi', served: 45, underserved: 8, uncovered: 2, demand: 750000, supply: 680000 },
    { region: 'Coast', served: 28, underserved: 15, uncovered: 7, demand: 420000, supply: 320000 },
    { region: 'Rift Valley', served: 38, underserved: 12, uncovered: 5, demand: 580000, supply: 520000 },
    { region: 'Western', served: 22, underserved: 18, uncovered: 10, demand: 380000, supply: 280000 },
    { region: 'Central', served: 32, underserved: 10, uncovered: 3, demand: 490000, supply: 450000 },
]


export function InstitutionalSupply() {
    const [showGapAnalysis, setShowGapAnalysis] = React.useState(false)

    return (
        <div className="space-y-6">
            {/* Procurement Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 shrink-0">
                <Card className="hover:shadow-md transition-all border-zinc-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Pipeline Velocity</CardTitle>
                        <div className="p-2 rounded-full bg-blue-50">
                            <Package className="h-4 w-4 text-blue-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-black text-zinc-900">{PROCUREMENT_METRICS.rfpsPosted}</div>
                        <p className="text-[10px] text-zinc-500 font-bold mt-1 uppercase tracking-tighter">
                            {PROCUREMENT_METRICS.contractsAwarded} active contracts
                        </p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-all border-zinc-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Contract Value</CardTitle>
                        <div className="p-2 rounded-full bg-green-50">
                            <DollarSign className="h-4 w-4 text-green-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-black text-zinc-900">
                            ${(PROCUREMENT_METRICS.totalContractValue / 1000000).toFixed(1)}M
                        </div>
                        <p className="text-[10px] text-zinc-500 font-bold mt-1 uppercase tracking-tighter">
                            Avg: ${(PROCUREMENT_METRICS.avgContractSize / 1000).toFixed(0)}k per unit
                        </p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-all border-zinc-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Logistics SLA</CardTitle>
                        <div className="p-2 rounded-full bg-purple-50">
                            <Clock className="h-4 w-4 text-purple-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-black text-zinc-900">{PROCUREMENT_METRICS.onTimeDeliveryRate}%</div>
                        <p className="text-[10px] text-green-600 font-bold mt-1 uppercase tracking-tighter flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" /> Above Benchmark
                        </p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-all border-zinc-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Intake Quality</CardTitle>
                        <div className="p-2 rounded-full bg-orange-50">
                            <AlertCircle className="h-4 w-4 text-orange-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-black text-zinc-900">{PROCUREMENT_METRICS.qualityIssueRate}%</div>
                        <p className="text-[10px] text-zinc-500 font-bold mt-1 uppercase tracking-tighter">
                            Non-compliance rate
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Procurement Trend */}
            <Card className="hover:shadow-md transition-shadow border-none shadow-sm">
                <CardHeader className="border-b py-3 px-6 bg-white">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-base flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-blue-600" />
                            Procurement Performance Index
                        </CardTitle>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Download className="w-4 h-4" />
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="pt-6">
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={PROCUREMENT_TREND}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                            <XAxis dataKey="month" axisLine={false} tickLine={false} fontSize={12} />
                            <YAxis yAxisId="left" axisLine={false} tickLine={false} fontSize={12} />
                            <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} fontSize={12} />
                            <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                            <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 700, paddingTop: '10px' }} />
                            <Bar yAxisId="left" dataKey="rfps" fill="#3b82f6" name="RFPs Posted" radius={[4, 4, 0, 0]} barSize={20} />
                            <Bar yAxisId="left" dataKey="contracts" fill="#10b981" name="Contracts Awarded" radius={[4, 4, 0, 0]} barSize={20} />
                            <Line yAxisId="right" type="monotone" dataKey="value" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: '#fff' }} name="Contract Value ($)" />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Delivery Tracking */}
            <Card className="border-none shadow-md overflow-hidden bg-white">
                <CardHeader className="border-b py-3 px-6">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-base flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-zinc-400" />
                            Logistics Manifest
                        </CardTitle>
                        <Button variant="outline" size="sm" className="h-8">
                            <Download className="w-3.5 h-3.5 mr-2" />
                            Export Manifest
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader className="bg-zinc-50/50">
                            <TableRow>
                                <TableHead className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Manifest ID</TableHead>
                                <TableHead className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Destination Buyer</TableHead>
                                <TableHead className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Origin Mill</TableHead>
                                <TableHead className="text-right text-[10px] font-bold uppercase tracking-wider text-zinc-500">Volume (KG)</TableHead>
                                <TableHead className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Status</TableHead>
                                <TableHead className="text-center text-[10px] font-bold uppercase tracking-wider text-zinc-500">On-Time</TableHead>
                                <TableHead className="text-center text-[10px] font-bold uppercase tracking-wider text-zinc-500">Quality</TableHead>
                                <TableHead className="text-right text-[10px] font-bold uppercase tracking-wider text-zinc-500">ETA/Delivery</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {DELIVERY_TRACKING.map((delivery) => (
                                <TableRow key={delivery.id} className="hover:bg-zinc-50/50 transition-colors group">
                                    <TableCell className="font-mono text-[10px] font-bold text-zinc-500">{delivery.id}</TableCell>
                                    <TableCell className="font-bold text-zinc-900 text-xs">{delivery.buyer}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded bg-zinc-100 flex items-center justify-center text-[8px] font-black text-zinc-500">M</div>
                                            <span className="text-[10px] font-bold text-zinc-600 font-mono">{delivery.mill}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right font-black text-zinc-900 text-xs">
                                        {delivery.volume.toLocaleString()}
                                    </TableCell>
                                    <TableCell>
                                        <Badge className={`border-none px-2 py-0 h-5 text-[9px] font-black tracking-widest ${delivery.status === 'delivered' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                                            }`}>
                                            {delivery.status.replace('_', ' ').toUpperCase()}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <div className="flex justify-center">
                                            {delivery.onTime ? (
                                                <div className="w-5 h-5 rounded-full bg-green-50 flex items-center justify-center"><CheckCircle2 className="w-3.5 h-3.5 text-green-600" /></div>
                                            ) : (
                                                <div className="w-5 h-5 rounded-full bg-red-50 flex items-center justify-center"><Clock className="w-3.5 h-3.5 text-red-600" /></div>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <div className="flex justify-center">
                                            {delivery.qualityIssue ? (
                                                <div className="w-5 h-5 rounded-full bg-red-50 flex items-center justify-center"><AlertCircle className="w-3.5 h-3.5 text-red-600" /></div>
                                            ) : (
                                                <div className="w-5 h-5 rounded-full bg-green-50 flex items-center justify-center"><CheckCircle2 className="w-3.5 h-3.5 text-green-600" /></div>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right text-[10px] font-bold text-zinc-500">
                                        {new Date(delivery.deliveryDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    {/* Quality Issue Analytics */}
                    <div className="p-4 bg-zinc-50 border-t">
                        <div className="flex items-start gap-3 p-3 bg-white rounded-2xl border border-zinc-200">
                            <div className="p-2 bg-orange-50 rounded-lg">
                                <AlertCircle className="w-4 h-4 text-orange-600" />
                            </div>
                            <div>
                                <h4 className="font-bold text-[11px] text-zinc-900">Intelligence Note: Shipment Anomaly</h4>
                                <p className="text-[10px] text-zinc-500 mt-0.5 leading-relaxed font-medium">
                                    Quality exception in <span className="font-bold text-zinc-900">DEL-159</span> correlated with mid-month equipment drift at origin. Recalibration protocols updated for all regional hubs.
                                </p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Buyer Analytics */}
            <Card className="border-none shadow-md overflow-hidden bg-white">
                <CardHeader className="border-b py-3 px-6">
                    <CardTitle className="text-base flex items-center gap-2">
                        <Users className="w-4 h-4 text-zinc-400" />
                        Network Buyer Intelligence
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader className="bg-zinc-50/50">
                            <TableRow>
                                <TableHead className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Buyer Identifier</TableHead>
                                <TableHead className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Segment</TableHead>
                                <TableHead className="text-center text-[10px] font-bold uppercase tracking-wider text-zinc-500">Order Freq</TableHead>
                                <TableHead className="text-right text-[10px] font-bold uppercase tracking-wider text-zinc-500">Lifetime Volume</TableHead>
                                <TableHead className="text-center text-[10px] font-bold uppercase tracking-wider text-zinc-500">CSAT Score</TableHead>
                                <TableHead className="text-center text-[10px] font-bold uppercase tracking-wider text-zinc-500">Retention</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {BUYER_ANALYTICS.map((buyer) => (
                                <TableRow key={buyer.buyer} className="hover:bg-zinc-50/50 transition-colors group">
                                    <TableCell className="font-bold text-zinc-900 text-xs">{buyer.buyer}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="border-zinc-200 text-[8px] font-black tracking-widest h-5">
                                            {buyer.type.replace('_', ' ').toUpperCase()}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-center font-bold text-zinc-600 text-xs">{buyer.orders}</TableCell>
                                    <TableCell className="text-right font-black text-zinc-900 text-xs">
                                        {buyer.volume.toLocaleString()} KG
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <div className="flex items-center justify-center gap-1">
                                            <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                                            <span className="font-black text-zinc-900 text-xs">{buyer.satisfaction}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <div className={`inline-flex items-center justify-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${buyer.repeatRate >= 90 ? 'bg-green-50 text-green-700 border-green-100' : 'bg-orange-50 text-orange-700 border-orange-100'
                                            }`}>
                                            {buyer.repeatRate}%
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Market Coverage Analysis */}
            <Card className="border-none shadow-md overflow-hidden bg-white">
                <CardHeader className="border-b py-3 px-6">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-base flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-blue-600" />
                            Market Penetration Matrix
                        </CardTitle>

                        <Button variant="outline" size="sm" className="h-8" onClick={() => setShowGapAnalysis(true)}>
                            <Download className="w-3.5 h-3.5 mr-2" />
                            Gap Analysis
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {MARKET_COVERAGE.map((region) => {
                            const supplyGap = region.demand - region.supply
                            const coveragePercent = (region.supply / region.demand) * 100

                            return (
                                <div key={region.region} className="flex flex-col border-2 border-zinc-100 rounded-2xl overflow-hidden hover:border-blue-100 transition-all group bg-white shadow-sm">
                                    <div className="p-4 border-b bg-zinc-50/50 flex items-center justify-between">
                                        <h4 className="font-bold text-zinc-900 text-sm">{region.region}</h4>
                                        <div className={`px-2 py-0.5 rounded-full text-[9px] font-black tracking-tighter ${coveragePercent >= 90 ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                                            }`}>
                                            {coveragePercent.toFixed(0)}% COVERAGE
                                        </div>
                                    </div>

                                    <div className="p-4 space-y-4">
                                        <div className="grid grid-cols-3 gap-2">
                                            <div className="p-2 bg-zinc-50 rounded-xl border border-zinc-100 flex flex-col items-center">
                                                <span className="text-sm font-black text-zinc-900">{region.served}</span>
                                                <span className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest">Served</span>
                                            </div>
                                            <div className="p-2 bg-zinc-50 rounded-xl border border-zinc-100 flex flex-col items-center">
                                                <span className="text-sm font-black text-zinc-900">{region.underserved}</span>
                                                <span className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest">Partial</span>
                                            </div>
                                            <div className="p-2 bg-zinc-50 rounded-xl border border-zinc-100 flex flex-col items-center">
                                                <span className="text-sm font-black text-red-600">{region.uncovered}</span>
                                                <span className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest">Gaps</span>
                                            </div>
                                        </div>

                                        <div className="space-y-1.5">
                                            <div className="flex justify-between items-end">
                                                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-tight">Demand Fulfillment</span>
                                                <span className="text-xs font-black text-zinc-900">
                                                    {(region.supply / 1000).toFixed(0)}k / {(region.demand / 1000).toFixed(0)}k KG
                                                </span>
                                            </div>
                                            <div className="h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full transition-all duration-1000 ${coveragePercent >= 90 ? 'bg-green-500' : 'bg-orange-500'
                                                        }`}
                                                    style={{ width: `${coveragePercent}%` }}
                                                />
                                            </div>
                                        </div>

                                        <div className="pt-2">
                                            {supplyGap > 0 ? (
                                                <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-xl border border-blue-100">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                                                    <p className="text-[10px] text-blue-700 font-bold">
                                                        {supplyGap > 100000 ? 'Strategic priority: Capacity expansion required' : 'Tactical note: Equipment optimization potential'}
                                                    </p>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2 p-2 bg-green-50 rounded-xl border border-green-100">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                                    <p className="text-[10px] text-green-700 font-bold text-center w-full">Demand fully satisfied</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </CardContent>
            </Card>

            {/* Gap Analysis Dialog */}
            <Dialog open={showGapAnalysis} onOpenChange={setShowGapAnalysis}>
                <DialogContent className="max-w-3xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-blue-600" />
                            Supply-Demand Gap Analysis
                        </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <Card className="bg-orange-50 border-orange-100">
                                <CardContent className="p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <AlertCircle className="w-4 h-4 text-orange-600" />
                                        <h4 className="font-bold text-sm text-orange-900">Critical Shortfall</h4>
                                    </div>
                                    <p className="text-2xl font-black text-orange-700">120,000 KG</p>
                                    <p className="text-xs text-orange-600">Western Region Deficit</p>
                                </CardContent>
                            </Card>
                            <Card className="bg-blue-50 border-blue-100">
                                <CardContent className="p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <TrendingUp className="w-4 h-4 text-blue-600" />
                                        <h4 className="font-bold text-sm text-blue-900">Optimization Opportunity</h4>
                                    </div>
                                    <p className="text-2xl font-black text-blue-700">+45,000 KG</p>
                                    <p className="text-xs text-blue-600">Nairobi Surplus Available</p>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="bg-zinc-50 rounded-xl p-4 border">
                            <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-4">Regional Allocation matrix</h4>
                            <div className="space-y-4">
                                {MARKET_COVERAGE.map(region => {
                                    const gap = region.demand - region.supply
                                    const isDeficit = gap > 0
                                    return (
                                        <div key={region.region} className="flex items-center justify-between text-sm">
                                            <div className="w-32 font-medium">{region.region}</div>
                                            <div className="flex-1 px-4">
                                                <div className="h-2 bg-zinc-200 rounded-full overflow-hidden flex">
                                                    <div
                                                        className="h-full bg-blue-500"
                                                        style={{ width: `${Math.min((region.supply / region.demand) * 100, 100)}%` }}
                                                    />
                                                    {isDeficit && (
                                                        <div className="h-full bg-red-400 opacity-50 flex-1" />
                                                    )}
                                                </div>
                                            </div>
                                            <div className={`w-24 text-right font-bold ${isDeficit ? 'text-red-600' : 'text-green-600'}`}>
                                                {isDeficit ? `-${(gap / 1000).toFixed(1)}k` : 'OK'}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                            <h4 className="font-bold text-blue-900 text-sm mb-2">AI Recommendation</h4>
                            <p className="text-xs text-blue-700 leading-relaxed">
                                Reroute 45k KG from <span className="font-bold">Nairobi</span> surplus to <span className="font-bold">Western</span> region to mitigate critical shortfall. Estimated impact: reduces Western deficit by 38%.
                            </p>
                            <Button size="sm" className="mt-3 bg-blue-600 hover:bg-blue-700 text-white w-full">
                                Apply Allocation Strategy
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
