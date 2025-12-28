'use client'

import * as React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import {
    MapPin, Building2, School, Hospital, Package, Layers,
    ZoomIn, ZoomOut, Maximize2, Download, Filter
} from 'lucide-react'

// Mock geographic data
const MOCK_MILLS = [
    { id: 'MILL-001', name: 'Nairobi Grain Mills', lat: -1.2921, lng: 36.8219, complianceScore: 92, production: 450000, status: 'certified' },
    { id: 'MILL-002', name: 'Mombasa Fortified Foods', lat: -4.0435, lng: 39.6682, complianceScore: 88, production: 320000, status: 'certified' },
    { id: 'MILL-003', name: 'Kisumu Processing Ltd', lat: -0.0917, lng: 34.7680, complianceScore: 75, production: 280000, status: 'provisional' },
    { id: 'MILL-004', name: 'Eldoret Mills Co', lat: 0.5143, lng: 35.2698, complianceScore: 95, production: 380000, status: 'certified' },
    { id: 'MILL-005', name: 'Nakuru Grain Processors', lat: -0.3031, lng: 36.0800, complianceScore: 68, production: 210000, status: 'provisional' },
    { id: 'MILL-006', name: 'Thika Fortification Hub', lat: -1.0332, lng: 37.0690, complianceScore: 90, production: 350000, status: 'certified' },
    // Expanded data
    { id: 'MILL-007', name: 'Machakos Flour', lat: -1.5177, lng: 37.2634, complianceScore: 82, production: 150000, status: 'certified' },
    { id: 'MILL-008', name: 'Nyeri Millers', lat: -0.4167, lng: 36.9500, complianceScore: 89, production: 180000, status: 'certified' },
    { id: 'MILL-009', name: 'Meru Processors', lat: 0.0470, lng: 37.6498, complianceScore: 71, production: 120000, status: 'provisional' },
    { id: 'MILL-010', name: 'Kitale Grain', lat: 1.0191, lng: 35.0023, complianceScore: 93, production: 250000, status: 'certified' },
    { id: 'MILL-011', name: 'Kericho Tea & Grain', lat: -0.3692, lng: 35.2839, complianceScore: 85, production: 160000, status: 'certified' },
    { id: 'MILL-012', name: 'Kakamega Millers', lat: 0.2827, lng: 34.7519, complianceScore: 65, production: 90000, status: 'provisional' },
    { id: 'MILL-013', name: 'Voi Grain Hub', lat: -3.3964, lng: 38.5566, complianceScore: 78, production: 110000, status: 'certified' },
    { id: 'MILL-014', name: 'Naivasha Processors', lat: -0.7172, lng: 36.4310, complianceScore: 88, production: 200000, status: 'certified' },
    { id: 'MILL-015', name: 'Kisii High Quality', lat: -0.6817, lng: 34.7667, complianceScore: 91, production: 175000, status: 'certified' },
    // Uganda Border
    { id: 'MILL-016', name: 'Busia Border Mills', lat: 0.4608, lng: 34.1115, complianceScore: 74, production: 130000, status: 'provisional' },
    { id: 'MILL-017', name: 'Malaba Grain', lat: 0.6333, lng: 34.2833, complianceScore: 83, production: 145000, status: 'certified' },
]

const MOCK_BUYERS = [
    { id: 'BUY-001', name: 'Nairobi Primary Schools', type: 'school', lat: -1.2864, lng: 36.8172 },
    { id: 'BUY-002', name: 'Kenyatta National Hospital', type: 'hospital', lat: -1.3018, lng: 36.8073 },
    { id: 'BUY-003', name: 'WFP Relief Center', type: 'relief_agency', lat: -1.2921, lng: 36.8344 },
    { id: 'BUY-004', name: 'Coast Schools Network', type: 'school', lat: -4.0500, lng: 39.6600 },
    { id: 'BUY-005', name: 'Rift Valley Hospitals', type: 'hospital', lat: 0.5200, lng: 35.2800 },
    // Expanded data
    { id: 'BUY-006', name: 'Kisumu District Hospital', type: 'hospital', lat: -0.1000, lng: 34.7500 },
    { id: 'BUY-007', name: 'Nyeri High School', type: 'school', lat: -0.4200, lng: 36.9600 },
    { id: 'BUY-008', name: 'Machakos Relief Depot', type: 'relief_agency', lat: -1.5200, lng: 37.2700 },
    { id: 'BUY-009', name: 'Thika Level 5', type: 'hospital', lat: -1.0400, lng: 37.0700 },
    { id: 'BUY-010', name: 'Eldoret University', type: 'school', lat: 0.5250, lng: 35.2750 },
    { id: 'BUY-011', name: 'Nakuru General', type: 'hospital', lat: -0.2800, lng: 36.0700 },
    { id: 'BUY-012', name: 'Kakamega Schools', type: 'school', lat: 0.2900, lng: 34.7600 },
    { id: 'BUY-013', name: 'Garissa Relief Hub', type: 'relief_agency', lat: -0.4532, lng: 39.6460 },
    { id: 'BUY-014', name: 'Turkana Aid Center', type: 'relief_agency', lat: 3.1167, lng: 35.6000 },
]

const MOCK_SUPPLY_ROUTES = [
    { millId: 'MILL-001', buyerId: 'BUY-001', volume: 45000 },
    { millId: 'MILL-001', buyerId: 'BUY-002', volume: 32000 },
    { millId: 'MILL-002', buyerId: 'BUY-004', volume: 28000 },
    { millId: 'MILL-004', buyerId: 'BUY-005', volume: 38000 },
    { millId: 'MILL-006', buyerId: 'BUY-003', volume: 25000 },
    { millId: 'MILL-010', buyerId: 'BUY-010', volume: 15000 },
    { millId: 'MILL-003', buyerId: 'BUY-006', volume: 22000 },
    { millId: 'MILL-008', buyerId: 'BUY-007', volume: 12000 },
    { millId: 'MILL-007', buyerId: 'BUY-008', volume: 18000 },
    { millId: 'MILL-016', buyerId: 'BUY-012', volume: 14000 },
]

const REGIONAL_PRODUCTION = [
    { region: 'Nairobi', totalOutput: 800000, color: '#3b82f6' },
    { region: 'Coast', totalOutput: 320000, color: '#10b981' },
    { region: 'Rift Valley', totalOutput: 660000, color: '#f59e0b' },
    { region: 'Western', totalOutput: 280000, color: '#8b5cf6' },
    { region: 'Central', totalOutput: 560000, color: '#ec4899' },
]

export function GeographicMap() {
    const [showMills, setShowMills] = React.useState(true)
    const [showBuyers, setShowBuyers] = React.useState(true)
    const [showRoutes, setShowRoutes] = React.useState(true)
    const [showChoropleth, setShowChoropleth] = React.useState(false)
    const [selectedCountry, setSelectedCountry] = React.useState('kenya')
    const [selectedCommodity, setSelectedCommodity] = React.useState('all')
    const [hoveredMill, setHoveredMill] = React.useState<string | null>(null)

    const getComplianceColor = (score: number) => {
        if (score >= 90) return '#10b981' // green
        if (score >= 70) return '#f59e0b' // yellow
        return '#ef4444' // red
    }

    const getBuyerIcon = (type: string) => {
        switch (type) {
            case 'school': return '🏫'
            case 'hospital': return '🏥'
            case 'relief_agency': return '📦'
            default: return '📍'
        }
    }

    return (
        <div className="space-y-6">
            {/* Map Controls */}
            <Card className="border-zinc-200 shadow-sm shrink-0">
                <CardContent className="p-4 flex flex-col lg:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-zinc-400" />
                        <div>
                            <h2 className="text-lg font-bold text-zinc-900">Geographic Intelligence</h2>
                            <p className="text-zinc-500 text-xs">Interactive mapping of program assets</p>
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row gap-4 flex-1 justify-end">
                        <div className="flex gap-2 items-center">
                            <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                                <SelectTrigger className="w-[140px] bg-white">
                                    <SelectValue placeholder="Country" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="kenya">Kenya</SelectItem>
                                    <SelectItem value="uganda">Uganda</SelectItem>
                                    <SelectItem value="tanzania">Tanzania</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select value={selectedCommodity} onValueChange={setSelectedCommodity}>
                                <SelectTrigger className="w-[140px] bg-white">
                                    <SelectValue placeholder="Commodity" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All</SelectItem>
                                    <SelectItem value="maize">Maize</SelectItem>
                                    <SelectItem value="wheat">Wheat</SelectItem>
                                    <SelectItem value="rice">Rice</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="h-8 w-px bg-zinc-200 hidden md:block" />

                        <div className="flex flex-wrap gap-4 items-center">
                            <div className="flex items-center gap-2">
                                <Checkbox
                                    id="mills"
                                    checked={showMills}
                                    onCheckedChange={(checked) => setShowMills(checked as boolean)}
                                />
                                <Label htmlFor="mills" className="text-sm cursor-pointer font-medium">Mills</Label>
                            </div>
                            <div className="flex items-center gap-2">
                                <Checkbox
                                    id="buyers"
                                    checked={showBuyers}
                                    onCheckedChange={(checked) => setShowBuyers(checked as boolean)}
                                />
                                <Label htmlFor="buyers" className="text-sm cursor-pointer font-medium">Buyers</Label>
                            </div>
                            <div className="flex items-center gap-2">
                                <Checkbox
                                    id="routes"
                                    checked={showRoutes}
                                    onCheckedChange={(checked) => setShowRoutes(checked as boolean)}
                                />
                                <Label htmlFor="routes" className="text-sm cursor-pointer font-medium">Routes</Label>
                            </div>
                            <div className="flex items-center gap-2">
                                <Checkbox
                                    id="choropleth"
                                    checked={showChoropleth}
                                    onCheckedChange={(checked) => setShowChoropleth(checked as boolean)}
                                />
                                <Label htmlFor="choropleth" className="text-sm cursor-pointer font-medium text-[#0A3225]">Heatmap</Label>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Map Container */}
            <Card className="border-none shadow-md overflow-hidden">
                <CardHeader className="bg-white border-b py-3 px-6">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-base flex items-center gap-2">
                            <Layers className="w-4 h-4 text-[#0A3225]" />
                            Live Asset Mapping
                        </CardTitle>
                        <div className="flex gap-1">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <ZoomIn className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <ZoomOut className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <Maximize2 className="w-4 h-4" />
                            </Button>
                            <div className="w-px h-4 bg-zinc-200 mx-1 self-center" />
                            <Button variant="outline" size="sm" className="h-8">
                                <Download className="w-3.5 h-3.5 mr-2" />
                                Export View
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="relative w-full h-[600px] bg-gradient-to-br from-blue-50 to-green-50 overflow-hidden">
                        {/* Map Background */}
                        <div className="absolute inset-0 opacity-90">
                            <img
                                src="/images/map_bg.png"
                                alt="Satellite Map View"
                                className="w-full h-full object-cover grayscale-[20%] contrast-125 brightness-90"
                            />
                            <div className="absolute inset-0 bg-[#0A3225]/10 mix-blend-overlay"></div>
                        </div>

                        {/* Regional Choropleth (if enabled) ... */}
                        {showChoropleth && (
                            <div className="absolute inset-0 pointer-events-none">
                                {REGIONAL_PRODUCTION.map((region, idx) => (
                                    <div
                                        key={region.region}
                                        className="absolute rounded-full opacity-20"
                                        style={{
                                            left: `${20 + idx * 15}%`,
                                            top: `${15 + idx * 12}%`,
                                            width: `${Math.sqrt(region.totalOutput / 10000)}px`,
                                            height: `${Math.sqrt(region.totalOutput / 10000)}px`,
                                            backgroundColor: region.color,
                                        }}
                                    />
                                ))}
                            </div>
                        )}

                        {/* Supply Routes ... */}
                        {showRoutes && MOCK_SUPPLY_ROUTES.map((route) => {
                            const mill = MOCK_MILLS.find(m => m.id === route.millId)
                            const buyer = MOCK_BUYERS.find(b => b.id === route.buyerId)
                            if (!mill || !buyer) return null

                            const millX = ((mill.lng + 42) / 6) * 100
                            const millY = ((mill.lat + 5) / 6) * 100
                            const buyerX = ((buyer.lng + 42) / 6) * 100
                            const buyerY = ((buyer.lat + 5) / 6) * 100

                            return (
                                <svg key={`${route.millId}-${route.buyerId}`} className="absolute inset-0 pointer-events-none">
                                    <line
                                        x1={`${millX}%`}
                                        y1={`${millY}%`}
                                        x2={`${buyerX}%`}
                                        y2={`${buyerY}%`}
                                        stroke="#3b82f6"
                                        strokeWidth="2"
                                        strokeDasharray="5,5"
                                        opacity="0.4"
                                    />
                                </svg>
                            )
                        })}

                        {/* Mill Markers ... */}
                        {showMills && MOCK_MILLS.map((mill) => {
                            const x = ((mill.lng + 42) / 6) * 100
                            const y = ((mill.lat + 5) / 6) * 100
                            const size = Math.sqrt(mill.production / 5000)

                            return (
                                <div
                                    key={mill.id}
                                    className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all hover:scale-125"
                                    style={{
                                        left: `${x}%`,
                                        top: `${y}%`,
                                    }}
                                    onMouseEnter={() => setHoveredMill(mill.id)}
                                    onMouseLeave={() => setHoveredMill(null)}
                                >
                                    <div
                                        className="rounded-full border-4 border-white shadow-lg flex items-center justify-center"
                                        style={{
                                            width: `${size}px`,
                                            height: `${size}px`,
                                            backgroundColor: getComplianceColor(mill.complianceScore),
                                        }}
                                    >
                                        <Building2 className="w-4 h-4 text-white" />
                                    </div>

                                    {/* Tooltip */}
                                    {hoveredMill === mill.id && (
                                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 bg-white rounded-lg shadow-xl p-3 border-2 border-gray-200 z-50">
                                            <h4 className="font-bold text-sm mb-1">{mill.name}</h4>
                                            <p className="text-xs text-gray-600 mb-2">{mill.id}</p>
                                            <div className="space-y-1 text-xs">
                                                <div className="flex justify-between">
                                                    <span>Compliance:</span>
                                                    <span className="font-semibold" style={{ color: getComplianceColor(mill.complianceScore) }}>
                                                        {mill.complianceScore}%
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>Production:</span>
                                                    <span className="font-semibold">{(mill.production / 1000).toFixed(1)}k kg</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>Status:</span>
                                                    <Badge className={mill.status === 'certified' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}>
                                                        {mill.status}
                                                    </Badge>
                                                </div>
                                            </div>
                                            <Button size="sm" className="w-full mt-2">View Profile</Button>
                                        </div>
                                    )}
                                </div>
                            )
                        })}

                        {/* Buyer Markers ... */}
                        {showBuyers && MOCK_BUYERS.map((buyer) => {
                            const x = ((buyer.lng + 42) / 6) * 100
                            const y = ((buyer.lat + 5) / 6) * 100

                            return (
                                <div
                                    key={buyer.id}
                                    className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all hover:scale-125"
                                    style={{
                                        left: `${x}%`,
                                        top: `${y}%`,
                                    }}
                                    title={buyer.name}
                                >
                                    <div className="text-2xl drop-shadow-lg">
                                        {getBuyerIcon(buyer.type)}
                                    </div>
                                </div>
                            )
                        })}

                        {/* Map Note */}
                        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 text-xs text-gray-600 max-w-xs border shadow-sm">
                            <p className="font-semibold mb-1 text-[#0A3225]">Interactive Map View</p>
                            <p>Hover over mills for production metrics. Using SVG layer for precision assets.</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Legend Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="hover:shadow-md transition-all">
                    <CardHeader className="py-2.5 bg-zinc-50 border-b">
                        <CardTitle className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Compliance Status</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-3 space-y-2">
                        <div className="flex items-center gap-3">
                            <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                            <span className="text-xs text-zinc-600 font-medium">Compliant (≥90%)</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                            <span className="text-xs text-zinc-600 font-medium">Marginal (70-89%)</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                            <span className="text-xs text-zinc-600 font-medium">Critical (&lt;70%)</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-all">
                    <CardHeader className="py-2.5 bg-zinc-50 border-b">
                        <CardTitle className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Stakeholder Map</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-3 space-y-2">
                        <div className="flex items-center gap-3">
                            <span className="text-xs grayscale opacity-70">🏫</span>
                            <span className="text-xs text-zinc-600 font-medium">Educational Institutions</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-xs grayscale opacity-70">🏥</span>
                            <span className="text-xs text-zinc-600 font-medium">Healthcare Facilities</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-xs grayscale opacity-70">📦</span>
                            <span className="text-xs text-zinc-600 font-medium">Relief distribution hubs</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-all">
                    <CardHeader className="py-2.5 bg-zinc-50 border-b">
                        <CardTitle className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Visual Aids</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-3 space-y-2">
                        <div className="flex items-center gap-3">
                            <div className="w-4 h-0.5 bg-[#0A3225]/50 border-dashed opacity-50" />
                            <span className="text-xs text-zinc-600 font-medium">Primary Supply Routes</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full bg-[#0A3225]/50 opacity-20 border border-blue-400" />
                            <span className="text-xs text-zinc-600 font-medium">Regional Output Heatmap</span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Regional Summaries */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {REGIONAL_PRODUCTION.map((region) => (
                    <Card key={region.region} className="hover:shadow-md transition-all border-none bg-white">
                        <CardHeader className="p-3 pb-0 flex flex-row items-center justify-between space-y-0 text-muted-foreground">
                            <CardTitle className="text-[10px] font-bold uppercase tracking-tighter">{region.region}</CardTitle>
                            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: region.color }} />
                        </CardHeader>
                        <CardContent className="p-3 pt-1">
                            <div className="text-xl font-bold" style={{ color: region.color }}>
                                {(region.totalOutput / 1000).toFixed(0)}k <span className="text-[10px] font-normal text-zinc-400">kg</span>
                            </div>
                            <div className="h-1 w-full bg-zinc-100 rounded-full mt-2 overflow-hidden">
                                <div className="h-full rounded-full transition-all duration-1000" style={{ backgroundColor: region.color, width: `${(region.totalOutput / 1000000) * 100}%` }} />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
