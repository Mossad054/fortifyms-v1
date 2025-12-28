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
    TrendingUp, TrendingDown, Download, Flag, AlertCircle, CheckCircle2
} from 'lucide-react'
import {
    LineChart, Line, AreaChart, Area, BarChart, Bar,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    Legend, ReferenceLine
} from 'recharts'

// Mock data for trends
const COMPLIANCE_TREND = [
    { month: 'Jan', programAvg: 82, nairobi: 85, coast: 78, riftValley: 80, western: 79, central: 84 },
    { month: 'Feb', programAvg: 83, nairobi: 86, coast: 79, riftValley: 81, western: 80, central: 85 },
    { month: 'Mar', programAvg: 84, nairobi: 87, coast: 80, riftValley: 82, western: 81, central: 86 },
    { month: 'Apr', programAvg: 85, nairobi: 88, coast: 81, riftValley: 83, western: 82, central: 87 },
    { month: 'May', programAvg: 86, nairobi: 89, coast: 82, riftValley: 84, western: 83, central: 88 },
    { month: 'Jun', programAvg: 87, nairobi: 90, coast: 83, riftValley: 85, western: 84, central: 89 },
    { month: 'Jul', programAvg: 86, nairobi: 89, coast: 82, riftValley: 84, western: 83, central: 88 },
    { month: 'Aug', programAvg: 87, nairobi: 90, coast: 83, riftValley: 85, western: 84, central: 89 },
    { month: 'Sep', programAvg: 88, nairobi: 91, coast: 84, riftValley: 86, western: 85, central: 90 },
    { month: 'Oct', programAvg: 87, nairobi: 90, coast: 83, riftValley: 85, western: 84, central: 89 },
    { month: 'Nov', programAvg: 87, nairobi: 90, coast: 83, riftValley: 85, western: 84, central: 89 },
    { month: 'Dec', programAvg: 87, nairobi: 90, coast: 83, riftValley: 85, western: 84, central: 89 },
]

const PRODUCTION_VOLUME = [
    { month: 'Jan', maize: 450, wheat: 280, rice: 120 },
    { month: 'Feb', maize: 470, wheat: 290, rice: 125 },
    { month: 'Mar', maize: 490, wheat: 300, rice: 130 },
    { month: 'Apr', maize: 510, wheat: 310, rice: 135 },
    { month: 'May', maize: 530, wheat: 320, rice: 140 },
    { month: 'Jun', maize: 550, wheat: 330, rice: 145 },
    { month: 'Jul', maize: 520, wheat: 315, rice: 138 },
    { month: 'Aug', maize: 540, wheat: 325, rice: 142 },
    { month: 'Sep', maize: 560, wheat: 335, rice: 147 },
    { month: 'Oct', maize: 580, wheat: 345, rice: 152 },
    { month: 'Nov', maize: 550, wheat: 330, rice: 145 },
    { month: 'Dec', maize: 550, wheat: 330, rice: 145 },
]

const QC_PASS_RATE = [
    { month: 'Jan', passRate: 88, calibration: 85, training: 82 },
    { month: 'Feb', passRate: 89, calibration: 86, training: 84 },
    { month: 'Mar', passRate: 90, calibration: 87, training: 86 },
    { month: 'Apr', passRate: 89, calibration: 86, training: 85 },
    { month: 'May', passRate: 91, calibration: 88, training: 87 },
    { month: 'Jun', passRate: 92, calibration: 89, training: 89 },
    { month: 'Jul', passRate: 91, calibration: 88, training: 88 },
    { month: 'Aug', passRate: 92, calibration: 89, training: 89 },
    { month: 'Sep', passRate: 93, calibration: 90, training: 90 },
    { month: 'Oct', passRate: 92, calibration: 89, training: 89 },
    { month: 'Nov', passRate: 92, calibration: 89, training: 89 },
    { month: 'Dec', passRate: 92, calibration: 89, training: 89 },
]

const TRAINING_COMPLETION = [
    { region: 'Nairobi', completion: 95, required: 120, completed: 114 },
    { region: 'Coast', completion: 78, required: 85, completed: 66 },
    { region: 'Rift Valley', completion: 88, required: 110, completed: 97 },
    { region: 'Western', completion: 72, required: 75, completed: 54 },
    { region: 'Central', completion: 92, required: 95, completed: 87 },
]

const POLICY_MILESTONES = [
    { month: 'Mar', label: 'New QC Standards', type: 'regulatory' },
    { month: 'Jul', label: 'Training Initiative', type: 'program' },
    { month: 'Oct', label: 'Equipment Upgrade', type: 'technical' },
]

export function PerformanceTrends() {
    const [showRegions, setShowRegions] = React.useState(false)
    const [showCalibration, setShowCalibration] = React.useState(false)
    const [showTraining, setShowTraining] = React.useState(false)
    const [selectedTimeRange, setSelectedTimeRange] = React.useState('12m')

    return (
        <div className="space-y-6">
            {/* Controls */}
            <Card className="border-zinc-200 shadow-sm shrink-0">
                <CardContent className="p-4 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-zinc-400" />
                        <div>
                            <h2 className="text-lg font-bold text-zinc-900">Performance Intelligence</h2>
                            <p className="text-zinc-500 text-xs">Longitudinal program trends and analytics</p>
                        </div>
                    </div>
                    <div className="flex gap-4 items-center">
                        <div className="flex items-center gap-2">
                            <Label className="text-xs font-bold text-zinc-500 uppercase">Range:</Label>
                            <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
                                <SelectTrigger className="w-[180px] bg-white">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="6m">Last 6 Months</SelectItem>
                                    <SelectItem value="12m">Last 12 Months</SelectItem>
                                    <SelectItem value="24m">Last 24 Months</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <Button variant="outline" className="bg-white">
                            <Download className="w-4 h-4 mr-2" />
                            Full Export
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Compliance Trend with Policy Milestones */}
            <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="border-b py-3 px-6 bg-white">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-base flex items-center gap-2">
                            <Flag className="w-4 h-4 text-orange" />
                            National Compliance Roadmap
                        </CardTitle>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <Checkbox
                                    id="regions"
                                    checked={showRegions}
                                    onCheckedChange={(checked) => setShowRegions(checked as boolean)}
                                />
                                <Label htmlFor="regions" className="text-xs cursor-pointer font-medium text-zinc-600">Regional Breakdown</Label>
                            </div>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <Download className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={350}>
                        <LineChart data={COMPLIANCE_TREND}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e5e5" />
                            <XAxis dataKey="month" axisLine={false} tickLine={false} />
                            <YAxis domain={[70, 95]} axisLine={false} tickLine={false} />
                            <Tooltip />
                            <Legend />

                            {/* Policy Milestones */}
                            {POLICY_MILESTONES.map((milestone, idx) => (
                                <ReferenceLine
                                    key={idx}
                                    x={milestone.month}
                                    stroke="#9333ea"
                                    strokeDasharray="3 3"
                                    label={{
                                        value: milestone.label,
                                        position: 'top',
                                        fill: '#9333ea',
                                        fontSize: 10
                                    }}
                                />
                            ))}

                            <Line
                                type="monotone"
                                dataKey="programAvg"
                                stroke="#3b82f6"
                                strokeWidth={3}
                                name="Program Average"
                                dot={{ r: 4 }}
                            />

                            {showRegions && (
                                <>
                                    <Line type="monotone" dataKey="nairobi" stroke="#10b981" strokeWidth={1.5} name="Nairobi" />
                                    <Line type="monotone" dataKey="coast" stroke="#f59e0b" strokeWidth={1.5} name="Coast" />
                                    <Line type="monotone" dataKey="riftValley" stroke="#8b5cf6" strokeWidth={1.5} name="Rift Valley" />
                                    <Line type="monotone" dataKey="western" stroke="#ec4899" strokeWidth={1.5} name="Western" />
                                    <Line type="monotone" dataKey="central" stroke="#06b6d4" strokeWidth={1.5} name="Central" />
                                </>
                            )}
                        </LineChart>
                    </ResponsiveContainer>

                    {/* Policy Milestones Legend */}
                    <div className="mt-4 flex flex-wrap gap-3">
                        {POLICY_MILESTONES.map((milestone, idx) => (
                            <Badge key={idx} variant="outline" className="text-orange border-purple-300">
                                <Flag className="w-3 h-3 mr-1" />
                                {milestone.month}: {milestone.label}
                            </Badge>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Production Volume Trend */}
            <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="border-b py-3 px-6 bg-white">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-base flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-[#0A3225]" />
                            Aggregated Production (MT)
                        </CardTitle>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Download className="w-4 h-4" />
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="pt-6">
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={PRODUCTION_VOLUME}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                            <XAxis dataKey="month" axisLine={false} tickLine={false} fontSize={12} />
                            <YAxis axisLine={false} tickLine={false} fontSize={12} />
                            <Tooltip
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            />
                            <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                            <Area
                                type="monotone"
                                dataKey="maize"
                                stackId="1"
                                stroke="#2563eb"
                                fillOpacity={1}
                                fill="url(#colorMaize)"
                                name="Maize"
                            />
                            <defs>
                                <linearGradient id="colorMaize" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1} />
                                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            {/* ... (simplified for now to keep it clean) */}
                            <Area type="monotone" dataKey="wheat" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.1} name="Wheat" />
                            <Area type="monotone" dataKey="rice" stackId="1" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.1} name="Rice" />
                        </AreaChart>
                    </ResponsiveContainer>

                    {/* Commodity Shift Analysis */}
                    <div className="mt-6 p-4 bg-zinc-50 rounded-xl border border-zinc-200">
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-[#0A3225]/10 rounded-lg">
                                <AlertCircle className="w-4 h-4 text-[#0A3225]" />
                            </div>
                            <div>
                                <h4 className="font-bold text-sm text-zinc-900">Intelligence Note: Commodity Shift</h4>
                                <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                                    Maize production increased <span className="text-[#0A3225] font-bold">22%</span> over 12 months.
                                    Strategic shift detected in central regions towards fortified maize secondary processing.
                                </p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* QC Pass Rate with Correlations */}
            <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="border-b py-3 px-6 bg-white">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-base flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 text-green-600" />
                            Quality Assurance correlations
                        </CardTitle>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2">
                                    <Checkbox
                                        id="calibration"
                                        checked={showCalibration}
                                        onCheckedChange={(checked) => setShowCalibration(checked as boolean)}
                                    />
                                    <Label htmlFor="calibration" className="text-xs cursor-pointer font-medium text-zinc-600">Calibration</Label>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Checkbox
                                        id="training-overlay"
                                        checked={showTraining}
                                        onCheckedChange={(checked) => setShowTraining(checked as boolean)}
                                    />
                                    <Label htmlFor="training-overlay" className="text-xs cursor-pointer font-medium text-zinc-600">Training</Label>
                                </div>
                            </div>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <Download className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={QC_PASS_RATE}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e5e5" />
                            <XAxis dataKey="month" axisLine={false} tickLine={false} />
                            <YAxis domain={[75, 100]} axisLine={false} tickLine={false} />
                            <Tooltip />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="passRate"
                                stroke="#10b981"
                                strokeWidth={3}
                                name="QC Pass Rate"
                                dot={{ r: 4 }}
                            />
                            {showCalibration && (
                                <Line
                                    type="monotone"
                                    dataKey="calibration"
                                    stroke="#f59e0b"
                                    strokeWidth={2}
                                    strokeDasharray="5 5"
                                    name="Calibration Compliance"
                                    dot={{ r: 3 }}
                                />
                            )}
                            {showTraining && (
                                <Line
                                    type="monotone"
                                    dataKey="training"
                                    stroke="#8b5cf6"
                                    strokeWidth={2}
                                    strokeDasharray="3 3"
                                    name="Training Completion"
                                    dot={{ r: 3 }}
                                />
                            )}
                        </LineChart>
                    </ResponsiveContainer>

                    {/* Correlation Analysis */}
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-green-50 rounded-lg">
                            <div className="flex items-start gap-2">
                                <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                                <div>
                                    <h4 className="font-semibold text-sm text-green-900">Strong Correlation</h4>
                                    <p className="text-xs text-green-700 mt-1">
                                        QC pass rate shows 0.89 correlation with calibration compliance.
                                        Regular equipment calibration significantly improves quality outcomes.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="p-4 bg-purple-50 rounded-lg">
                            <div className="flex items-start gap-2">
                                <TrendingUp className="w-5 h-5 text-orange mt-0.5" />
                                <div>
                                    <h4 className="font-semibold text-sm text-purple-900">Training Impact</h4>
                                    <p className="text-xs text-orange mt-1">
                                        Training completion correlates at 0.76 with QC performance.
                                        July training initiative resulted in 2% QC improvement.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Training Completion by Region */}
            <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="border-b py-3 px-6 bg-white">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-base flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-orange-600" />
                            Workforce Training Velocity
                        </CardTitle>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Download className="w-4 h-4" />
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2">
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={TRAINING_COMPLETION}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                    <XAxis dataKey="region" axisLine={false} tickLine={false} fontSize={12} />
                                    <YAxis domain={[0, 100]} axisLine={false} tickLine={false} fontSize={12} />
                                    <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                    <Bar dataKey="completion" fill="#3b82f6" name="Completion %" radius={[4, 4, 0, 0]} barSize={40} />
                                    <ReferenceLine y={85} stroke="#ef4444" strokeDasharray="3 3" label={{ value: '85% Target', position: 'right', fill: '#ef4444', fontSize: 10 }} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Training Gap Analysis */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between border-b pb-2">
                                <h4 className="font-bold text-sm text-zinc-900">Priority Areas</h4>
                                <Badge variant="outline" className="text-[10px] uppercase">Gaps Detected</Badge>
                            </div>
                            <div className="space-y-3">
                                {TRAINING_COMPLETION.filter(r => r.completion < 85).map((region) => (
                                    <div key={region.region} className="p-3 bg-red-50/50 rounded-xl border border-red-100 group hover:bg-red-50 transition-colors">
                                        <div className="flex items-center justify-between mb-2">
                                            <p className="font-bold text-xs text-red-900">{region.region}</p>
                                            <Badge className="bg-red-100 text-red-700 hover:bg-red-200 border-none text-[10px]">
                                                {region.required - region.completed} pending
                                            </Badge>
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex justify-between text-[10px] text-red-600 mb-1">
                                                <span>Progress</span>
                                                <span>{region.completion}%</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-red-100 rounded-full overflow-hidden">
                                                <div className="h-full bg-red-500 rounded-full transition-all duration-1000" style={{ width: `${region.completion}%` }} />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <Button className="w-full mt-2 bg-zinc-900 hover:bg-zinc-800 text-xs py-2 h-auto" size="sm">
                                <Download className="w-3.5 h-3.5 mr-2" />
                                Export Detailed Gap List
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
