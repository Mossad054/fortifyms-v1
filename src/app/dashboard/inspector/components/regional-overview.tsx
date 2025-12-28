'use client'

import * as React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import {
    BarChart3, TrendingUp, TrendingDown, AlertTriangle,
    Building2, Download, Flag
} from 'lucide-react'
import { MOCK_ASSIGNED_MILLS } from '../types'

export function RegionalOverviewView() {
    const [selectedRegion, setSelectedRegion] = React.useState('all')
    const [selectedCountry, setSelectedCountry] = React.useState('all')

    // Calculate regional metrics
    const mills = MOCK_ASSIGNED_MILLS
    const totalMills = mills.length
    const avgComplianceScore = Math.round(
        mills.reduce((sum, m) => sum + m.complianceScore, 0) / totalMills
    )
    const millsAtRisk = mills.filter(m => m.complianceScore < 70).length
    const pendingActions = mills.reduce((sum, m) => sum + m.openNonConformances, 0)

    // Common non-compliance categories
    const nonComplianceCategories = [
        { category: 'Calibration Failures', count: 8, percentage: 35 },
        { category: 'Underdosing', count: 6, percentage: 26 },
        { category: 'Poor Documentation', count: 5, percentage: 22 },
        { category: 'Training Gaps', count: 3, percentage: 13 },
        { category: 'Other', count: 1, percentage: 4 }
    ]

    // Time-based trends (12 months)
    const complianceTrend = [
        { month: 'Jan', score: 92 },
        { month: 'Feb', score: 93 },
        { month: 'Mar', score: 92 },
        { month: 'Apr', score: 91 },
        { month: 'May', score: 90 },
        { month: 'Jun', score: 89 },
        { month: 'Jul', score: 88 },
        { month: 'Aug', score: 87 },
        { month: 'Sep', score: 88 },
        { month: 'Oct', score: 87 },
        { month: 'Nov', score: 86 },
        { month: 'Dec', score: 87 }
    ]

    // Systemic risks
    const systemicRisks = [
        {
            id: 'SR-001',
            type: 'supplier_issue',
            severity: 'critical',
            description: 'Premix batch PM-2024-156 linked to QC failures in 3 mills',
            affectedMills: ['MILL-042', 'MILL-018', 'MILL-031'],
            recommendation: 'Quarantine all batches using PM-2024-156, contact supplier'
        },
        {
            id: 'SR-002',
            type: 'equipment_pattern',
            severity: 'high',
            description: 'Doser calibration drift pattern detected across 4 mills',
            affectedMills: ['MILL-042', 'MILL-007', 'MILL-023', 'MILL-018'],
            recommendation: 'Regional equipment audit, check maintenance protocols'
        },
        {
            id: 'SR-003',
            type: 'training_gap',
            severity: 'medium',
            description: 'QC technician certification expiring for 6 operators',
            affectedMills: ['MILL-031', 'MILL-007'],
            recommendation: 'Schedule regional refresher training session'
        }
    ]

    const getCategoryColor = (index: number) => {
        const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-[#0A3225]/50', 'bg-gray-500']
        return colors[index] || 'bg-gray-500'
    }

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'critical': return 'bg-red-100 text-red-700 border-red-200'
            case 'high': return 'bg-orange-100 text-orange-700 border-orange-200'
            case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
            default: return 'bg-gray-100 text-gray-700 border-gray-200'
        }
    }

    return (
        <div className="space-y-6">
            {/* Filters */}
            <Card className="glass-card border-none shadow-sm">
                <CardContent className="p-4">
                    <div className="flex gap-4">
                        <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                            <SelectTrigger className="w-[200px]">
                                <SelectValue placeholder="Country" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Countries</SelectItem>
                                <SelectItem value="Kenya">Kenya</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                            <SelectTrigger className="w-[200px]">
                                <SelectValue placeholder="Region" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Regions</SelectItem>
                                <SelectItem value="Central">Central</SelectItem>
                                <SelectItem value="Rift Valley">Rift Valley</SelectItem>
                                <SelectItem value="Coast">Coast</SelectItem>
                                <SelectItem value="Western">Western</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button variant="outline" className="ml-auto">
                            <Download className="w-4 h-4 mr-2" />
                            Export Regional Report
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Regional Metrics Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="border-l-4 border-l-blue-500">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Total Mills</p>
                                <p className="text-4xl font-bold text-[#0A3225]">{totalMills}</p>
                            </div>
                            <Building2 className="w-10 h-10 text-blue-500" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-green-500">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Avg Compliance</p>
                                <p className="text-4xl font-bold text-green-600">{avgComplianceScore}%</p>
                            </div>
                            <TrendingUp className="w-10 h-10 text-green-500" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-red-500">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Mills at Risk</p>
                                <p className="text-4xl font-bold text-red-600">{millsAtRisk}</p>
                            </div>
                            <AlertTriangle className="w-10 h-10 text-red-500" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-orange-500">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Pending Actions</p>
                                <p className="text-4xl font-bold text-orange-600">{pendingActions}</p>
                            </div>
                            <Flag className="w-10 h-10 text-orange-500" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Systemic Risk Detection */}
            <Card className="border-l-4 border-l-red-500">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-red-600" />
                        Systemic Risk Detection
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {systemicRisks.map(risk => (
                            <div key={risk.id} className="border-l-4 border-l-red-500 bg-red-50/30 rounded-lg p-4">
                                <div className="flex items-start justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <Badge variant="outline" className="font-mono text-xs">
                                            {risk.id}
                                        </Badge>
                                        <Badge className={getSeverityColor(risk.severity)}>
                                            {risk.severity.toUpperCase()}
                                        </Badge>
                                        <Badge variant="outline">
                                            {risk.type.replace('_', ' ').toUpperCase()}
                                        </Badge>
                                    </div>
                                </div>
                                <h4 className="font-semibold text-gray-900 mb-2">{risk.description}</h4>
                                <div className="flex items-center gap-2 mb-2 text-sm text-gray-600">
                                    <span className="font-medium">Affected Mills:</span>
                                    {risk.affectedMills.map(millId => (
                                        <Badge key={millId} variant="outline" className="text-xs">
                                            {millId}
                                        </Badge>
                                    ))}
                                </div>
                                <p className="text-sm text-gray-700 mb-3">
                                    <strong>Recommendation:</strong> {risk.recommendation}
                                </p>
                                <div className="flex gap-2">
                                    <Button size="sm" variant="destructive">
                                        Escalate to Program Manager
                                    </Button>
                                    <Button size="sm" variant="outline">
                                        View Details
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Compliance Rate by Mill */}
                <Card>
                    <CardHeader>
                        <CardTitle>Compliance Rate by Mill</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {mills.map(mill => (
                                <div key={mill.millId}>
                                    <div className="flex items-center justify-between text-sm mb-1">
                                        <span className="font-medium">{mill.millName}</span>
                                        <span className={
                                            mill.complianceScore >= 90 ? 'text-green-600' :
                                                mill.complianceScore >= 70 ? 'text-yellow-600' :
                                                    'text-red-600'
                                        }>
                                            {mill.complianceScore}%
                                        </span>
                                    </div>
                                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                        <div
                                            className={
                                                mill.complianceScore >= 90 ? 'bg-green-500' :
                                                    mill.complianceScore >= 70 ? 'bg-yellow-500' :
                                                        'bg-red-500'
                                            }
                                            style={{ width: `${mill.complianceScore}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Common Non-Compliance Categories */}
                <Card>
                    <CardHeader>
                        <CardTitle>Common Non-Compliance Categories</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {/* Pie Chart Representation */}
                            <div className="flex items-center justify-center">
                                <div className="relative w-48 h-48">
                                    <svg viewBox="0 0 100 100" className="transform -rotate-90">
                                        {nonComplianceCategories.reduce((acc, cat, idx) => {
                                            const prevPercentage = nonComplianceCategories
                                                .slice(0, idx)
                                                .reduce((sum, c) => sum + c.percentage, 0)
                                            const strokeDasharray = `${cat.percentage} ${100 - cat.percentage}`
                                            const strokeDashoffset = -prevPercentage

                                            return [
                                                ...acc,
                                                <circle
                                                    key={idx}
                                                    cx="50"
                                                    cy="50"
                                                    r="15.9"
                                                    fill="none"
                                                    stroke={getCategoryColor(idx).replace('bg-', '')}
                                                    strokeWidth="31.8"
                                                    strokeDasharray={strokeDasharray}
                                                    strokeDashoffset={strokeDashoffset}
                                                    className={getCategoryColor(idx)}
                                                />
                                            ]
                                        }, [] as React.ReactNode[])}
                                    </svg>
                                </div>
                            </div>

                            {/* Legend */}
                            <div className="space-y-2">
                                {nonComplianceCategories.map((cat, idx) => (
                                    <div key={idx} className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-4 h-4 rounded ${getCategoryColor(idx)}`} />
                                            <span className="text-sm">{cat.category}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-semibold">{cat.count}</span>
                                            <span className="text-xs text-gray-500">({cat.percentage}%)</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Time-Based Trends */}
            <Card>
                <CardHeader>
                    <CardTitle>Regional Compliance Trend (12 Months)</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-64 flex items-end justify-between gap-2">
                        {complianceTrend.map((data, idx) => (
                            <div key={idx} className="flex-1 flex flex-col items-center">
                                <div className="relative w-full">
                                    <div
                                        className={`w-full rounded-t transition-all ${data.score >= 90 ? 'bg-green-500' :
                                                data.score >= 70 ? 'bg-yellow-500' :
                                                    'bg-red-500'
                                            }`}
                                        style={{ height: `${data.score * 2.5}px` }}
                                    />
                                    <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-semibold">
                                        {data.score}%
                                    </span>
                                </div>
                                <p className="text-xs text-gray-500 mt-2">{data.month}</p>
                            </div>
                        ))}
                    </div>
                    <div className="mt-6 flex items-center justify-center gap-2">
                        <TrendingDown className="w-5 h-5 text-red-600" />
                        <span className="text-sm text-gray-600">
                            Declining trend detected: -5% over 12 months
                        </span>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
