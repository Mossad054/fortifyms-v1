'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Package, FileCheck, AlertCircle, CheckCircle, Clock, AlertTriangle, ArrowRight, BarChart, FileText, Calculator, Microscope, Download } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

// Imports for Maintenance Approval
import { MaintenanceApproval } from '../operator/maintenance-approval'
import { INITIAL_TASKS } from '../operator/maintenance-module'

// --- Production View ---
export function ProductionView() {
    const [filter, setFilter] = React.useState({ line: 'all', product: 'all', shift: 'all' })
    const router = useRouter()

    // Batch Details State
    const [batchDetailsOpen, setBatchDetailsOpen] = React.useState(false)
    const [selectedBatch, setSelectedBatch] = React.useState<any>(null)

    const handleViewBatch = (batch: any) => {
        setSelectedBatch(batch)
        setBatchDetailsOpen(true)
    }

    // Mock data for maintenance
    const maintenanceData = [
        { machine: 'Doser A1', status: 'Due Soon', due: '2025-01-05', last: '2024-12-05', needs: 'Calibration Kit' },
        { machine: 'Mixer B2', status: 'Done', due: '2025-02-10', last: '2024-12-20', needs: '-' },
        { machine: 'Sensor X', status: 'Overdue', due: '2024-12-26', last: '2024-11-26', needs: 'Replacement Sensor' },
    ]

    // Mock data for daily production
    const dailyProduction = [
        { day: 'Dec 19', maize: 1200, rice: 800, wheat: 600 },
        { day: 'Dec 20', maize: 1350, rice: 750, wheat: 650 },
        { day: 'Dec 21', maize: 1100, rice: 900, wheat: 700 },
        { day: 'Dec 22', maize: 1450, rice: 850, wheat: 550 },
        { day: 'Dec 23', maize: 1300, rice: 800, wheat: 600 },
        { day: 'Dec 24', maize: 1250, rice: 900, wheat: 650 },
        { day: 'Dec 25', maize: 1400, rice: 850, wheat: 700 },
    ]

    // Mock data for recent batches with QC
    const recentBatches = [
        { id: 'B-2024-001', product: 'Maize', date: '2024-12-25', qcStatus: 'Pass', releaseStatus: 'Released', yield: 98 },
        { id: 'B-2024-002', product: 'Rice', date: '2024-12-25', qcStatus: 'Marginal', releaseStatus: 'Pending Approval', yield: 94 },
        { id: 'B-2024-003', product: 'Wheat', date: '2024-12-24', qcStatus: 'Pass', releaseStatus: 'Released', yield: 97 },
        { id: 'B-2024-004', product: 'Maize', date: '2024-12-24', qcStatus: 'Pass', releaseStatus: 'Pending Approval', yield: 96 },
        { id: 'B-2024-005', product: 'Rice', date: '2024-12-23', qcStatus: 'Fail', releaseStatus: 'Quarantined', yield: 89 },
        { id: 'B-2024-006', product: 'Maize', date: '2024-12-23', qcStatus: 'Pass', releaseStatus: 'Released', yield: 99 },
        { id: 'B-2024-007', product: 'Wheat', date: '2024-12-22', qcStatus: 'Marginal', releaseStatus: 'Released', yield: 95 },
        { id: 'B-2024-008', product: 'Rice', date: '2024-12-22', qcStatus: 'Pass', releaseStatus: 'Released', yield: 98 },
        { id: 'B-2024-009', product: 'Maize', date: '2024-12-21', qcStatus: 'Pass', releaseStatus: 'Released', yield: 97 },
        { id: 'B-2024-010', product: 'Wheat', date: '2024-12-21', qcStatus: 'Pass', releaseStatus: 'Released', yield: 96 },
    ]

    // Mock data for premix efficiency
    const premixEfficiency = [
        { batch: 'B-001', expected: 0.5, actual: 0.52, variance: 4 },
        { batch: 'B-002', expected: 0.4, actual: 0.44, variance: 10 },
        { batch: 'B-003', expected: 0.6, actual: 0.58, variance: -3.3 },
        { batch: 'B-004', expected: 0.5, actual: 0.51, variance: 2 },
        { batch: 'B-005', expected: 0.45, actual: 0.43, variance: -4.4 },
    ]

    // Mock data for equipment uptime
    const equipmentUptime = [
        { line: 'Line 1', uptime: 96, downtime: 4, reason: 'Scheduled maintenance' },
        { line: 'Line 2', uptime: 94, downtime: 6, reason: 'Doser calibration' },
        { line: 'Line 3', uptime: 98, downtime: 2, reason: 'Minor adjustment' },
    ]

    // Mock data for stock and logic for calculator
    const [selectedProductForCalc, setSelectedProductForCalc] = React.useState('maize')
    const stockLevels = {
        maize: { raw: 50000, premix: 200, bags: 5000 },
        rice: { raw: 30000, premix: 150, bags: 3000 },
        wheat: { raw: 40000, premix: 180, bags: 4000 },
    }

    // Recipes (kg per 1000kg batch)
    const recipes = {
        maize: { raw: 980, premix: 0.2, acc: 20 }, // acc is bags/packaging roughly
        rice: { raw: 990, premix: 0.15, acc: 10 },
        wheat: { raw: 985, premix: 0.25, acc: 15 },
    }



    // State for calculator inputs
    const [calcInputs, setCalcInputs] = React.useState({ raw: 50000, premix: 200 })

    // Update inputs when product changes (mocking fetching current stock)
    React.useEffect(() => {
        const stock = stockLevels[selectedProductForCalc as keyof typeof stockLevels]
        setCalcInputs({ raw: stock.raw, premix: stock.premix })
    }, [selectedProductForCalc])

    const calculateMaxProduction = (product: string) => {
        const recipe = recipes[product as keyof typeof recipes]

        const maxRaw = calcInputs.raw / recipe.raw
        const maxPremix = calcInputs.premix / recipe.premix
        // We will just use raw and premix for this simple calc
        return Math.floor(Math.min(maxRaw, maxPremix) * 1000) // in kg
    }

    const maxProduction = calculateMaxProduction(selectedProductForCalc)
    const batchesPossible = Math.floor(maxProduction / 1000)

    const getRowColor = (qcStatus: string, releaseStatus: string) => {
        if (qcStatus === 'Fail') return 'bg-red-50 border-l-4 border-l-red-500'
        if (qcStatus === 'Marginal') return 'bg-yellow-50 border-l-4 border-l-yellow-500'
        if (qcStatus === 'Pass' && releaseStatus === 'Released') return 'bg-green-50 border-l-4 border-l-green-500'
        if (qcStatus === 'Pass' && releaseStatus === 'Pending Approval') return 'bg-blue-50 border-l-4 border-l-blue-500'
        return ''
    }

    return (
        <div className="space-y-6">
            {/* Top Row: Daily Production & Stock Calculator */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Daily Production Chart - Wider */}
                <Card className="glass-card border-none shadow-sm lg:col-span-2">
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <CardTitle>Daily Production (Last 7 Days)</CardTitle>
                            <div className="flex gap-2">
                                <select className="text-sm border rounded px-2 py-1" value={filter.line} onChange={(e) => setFilter({ ...filter, line: e.target.value })}>
                                    <option value="all">All Lines</option>
                                    <option value="line1">Line 1</option>
                                    <option value="line2">Line 2</option>
                                    <option value="line3">Line 3</option>
                                </select>
                                <select className="text-sm border rounded px-2 py-1" value={filter.product} onChange={(e) => setFilter({ ...filter, product: e.target.value })}>
                                    <option value="all">All Products</option>
                                    <option value="maize">Maize</option>
                                    <option value="rice">Rice</option>
                                    <option value="wheat">Wheat</option>
                                </select>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <div className="w-full h-full flex items-center justify-center bg-slate-50 rounded-lg">
                            <div className="text-center text-muted-foreground">
                                <BarChart className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                                <p className="text-sm">Daily Production Chart</p>
                                <p className="text-xs text-muted-foreground mt-1">Monitor daily production output trends across all lines.</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Stock Check & Calculator - Narrower */}
                <Card className="glass-card border-none shadow-sm bg-blue-50/50">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Calculator className="w-5 h-5 text-blue-600" />
                            Production Planner
                        </CardTitle>
                        <p className="text-xs text-blue-700/80">Calculate max batches based on current stock.</p>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label>Select Product Line</Label>
                            <Select value={selectedProductForCalc} onValueChange={setSelectedProductForCalc}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="maize">Maize Flour</SelectItem>
                                    <SelectItem value="rice">Fortified Rice</SelectItem>
                                    <SelectItem value="wheat">Wheat Flour</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="bg-white p-3 rounded border space-y-2">
                                <Label className="text-muted-foreground text-xs">Raw Material (kg)</Label>
                                <Input
                                    type="number"
                                    value={calcInputs.raw}
                                    onChange={(e) => setCalcInputs({ ...calcInputs, raw: Number(e.target.value) })}
                                    className="font-bold text-lg h-9"
                                />
                            </div>
                            <div className="bg-white p-3 rounded border space-y-2">
                                <Label className="text-muted-foreground text-xs">Premix Stock (kg)</Label>
                                <Input
                                    type="number"
                                    value={calcInputs.premix}
                                    onChange={(e) => setCalcInputs({ ...calcInputs, premix: Number(e.target.value) })}
                                    className="font-bold text-lg h-9"
                                />
                            </div>
                        </div>

                        <div className="pt-4 border-t border-blue-200">
                            <div className="flex justify-between items-end mb-1">
                                <span className="font-medium text-blue-900">Max Production Capacity</span>
                                <span className="text-2xl font-bold text-blue-700">{(maxProduction / 1000).toFixed(1)} MT</span>
                            </div>
                            <p className="text-xs text-blue-600">
                                Enough for <span className="font-bold">{batchesPossible}</span> batches based on current premix availability.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Batch QC Table */}
            <Card className="glass-card border-none shadow-sm">
                <CardHeader>
                    <CardTitle>Recent Batch QC Status (Last 10 Batches)</CardTitle>
                    <p className="text-xs text-muted-foreground">Click on any batch to view detailed QC report and release status.</p>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        {recentBatches.map(batch => (
                            <div
                                key={batch.id}
                                className={`p-3 rounded-lg cursor-pointer hover:shadow-md transition-all ${getRowColor(batch.qcStatus, batch.releaseStatus)}`}
                                onClick={() => handleViewBatch(batch)}
                            >
                                <div className="grid grid-cols-6 gap-4 items-center">
                                    <div>
                                        <Badge variant="outline" className="font-mono bg-white">{batch.id}</Badge>
                                    </div>
                                    <div className="text-sm font-medium">{batch.product}</div>
                                    <div className="text-sm text-muted-foreground">{batch.date}</div>
                                    <div>
                                        <Badge className={
                                            batch.qcStatus === 'Pass' ? 'bg-green-100 text-green-700' :
                                                batch.qcStatus === 'Marginal' ? 'bg-yellow-100 text-yellow-700' :
                                                    'bg-red-100 text-red-700'
                                        }>
                                            {batch.qcStatus}
                                        </Badge>
                                    </div>
                                    <div className="text-sm">{batch.releaseStatus}</div>
                                    <div className="text-sm font-bold text-right">{batch.yield}%</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Bottom Row: Efficiency & Uptime Side-by-Side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Premix Usage Efficiency */}
                <Card className="glass-card border-none shadow-sm h-full">
                    <CardHeader>
                        <CardTitle>Premix Usage Efficiency</CardTitle>
                        <p className="text-xs text-muted-foreground">Compare expected vs actual premix usage per batch.</p>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {premixEfficiency.map(item => (
                                <div key={item.batch} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                    <div className="flex items-center gap-4 flex-1">
                                        <Badge variant="outline" className="font-mono">{item.batch}</Badge>
                                        <div className="flex gap-6 text-sm">
                                            <div>
                                                <span className="text-muted-foreground">Exp: </span>
                                                <span className="font-medium">{item.expected}kg</span>
                                            </div>
                                            <div>
                                                <span className="text-muted-foreground">Act: </span>
                                                <span className="font-medium">{item.actual}kg</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={`font-bold ${Math.abs(item.variance) > 5 ? 'text-orange-600' : 'text-green-600'}`}>
                                        {item.variance > 0 ? '+' : ''}{item.variance}%
                                        {Math.abs(item.variance) > 5 && <AlertTriangle className="w-4 h-4 inline ml-1" />}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Equipment Uptime */}
                <Card className="glass-card border-none shadow-sm h-full">
                    <CardHeader>
                        <CardTitle>Equipment Uptime (Last 7 Days)</CardTitle>
                        <p className="text-xs text-muted-foreground">Track machine availability and downtime reasons.</p>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {equipmentUptime.map(item => (
                                <div key={item.line} className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="font-medium">{item.line}</span>
                                        <span className="text-sm font-bold text-green-600">{item.uptime}% Uptime</span>
                                    </div>


                                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                                        <div
                                            className="bg-green-500 h-full rounded-full"
                                            style={{ width: `${item.uptime}%` }}
                                        />
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        Downtime ({item.downtime}%): {item.reason}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Maintenance & Diagnostics Card */}
            <Card className="glass-card border-none shadow-sm">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Microscope className="w-5 h-5 text-purple-600" />
                        Maintenance & Diagnostics
                    </CardTitle>
                    <p className="text-xs text-muted-foreground">Track machinery health, scheduled maintenance, and required parts.</p>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {maintenanceData.map((item, idx) => (
                                <div key={idx} className="border rounded-lg p-4 bg-white/50">
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-bold text-gray-900">{item.machine}</h4>
                                        <Badge variant="outline" className={`${item.status === 'Overdue' ? 'bg-red-100 text-red-700 border-red-200' :
                                                item.status === 'Due Soon' ? 'bg-amber-100 text-amber-700 border-amber-200' :
                                                    'bg-green-100 text-green-700 border-green-200'
                                            }`}>
                                            {item.status}
                                        </Badge>
                                    </div>
                                    <div className="space-y-1 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Due Date:</span>
                                            <span className="font-medium">{item.due}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Last Maint:</span>
                                            <span className="text-gray-600">{item.last}</span>
                                        </div>
                                        {item.needs !== '-' && (
                                            <div className="mt-2 pt-2 border-t flex items-start gap-2 text-xs text-blue-700">
                                                <Package className="w-3 h-3 mt-0.5" />
                                                <span>Need: {item.needs}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Batch Details Dialog */}
            <Dialog open={batchDetailsOpen} onOpenChange={setBatchDetailsOpen}>
                <DialogContent className="max-w-3xl">
                    <DialogHeader>
                        <div className="flex justify-between items-start">
                            <div>
                                <DialogTitle className="text-xl font-bold flex items-center gap-2">
                                    Batch Details: {selectedBatch?.id}
                                    <Badge className={
                                        selectedBatch?.qcStatus === 'Pass' ? 'bg-green-100 text-green-700 hover:bg-green-100' :
                                            selectedBatch?.qcStatus === 'Marginal' ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100' :
                                                'bg-red-100 text-red-700 hover:bg-red-100'
                                    }>
                                        {selectedBatch?.qcStatus}
                                    </Badge>
                                </DialogTitle>
                                <DialogDescription className="mt-1">
                                    Product: <span className="font-medium text-gray-900">{selectedBatch?.product}</span> •
                                    Date: <span className="font-medium text-gray-900">{selectedBatch?.date}</span>
                                </DialogDescription>
                            </div>
                            <Button variant="outline" size="sm">
                                <FileText className="w-4 h-4 mr-2" />
                                Print Report
                            </Button>
                        </div>
                    </DialogHeader>

                    {selectedBatch && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                            {/* Left Col: Production Data */}
                            <div className="space-y-4">
                                <h4 className="font-semibold text-sm bg-slate-100 p-2 rounded">Production Data</h4>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="text-muted-foreground block">Yield</span>
                                        <span className="font-bold text-lg">{selectedBatch.yield}%</span>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground block">Release Status</span>
                                        <span className="font-medium">{selectedBatch.releaseStatus}</span>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground block">Production Line</span>
                                        <span className="font-medium">Line 1 (Auto)</span>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground block">Operator</span>
                                        <span className="font-medium">John Doe</span>
                                    </div>
                                </div>
                            </div>

                            {/* Right Col: QC Tests (Mocked based on status) */}
                            <div className="space-y-4">
                                <h4 className="font-semibold text-sm bg-slate-100 p-2 rounded">QC Test Results</h4>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between items-center border-b pb-2">
                                        <span>Moisture Content</span>
                                        <span className={`font-mono ${selectedBatch.qcStatus === 'Fail' ? 'text-red-600 font-bold' : 'text-green-600'}`}>
                                            {selectedBatch.qcStatus === 'Fail' ? '15.2%' : '13.5%'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center border-b pb-2">
                                        <span>Iron Spot Test</span>
                                        <span className="font-mono text-green-600">Positive</span>
                                    </div>
                                    <div className="flex justify-between items-center border-b pb-2">
                                        <span>Visual Color</span>
                                        <span className="font-mono text-green-600">Normal</span>
                                    </div>
                                    <div className="flex justify-between items-center pb-2">
                                        <span>Fineness</span>
                                        <span className="font-mono text-green-600">&gt; 95%</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setBatchDetailsOpen(false)}>Close</Button>
                        <Button className="bg-blue-600 hover:bg-blue-700">Approve Release</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

// --- Compliance View ---
export function ComplianceView() {
    const router = useRouter()
    const [ncDialogOpen, setNcDialogOpen] = React.useState(false)
    const [selectedNC, setSelectedNC] = React.useState<any>(null)

    // COA Preview State
    const [coaPreviewOpen, setCoaPreviewOpen] = React.useState(false)
    const [selectedCOA, setSelectedCOA] = React.useState<any>(null)

    const handleViewCOA = (coa: any) => {
        setSelectedCOA(coa)
        setCoaPreviewOpen(true)
    }

    // State for QC Results Filter
    const [selectedNutrientProduct, setSelectedNutrientProduct] = React.useState('all')

    const handleViewNC = (nc: any) => {
        setSelectedNC(nc)
        setNcDialogOpen(true)
    }

    // Mock data for compliance score trend (12 months)
    const complianceTrend = [
        { month: 'Jan', score: 92 },
        { month: 'Feb', score: 94 },
        { month: 'Mar', score: 91 },
        { month: 'Apr', score: 95 },
        { month: 'May', score: 93 },
        { month: 'Jun', score: 96 },
        { month: 'Jul', score: 94 },
        { month: 'Aug', score: 97 },
        { month: 'Sep', score: 95 },
        { month: 'Oct', score: 96 },
        { month: 'Nov', score: 94 },
        { month: 'Dec', score: 98 },
    ]

    // Mock data for QC results by nutrient
    const nutrientResults = {
        Iron: [
            { batch: 'B-001', value: 23, target: { min: 20, max: 30 }, status: 'Pass', product: 'Maize Flour' },
            { batch: 'B-002', value: 28, target: { min: 20, max: 30 }, status: 'Pass', product: 'Wheat Flour' },
            { batch: 'B-003', value: 19, target: { min: 20, max: 30 }, status: 'Marginal', product: 'Maize Flour' },
            { batch: 'B-004', value: 25, target: { min: 20, max: 30 }, status: 'Pass', product: 'Wheat Flour' },
            { batch: 'B-005', value: 31, target: { min: 20, max: 30 }, status: 'Marginal', product: 'Maize Flour' },
        ],
        'Vitamin A': [
            { batch: 'B-001', value: 1.2, target: { min: 1.0, max: 1.5 }, status: 'Pass', product: 'Maize Flour' },
            { batch: 'B-002', value: 1.4, target: { min: 1.0, max: 1.5 }, status: 'Pass', product: 'Wheat Flour' },
            { batch: 'B-003', value: 0.9, target: { min: 1.0, max: 1.5 }, status: 'Fail', product: 'Maize Flour' },
            { batch: 'B-004', value: 1.3, target: { min: 1.0, max: 1.5 }, status: 'Pass', product: 'Wheat Flour' },
            { batch: 'B-005', value: 1.1, target: { min: 1.0, max: 1.5 }, status: 'Pass', product: 'Maize Flour' },
        ],
        Moisture: [
            { batch: 'B-001', value: 12.3, target: { min: 10, max: 14.5 }, status: 'Pass', product: 'Maize Flour' },
            { batch: 'B-002', value: 14.2, target: { min: 10, max: 14.5 }, status: 'Marginal', product: 'Wheat Flour' },
            { batch: 'B-003', value: 13.1, target: { min: 10, max: 14.5 }, status: 'Pass', product: 'Maize Flour' },
            { batch: 'B-004', value: 15.0, target: { min: 10, max: 14.5 }, status: 'Fail', product: 'Wheat Flour' },
            { batch: 'B-005', value: 11.8, target: { min: 10, max: 14.5 }, status: 'Pass', product: 'Maize Flour' },
        ],
    }

    // Mock data for non-conformances
    const nonConformances = [
        {
            id: 'NC-001',
            issue: 'Iron content below minimum',
            batch: 'B-2024-003',
            date: '2024-12-23',
            rootCause: 'Premix dosing rate error',
            correctiveAction: 'Recalibrated doser, retested batch',
            status: 'Closed',
        },
        {
            id: 'NC-002',
            issue: 'Moisture above limit',
            batch: 'B-2024-005',
            date: '2024-12-22',
            rootCause: 'Dryer temperature too low',
            correctiveAction: 'Adjusted dryer settings, batch quarantined',
            status: 'In Progress',
        },
        {
            id: 'NC-003',
            issue: 'Visual discoloration',
            batch: 'B-2024-007',
            date: '2024-12-20',
            rootCause: 'Raw material quality issue',
            correctiveAction: 'Supplier notified, batch released with note',
            status: 'Closed',
        },
    ]

    // Mock data for upcoming audits
    // Mock data for upcoming audits (Updated Layout)
    // Mock data for upcoming audits
    const upcomingAudits = [
        {
            id: 'AUD-001',
            date: '2025-01-15',
            scope: 'Annual FWGA Compliance Audit',
            readiness: 95,
        },
        {
            id: 'AUD-002',
            date: '2025-02-10',
            scope: 'ISO 22000 Surveillance',
            readiness: 78,
        },
    ]

    // New Mock Data: COA Issued
    const coaIssued = [
        {
            id: 'COA-2024-892',
            batch: 'B-24-12-005',
            client: 'Supermarkets Ltd',
            status: 'Sent',
            date: 'Dec 24, 2024',
            product: 'Maize Flour Premium',
            weight: '50 MT',
            results: [
                { parameter: 'Moisture Content', method: 'ISO 712', spec: 'Max 13.5%', result: '12.8%', status: 'Pass' },
                { parameter: 'Iron (NaFeEDTA)', method: 'AACC 40-70', spec: '> 20 mg/kg', result: '24.5 mg/kg', status: 'Pass' },
                { parameter: 'Zinc Oxide', method: 'AOAC 984.27', spec: '> 30 mg/kg', result: '32.1 mg/kg', status: 'Pass' },
                { parameter: 'Vitamin A', method: 'HPLC', spec: '> 1.0 mg/kg', result: '1.4 mg/kg', status: 'Pass' },
                { parameter: 'Aflatoxin', method: 'Test Kit', spec: '< 10 ppb', result: '2.5 ppb', status: 'Pass' },
            ]
        },
        {
            id: 'COA-2024-891',
            batch: 'B-24-12-004',
            client: 'National Distributors',
            status: 'Pending',
            date: 'Dec 23, 2024',
            product: 'Fortified Rice',
            weight: '25 MT',
            results: [
                { parameter: 'Moisture Content', method: 'ISO 712', spec: 'Max 14.0%', result: '13.2%', status: 'Pass' },
                { parameter: 'Iron (Ferric Pyro)', method: 'AACC 40-70', spec: '> 30 mg/kg', result: '29.5 mg/kg', status: 'Marginal' },
                { parameter: 'Folic Acid', method: 'Microbiological', spec: '> 1.5 mg/kg', result: '1.8 mg/kg', status: 'Pass' },
            ]
        },
        {
            id: 'COA-2024-890',
            batch: 'B-24-12-003',
            client: 'Regional Relief Org',
            status: 'Sent',
            date: 'Dec 22, 2024',
            product: 'Wheat Flour',
            weight: '100 MT',
            results: [
                { parameter: 'Moisture', method: 'ISO 712', spec: 'Max 14.0%', result: '13.1%', status: 'Pass' },
                { parameter: 'Protein', method: 'Kjeldahl', spec: '> 11.0%', result: '11.8%', status: 'Pass' },
                { parameter: 'Ash Content', method: 'ISO 2171', spec: '< 0.65%', result: '0.62%', status: 'Pass' },
            ]
        },
    ]

    // New Mock Data: Product Performance
    const productPerformance = [
        { product: 'Maize Flour', score: 98, trend: '+2%', issues: 0 },
        { product: 'Fortified Rice', score: 94, trend: '-1%', issues: 2 },
        { product: 'Wheat Flour', score: 96, trend: '+0.5%', issues: 1 },
    ]

    return (
        <div className="space-y-6">
            {/* Top Section - Compliance Trend & Product Performance Side-by-Side */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="glass-card border-none shadow-sm lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Compliance Score Trend (Last 12 Months)</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={complianceTrend} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                <XAxis dataKey="month" stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} domain={[85, 100]} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #E2E8F0' }}
                                    itemStyle={{ color: '#0F172A', fontWeight: 'bold' }}
                                />
                                <Line type="monotone" dataKey="score" stroke="#2563EB" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Product Performance Card */}
                <Card className="glass-card border-none shadow-sm">
                    <CardHeader>
                        <CardTitle>Product Performance</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {productPerformance.map((prod, idx) => (
                            <div key={idx} className="flex flex-col gap-1 pb-3 border-b last:border-0 last:pb-0">
                                <div className="flex justify-between items-center">
                                    <span className="font-semibold text-sm">{prod.product}</span>
                                    <span className={`text-xs font-bold ${prod.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>{prod.trend}</span>
                                </div>
                                <div className="flex justify-between items-center text-xs">
                                    <div className="w-24 bg-gray-200 rounded-full h-1.5">
                                        <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${prod.score}%` }} />
                                    </div>
                                    <span className="text-muted-foreground">{prod.score}% Score</span>
                                </div>
                                {prod.issues > 0 && (
                                    <div className="flex items-center gap-1 text-xs text-amber-600 mt-1">
                                        <AlertTriangle className="w-3 h-3" />
                                        {prod.issues} Active Issues
                                    </div>
                                )}
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>

            {/* QC Results by Nutrient */}
            <Card className="glass-card border-none shadow-sm">
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle>QC Results by Nutrient</CardTitle>
                        <Select value={selectedNutrientProduct} onValueChange={setSelectedNutrientProduct}>
                            <SelectTrigger className="w-[180px] h-8 text-xs">
                                <SelectValue placeholder="All Products" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Products</SelectItem>
                                <SelectItem value="Maize Flour">Maize Flour</SelectItem>
                                <SelectItem value="Wheat Flour">Wheat Flour</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {Object.entries(nutrientResults).map(([nutrient, results]) => (
                            <div key={nutrient} className="space-y-3">
                                <h4 className="font-bold text-gray-900 flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-blue-500" />
                                    {nutrient}
                                </h4>
                                <div className="space-y-2">
                                    {results
                                        .filter(r => selectedNutrientProduct === 'all' || r.product === selectedNutrientProduct)
                                        .map((result, idx) => (
                                            <div key={idx} className="flex items-center justify-between text-sm p-2 bg-slate-50 rounded">
                                                <span className="text-muted-foreground">{result.batch}</span>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium">{result.value}</span>
                                                    <div className={`w-2 h-2 rounded-full ${result.status === 'Pass' ? 'bg-green-500' :
                                                        result.status === 'Marginal' ? 'bg-yellow-500' :
                                                            'bg-red-500'
                                                        }`} />
                                                </div>
                                            </div>
                                        ))}
                                    {results.filter(r => selectedNutrientProduct === 'all' || r.product === selectedNutrientProduct).length === 0 && (
                                        <div className="text-xs text-muted-foreground text-center py-2">No data</div>
                                    )}
                                </div>
                                <div className="text-xs text-muted-foreground pt-2 border-t">
                                    Target: {results[0].target.min} - {results[0].target.max}
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Non-Conformance Log */}
            <Card className="glass-card border-none shadow-sm">
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle>Non-Conformance Log</CardTitle>
                        <Button variant="outline" size="sm">
                            <FileCheck className="w-4 h-4 mr-2" />
                            Export CSV
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {nonConformances.map(nc => (
                            <div key={nc.id} className="border rounded-lg p-4 hover:bg-slate-50 transition-colors">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <Badge variant="outline" className="font-mono">{nc.id}</Badge>
                                            <Badge className={nc.status === 'Closed' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}>
                                                {nc.status}
                                            </Badge>
                                            <Button variant="ghost" size="sm" className="h-6 text-xs text-blue-600 ml-2" onClick={() => handleViewNC(nc)}>
                                                View Details
                                            </Button>
                                        </div>
                                        <h4 className="font-bold text-gray-900">{nc.issue}</h4>
                                        <p className="text-sm text-muted-foreground">Batch: {nc.batch} • {nc.date}</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                    <div>
                                        <span className="text-muted-foreground font-medium">Root Cause:</span>
                                        <p className="mt-1">{nc.rootCause}</p>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground font-medium">Corrective Action:</span>
                                        <p className="mt-1">{nc.correctiveAction}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Bottom Row: Upcoming Audits & COA Issued */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Upcoming Audits (Resized) */}
                <Card className="glass-card border-none shadow-sm h-full">
                    <CardHeader>
                        <CardTitle>Upcoming Audits</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {upcomingAudits.map(audit => (
                                <div key={audit.id} className="border rounded-lg p-4">
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <h4 className="font-bold text-gray-900">{audit.scope}</h4>
                                            <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                                                <Clock className="w-4 h-4" />
                                                {audit.date}
                                            </p>
                                        </div>
                                        <Badge variant="outline" className="font-mono">{audit.id}</Badge>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-muted-foreground">Readiness</span>
                                            <span className={`font-bold ${audit.readiness >= 90 ? 'text-green-600' :
                                                audit.readiness >= 70 ? 'text-yellow-600' :
                                                    'text-red-600'
                                                }`}>
                                                {audit.readiness}%
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                                            <div
                                                className={`h-full rounded-full ${audit.readiness >= 90 ? 'bg-green-500' :
                                                    audit.readiness >= 70 ? 'bg-yellow-500' :
                                                        'bg-red-500'
                                                    }`}
                                                style={{ width: `${audit.readiness}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* COA Issued Card */}
                <Card className="glass-card border-none shadow-sm h-full">
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <CardTitle>Recent COAs Issued</CardTitle>
                            <Button variant="ghost" size="sm" className="text-blue-600">View All</Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {coaIssued.map((coa, idx) => (
                                <div key={idx} className="flex items-center justify-between p-3 border rounded-lg hover:bg-slate-50 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                                            <FileText className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm text-gray-900">{coa.id}</p>
                                            <p className="text-xs text-muted-foreground">{coa.client} • {coa.date}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-1">
                                        <div className="flex gap-2 mb-1">
                                            <Button variant="ghost" size="sm" className="h-6 text-xs px-2" onClick={() => handleViewCOA(coa)}>
                                                View
                                            </Button>
                                            <Badge variant="outline" className="font-mono text-xs">{coa.batch}</Badge>
                                        </div>
                                        <div className={`text-xs font-medium flex items-center gap-1 ${coa.status === 'Sent' ? 'text-green-600' : 'text-amber-600'
                                            }`}>
                                            {coa.status === 'Sent' ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                                            {coa.status}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Non-Conformance Details Dialog */}
            <Dialog open={ncDialogOpen} onOpenChange={setNcDialogOpen}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-red-500" />
                            Non-Conformance Details
                        </DialogTitle>
                        <DialogDescription>
                            Review details and required actions for Closure.
                        </DialogDescription>
                    </DialogHeader>
                    {selectedNC && (
                        <div className="space-y-4 py-2">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="text-muted-foreground block">ID</span>
                                    <span className="font-mono font-medium">{selectedNC.id}</span>
                                </div>
                                <div>
                                    <span className="text-muted-foreground block">Date</span>
                                    <span className="font-medium">{selectedNC.date}</span>
                                </div>
                                <div className="col-span-2">
                                    <span className="text-muted-foreground block">Issue</span>
                                    <span className="font-medium">{selectedNC.issue}</span>
                                </div>
                            </div>

                            <div className="bg-slate-50 p-4 rounded-lg border space-y-3">
                                <h4 className="font-semibold text-sm">Steps to Close</h4>
                                <div className="space-y-2 text-sm">
                                    <div className="flex items-center gap-2">
                                        <div className="w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs">1</div>
                                        <span>Investigate root cause (Machine/Process)</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-5 h-5 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-xs">2</div>
                                        <span>Implement corrective action</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-5 h-5 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-xs">3</div>
                                        <span>Verify effectiveness & Document</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setNcDialogOpen(false)}>Close</Button>
                        <Button className="bg-blue-600 hover:bg-blue-700">Update Status</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* COA Preview Dialog */}
            <Dialog open={coaPreviewOpen} onOpenChange={setCoaPreviewOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <div className="flex justify-between items-start border-b pb-4 mb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 rounded-lg text-blue-700">
                                    <FileText className="w-8 h-8" />
                                </div>
                                <div className="space-y-1">
                                    <DialogTitle className="text-xl font-bold">Certificate of Analysis</DialogTitle>
                                    <DialogDescription className="text-gray-500">
                                        Fortified Mill Products
                                    </DialogDescription>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-muted-foreground uppercase tracking-wider">Report ID</p>
                                <p className="font-mono font-bold text-gray-900">{selectedCOA?.id}</p>
                            </div>
                        </div>
                    </DialogHeader>

                    {selectedCOA && (
                        <div className="space-y-6">
                            {/* Product & Batch Info */}
                            <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                                <div>
                                    <p className="text-xs text-muted-foreground">Product</p>
                                    <p className="font-semibold text-gray-900">{selectedCOA.product}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Batch Number</p>
                                    <p className="font-mono font-semibold text-gray-900">{selectedCOA.batch}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Date of Manufacture</p>
                                    <p className="font-medium text-gray-900">{selectedCOA.date}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Total Weight</p>
                                    <p className="font-medium text-gray-900">{selectedCOA.weight}</p>
                                </div>
                            </div>

                            {/* Test Results Table */}
                            <div className="space-y-2">
                                <h4 className="font-bold text-gray-900 flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4 text-green-600" />
                                    Analytical Results
                                </h4>
                                <div className="border rounded-lg overflow-hidden">
                                    <table className="w-full text-sm">
                                        <thead className="bg-slate-100 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                            <tr>
                                                <th className="p-3">Parameter</th>
                                                <th className="p-3">Method</th>
                                                <th className="p-3">Specification</th>
                                                <th className="p-3">Result</th>
                                                <th className="p-3 text-right">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {selectedCOA?.results?.map((res: any, idx: number) => (
                                                <tr key={idx} className="bg-white hover:bg-slate-50">
                                                    <td className="p-3 font-medium text-gray-900">{res.parameter}</td>
                                                    <td className="p-3 text-gray-500">{res.method}</td>
                                                    <td className="p-3 text-gray-500">{res.spec}</td>
                                                    <td className="p-3 font-semibold text-gray-900">{res.result}</td>
                                                    <td className="p-3 text-right">
                                                        <Badge variant="outline" className={
                                                            res.status === 'Pass' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'
                                                        }>
                                                            {res.status}
                                                        </Badge>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Certification Footer */}
                            <div className="pt-6 border-t mt-6 grid grid-cols-2 gap-8">
                                <div>
                                    <div className="h-10 border-b border-gray-300 w-3/4 mb-2"></div>
                                    <p className="text-xs uppercase text-muted-foreground">Head of Quality Control</p>
                                    <p className="text-sm font-bold text-gray-900">Dr. Sarah Johnson</p>
                                </div>
                                <div className="text-right">
                                    <div className="h-10 border-b border-gray-300 w-3/4 ml-auto mb-2"></div>
                                    <p className="text-xs uppercase text-muted-foreground">Date of Issue</p>
                                    <p className="text-sm font-bold text-gray-900">{selectedCOA.date}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    <DialogFooter className="border-t pt-4 mt-4">
                        <Button variant="outline" onClick={() => setCoaPreviewOpen(false)}>Close</Button>
                        <Button>
                            <Download className="w-4 h-4 mr-2" />
                            Download PDF
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

// --- Alerts View ---

interface Alert {
    id: string
    title: string
    description: string
    timestamp: string
    priority: string
    source: string
    status: string
}

// Mock data for alerts
const alerts: Alert[] = [
    {
        id: 'ALT-001',
        title: 'QC Failure: Maize Batch B-2024-005',
        description: 'Moisture content (15%) exceeds limit (14.5%). Batch quarantined.',
        timestamp: '10 min ago',
        priority: 'high',
        source: 'QC',
        status: 'unread',
    },
    {
        id: 'ALT-002',
        title: 'Maintenance Due: Line 2 Doser',
        description: 'Scheduled calibration is overdue by 24 hours.',
        timestamp: '1 hour ago',
        priority: 'medium',
        source: 'Maintenance',
        status: 'unread',
    },
    {
        id: 'ALT-003',
        title: 'Low Stock: Premix Type A',
        description: 'Current level (150kg) below reorder point (200kg).',
        timestamp: '2 hours ago',
        priority: 'medium',
        source: 'Inventory',
        status: 'acknowledged',
    },
    {
        id: 'ALT-004',
        title: 'Compliance: COA Pending',
        description: 'Batch B-2024-009 requires COA generation for shipment.',
        timestamp: '3 hours ago',
        priority: 'high',
        source: 'Compliance',
        status: 'assigned',
    },
]

// --- Alerts View ---
export function AlertsView() {
    const [selectedAlert, setSelectedAlert] = React.useState<string | null>(null)

    const [alertList, setAlertList] = React.useState(alerts)
    const [dialogOpen, setDialogOpen] = React.useState(false)
    const [selectedAlertData, setSelectedAlertData] = React.useState<typeof alerts[0] | null>(null)

    const handleAction = (alertId: string, action: 'acknowledge' | 'assign' | 'escalate') => {
        setAlertList(prev => prev.map(a => {
            if (a.id !== alertId) return a
            let newStatus = a.status
            if (action === 'acknowledge') newStatus = 'acknowledged'
            if (action === 'assign') newStatus = 'assigned'
            return { ...a, status: newStatus }
        }))
        if (dialogOpen) setDialogOpen(false)
    }

    const onViewDetails = (alertId: string) => {
        const alert = alertList.find(a => a.id === alertId)
        if (alert) {
            setSelectedAlertData(alert)
            setDialogOpen(true)
        }
    }

    const highPriorityAlerts = alertList.filter(a => a.priority === 'high')
    const mediumPriorityAlerts = alertList.filter(a => a.priority === 'medium')

    const getSourceColor = (source: string) => {
        switch (source) {
            case 'QC': return 'bg-purple-100 text-purple-700 border-purple-200'
            case 'Maintenance': return 'bg-orange-100 text-orange-700 border-orange-200'
            case 'Compliance': return 'bg-blue-100 text-blue-700 border-blue-200'
            case 'Inventory': return 'bg-green-100 text-green-700 border-green-200'
            default: return 'bg-gray-100 text-gray-700 border-gray-200'
        }
    }

    return (
        <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="glass-card border-none shadow-sm">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">High Priority</p>
                                <p className="text-3xl font-bold text-red-600">{highPriorityAlerts.length}</p>
                            </div>
                            <AlertCircle className="w-10 h-10 text-red-500" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="glass-card border-none shadow-sm">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Medium Priority</p>
                                <p className="text-3xl font-bold text-yellow-600">{mediumPriorityAlerts.length}</p>
                            </div>
                            <AlertTriangle className="w-10 h-10 text-yellow-500" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="glass-card border-none shadow-sm">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Resolved Today</p>
                                <p className="text-3xl font-bold text-green-600">8</p>
                            </div>
                            <CheckCircle className="w-10 h-10 text-green-500" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* High Priority Alerts */}
            <Card className="glass-card border-none shadow-sm">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-red-600">
                        <AlertCircle className="w-5 h-5" />
                        High Priority Alerts
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {highPriorityAlerts.map(alert => (
                            <div
                                key={alert.id}
                                className={`rounded-lg p-4 border transition-all ${alert.status === 'unread' ? 'bg-red-50 border-red-200 shadow-sm' : 'bg-red-50/50 border-red-100 opacity-80'
                                    }`}
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Badge variant="outline" className={getSourceColor(alert.source)}>
                                                {alert.source}
                                            </Badge>
                                            <Badge variant="outline" className="font-mono text-xs">
                                                {alert.id}
                                            </Badge>
                                            {alert.status === 'acknowledged' && (
                                                <Badge className="bg-blue-100 text-blue-700">Acknowledged</Badge>
                                            )}
                                            {alert.status === 'assigned' && (
                                                <Badge className="bg-purple-100 text-purple-700">Assigned</Badge>
                                            )}
                                        </div>
                                        <h4 className="font-bold text-gray-900 mb-1">{alert.title}</h4>
                                        <p className="text-sm text-gray-600 mb-2">{alert.description}</p>
                                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {alert.timestamp}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="text-xs"
                                        onClick={() => handleAction(alert.id, 'acknowledge')}
                                    >
                                        <CheckCircle className="w-3 h-3 mr-1" />
                                        Acknowledge
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="text-xs"
                                        onClick={() => handleAction(alert.id, 'assign')}
                                    >
                                        <Package className="w-3 h-3 mr-1" />
                                        Assign
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="text-xs text-red-600 border-red-300 hover:bg-red-50"
                                        onClick={() => handleAction(alert.id, 'escalate')}
                                    >
                                        <AlertTriangle className="w-3 h-3 mr-1" />
                                        Escalate
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        className="text-xs ml-auto"
                                        onClick={() => onViewDetails(alert.id)}
                                    >
                                        View Details →
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Medium Priority Alerts */}
            <Card className="glass-card border-none shadow-sm">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-yellow-600">
                        <AlertTriangle className="w-5 h-5" />
                        Medium Priority Alerts
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {mediumPriorityAlerts.map(alert => (
                            <div
                                key={alert.id}
                                className={`rounded-lg p-4 border transition-all ${alert.status === 'unread' ? 'bg-yellow-50 border-yellow-200 shadow-sm' : 'bg-yellow-50/50 border-yellow-100 opacity-80'
                                    }`}
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Badge variant="outline" className={getSourceColor(alert.source)}>
                                                {alert.source}
                                            </Badge>
                                            <Badge variant="outline" className="font-mono text-xs">
                                                {alert.id}
                                            </Badge>
                                            {alert.status === 'acknowledged' && (
                                                <Badge className="bg-blue-100 text-blue-700">Acknowledged</Badge>
                                            )}
                                            {alert.status === 'assigned' && (
                                                <Badge className="bg-purple-100 text-purple-700">Assigned</Badge>
                                            )}
                                        </div>
                                        <h4 className="font-bold text-gray-900 mb-1">{alert.title}</h4>
                                        <p className="text-sm text-gray-600 mb-2">{alert.description}</p>
                                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {alert.timestamp}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="text-xs"
                                        onClick={() => handleAction(alert.id, 'acknowledge')}
                                    >
                                        <CheckCircle className="w-3 h-3 mr-1" />
                                        Acknowledge
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="text-xs"
                                        onClick={() => handleAction(alert.id, 'assign')}
                                    >
                                        <Package className="w-3 h-3 mr-1" />
                                        Assign
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        className="text-xs ml-auto"
                                        onClick={() => onViewDetails(alert.id)}
                                    >
                                        View Details →
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Detailed Alert Dialog */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline" className={selectedAlertData ? getSourceColor(selectedAlertData.source) : ''}>
                                {selectedAlertData?.source}
                            </Badge>
                            <Badge variant="outline" className="font-mono text-xs">
                                {selectedAlertData?.id}
                            </Badge>
                        </div>
                        <DialogTitle>{selectedAlertData?.title}</DialogTitle>
                        <DialogDescription>
                            {selectedAlertData?.timestamp}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div className="bg-slate-50 p-4 rounded-lg border">
                            <h4 className="font-semibold text-sm mb-2 text-gray-900">Description</h4>
                            <p className="text-sm text-gray-700">{selectedAlertData?.description}</p>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Recommended Action</label>
                            <div className="text-sm text-muted-foreground bg-blue-50/50 p-3 rounded border border-blue-100">
                                This alert requires immediate attention. Please verify the source issue and log a corrective action plan.
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="gap-2 sm:gap-0">
                        <div className="flex w-full gap-2">
                            <Button className="flex-1" variant="outline" onClick={() => setDialogOpen(false)}>Close</Button>
                            <Button className="flex-1 bg-blue-600 hover:bg-blue-700" onClick={() => handleAction(selectedAlert!, 'acknowledge')}>Take Action</Button>
                        </div>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

// --- Maintenance Approval View ---
export function MaintenanceApprovalView() {
    // Local state for approval handling within Manager View (mocking backend update)
    const [tasks, setTasks] = React.useState(INITIAL_TASKS)

    const handleAction = (id: string, notes: string, status: 'Completed' | 'Pending') => {
        setTasks(tasks.map(t => t.id === id ? { ...t, status: status, notes } : t))
    }

    // Filter to only show tasks that need approval (for demo consistency with component logic)
    // Actually MaintenanceApproval component does the filtering internally based on 'Completed' status (as "Pending Approval")
    // Note: In real app, 'Completed' by Operator might mean 'Pending Approval' for Manager.
    // Here we reuse INITIAL_TASKS, which might mock some completed tasks.

    return (
        <div className="h-[600px] border rounded-xl overflow-hidden bg-slate-50 p-4">
            <MaintenanceApproval
                tasks={tasks}
                onApprove={(id, notes) => handleAction(id, notes, 'Completed')}
                onReject={(id, notes) => handleAction(id, notes, 'Pending')}
            />
        </div>
    )
}
