'use client'

import * as React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Label } from '@/components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import {
    TrendingUp, TrendingDown, Building2, CheckCircle, AlertTriangle,
    Users, Package, Truck, Download, Info
} from 'lucide-react'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { ProgramMetrics, MOCK_PROGRAM_METRICS } from '../types'

export function HeroMetrics() {
    const [metrics] = React.useState<ProgramMetrics>(MOCK_PROGRAM_METRICS)
    const [selectedCountry, setSelectedCountry] = React.useState('all')
    const [selectedCommodity, setSelectedCommodity] = React.useState('all')

    // People Reached Calculator
    const [perCapitaConsumption, setPerCapitaConsumption] = React.useState(
        metrics.peopleReached.assumptions.perCapitaConsumption
    )
    const [distributionEfficiency, setDistributionEfficiency] = React.useState(
        metrics.peopleReached.assumptions.distributionEfficiency
    )

    const calculatedPeopleReached = React.useMemo(() => {
        return Math.round(
            (metrics.totalFortifiedOutput.value * (distributionEfficiency / 100)) / perCapitaConsumption
        )
    }, [metrics.totalFortifiedOutput.value, perCapitaConsumption, distributionEfficiency])

    const formatNumber = (num: number) => {
        if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
        if (num >= 1000) return `${(num / 1000).toFixed(1)}k`
        return num.toString()
    }

    const formatCurrency = (num: number) => {
        return `$${formatNumber(num)}`
    }

    return (
        <div className="space-y-6">
            {/* Filters */}
            <Card className="border-zinc-200 shadow-sm shrink-0">
                <CardContent className="p-4 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-zinc-400" />
                        <div>
                            <h2 className="text-lg font-bold text-zinc-900">Program Analytics</h2>
                            <p className="text-zinc-500 text-xs">Filter national performance data</p>
                        </div>
                    </div>
                    <div className="flex gap-4 items-center">
                        <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                            <SelectTrigger className="w-[180px] bg-white">
                                <SelectValue placeholder="Country" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Countries</SelectItem>
                                <SelectItem value="kenya">Kenya</SelectItem>
                                <SelectItem value="uganda">Uganda</SelectItem>
                                <SelectItem value="tanzania">Tanzania</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={selectedCommodity} onValueChange={setSelectedCommodity}>
                            <SelectTrigger className="w-[180px] bg-white">
                                <SelectValue placeholder="Commodity" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Commodities</SelectItem>
                                <SelectItem value="maize">Maize</SelectItem>
                                <SelectItem value="wheat">Wheat</SelectItem>
                                <SelectItem value="rice">Rice</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Hero KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {/* Total Fortified Output */}
                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Output</CardTitle>
                        <div className="p-2 rounded-full bg-[#0A3225]/10">
                            <Package className="h-4 w-4 text-[#0A3225]" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatNumber(metrics.totalFortifiedOutput.value)} kg</div>
                        <div className="flex items-center justify-between mt-1">
                            <p className="text-xs text-green-600 flex items-center">
                                <TrendingUp className="w-3 h-3 mr-1" />
                                +{metrics.totalFortifiedOutput.momChange}% MoM
                            </p>
                            <Badge variant="outline" className="text-[10px] h-4">Target: 1.2M</Badge>
                        </div>
                    </CardContent>
                </Card>

                {/* Active Certified Mills */}
                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Active Mills</CardTitle>
                        <div className="p-2 rounded-full bg-green-100">
                            <Building2 className="h-4 w-4 text-green-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{metrics.activeCertifiedMills.total}</div>
                        <div className="flex items-center justify-between mt-1">
                            <p className="text-xs text-[#0A3225]">
                                {metrics.activeCertifiedMills.certified} Certified
                            </p>
                            <Badge variant="outline" className="text-[10px] h-4 text-green-700 bg-green-50 border-green-200">
                                +{metrics.activeCertifiedMills.newThisMonth} new
                            </Badge>
                        </div>
                    </CardContent>
                </Card>

                {/* Average Compliance Rate */}
                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Compliance</CardTitle>
                        <div className="p-2 rounded-full bg-purple-100">
                            <CheckCircle className="h-4 w-4 text-orange" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{metrics.avgComplianceRate.value}%</div>
                        <div className="flex items-center gap-1 mt-1">
                            <div className="h-1.5 flex-1 bg-gray-100 rounded-full overflow-hidden flex gap-0.5">
                                <div className="h-full bg-green-500" style={{ width: `${metrics.avgComplianceRate.distribution.aboveTarget}%` }} />
                                <div className="h-full bg-yellow-400" style={{ width: `${metrics.avgComplianceRate.distribution.marginal}%` }} />
                                <div className="h-full bg-red-400" style={{ width: `${metrics.avgComplianceRate.distribution.critical}%` }} />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Institutional Deliveries */}
                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Deliveries</CardTitle>
                        <div className="p-2 rounded-full bg-orange-100">
                            <Truck className="h-4 w-4 text-orange-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{metrics.institutionalDeliveries.completedOrders}</div>
                        <div className="flex items-center justify-between mt-1">
                            <p className="text-xs text-orange-600">
                                {metrics.institutionalDeliveries.onTimeRate}% On-time
                            </p>
                            <p className="text-xs text-muted-foreground font-mono">
                                {formatCurrency(metrics.institutionalDeliveries.totalValue)}
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* People Reached */}
                <Card className="hover:shadow-md transition-shadow border-indigo-100 bg-indigo-50/10">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Reach Impact</CardTitle>
                        <div className="p-2 rounded-full bg-indigo-100">
                            <Users className="h-4 w-4 text-indigo-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-indigo-700">{formatNumber(calculatedPeopleReached)}</div>
                        <p className="text-[10px] text-indigo-600/70 truncate">
                            {perCapitaConsumption}kg/yr @ {distributionEfficiency}% eff
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Detailed Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Production Trend */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            <span>Production Trend (12 Months)</span>
                            <Button variant="ghost" size="sm">
                                <Download className="w-4 h-4" />
                            </Button>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={250}>
                            <LineChart data={metrics.totalFortifiedOutput.monthlyTrend}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e5e5" />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => formatNumber(value)} />
                                <Tooltip formatter={(value: number) => formatNumber(value) + ' kg'} />
                                <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Compliance Distribution */}
                <Card>
                    <CardHeader>
                        <CardTitle>Compliance Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="font-medium">Above Target (≥90%)</span>
                                    <span className="text-green-600 font-bold">
                                        {metrics.avgComplianceRate.distribution.aboveTarget}%
                                    </span>
                                </div>
                                <div className="h-8 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-green-500"
                                        style={{ width: `${metrics.avgComplianceRate.distribution.aboveTarget}%` }}
                                    />
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="font-medium">Marginal (70-89%)</span>
                                    <span className="text-yellow-600 font-bold">
                                        {metrics.avgComplianceRate.distribution.marginal}%
                                    </span>
                                </div>
                                <div className="h-8 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-yellow-500"
                                        style={{ width: `${metrics.avgComplianceRate.distribution.marginal}%` }}
                                    />
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="font-medium">Critical (&lt;70%)</span>
                                    <span className="text-red-600 font-bold">
                                        {metrics.avgComplianceRate.distribution.critical}%
                                    </span>
                                </div>
                                <div className="h-8 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-red-500"
                                        style={{ width: `${metrics.avgComplianceRate.distribution.critical}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* People Reached Calculator */}
            <Card className="border-indigo-200 bg-indigo-50/20 shadow-sm shrink-0">
                <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-indigo-600" />
                        <div>
                            <CardTitle className="text-base text-indigo-900">People Reached Calculator</CardTitle>
                            <p className="text-xs text-indigo-600/70">Adjust assumptions to calculate nutritional impact</p>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Assumptions Panel */}
                        <div className="space-y-6">
                            <div className="space-y-3">
                                <Label className="text-xs font-bold text-indigo-900 uppercase tracking-wider">
                                    Consumption (kg/yr)
                                </Label>
                                <div className="flex items-center gap-4">
                                    <Slider
                                        value={[perCapitaConsumption]}
                                        onValueChange={(value) => setPerCapitaConsumption(value[0])}
                                        min={20}
                                        max={100}
                                        step={5}
                                        className="flex-1"
                                    />
                                    <Badge className="bg-white text-indigo-700 border-indigo-200 font-bold min-w-[3rem] justify-center">
                                        {perCapitaConsumption}
                                    </Badge>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <Label className="text-xs font-bold text-indigo-900 uppercase tracking-wider">
                                    Efficiency (%)
                                </Label>
                                <div className="flex items-center gap-4">
                                    <Slider
                                        value={[distributionEfficiency]}
                                        onValueChange={(value) => setDistributionEfficiency(value[0])}
                                        min={50}
                                        max={100}
                                        step={5}
                                        className="flex-1"
                                    />
                                    <Badge className="bg-white text-indigo-700 border-indigo-200 font-bold min-w-[3rem] justify-center">
                                        {distributionEfficiency}%
                                    </Badge>
                                </div>
                            </div>
                        </div>

                        {/* Result Panel */}
                        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="md:col-span-2 flex flex-col justify-center p-6 bg-white rounded-xl border border-indigo-100 shadow-sm">
                                <p className="text-sm font-medium text-indigo-900 mb-1">Calculated Impact:</p>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-4xl font-black text-indigo-600">
                                        {formatNumber(calculatedPeopleReached)}
                                    </span>
                                    <span className="text-indigo-400 font-medium">individuals reached</span>
                                </div>
                                <p className="text-[10px] text-zinc-500 mt-4 font-mono bg-zinc-50 p-2 rounded border">
                                    LOGIC: (Output:{formatNumber(metrics.totalFortifiedOutput.value)}kg * Eff:{distributionEfficiency}%) / {perCapitaConsumption}kg/yr
                                </p>
                            </div>

                            <div className="flex flex-col gap-2 justify-center">
                                <Button className="w-full bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-200">
                                    <Download className="w-4 h-4 mr-2" />
                                    Download SVG
                                </Button>
                                <Button variant="outline" className="w-full border-indigo-200 text-indigo-700 bg-white">
                                    Save Analysis
                                </Button>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
