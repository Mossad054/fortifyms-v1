'use client'

import * as React from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import {
    ArrowLeft, TrendingUp, TrendingDown, Minus, AlertTriangle,
    CheckCircle, XCircle, Download, FileText, Beaker, Wrench,
    Calendar, Flag, Eye
} from 'lucide-react'
import { MillComplianceProfile, NonConformance, MOCK_ASSIGNED_MILLS } from '../types'

export default function MillComplianceProfilePage() {
    const router = useRouter()
    const params = useParams()
    const millId = params?.id as string

    // Mock mill data - in real app, fetch from API
    const mill = MOCK_ASSIGNED_MILLS.find(m => m.millId === millId) || MOCK_ASSIGNED_MILLS[0]

    // Mock non-conformances
    const nonConformances: NonConformance[] = [
        {
            id: 'NC-2024-156',
            millId: mill.millId,
            dateRaised: '2024-11-15',
            severity: 'major',
            description: 'Doser A1 calibration drift detected - 12% variance from target',
            rootCause: 'Worn feeder screw causing inconsistent dosing rate',
            correctiveActions: [
                'Replace feeder screw',
                'Recalibrate doser',
                'Implement weekly drift monitoring'
            ],
            status: 'open',
            evidenceUrls: ['calibration-report.pdf', 'drift-chart.png']
        },
        {
            id: 'NC-2024-142',
            millId: mill.millId,
            dateRaised: '2024-10-22',
            severity: 'minor',
            description: 'Incomplete training records for 2 operators',
            rootCause: 'Training coordinator on leave, records not updated',
            correctiveActions: [
                'Complete missing training sessions',
                'Update training matrix',
                'Assign backup coordinator'
            ],
            status: 'closed',
            closedDate: '2024-11-05'
        }
    ]

    // Mock QC data
    const qcTrend = [
        { month: 'Jul', pass: 92, marginal: 6, fail: 2 },
        { month: 'Aug', pass: 90, marginal: 7, fail: 3 },
        { month: 'Sep', pass: 89, marginal: 8, fail: 3 },
        { month: 'Oct', pass: 88, marginal: 9, fail: 3 },
        { month: 'Nov', pass: 87, marginal: 10, fail: 3 },
        { month: 'Dec', pass: 87, marginal: 8, fail: 5 }
    ]

    // Mock calibration data
    const calibrationData = [
        {
            equipment: 'Doser A1',
            lastCalibration: '2024-10-15',
            nextDue: '2024-12-15',
            status: 'overdue',
            driftStatus: 'high'
        },
        {
            equipment: 'Doser A2',
            lastCalibration: '2024-11-20',
            nextDue: '2025-01-20',
            status: 'compliant',
            driftStatus: 'normal'
        },
        {
            equipment: 'Mixer M1',
            lastCalibration: '2024-11-01',
            nextDue: '2025-01-01',
            status: 'compliant',
            driftStatus: 'normal'
        }
    ]

    const getTrendIcon = (trend: string) => {
        switch (trend) {
            case 'improving': return <TrendingUp className="w-5 h-5 text-green-600" />
            case 'declining': return <TrendingDown className="w-5 h-5 text-red-600" />
            case 'stable': return <Minus className="w-5 h-5 text-gray-600" />
            default: return null
        }
    }

    const getComplianceColor = (score: number) => {
        if (score >= 90) return 'text-green-600'
        if (score >= 70) return 'text-yellow-600'
        return 'text-red-600'
    }

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'critical': return 'bg-red-100 text-red-700 border-red-200'
            case 'major': return 'bg-orange-100 text-orange-700 border-orange-200'
            case 'minor': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
            default: return 'bg-gray-100 text-gray-700 border-gray-200'
        }
    }

    const getCalibrationStatusColor = (status: string) => {
        switch (status) {
            case 'overdue': return 'bg-red-100 text-red-700'
            case 'due_soon': return 'bg-yellow-100 text-yellow-700'
            case 'compliant': return 'bg-green-100 text-green-700'
            default: return 'bg-gray-100 text-gray-700'
        }
    }

    return (
        <div className="p-6 space-y-6 max-w-[1600px] mx-auto min-h-screen bg-[#F0EFEA]/30">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="outline" onClick={() => router.back()}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Mills
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold text-premium-dark">{mill.millName}</h1>
                        <p className="text-muted-foreground">
                            {mill.millId} • {mill.location.region}, {mill.location.country}
                        </p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline">
                        <Download className="w-4 h-4 mr-2" />
                        Export Report
                    </Button>
                    <Button variant="outline" className="text-orange-600 border-orange-300">
                        <Flag className="w-4 h-4 mr-2" />
                        Flag Pattern
                    </Button>
                </div>
            </div>

            {/* Compliance Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="border-l-4 border-l-blue-500">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-sm text-muted-foreground">Compliance Score</p>
                            {getTrendIcon(mill.trend)}
                        </div>
                        <p className={`text-4xl font-bold ${getComplianceColor(mill.complianceScore)}`}>
                            {mill.complianceScore}%
                        </p>
                        <p className="text-xs text-gray-500 mt-2 capitalize">{mill.trend}</p>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-green-500">
                    <CardContent className="p-6">
                        <p className="text-sm text-muted-foreground mb-2">Certification Status</p>
                        <Badge className={
                            mill.certificationStatus === 'certified' ? 'bg-green-100 text-green-700' :
                                mill.certificationStatus === 'provisional' ? 'bg-yellow-100 text-yellow-700' :
                                    'bg-red-100 text-red-700'
                        }>
                            {mill.certificationStatus.toUpperCase()}
                        </Badge>
                        <p className="text-xs text-gray-500 mt-3">
                            Next audit: {new Date(mill.nextAuditDate).toLocaleDateString()}
                        </p>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-orange-500">
                    <CardContent className="p-6">
                        <p className="text-sm text-muted-foreground mb-2">Open Non-Conformances</p>
                        <p className="text-4xl font-bold text-orange-600">
                            {mill.openNonConformances}
                        </p>
                        <p className="text-xs text-gray-500 mt-2">Requires attention</p>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-red-500">
                    <CardContent className="p-6">
                        <p className="text-sm text-muted-foreground mb-2">Active Alerts</p>
                        <p className="text-4xl font-bold text-red-600">{mill.activeAlerts}</p>
                        <p className="text-xs text-gray-500 mt-2">Performance issues</p>
                    </CardContent>
                </Card>
            </div>

            {/* Compliance Trend Chart */}
            <Card>
                <CardHeader>
                    <CardTitle>Compliance Score Trend (Last 12 Months)</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-64 flex items-end justify-between gap-2">
                        {[95, 94, 92, 90, 89, 88, 87, 87, 88, 87, 86, 87].map((score, idx) => (
                            <div key={idx} className="flex-1 flex flex-col items-center">
                                <div
                                    className={`w-full rounded-t ${score >= 90 ? 'bg-green-500' :
                                            score >= 70 ? 'bg-yellow-500' :
                                                'bg-red-500'
                                        }`}
                                    style={{ height: `${score}%` }}
                                />
                                <p className="text-xs text-gray-500 mt-2">
                                    {['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'][idx]}
                                </p>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Non-Conformance Log */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Non-Conformance Log</CardTitle>
                        <Button variant="outline" size="sm">
                            <Download className="w-4 h-4 mr-2" />
                            Export CSV
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>NC ID</TableHead>
                                <TableHead>Date Raised</TableHead>
                                <TableHead>Severity</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Root Cause</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {nonConformances.map(nc => (
                                <TableRow key={nc.id}>
                                    <TableCell className="font-mono text-sm">{nc.id}</TableCell>
                                    <TableCell>{new Date(nc.dateRaised).toLocaleDateString()}</TableCell>
                                    <TableCell>
                                        <Badge className={getSeverityColor(nc.severity)}>
                                            {nc.severity.toUpperCase()}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="max-w-xs">{nc.description}</TableCell>
                                    <TableCell className="max-w-xs text-sm text-gray-600">
                                        {nc.rootCause}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={nc.status === 'closed' ? 'secondary' : 'default'}>
                                            {nc.status.toUpperCase()}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Button size="sm" variant="ghost">
                                            <Eye className="w-4 h-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* QC & Fortification Performance */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Beaker className="w-5 h-5" />
                        QC & Fortification Performance (Read-Only)
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* QC Pass/Fail Trend */}
                        <div>
                            <h4 className="font-semibold mb-4">QC Pass/Fail Trend (6 Months)</h4>
                            <div className="space-y-3">
                                {qcTrend.map((data, idx) => (
                                    <div key={idx}>
                                        <div className="flex items-center justify-between text-sm mb-1">
                                            <span className="font-medium">{data.month}</span>
                                            <span className="text-gray-500">
                                                {data.pass}% / {data.marginal}% / {data.fail}%
                                            </span>
                                        </div>
                                        <div className="flex h-6 rounded overflow-hidden">
                                            <div
                                                className="bg-green-500"
                                                style={{ width: `${data.pass}%` }}
                                            />
                                            <div
                                                className="bg-yellow-500"
                                                style={{ width: `${data.marginal}%` }}
                                            />
                                            <div
                                                className="bg-red-500"
                                                style={{ width: `${data.fail}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="flex gap-4 mt-4 text-xs">
                                <div className="flex items-center gap-1">
                                    <div className="w-3 h-3 bg-green-500 rounded" />
                                    <span>Pass</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <div className="w-3 h-3 bg-yellow-500 rounded" />
                                    <span>Marginal</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <div className="w-3 h-3 bg-red-500 rounded" />
                                    <span>Fail</span>
                                </div>
                            </div>
                        </div>

                        {/* Current QC Summary */}
                        <div>
                            <h4 className="font-semibold mb-4">Current Period Summary</h4>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="text-center p-4 bg-green-50 rounded-lg">
                                    <p className="text-3xl font-bold text-green-600">
                                        {mill.qcPerformance.passRate}%
                                    </p>
                                    <p className="text-sm text-gray-600 mt-1">Pass Rate</p>
                                </div>
                                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                                    <p className="text-3xl font-bold text-yellow-600">
                                        {mill.qcPerformance.marginalRate}%
                                    </p>
                                    <p className="text-sm text-gray-600 mt-1">Marginal</p>
                                </div>
                                <div className="text-center p-4 bg-red-50 rounded-lg">
                                    <p className="text-3xl font-bold text-red-600">
                                        {mill.qcPerformance.failRate}%
                                    </p>
                                    <p className="text-sm text-gray-600 mt-1">Fail Rate</p>
                                </div>
                            </div>
                            <Button className="w-full mt-4" variant="outline">
                                <Download className="w-4 h-4 mr-2" />
                                Download QC Evidence
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Maintenance & Calibration Oversight */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Wrench className="w-5 h-5" />
                        Maintenance & Calibration Oversight
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Equipment</TableHead>
                                <TableHead>Last Calibration</TableHead>
                                <TableHead>Next Due</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Drift Status</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {calibrationData.map((cal, idx) => (
                                <TableRow key={idx}>
                                    <TableCell className="font-semibold">{cal.equipment}</TableCell>
                                    <TableCell>{new Date(cal.lastCalibration).toLocaleDateString()}</TableCell>
                                    <TableCell>{new Date(cal.nextDue).toLocaleDateString()}</TableCell>
                                    <TableCell>
                                        <Badge className={getCalibrationStatusColor(cal.status)}>
                                            {cal.status.replace('_', ' ').toUpperCase()}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={cal.driftStatus === 'high' ? 'destructive' : 'outline'}>
                                            {cal.driftStatus.toUpperCase()}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Button size="sm" variant="ghost">
                                            <FileText className="w-4 h-4" />
                                        </Button>
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
