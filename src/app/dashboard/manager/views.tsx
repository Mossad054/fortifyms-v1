'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Package, FileCheck, AlertCircle, CheckCircle, Clock, AlertTriangle, ArrowRight, BarChart } from 'lucide-react'

// Imports for Maintenance Approval
import { MaintenanceApproval } from '../operator/maintenance-approval'
import { INITIAL_TASKS } from '../operator/maintenance-module'

// --- Production View ---
export function ProductionView() {
    const [filter, setFilter] = React.useState({ line: 'all', product: 'all', shift: 'all' })
    const router = useRouter()

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

    const getRowColor = (qcStatus: string, releaseStatus: string) => {
        if (qcStatus === 'Fail') return 'bg-red-50 border-l-4 border-l-red-500'
        if (qcStatus === 'Marginal') return 'bg-yellow-50 border-l-4 border-l-yellow-500'
        if (qcStatus === 'Pass' && releaseStatus === 'Released') return 'bg-green-50 border-l-4 border-l-green-500'
        if (qcStatus === 'Pass' && releaseStatus === 'Pending Approval') return 'bg-blue-50 border-l-4 border-l-blue-500'
        return ''
    }

    return (
        <div className="space-y-6">
            {/* Daily Production Chart */}
            <Card className="glass-card border-none shadow-sm">
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
                            <p className="text-xs">(Recharts integration required)</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Recent Batch QC Table */}
            <Card className="glass-card border-none shadow-sm">
                <CardHeader>
                    <CardTitle>Recent Batch QC Status (Last 10 Batches)</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        {recentBatches.map(batch => (
                            <div
                                key={batch.id}
                                className={`p-3 rounded-lg cursor-pointer hover:shadow-md transition-all ${getRowColor(batch.qcStatus, batch.releaseStatus)}`}
                                onClick={() => console.log('Open batch detail:', batch.id)}
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

            {/* Premix Usage Efficiency */}
            <Card className="glass-card border-none shadow-sm">
                <CardHeader>
                    <CardTitle>Premix Usage Efficiency</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {premixEfficiency.map(item => (
                            <div key={item.batch} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                <div className="flex items-center gap-4 flex-1">
                                    <Badge variant="outline" className="font-mono">{item.batch}</Badge>
                                    <div className="flex gap-6 text-sm">
                                        <div>
                                            <span className="text-muted-foreground">Expected: </span>
                                            <span className="font-medium">{item.expected} kg</span>
                                        </div>
                                        <div>
                                            <span className="text-muted-foreground">Actual: </span>
                                            <span className="font-medium">{item.actual} kg</span>
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
            <Card className="glass-card border-none shadow-sm">
                <CardHeader>
                    <CardTitle>Equipment Uptime (Last 7 Days)</CardTitle>
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
    )
}

// --- Compliance View ---
export function ComplianceView() {
    const router = useRouter()

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
            { batch: 'B-001', value: 23, target: { min: 20, max: 30 }, status: 'Pass' },
            { batch: 'B-002', value: 28, target: { min: 20, max: 30 }, status: 'Pass' },
            { batch: 'B-003', value: 19, target: { min: 20, max: 30 }, status: 'Marginal' },
            { batch: 'B-004', value: 25, target: { min: 20, max: 30 }, status: 'Pass' },
            { batch: 'B-005', value: 31, target: { min: 20, max: 30 }, status: 'Marginal' },
        ],
        'Vitamin A': [
            { batch: 'B-001', value: 1.2, target: { min: 1.0, max: 1.5 }, status: 'Pass' },
            { batch: 'B-002', value: 1.4, target: { min: 1.0, max: 1.5 }, status: 'Pass' },
            { batch: 'B-003', value: 0.9, target: { min: 1.0, max: 1.5 }, status: 'Fail' },
            { batch: 'B-004', value: 1.3, target: { min: 1.0, max: 1.5 }, status: 'Pass' },
            { batch: 'B-005', value: 1.1, target: { min: 1.0, max: 1.5 }, status: 'Pass' },
        ],
        Moisture: [
            { batch: 'B-001', value: 12.3, target: { min: 10, max: 14.5 }, status: 'Pass' },
            { batch: 'B-002', value: 14.2, target: { min: 10, max: 14.5 }, status: 'Marginal' },
            { batch: 'B-003', value: 13.1, target: { min: 10, max: 14.5 }, status: 'Pass' },
            { batch: 'B-004', value: 15.0, target: { min: 10, max: 14.5 }, status: 'Fail' },
            { batch: 'B-005', value: 11.8, target: { min: 10, max: 14.5 }, status: 'Pass' },
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
        {
            id: 'AUD-003',
            date: '2025-03-05',
            scope: 'Internal Quality Audit',
            readiness: 100,
        },
    ]

    return (
        <div className="space-y-6">
            {/* Compliance Score Trend */}
            <Card className="glass-card border-none shadow-sm">
                <CardHeader>
                    <CardTitle>Compliance Score Trend (Last 12 Months)</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                    <div className="w-full h-full flex items-center justify-center bg-slate-50 rounded-lg">
                        <div className="text-center text-muted-foreground">
                            <BarChart className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                            <p className="text-sm">Compliance Trend Line Chart</p>
                            <p className="text-xs">(Recharts integration required)</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* QC Results by Nutrient */}
            <Card className="glass-card border-none shadow-sm">
                <CardHeader>
                    <CardTitle>QC Results by Nutrient (Recent Batches)</CardTitle>
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
                                    {results.map((result, idx) => (
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

            {/* Upcoming Audits */}
            <Card className="glass-card border-none shadow-sm">
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
        </div>
    )
}

// --- Alerts View ---
export function AlertsView() {
    const [selectedAlert, setSelectedAlert] = React.useState<string | null>(null)

    // Mock alerts data with priority and source
    const alerts = [
        // High Priority
        {
            id: 'ALT-001',
            priority: 'high',
            source: 'QC',
            title: 'QC Failure - Batch B-2024-005',
            description: 'Iron content below minimum threshold (18 ppm vs 20 ppm target). Batch quarantined pending review.',
            timestamp: '2 hours ago',
            status: 'unread',
        },
        {
            id: 'ALT-002',
            priority: 'high',
            source: 'Maintenance',
            title: 'Calibration Overdue - Doser A1',
            description: 'Volumetric Doser A1 calibration expired 3 hours ago. Production line halted.',
            timestamp: '3 hours ago',
            status: 'unread',
        },
        {
            id: 'ALT-003',
            priority: 'high',
            source: 'Compliance',
            title: 'Audit Documentation Missing',
            description: 'Required FWGA audit documents incomplete. Deadline: 48 hours.',
            timestamp: '5 hours ago',
            status: 'acknowledged',
        },
        // Medium Priority
        {
            id: 'ALT-004',
            priority: 'medium',
            source: 'Inventory',
            title: 'Premix Stock Low',
            description: 'Iron Premix (Batch PRE-992) at 15% capacity. Reorder recommended.',
            timestamp: '1 day ago',
            status: 'unread',
        },
        {
            id: 'ALT-005',
            priority: 'medium',
            source: 'Maintenance',
            title: 'Scheduled Maintenance Due',
            description: 'Mixer M1 scheduled maintenance due in 3 days.',
            timestamp: '1 day ago',
            status: 'assigned',
        },
        {
            id: 'ALT-006',
            priority: 'medium',
            source: 'QC',
            title: 'Marginal QC Result Trend',
            description: 'Moisture levels trending toward upper limit (3 batches at 14.0-14.5%).',
            timestamp: '2 days ago',
            status: 'unread',
        },
    ]

    const highPriorityAlerts = alerts.filter(a => a.priority === 'high')
    const mediumPriorityAlerts = alerts.filter(a => a.priority === 'medium')

    const handleAction = (alertId: string, action: 'acknowledge' | 'assign' | 'escalate') => {
        console.log(`Action: ${action} on alert ${alertId}`)
        // TODO: API call to update alert status
    }

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
                <Card className="border-l-4 border-l-red-500">
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
                <Card className="border-l-4 border-l-yellow-500">
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
                <Card className="border-l-4 border-l-green-500">
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
                                className={`border-l-4 border-l-red-500 bg-red-50/30 rounded-lg p-4 ${alert.status === 'unread' ? 'border-2 border-red-200' : ''
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
                                        onClick={() => setSelectedAlert(alert.id)}
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
                                className={`border-l-4 border-l-yellow-500 bg-yellow-50/30 rounded-lg p-4 ${alert.status === 'unread' ? 'border-2 border-yellow-200' : ''
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
                                        onClick={() => setSelectedAlert(alert.id)}
                                    >
                                        View Details →
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
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
