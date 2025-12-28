'use client'

import * as React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Label } from '@/components/ui/label'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import {
    Trophy, AlertTriangle, TrendingUp, TrendingDown, Building2,
    Download, Eye, Award, Target, BarChart3, Lightbulb
} from 'lucide-react'
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'
import { MillPerformance } from '../types'

// Mock mill performance data
const TOP_PERFORMERS: MillPerformance[] = [
    {
        millId: 'MILL-004',
        millName: 'Eldoret Mills Co',
        region: 'Rift Valley',
        country: 'Kenya',
        performanceScore: 95,
        complianceScore: 95,
        productionConsistency: 94,
        buyerSatisfaction: 96,
        ranking: { overall: 1, regional: 1, percentile: 98 },
        riskLevel: 'low',
        bestPractices: ['Automated QC system', 'Weekly calibration', 'Staff incentive program']
    },
    {
        millId: 'MILL-001',
        millName: 'Nairobi Grain Mills',
        region: 'Nairobi',
        country: 'Kenya',
        performanceScore: 92,
        complianceScore: 92,
        productionConsistency: 91,
        buyerSatisfaction: 93,
        ranking: { overall: 2, regional: 1, percentile: 95 },
        riskLevel: 'low',
        bestPractices: ['Digital batch tracking', 'Continuous training', 'Supplier partnerships']
    },
    {
        millId: 'MILL-006',
        millName: 'Thika Fortification Hub',
        region: 'Central',
        country: 'Kenya',
        performanceScore: 90,
        complianceScore: 90,
        productionConsistency: 89,
        buyerSatisfaction: 91,
        ranking: { overall: 3, regional: 1, percentile: 90 },
        riskLevel: 'low',
        bestPractices: ['Preventive maintenance', 'Quality circles', 'Customer feedback loop']
    },
]

const AT_RISK_MILLS: MillPerformance[] = [
    {
        millId: 'MILL-005',
        millName: 'Nakuru Grain Processors',
        region: 'Rift Valley',
        country: 'Kenya',
        performanceScore: 68,
        complianceScore: 68,
        productionConsistency: 65,
        buyerSatisfaction: 71,
        ranking: { overall: 38, regional: 8, percentile: 15 },
        riskLevel: 'critical',
    },
    {
        millId: 'MILL-003',
        millName: 'Kisumu Processing Ltd',
        region: 'Western',
        country: 'Kenya',
        performanceScore: 75,
        complianceScore: 75,
        productionConsistency: 72,
        buyerSatisfaction: 78,
        ranking: { overall: 28, regional: 5, percentile: 35 },
        riskLevel: 'high',
    },
]

const RISK_FACTORS = [
    { mill: 'MILL-005', factor: 'Declining Compliance', severity: 'critical', trend: '-12% in 3 months' },
    { mill: 'MILL-005', factor: 'Repeated QC Failures', severity: 'critical', trend: '8 failures in 2 months' },
    { mill: 'MILL-003', factor: 'Equipment Maintenance Gap', severity: 'high', trend: '3 overdue calibrations' },
    { mill: 'MILL-003', factor: 'Staff Turnover', severity: 'medium', trend: '4 operators left' },
]

const BENCHMARKING_DATA = {
    mill: {
        compliance: 88,
        production: 85,
        quality: 90,
        efficiency: 82,
        training: 87,
    },
    regionalAvg: {
        compliance: 85,
        production: 80,
        quality: 83,
        efficiency: 78,
        training: 82,
    },
    nationalAvg: {
        compliance: 82,
        production: 75,
        quality: 80,
        efficiency: 75,
        training: 78,
    },
    top10: {
        compliance: 95,
        production: 92,
        quality: 94,
        efficiency: 90,
        training: 93,
    },
}

export function MillPerformanceAnalysis() {
    const [selectedMill, setSelectedMill] = React.useState<MillPerformance | null>(null)

    const [showDrillDown, setShowDrillDown] = React.useState(false)
    const [showCaseStudy, setShowCaseStudy] = React.useState(false)
    const [showAssistance, setShowAssistance] = React.useState(false)
    const [showProfile, setShowProfile] = React.useState(false)
    const [generating, setGenerating] = React.useState(false)

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'critical': return 'bg-red-100 text-red-700 border-red-200'
            case 'high': return 'bg-orange-100 text-orange-700 border-orange-200'
            case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
            default: return 'bg-gray-100 text-gray-700 border-gray-200'
        }
    }

    const getRiskColor = (risk: string) => {
        switch (risk) {
            case 'critical': return 'bg-red-500'
            case 'high': return 'bg-orange-500'
            case 'medium': return 'bg-yellow-500'
            case 'low': return 'bg-green-500'
            default: return 'bg-gray-500'
        }
    }


    const radarData = [
        {
            metric: 'Compliance',
            mill: BENCHMARKING_DATA.mill.compliance,
            regionalAvg: BENCHMARKING_DATA.regionalAvg.compliance,
            nationalAvg: BENCHMARKING_DATA.nationalAvg.compliance,
            top10: BENCHMARKING_DATA.top10.compliance
        },
        {
            metric: 'Production',
            mill: BENCHMARKING_DATA.mill.production,
            regionalAvg: BENCHMARKING_DATA.regionalAvg.production,
            nationalAvg: BENCHMARKING_DATA.nationalAvg.production,
            top10: BENCHMARKING_DATA.top10.production
        },
        {
            metric: 'Quality',
            mill: BENCHMARKING_DATA.mill.quality,
            regionalAvg: BENCHMARKING_DATA.regionalAvg.quality,
            nationalAvg: BENCHMARKING_DATA.nationalAvg.quality,
            top10: BENCHMARKING_DATA.top10.quality
        },
        {
            metric: 'Efficiency',
            mill: BENCHMARKING_DATA.mill.efficiency,
            regionalAvg: BENCHMARKING_DATA.regionalAvg.efficiency,
            nationalAvg: BENCHMARKING_DATA.nationalAvg.efficiency,
            top10: BENCHMARKING_DATA.top10.efficiency
        },
        {
            metric: 'Training',
            mill: BENCHMARKING_DATA.mill.training,
            regionalAvg: BENCHMARKING_DATA.regionalAvg.training,
            nationalAvg: BENCHMARKING_DATA.nationalAvg.training,
            top10: BENCHMARKING_DATA.top10.training
        },
    ]

    return (
        <div className="space-y-6">
            <Tabs defaultValue="top" className="space-y-6">
                <TabsList className="grid w-full grid-cols-3 lg:w-[600px] bg-white/60 p-1 backdrop-blur-md rounded-xl border border-white/20 shadow-sm">
                    <TabsTrigger
                        value="top"
                        className="flex items-center gap-2 font-bold text-gray-600 data-[state=active]:bg-[#0A3225] data-[state=active]:text-white transition-all rounded-lg"
                    >
                        <Trophy className="w-4 h-4" />
                        Top Performers
                    </TabsTrigger>
                    <TabsTrigger
                        value="risk"
                        className="flex items-center gap-2 font-bold text-gray-600 data-[state=active]:bg-[#0A3225] data-[state=active]:text-white transition-all rounded-lg"
                    >
                        <AlertTriangle className="w-4 h-4" />
                        At-Risk Mills
                    </TabsTrigger>
                    <TabsTrigger
                        value="benchmark"
                        className="flex items-center gap-2 font-bold text-gray-600 data-[state=active]:bg-[#0A3225] data-[state=active]:text-white transition-all rounded-lg"
                    >
                        <Target className="w-4 h-4" />
                        Benchmarking
                    </TabsTrigger>
                </TabsList>

                {/* TOP PERFORMERS TAB */}
                <TabsContent value="top">
                    <Card className="border-none shadow-md overflow-hidden">
                        <CardHeader className="bg-white border-b py-3 px-6">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-base flex items-center gap-2">
                                    <Building2 className="w-4 h-4 text-zinc-400" />
                                    Performance Leaderboard
                                </CardTitle>

                                <Button variant="outline" size="sm" className="h-8" onClick={() => setShowCaseStudy(true)}>
                                    <Download className="w-3.5 h-3.5 mr-2" />
                                    Generate Case Studies
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader className="bg-zinc-50/50">
                                    <TableRow>
                                        <TableHead className="w-[80px] text-center text-[10px] font-bold uppercase tracking-wider text-zinc-500">Rank</TableHead>
                                        <TableHead className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Mill Entity</TableHead>
                                        <TableHead className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Geography</TableHead>
                                        <TableHead className="text-center text-[10px] font-bold uppercase tracking-wider text-zinc-500">Compliance</TableHead>
                                        <TableHead className="text-center text-[10px] font-bold uppercase tracking-wider text-zinc-500">Consistency</TableHead>
                                        <TableHead className="text-center text-[10px] font-bold uppercase tracking-wider text-zinc-500">Network score</TableHead>
                                        <TableHead className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Operational DNA</TableHead>
                                        <TableHead className="text-right text-[10px] font-bold uppercase tracking-wider text-zinc-500">Details</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {TOP_PERFORMERS.map((mill) => (
                                        <TableRow key={mill.millId} className="hover:bg-zinc-50/50 transition-colors group">
                                            <TableCell className="text-center">
                                                <div className="flex items-center justify-center">
                                                    {mill.ranking.overall === 1 ? (
                                                        <div className="bg-yellow-100 p-1.5 rounded-full"><Trophy className="w-4 h-4 text-yellow-600" /></div>
                                                    ) : mill.ranking.overall === 2 ? (
                                                        <div className="bg-zinc-100 p-1.5 rounded-full"><Award className="w-4 h-4 text-zinc-500" /></div>
                                                    ) : mill.ranking.overall === 3 ? (
                                                        <div className="bg-orange-100 p-1.5 rounded-full"><Award className="w-4 h-4 text-orange-600" /></div>
                                                    ) : (
                                                        <span className="font-bold text-zinc-900">{mill.ranking.overall}</span>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-500 font-bold text-xs">
                                                        {mill.millName.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-zinc-900">{mill.millName}</p>
                                                        <p className="text-[10px] text-zinc-500 font-medium font-mono">{mill.millId}</p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1.5">
                                                    <span className="text-xs font-semibold text-zinc-600">{mill.region}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <div className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-50 text-green-700 border border-green-100">
                                                    {mill.complianceScore}%
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <div className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#0A3225]/5 text-[#0A3225] border border-blue-100">
                                                    {mill.productionConsistency}%
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <div className="flex flex-col items-center">
                                                    <span className="text-lg font-black text-zinc-900">{mill.performanceScore}</span>
                                                    <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-tighter">Top {100 - mill.ranking.percentile}%</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-wrap gap-1">
                                                    {mill.bestPractices?.slice(0, 2).map((practice, idx) => (
                                                        <Badge key={idx} variant="secondary" className="bg-zinc-100 hover:bg-zinc-200 text-zinc-700 border-none text-[9px] font-bold h-5 px-2">
                                                            {practice}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    onClick={() => {
                                                        setSelectedMill(mill)
                                                        setShowDrillDown(true)
                                                    }}
                                                >
                                                    <Eye className="w-4 h-4 text-zinc-400" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>

                            {/* Best Practices Summary */}
                            <div className="mt-6 p-4 bg-green-50 rounded-lg">
                                <h4 className="font-semibold text-sm text-green-900 mb-3 flex items-center gap-2">
                                    <Lightbulb className="w-4 h-4" />
                                    Common Best Practices from Top Performers
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    <div className="text-sm">
                                        <p className="font-medium">Automated QC Systems</p>
                                        <p className="text-xs text-gray-600">Real-time monitoring reduces failures by 45%</p>
                                    </div>
                                    <div className="text-sm">
                                        <p className="font-medium">Continuous Training</p>
                                        <p className="text-xs text-gray-600">Monthly sessions improve consistency by 32%</p>
                                    </div>
                                    <div className="text-sm">
                                        <p className="font-medium">Preventive Maintenance</p>
                                        <p className="text-xs text-gray-600">Scheduled calibration reduces downtime by 28%</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* AT-RISK MILLS TAB */}
                <TabsContent value="risk">
                    <Card className="border-none shadow-md overflow-hidden bg-white">
                        <CardHeader className="border-b py-3 px-6">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-base flex items-center gap-2">
                                    <AlertTriangle className="w-4 h-4 text-red-600" />
                                    Critical Intervention Queue
                                </CardTitle>
                                <Button variant="outline" size="sm" className="h-8 border-red-200 text-red-700 hover:bg-red-50">
                                    <Download className="w-3.5 h-3.5 mr-2" />
                                    Export Intervention Log
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {AT_RISK_MILLS.map((mill) => (
                                    <div key={mill.millId} className="flex flex-col border-2 border-zinc-100 rounded-2xl overflow-hidden hover:border-red-200 transition-all group bg-white shadow-sm">
                                        <div className="p-4 border-b bg-zinc-50/50">
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center text-red-600">
                                                        <AlertTriangle className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-zinc-900 leading-tight">{mill.millName}</h3>
                                                        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">{mill.millId} • {mill.region}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <span className="text-2xl font-black text-red-600">{mill.performanceScore}</span>
                                                    <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-tighter">Perf. Score</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-4 space-y-4">
                                            <div>
                                                <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-2 block">Identified Risk Factors</Label>
                                                <div className="space-y-2">
                                                    {RISK_FACTORS.filter(r => r.mill === mill.millId).map((risk, idx) => (
                                                        <div key={idx} className="flex items-center justify-between p-2.5 bg-zinc-50 rounded-xl border border-zinc-100 group-hover:border-red-100 transition-colors">
                                                            <div className="flex items-center gap-2">
                                                                <Badge className={`${getSeverityColor(risk.severity)} border-none text-[9px] font-bold h-5 px-2`}>
                                                                    {risk.severity}
                                                                </Badge>
                                                                <span className="text-[11px] font-bold text-zinc-700">{risk.factor}</span>
                                                            </div>
                                                            <span className="text-[10px] font-medium text-zinc-400 font-mono">{risk.trend}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>


                                            <div className="flex gap-2 pt-2">
                                                <Button size="sm" className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold text-[11px] h-9"
                                                    onClick={() => {
                                                        setSelectedMill(mill)
                                                        setShowAssistance(true)
                                                    }}>
                                                    Deploy Assistance
                                                </Button>
                                                <Button size="sm" variant="outline" className="flex-1 font-bold text-[11px] h-9 border-zinc-200"
                                                    onClick={() => {
                                                        setSelectedMill(mill)
                                                        setShowProfile(true)
                                                    }}>
                                                    Active Profile
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* BENCHMARKING TAB */}
                <TabsContent value="benchmark">
                    <Card className="border-none shadow-md overflow-hidden bg-white">
                        <CardHeader className="border-b py-3 px-6">
                            <CardTitle className="text-base flex items-center gap-2">
                                <Target className="w-4 h-4 text-[#0A3225]" />
                                Metric Normalization Engine
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                                {/* Radar Chart */}
                                <div>
                                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-6 flex items-center gap-2">
                                        <BarChart3 className="w-3.5 h-3.5" />
                                        Multidimensional performance
                                    </h4>
                                    <div className="bg-zinc-50 rounded-3xl p-4 border border-zinc-100">
                                        <ResponsiveContainer width="100%" height={350}>
                                            <RadarChart data={radarData}>
                                                <PolarGrid stroke="#e2e8f0" />
                                                <PolarAngleAxis dataKey="metric" tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }} />
                                                <PolarRadiusAxis domain={[0, 100]} axisLine={false} tick={false} />
                                                <Radar name="Selected Mill" dataKey="mill" stroke="#2563eb" strokeWidth={2} fill="#2563eb" fillOpacity={0.4} />
                                                <Radar name="Regional Avg" dataKey="regionalAvg" stroke="#10b981" fill="#10b981" fillOpacity={0.1} />
                                                <Radar name="National Avg" dataKey="nationalAvg" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.05} />
                                                <Radar name="Top 10%" dataKey="top10" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.05} />
                                                <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 700, paddingTop: '20px' }} />
                                            </RadarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                {/* Percentile Rankings */}
                                <div className="space-y-8">
                                    <div>
                                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-6 flex items-center gap-2">
                                            <TrendingUp className="w-3.5 h-3.5" />
                                            Distribution Analysis
                                        </h4>
                                        <div className="space-y-6">
                                            {[
                                                { metric: 'Compliance', value: 88, percentile: 75, color: '#10b981' },
                                                { metric: 'Production Consistency', value: 85, percentile: 68, color: '#3b82f6' },
                                                { metric: 'Quality Control', value: 90, percentile: 82, color: '#8b5cf6' },
                                                { metric: 'Operational Efficiency', value: 82, percentile: 65, color: '#f59e0b' },
                                            ].map((item, idx) => (
                                                <div key={idx} className="space-y-2">
                                                    <div className="flex justify-between items-end">
                                                        <div>
                                                            <p className="text-xs font-bold text-zinc-900">{item.metric}</p>
                                                            <p className="text-[10px] text-zinc-500 font-medium">Network average: {item.value - 5}%</p>
                                                        </div>
                                                        <div className="text-right">
                                                            <span className="text-lg font-black text-zinc-900">{item.percentile}</span>
                                                            <span className="text-[10px] text-zinc-400 font-bold uppercase ml-1">th</span>
                                                        </div>
                                                    </div>
                                                    <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full rounded-full transition-all duration-1000"
                                                            style={{ width: `${item.percentile}%`, backgroundColor: item.color }}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="p-6 bg-zinc-900 rounded-3xl text-white shadow-xl relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-4 opacity-10">
                                            <Lightbulb className="w-24 h-24 rotate-12" />
                                        </div>
                                        <h5 className="font-bold text-sm mb-3 flex items-center gap-2">
                                            <Lightbulb className="w-4 h-4 text-yellow-400" />
                                            Normalization Protocol
                                        </h5>
                                        <div className="text-[11px] space-y-2 text-zinc-400 font-medium leading-relaxed">
                                            <p><span className="text-white font-bold">• Capacity Adjusted:</span> Scores normalized by licensed output (5,000 MT/month base).</p>
                                            <p><span className="text-white font-bold">• Regional Weighed:</span> Infrastructure indexing applied based on power/logistics stability.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Mill Drill-Down Dialog */}
            <Dialog open={showDrillDown} onOpenChange={setShowDrillDown}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0 border-none bg-[#F8F9FA] rounded-3xl shadow-2xl">
                    <DialogHeader className="p-8 bg-white border-b sticky top-0 z-10">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-2xl bg-zinc-100 flex items-center justify-center text-zinc-400">
                                    <Building2 className="w-8 h-8" />
                                </div>
                                <div>
                                    <DialogTitle className="text-2xl font-black text-zinc-900 leading-tight">{selectedMill?.millName}</DialogTitle>
                                    <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest mt-1">
                                        Entity Profile: {selectedMill?.millId} • {selectedMill?.region}
                                    </p>
                                </div>
                            </div>
                            <Badge className="bg-zinc-900 text-white border-none px-4 py-1 rounded-full text-[10px] font-black tracking-tighter">
                                RANK #{selectedMill?.ranking.overall} NATIONAL
                            </Badge>
                        </div>
                    </DialogHeader>

                    {selectedMill && (
                        <div className="p-8 space-y-8">
                            {/* Performance Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="p-6 bg-white rounded-3xl shadow-sm border border-zinc-100 flex flex-col items-center text-center">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-4">Compliance</p>
                                    <div className="text-4xl font-black text-green-600 mb-2">{selectedMill.complianceScore}%</div>
                                    <div className="h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-green-500 rounded-full" style={{ width: `${selectedMill.complianceScore}%` }} />
                                    </div>
                                </div>
                                <div className="p-6 bg-white rounded-3xl shadow-sm border border-zinc-100 flex flex-col items-center text-center">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-4">Consistency</p>
                                    <div className="text-4xl font-black text-[#0A3225] mb-2">{selectedMill.productionConsistency}%</div>
                                    <div className="h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-[#0A3225]/50 rounded-full" style={{ width: `${selectedMill.productionConsistency}%` }} />
                                    </div>
                                </div>
                                <div className="p-6 bg-white rounded-3xl shadow-sm border border-zinc-100 flex flex-col items-center text-center">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-4">Percentile</p>
                                    <div className="text-4xl font-black text-orange mb-2">{selectedMill.ranking.percentile}th</div>
                                    <div className="h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-orange rounded-full" style={{ width: `${selectedMill.ranking.percentile}%` }} />
                                    </div>
                                </div>
                            </div>

                            {/* Operational Insights */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <Card className="border-none shadow-sm rounded-3xl bg-white overflow-hidden">
                                    <CardHeader className="bg-zinc-50/50 border-b py-4">
                                        <CardTitle className="text-sm font-bold flex items-center gap-2">
                                            <Lightbulb className="w-4 h-4 text-yellow-500" />
                                            Best Practices DNA
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-6 space-y-3">
                                        {selectedMill.bestPractices?.map((practice, idx) => (
                                            <div key={idx} className="flex items-center gap-3 p-3 bg-zinc-50 rounded-2xl border border-zinc-100 text-xs font-bold text-zinc-700">
                                                <div className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
                                                {practice}
                                            </div>
                                        ))}
                                    </CardContent>
                                </Card>

                                <Card className="border-none shadow-sm rounded-3xl bg-zinc-900 text-white overflow-hidden">
                                    <CardHeader className="border-b border-white/10 py-4">
                                        <CardTitle className="text-sm font-bold flex items-center gap-2">
                                            <BarChart3 className="w-4 h-4 text-blue-400" />
                                            Action Protocol
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-6 flex flex-col justify-between h-full min-h-[160px]">
                                        <p className="text-xs text-zinc-400 leading-relaxed font-medium">
                                            Entity is currently performing at the <span className="text-white font-bold">top tier</span> of the national network. Recommend utilizing as a training hub for neighboring regions.
                                        </p>
                                        <Button className="w-full bg-white text-zinc-900 hover:bg-zinc-100 font-black text-xs h-10 rounded-2xl mt-4">
                                            <Download className="w-4 h-4 mr-2" />
                                            GENERATE FULL REPORT
                                        </Button>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Case Study Dialog */}
            <Dialog open={showCaseStudy} onOpenChange={setShowCaseStudy}>
                <DialogContent className="max-w-2xl bg-white">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Lightbulb className="w-5 h-5 text-yellow-500" />
                            Generate Success Case Study
                        </DialogTitle>
                    </DialogHeader>
                    {generating ? (
                        <div className="py-12 flex flex-col items-center justify-center space-y-4">
                            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                            <p className="text-sm font-bold text-zinc-500">Processing performance data...</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-100">
                                <h4 className="font-bold text-sm text-zinc-900 mb-2">Select Focus Area</h4>
                                <div className="grid grid-cols-2 gap-3">
                                    <Button variant="outline" className="justify-start h-12 hover:border-[#0A3225]/20 hover:bg-[#0A3225]/5">
                                        <div className="text-left">
                                            <div className="font-bold text-xs">QC Automation</div>
                                            <div className="text-[10px] text-zinc-500">Impact on result consistency</div>
                                        </div>
                                    </Button>
                                    <Button variant="outline" className="justify-start h-12 hover:border-green-200 hover:bg-green-50">
                                        <div className="text-left">
                                            <div className="font-bold text-xs">Efficiency Drives</div>
                                            <div className="text-[10px] text-zinc-500">Output vs. Resource correlation</div>
                                        </div>
                                    </Button>
                                </div>
                            </div>
                            <Button className="w-full bg-[#0A3225] text-white hover:bg-[#0A3225]/90" onClick={() => {
                                setGenerating(true)
                                setTimeout(() => {
                                    setGenerating(false)
                                    setShowCaseStudy(false)
                                }, 2000)
                            }}>
                                <Download className="w-4 h-4 mr-2" />
                                Generate & Download PDF
                            </Button>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Deploy Assistance Dialog */}
            <Dialog open={showAssistance} onOpenChange={setShowAssistance}>
                <DialogContent className="max-w-md bg-white">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Building2 className="w-5 h-5 text-red-600" />
                            Deploy Support Team
                        </DialogTitle>
                    </DialogHeader>
                    {selectedMill && (
                        <div className="space-y-4">
                            <div className="p-3 bg-red-50 rounded-lg border border-red-100 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center font-bold text-sm text-red-600 border border-red-200">
                                    {selectedMill.millName.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-bold text-sm text-zinc-900">{selectedMill.millName}</p>
                                    <p className="text-xs text-red-600 font-medium">Critical Intervention Required</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Label className="text-xs font-bold uppercase text-zinc-500">Assign Specialist</Label>
                                <div className="space-y-2">
                                    {['Dr. Sarah K. (Quality Systems)', 'Eng. John M. (Machinery)', 'Tech Team Alpha (General Audit)'].map((expert, i) => (
                                        <div key={i} className="flex items-center gap-3 p-3 rounded-lg border hover:border-blue-500 cursor-pointer transition-all group">
                                            <div className="w-4 h-4 rounded-full border border-zinc-300 group-hover:border-blue-500" />
                                            <span className="text-sm font-medium text-zinc-700">{expert}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <Button className="w-full bg-red-600 hover:bg-red-700 text-white" onClick={() => setShowAssistance(false)}>
                                Confirm Deployment
                            </Button>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Active Profile Dialog */}
            <Dialog open={showProfile} onOpenChange={setShowProfile}>
                <DialogContent className="max-w-xl bg-white">
                    <DialogHeader>
                        <DialogTitle>Miller Profile</DialogTitle>
                    </DialogHeader>
                    {selectedMill && (
                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="w-16 h-16 bg-zinc-100 rounded-2xl flex items-center justify-center">
                                    <Building2 className="w-8 h-8 text-zinc-400" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-zinc-900">{selectedMill.millName}</h3>
                                    <div className="flex gap-2 mt-1">
                                        <Badge variant="outline">{selectedMill.millId}</Badge>
                                        <Badge variant="outline">{selectedMill.country}</Badge>
                                        <Badge className={selectedMill.riskLevel === 'critical' ? 'bg-red-100 text-red-700 hover:bg-red-200' : 'bg-green-100 text-green-700'}>
                                            {selectedMill.riskLevel.toUpperCase()} RISK
                                        </Badge>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-zinc-50 rounded-xl space-y-1">
                                    <p className="text-xs text-zinc-500 font-bold uppercase">Primary Contact</p>
                                    <p className="text-sm font-bold text-zinc-900">James Omondi</p>
                                    <p className="text-xs text-zinc-600">Plant Manager</p>
                                    <p className="text-xs text-[#0A3225] mt-1">+254 712 345 678</p>
                                </div>
                                <div className="p-4 bg-zinc-50 rounded-xl space-y-1">
                                    <p className="text-xs text-zinc-500 font-bold uppercase">Facility Details</p>
                                    <p className="text-sm font-bold text-zinc-900">Type A Processor</p>
                                    <p className="text-xs text-zinc-600">Capacity: 450MT/Day</p>
                                    <p className="text-xs text-zinc-600">Lines: 3 (Maize, Wheat)</p>
                                </div>
                            </div>

                            <div className="border-t pt-4">
                                <h4 className="text-xs font-bold uppercase text-zinc-500 mb-3">Compliance History (Last 3 Audits)</h4>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm p-2 bg-red-50 rounded text-red-700">
                                        <span>Oct 2024</span>
                                        <strong>68% (Critical Fail)</strong>
                                    </div>
                                    <div className="flex justify-between text-sm p-2 bg-yellow-50 rounded text-yellow-700">
                                        <span>Sep 2024</span>
                                        <strong>72% (Marginal)</strong>
                                    </div>
                                    <div className="flex justify-between text-sm p-2 bg-green-50 rounded text-green-700">
                                        <span>Aug 2024</span>
                                        <strong>81% (Pass)</strong>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}
