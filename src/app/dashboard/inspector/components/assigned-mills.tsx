'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import {
    Building2, TrendingUp, TrendingDown, Minus, AlertTriangle,
    Calendar, MapPin, Search, Filter, Eye, CalendarPlus
} from 'lucide-react'
import { MillComplianceProfile, MOCK_ASSIGNED_MILLS } from '../types'

export function AssignedMillsView() {
    const router = useRouter()
    const [mills, setMills] = React.useState<MillComplianceProfile[]>(MOCK_ASSIGNED_MILLS)
    const [filterCountry, setFilterCountry] = React.useState('all')
    const [filterRegion, setFilterRegion] = React.useState('all')
    const [filterRisk, setFilterRisk] = React.useState('all')
    const [searchQuery, setSearchQuery] = React.useState('')
    const [viewMode, setViewMode] = React.useState<'list' | 'heatmap'>('list')

    // Filter logic
    const filteredMills = mills.filter(mill => {
        const matchesCountry = filterCountry === 'all' || mill.location.country === filterCountry
        const matchesRegion = filterRegion === 'all' || mill.location.region === filterRegion
        const matchesRisk = filterRisk === 'all' ||
            (filterRisk === 'critical' && mill.complianceScore < 70) ||
            (filterRisk === 'marginal' && mill.complianceScore >= 70 && mill.complianceScore < 90) ||
            (filterRisk === 'compliant' && mill.complianceScore >= 90)
        const matchesSearch = searchQuery === '' ||
            mill.millName.toLowerCase().includes(searchQuery.toLowerCase())

        return matchesCountry && matchesRegion && matchesRisk && matchesSearch
    })

    const getComplianceColor = (score: number) => {
        if (score >= 90) return 'text-green-600 bg-green-50'
        if (score >= 70) return 'text-yellow-600 bg-yellow-50'
        return 'text-red-600 bg-red-50'
    }

    const getComplianceBadgeColor = (score: number) => {
        if (score >= 90) return 'bg-green-100 text-green-700 border-green-200'
        if (score >= 70) return 'bg-yellow-100 text-yellow-700 border-yellow-200'
        return 'bg-red-100 text-red-700 border-red-200'
    }

    const getTrendIcon = (trend: string) => {
        switch (trend) {
            case 'improving': return <TrendingUp className="w-4 h-4 text-green-600" />
            case 'declining': return <TrendingDown className="w-4 h-4 text-red-600" />
            case 'stable': return <Minus className="w-4 h-4 text-gray-600" />
            default: return null
        }
    }

    const getCertificationColor = (status: string) => {
        switch (status) {
            case 'certified': return 'bg-green-100 text-green-700'
            case 'provisional': return 'bg-yellow-100 text-yellow-700'
            case 'suspended': return 'bg-red-100 text-red-700'
            default: return 'bg-gray-100 text-gray-700'
        }
    }

    // Performance alerts
    const performanceAlerts = [
        {
            id: 'ALT-001',
            millId: 'MILL-042',
            millName: 'Golden Grain Mills',
            type: 'declining_trend',
            severity: 'high',
            message: 'Compliance score dropped 8% in last 3 months',
            date: '2024-12-20'
        },
        {
            id: 'ALT-002',
            millId: 'MILL-031',
            millName: 'Coastal Millers Ltd',
            type: 'repeated_marginal',
            severity: 'critical',
            message: '4 consecutive marginal QC results detected',
            date: '2024-12-22'
        },
        {
            id: 'ALT-003',
            millId: 'MILL-018',
            millName: 'Rift Valley Processors',
            type: 'overdue_action',
            severity: 'medium',
            message: 'Corrective action overdue by 5 days',
            date: '2024-12-19'
        }
    ]

    return (
        <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="border-l-4 border-l-blue-500">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Total Mills</p>
                                <p className="text-3xl font-bold text-blue-600">{mills.length}</p>
                            </div>
                            <Building2 className="w-10 h-10 text-blue-500" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-green-500">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Compliant (≥90%)</p>
                                <p className="text-3xl font-bold text-green-600">
                                    {mills.filter(m => m.complianceScore >= 90).length}
                                </p>
                            </div>
                            <TrendingUp className="w-10 h-10 text-green-500" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-yellow-500">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Marginal (70-89%)</p>
                                <p className="text-3xl font-bold text-yellow-600">
                                    {mills.filter(m => m.complianceScore >= 70 && m.complianceScore < 90).length}
                                </p>
                            </div>
                            <AlertTriangle className="w-10 h-10 text-yellow-500" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-red-500">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">At Risk (&lt;70%)</p>
                                <p className="text-3xl font-bold text-red-600">
                                    {mills.filter(m => m.complianceScore < 70).length}
                                </p>
                            </div>
                            <AlertTriangle className="w-10 h-10 text-red-500" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Performance Alerts Panel */}
            <Card className="border-l-4 border-l-orange-500">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-orange-600" />
                        Performance Alerts
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {performanceAlerts.map(alert => (
                            <div key={alert.id} className="flex items-start justify-between p-3 bg-orange-50 rounded-lg border border-orange-200">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Badge variant="outline" className="font-mono text-xs">
                                            {alert.millId}
                                        </Badge>
                                        <span className="font-semibold text-sm">{alert.millName}</span>
                                        <Badge className={
                                            alert.severity === 'critical' ? 'bg-red-100 text-red-700' :
                                                alert.severity === 'high' ? 'bg-orange-100 text-orange-700' :
                                                    'bg-yellow-100 text-yellow-700'
                                        }>
                                            {alert.severity.toUpperCase()}
                                        </Badge>
                                    </div>
                                    <p className="text-sm text-gray-700">{alert.message}</p>
                                    <p className="text-xs text-gray-500 mt-1">{alert.date}</p>
                                </div>
                                <div className="flex gap-2">
                                    <Button size="sm" variant="outline" onClick={() => router.push(`/dashboard/inspector/mill/${alert.millId}`)}>
                                        Investigate
                                    </Button>
                                    <Button size="sm" variant="outline" className="text-orange-600">
                                        Escalate
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Filters and View Toggle */}
            <Card className="glass-card border-none shadow-sm">
                <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row gap-4 items-end">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                                placeholder="Search mills..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <Select value={filterCountry} onValueChange={setFilterCountry}>
                            <SelectTrigger className="w-full md:w-[180px]">
                                <SelectValue placeholder="Country" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Countries</SelectItem>
                                <SelectItem value="Kenya">Kenya</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={filterRegion} onValueChange={setFilterRegion}>
                            <SelectTrigger className="w-full md:w-[180px]">
                                <SelectValue placeholder="Region" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Regions</SelectItem>
                                <SelectItem value="Central">Central</SelectItem>
                                <SelectItem value="Rift Valley">Rift Valley</SelectItem>
                                <SelectItem value="Coast">Coast</SelectItem>
                                <SelectItem value="Western">Western</SelectItem>
                                <SelectItem value="Nairobi">Nairobi</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={filterRisk} onValueChange={setFilterRisk}>
                            <SelectTrigger className="w-full md:w-[180px]">
                                <SelectValue placeholder="Risk Level" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Risk Levels</SelectItem>
                                <SelectItem value="compliant">Compliant (≥90%)</SelectItem>
                                <SelectItem value="marginal">Marginal (70-89%)</SelectItem>
                                <SelectItem value="critical">At Risk (&lt;70%)</SelectItem>
                            </SelectContent>
                        </Select>
                        <div className="flex gap-2">
                            <Button
                                variant={viewMode === 'list' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setViewMode('list')}
                            >
                                List
                            </Button>
                            <Button
                                variant={viewMode === 'heatmap' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setViewMode('heatmap')}
                            >
                                Heat Map
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Mills List */}
            {viewMode === 'list' ? (
                <Card className="glass-card border-none shadow-sm">
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Mill Name</TableHead>
                                    <TableHead>Location</TableHead>
                                    <TableHead>Compliance Score</TableHead>
                                    <TableHead>Trend</TableHead>
                                    <TableHead>Certification</TableHead>
                                    <TableHead>Alerts</TableHead>
                                    <TableHead>Last Audit</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredMills.map(mill => (
                                    <TableRow
                                        key={mill.millId}
                                        className="cursor-pointer hover:bg-gray-50"
                                        onClick={() => router.push(`/dashboard/inspector/mill/${mill.millId}`)}
                                    >
                                        <TableCell>
                                            <div>
                                                <p className="font-semibold">{mill.millName}</p>
                                                <p className="text-xs text-gray-500">{mill.millId}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1 text-sm">
                                                <MapPin className="w-3 h-3 text-gray-400" />
                                                {mill.location.region}, {mill.location.country}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <div className={`text-2xl font-bold ${getComplianceColor(mill.complianceScore)}`}>
                                                    {mill.complianceScore}%
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1">
                                                {getTrendIcon(mill.trend)}
                                                <span className="text-sm capitalize">{mill.trend}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={getCertificationColor(mill.certificationStatus)}>
                                                {mill.certificationStatus.toUpperCase()}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {mill.activeAlerts > 0 ? (
                                                <Badge variant="destructive">{mill.activeAlerts}</Badge>
                                            ) : (
                                                <span className="text-gray-400 text-sm">None</span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-sm">
                                                {new Date(mill.lastAuditDate).toLocaleDateString()}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        router.push(`/dashboard/inspector/mill/${mill.millId}`)
                                                    }}
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        console.log('Schedule audit for', mill.millId)
                                                    }}
                                                >
                                                    <CalendarPlus className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            ) : (
                /* Heat Map View */
                <Card className="glass-card border-none shadow-sm">
                    <CardHeader>
                        <CardTitle>Compliance Heat Map</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {filteredMills.map(mill => (
                                <div
                                    key={mill.millId}
                                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-lg ${mill.complianceScore >= 90 ? 'bg-green-50 border-green-300' :
                                            mill.complianceScore >= 70 ? 'bg-yellow-50 border-yellow-300' :
                                                'bg-red-50 border-red-300'
                                        }`}
                                    onClick={() => router.push(`/dashboard/inspector/mill/${mill.millId}`)}
                                >
                                    <div className="text-center">
                                        <p className="font-semibold text-sm mb-1">{mill.millName}</p>
                                        <p className={`text-3xl font-bold ${getComplianceColor(mill.complianceScore)}`}>
                                            {mill.complianceScore}%
                                        </p>
                                        <div className="flex items-center justify-center gap-1 mt-2">
                                            {getTrendIcon(mill.trend)}
                                        </div>
                                        {mill.activeAlerts > 0 && (
                                            <Badge variant="destructive" className="mt-2">
                                                {mill.activeAlerts} alerts
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
