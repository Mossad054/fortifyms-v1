'use client'

import * as React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
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
    FileText, Globe, TrendingUp, CheckCircle2, AlertCircle,
    Clock, Users, Target, Megaphone, Download, Plus,
    BarChart3, Flag, Award, MessageSquare, Send, DollarSign
} from 'lucide-react'
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

// Policy Lifecycle Types
type PolicyStatus = 'proposed' | 'adopted' | 'implementing' | 'monitoring' | 'completed'
type PolicyType = 'mandatory' | 'voluntary' | 'pilot' | 'regulatory'

interface Policy {
    id: string
    title: string
    type: PolicyType
    status: PolicyStatus
    country: string
    adoptionDate?: string
    implementationProgress: number
    impactScore: number
    millsAffected: number
    advocacyCampaigns: number
}

// Mock Policy Data
const POLICIES: Policy[] = [
    {
        id: 'POL-001',
        title: 'Mandatory Maize Fortification',
        type: 'mandatory',
        status: 'monitoring',
        country: 'Kenya',
        adoptionDate: '2023-01-15',
        implementationProgress: 85,
        impactScore: 92,
        millsAffected: 35,
        advocacyCampaigns: 3
    },
    {
        id: 'POL-002',
        title: 'Voluntary Wheat Fortification',
        type: 'voluntary',
        status: 'implementing',
        country: 'Uganda',
        adoptionDate: '2023-06-20',
        implementationProgress: 65,
        impactScore: 78,
        millsAffected: 18,
        advocacyCampaigns: 2
    },
    {
        id: 'POL-003',
        title: 'Rice Fortification Pilot',
        type: 'pilot',
        status: 'implementing',
        country: 'Tanzania',
        adoptionDate: '2024-03-10',
        implementationProgress: 40,
        impactScore: 65,
        millsAffected: 8,
        advocacyCampaigns: 1
    },
    {
        id: 'POL-004',
        title: 'Quality Standards Update',
        type: 'regulatory',
        status: 'adopted',
        country: 'Kenya',
        adoptionDate: '2024-09-01',
        implementationProgress: 25,
        impactScore: 55,
        millsAffected: 42,
        advocacyCampaigns: 1
    },
]

const REGULATORY_LANDSCAPE = [
    { country: 'Kenya', status: 'mandatory', maturity: 95, mills: 42, coverage: 88 },
    { country: 'Uganda', status: 'voluntary', maturity: 75, mills: 28, coverage: 65 },
    { country: 'Tanzania', status: 'pilot', maturity: 55, mills: 15, coverage: 42 },
    { country: 'Rwanda', status: 'voluntary', maturity: 68, mills: 12, coverage: 58 },
    { country: 'Burundi', status: 'none', maturity: 20, mills: 5, coverage: 15 },
]

const ADOPTION_TREND = [
    { year: '2020', mandatory: 1, voluntary: 2, pilot: 1 },
    { year: '2021', mandatory: 2, voluntary: 3, pilot: 2 },
    { year: '2022', mandatory: 2, voluntary: 4, pilot: 3 },
    { year: '2023', mandatory: 3, voluntary: 5, pilot: 4 },
    { year: '2024', mandatory: 4, voluntary: 6, pilot: 5 },
]

const ADVOCACY_CAMPAIGNS = [
    {
        id: 'ADV-001',
        title: 'National Fortification Awareness',
        policy: 'POL-001',
        status: 'active',
        reach: 2500000,
        engagement: 450000,
        startDate: '2024-01-15',
        budget: 150000,
        milestones: 8,
        completed: 6
    },
    {
        id: 'ADV-002',
        title: 'School Nutrition Program',
        policy: 'POL-001',
        status: 'active',
        reach: 850000,
        engagement: 320000,
        startDate: '2024-03-01',
        budget: 85000,
        milestones: 5,
        completed: 4
    },
    {
        id: 'ADV-003',
        title: 'Industry Stakeholder Engagement',
        policy: 'POL-004',
        status: 'planning',
        reach: 500000,
        engagement: 0,
        startDate: '2024-12-01',
        budget: 45000,
        milestones: 6,
        completed: 0
    },
]

const IMPACT_METRICS = {
    totalPolicies: 15,
    activePolicies: 4,
    millsCovered: 97,
    populationReach: 12500000,
    complianceImprovement: 23,
    nutritionalOutcomes: 18,
}

export function PolicyAdvocacy() {
    const [selectedPolicy, setSelectedPolicy] = React.useState<Policy | null>(null)
    const [showPolicyDialog, setShowPolicyDialog] = React.useState(false)
    const [showAdvocacyDialog, setShowAdvocacyDialog] = React.useState(false)

    const getStatusColor = (status: PolicyStatus) => {
        switch (status) {
            case 'proposed': return 'bg-gray-100 text-gray-700'
            case 'adopted': return 'bg-blue-100 text-blue-700'
            case 'implementing': return 'bg-yellow-100 text-yellow-700'
            case 'monitoring': return 'bg-green-100 text-green-700'
            case 'completed': return 'bg-purple-100 text-purple-700'
            default: return 'bg-gray-100 text-gray-700'
        }
    }

    const getTypeColor = (type: PolicyType) => {
        switch (type) {
            case 'mandatory': return 'bg-red-100 text-red-700 border-red-200'
            case 'voluntary': return 'bg-green-100 text-green-700 border-green-200'
            case 'pilot': return 'bg-blue-100 text-blue-700 border-blue-200'
            case 'regulatory': return 'bg-purple-100 text-purple-700 border-purple-200'
            default: return 'bg-gray-100 text-gray-700 border-gray-200'
        }
    }

    return (
        <div className="space-y-6">
            {/* Impact Summary Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 shrink-0">
                <Card className="hover:shadow-md transition-all border-zinc-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Legislative Base</CardTitle>
                        <div className="p-2 rounded-full bg-blue-50">
                            <FileText className="h-4 w-4 text-blue-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-black text-zinc-900">{IMPACT_METRICS.totalPolicies}</div>
                        <p className="text-[10px] text-zinc-500 font-bold mt-1 uppercase tracking-tighter">Total Frameworks</p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-all border-zinc-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Live Enforcement</CardTitle>
                        <div className="p-2 rounded-full bg-green-50">
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-black text-zinc-900">{IMPACT_METRICS.activePolicies}</div>
                        <p className="text-[10px] text-zinc-500 font-bold mt-1 uppercase tracking-tighter">Active Mandates</p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-all border-zinc-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Industrial Depth</CardTitle>
                        <div className="p-2 rounded-full bg-purple-50">
                            <Target className="h-4 w-4 text-purple-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-black text-zinc-900">{IMPACT_METRICS.millsCovered}</div>
                        <p className="text-[10px] text-zinc-500 font-bold mt-1 uppercase tracking-tighter">Impacted Entities</p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-all border-zinc-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Public Health</CardTitle>
                        <div className="p-2 rounded-full bg-orange-50">
                            <Users className="h-4 w-4 text-orange-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-black text-zinc-900">{(IMPACT_METRICS.populationReach / 1000000).toFixed(1)}M</div>
                        <p className="text-[10px] text-zinc-500 font-bold mt-1 uppercase tracking-tighter">Est. Net Reach</p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-all border-zinc-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Compliance Δ</CardTitle>
                        <div className="p-2 rounded-full bg-indigo-50">
                            <TrendingUp className="h-4 w-4 text-indigo-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-black text-indigo-600">+{IMPACT_METRICS.complianceImprovement}%</div>
                        <p className="text-[10px] text-zinc-500 font-bold mt-1 uppercase tracking-tighter">Efficiency Gain</p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-all border-zinc-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Outcome α</CardTitle>
                        <div className="p-2 rounded-full bg-pink-50">
                            <Award className="h-4 w-4 text-pink-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-black text-pink-600">+{IMPACT_METRICS.nutritionalOutcomes}%</div>
                        <p className="text-[10px] text-zinc-500 font-bold mt-1 uppercase tracking-tighter">Biomarker Shift</p>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="landscape" className="space-y-6">
                <TabsList className="grid w-full grid-cols-5 lg:w-[900px] bg-white/40 p-1 backdrop-blur-md rounded-xl border border-white/20 shadow-sm">
                    <TabsTrigger value="landscape" className="flex items-center gap-2 font-bold text-gray-600 data-[state=active]:bg-zinc-900 data-[state=active]:text-white transition-all">
                        <Globe className="w-4 h-4" />
                        <span className="hidden lg:inline">Landscape</span>
                    </TabsTrigger>
                    <TabsTrigger value="adoption" className="flex items-center gap-2 font-bold text-gray-600 data-[state=active]:bg-zinc-900 data-[state=active]:text-white transition-all">
                        <Flag className="w-4 h-4" />
                        <span className="hidden lg:inline">Adoption</span>
                    </TabsTrigger>
                    <TabsTrigger value="implementation" className="flex items-center gap-2 font-bold text-gray-600 data-[state=active]:bg-zinc-900 data-[state=active]:text-white transition-all">
                        <Target className="w-4 h-4" />
                        <span className="hidden lg:inline">Implementation</span>
                    </TabsTrigger>
                    <TabsTrigger value="advocacy" className="flex items-center gap-2 font-bold text-gray-600 data-[state=active]:bg-zinc-900 data-[state=active]:text-white transition-all">
                        <Megaphone className="w-4 h-4" />
                        <span className="hidden lg:inline">Advocacy</span>
                    </TabsTrigger>
                    <TabsTrigger value="impact" className="flex items-center gap-2 font-bold text-gray-600 data-[state=active]:bg-zinc-900 data-[state=active]:text-white transition-all">
                        <BarChart3 className="w-4 h-4" />
                        <span className="hidden lg:inline">Impact</span>
                    </TabsTrigger>
                </TabsList>

                {/* REGULATORY LANDSCAPE TAB */}
                <TabsContent value="landscape">
                    <Card className="border-none shadow-md overflow-hidden bg-white">
                        <CardHeader className="border-b py-3 px-6">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-base flex items-center gap-2">
                                    <Globe className="w-4 h-4 text-zinc-400" />
                                    National Framework Maturity
                                </CardTitle>
                                <Button variant="outline" size="sm" className="h-8">
                                    <Download className="w-3.5 h-3.5 mr-2" />
                                    Legislative Map
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {REGULATORY_LANDSCAPE.map((country) => (
                                    <div key={country.country} className="flex flex-col border-2 border-zinc-100 rounded-2xl overflow-hidden hover:border-zinc-300 transition-all group bg-white shadow-sm">
                                        <div className="p-4 border-b bg-zinc-50/50 flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <Flag className="w-4 h-4 text-zinc-400" />
                                                <h4 className="font-bold text-zinc-900 text-sm">{country.country}</h4>
                                            </div>
                                            <Badge className={`border-none px-2 py-0 h-5 text-[8px] font-black tracking-widest ${country.status === 'mandatory' ? 'bg-red-100 text-red-700' :
                                                country.status === 'voluntary' ? 'bg-green-100 text-green-700' :
                                                    country.status === 'pilot' ? 'bg-blue-100 text-blue-700' : 'bg-zinc-100 text-zinc-500'
                                                }`}>
                                                {country.status.toUpperCase()}
                                            </Badge>
                                        </div>

                                        <div className="p-4 space-y-5">
                                            <div>
                                                <div className="flex justify-between items-end mb-1.5">
                                                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-tight">Regulatory Maturity</span>
                                                    <span className="text-xs font-black text-zinc-900">{country.maturity}%</span>
                                                </div>
                                                <div className="h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden">
                                                    <div className="h-full bg-zinc-900 rounded-full transition-all duration-1000" style={{ width: `${country.maturity}%` }} />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-100">
                                                    <p className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest leading-none mb-1">Active Mills</p>
                                                    <p className="text-lg font-black text-zinc-900 leading-none">{country.mills}</p>
                                                </div>
                                                <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-100">
                                                    <p className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest leading-none mb-1">Coverage</p>
                                                    <p className="text-lg font-black text-zinc-900 leading-none">{country.coverage}%</p>
                                                </div>
                                            </div>

                                            {country.status === 'none' && (
                                                <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-xl border border-blue-100">
                                                    <AlertCircle className="w-3.5 h-3.5 text-blue-600" />
                                                    <p className="text-[10px] text-blue-700 font-bold leading-tight">Framework gap identified. Priority advocacy required.</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* POLICY ADOPTION TAB */}
                <TabsContent value="adoption">
                    <div className="space-y-6">
                        <Card className="border-none shadow-md overflow-hidden bg-white">
                            <CardHeader className="border-b py-3 px-6 bg-white">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-base flex items-center gap-2">
                                        <TrendingUp className="w-4 h-4 text-red-600" />
                                        Legislative Momentum Trend
                                    </CardTitle>
                                    <Button size="sm" onClick={() => setShowPolicyDialog(true)} className="h-8 bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-[11px]">
                                        <Plus className="w-3.5 h-3.5 mr-2" />
                                        DRAFT NEW FRAMEWORK
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={ADOPTION_TREND}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                        <XAxis dataKey="year" axisLine={false} tickLine={false} fontSize={12} />
                                        <YAxis axisLine={false} tickLine={false} fontSize={12} />
                                        <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                        <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 700, paddingTop: '10px' }} />
                                        <Bar dataKey="mandatory" fill="#ef4444" name="Mandatory Mandates" stackId="a" radius={[0, 0, 0, 0]} />
                                        <Bar dataKey="voluntary" fill="#10b981" name="Voluntary Standards" stackId="a" radius={[0, 0, 0, 0]} />
                                        <Bar dataKey="pilot" fill="#3b82f6" name="Pilot Initiatives" stackId="a" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>

                                <div className="mt-6 p-4 bg-zinc-900 rounded-2xl text-white shadow-lg overflow-hidden relative">
                                    <div className="absolute top-0 right-0 p-4 opacity-10">
                                        <TrendingUp className="w-16 h-16 rotate-12" />
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-white/10 rounded-lg">
                                            <TrendingUp className="w-4 h-4 text-blue-400" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-xs uppercase tracking-widest text-blue-400 mb-1">Growth Intelligence</h4>
                                            <p className="text-[11px] text-zinc-300 leading-relaxed font-medium">
                                                Policy adoption has scaled <span className="text-white font-black">150% YoY</span>. Mandatory mandates now dictate <span className="text-white font-black">27%</span> of national frameworks, reinforcing the shift towards strict regulatory enforcement.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Active Policies Table */}
                        <Card className="border-none shadow-md overflow-hidden bg-white">
                            <CardHeader className="border-b py-3 px-6 bg-white">
                                <CardTitle className="text-base flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-zinc-400" />
                                    Global Regulatory Registry
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <Table>
                                    <TableHeader className="bg-zinc-50/50">
                                        <TableRow>
                                            <TableHead className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">ID</TableHead>
                                            <TableHead className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Framework Title</TableHead>
                                            <TableHead className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Classification</TableHead>
                                            <TableHead className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Jurisdiction</TableHead>
                                            <TableHead className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Enforcement</TableHead>
                                            <TableHead className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Adopted</TableHead>
                                            <TableHead className="text-center text-[10px] font-bold uppercase tracking-wider text-zinc-500">Entities Affected</TableHead>
                                            <TableHead className="text-right text-[10px] font-bold uppercase tracking-wider text-zinc-500">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {POLICIES.map((policy) => (
                                            <TableRow key={policy.id} className="hover:bg-zinc-50/50 transition-colors group">
                                                <TableCell className="font-mono text-[10px] font-bold text-zinc-500">{policy.id}</TableCell>
                                                <TableCell className="font-bold text-zinc-900 text-xs">{policy.title}</TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className={`text-[8px] font-black tracking-widest h-5 ${getTypeColor(policy.type)}`}>
                                                        {policy.type.toUpperCase()}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-xs font-bold text-zinc-600">{policy.country}</TableCell>
                                                <TableCell>
                                                    <Badge className={`border-none px-2 py-0 h-5 text-[8px] font-black tracking-widest ${getStatusColor(policy.status)}`}>
                                                        {policy.status.toUpperCase()}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-[10px] font-bold text-zinc-500">
                                                    {policy.adoptionDate ? new Date(policy.adoptionDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'PENDING'}
                                                </TableCell>
                                                <TableCell className="text-center font-black text-zinc-900 text-xs">{policy.millsAffected}</TableCell>
                                                <TableCell className="text-right">
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        className="h-8 text-[11px] font-bold text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                                        onClick={() => {
                                                            setSelectedPolicy(policy)
                                                            setShowPolicyDialog(true)
                                                        }}
                                                    >
                                                        Details
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* IMPLEMENTATION MONITORING TAB */}
                <TabsContent value="implementation">
                    <Card className="border-none shadow-md overflow-hidden bg-white">
                        <CardHeader className="border-b py-3 px-6 bg-white">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-base flex items-center gap-2">
                                    <Target className="w-4 h-4 text-blue-600" />
                                    Execution Fidelity Monitoring
                                </CardTitle>
                                <Button variant="outline" size="sm" className="h-8">
                                    <Download className="w-3.5 h-3.5 mr-2" />
                                    Audit Manifest
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                                {POLICIES.filter(p => p.status === 'implementing' || p.status === 'monitoring').map((policy) => (
                                    <div key={policy.id} className="flex flex-col border-2 border-zinc-100 rounded-2xl overflow-hidden hover:border-zinc-300 transition-all bg-white shadow-sm">
                                        <div className="p-4 border-b bg-zinc-50/50 flex items-center justify-between">
                                            <div>
                                                <h4 className="font-bold text-zinc-900 text-sm">{policy.title}</h4>
                                                <p className="text-[10px] font-mono text-zinc-500 font-bold uppercase tracking-widest">{policy.id} // {policy.country}</p>
                                            </div>
                                            <Badge className={`border-none px-2 py-0 h-5 text-[8px] font-black tracking-widest ${getStatusColor(policy.status)}`}>
                                                {policy.status.toUpperCase()}
                                            </Badge>
                                        </div>

                                        <div className="p-4 space-y-6">
                                            <div className="grid grid-cols-2 gap-6">
                                                <div className="space-y-4">
                                                    <div className="space-y-1.5">
                                                        <div className="flex justify-between items-end">
                                                            <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-tight">Deployment Progress</span>
                                                            <span className="text-xs font-black text-blue-600">{policy.implementationProgress}%</span>
                                                        </div>
                                                        <div className="h-1.5 w-full bg-blue-50 rounded-full overflow-hidden">
                                                            <div className="h-full bg-blue-600 rounded-full transition-all duration-1000" style={{ width: `${policy.implementationProgress}%` }} />
                                                        </div>
                                                    </div>

                                                    <div className="space-y-1.5">
                                                        <div className="flex justify-between items-end">
                                                            <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-tight">Public Health Impact</span>
                                                            <span className="text-xs font-black text-green-600">{policy.impactScore}%</span>
                                                        </div>
                                                        <div className="h-1.5 w-full bg-green-50 rounded-full overflow-hidden">
                                                            <div className="h-full bg-green-600 rounded-full transition-all duration-1000" style={{ width: `${policy.impactScore}%` }} />
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 gap-2">
                                                    <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-100 flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            <Building2 className="w-3.5 h-3.5 text-zinc-400" />
                                                            <span className="text-[9px] font-bold text-zinc-500 uppercase">Impacted</span>
                                                        </div>
                                                        <span className="text-sm font-black text-zinc-900">{policy.millsAffected} Mills</span>
                                                    </div>
                                                    <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-100 flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            <Megaphone className="w-3.5 h-3.5 text-zinc-400" />
                                                            <span className="text-[9px] font-bold text-zinc-500 uppercase">Campaigns</span>
                                                        </div>
                                                        <span className="text-sm font-black text-zinc-900">{policy.advocacyCampaigns} Active</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="pt-2">
                                                <h5 className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-3 border-b pb-1">Milestone Checklist</h5>
                                                <div className="grid grid-cols-1 gap-2">
                                                    {[
                                                        { title: 'Stakeholder Consultation', status: 'completed' },
                                                        { title: 'Regulatory Framework Finalized', status: 'completed' },
                                                        { title: 'Regional Capacity Building', status: policy.implementationProgress >= 50 ? 'completed' : 'in_progress' },
                                                        { title: 'National Monitoring Setup', status: policy.implementationProgress >= 75 ? 'completed' : 'pending' },
                                                        { title: 'Long-term Impact Study', status: policy.implementationProgress >= 90 ? 'completed' : 'pending' },
                                                    ].map((milestone, idx) => (
                                                        <div key={idx} className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-zinc-50/50 border border-zinc-100">
                                                            {milestone.status === 'completed' ? (
                                                                <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                                                            ) : milestone.status === 'in_progress' ? (
                                                                <Clock className="w-3.5 h-3.5 text-orange-500 animate-pulse" />
                                                            ) : (
                                                                <div className="w-3.5 h-3.5 rounded-full border border-zinc-300" />
                                                            )}
                                                            <span className={`text-[10px] font-bold ${milestone.status === 'completed' ? 'text-zinc-600' : 'text-zinc-400'}`}>
                                                                {milestone.title}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* ADVOCACY CAMPAIGNS TAB */}
                <TabsContent value="advocacy">
                    <div className="space-y-6">
                        <Card className="border-none shadow-md overflow-hidden bg-white">
                            <CardHeader className="border-b py-3 px-6 bg-white">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-base flex items-center gap-2">
                                        <Megaphone className="w-4 h-4 text-orange-600" />
                                        Social Mobilization Hub
                                    </CardTitle>
                                    <Button size="sm" onClick={() => setShowAdvocacyDialog(true)} className="h-8 bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-[11px]">
                                        <Plus className="w-3.5 h-3.5 mr-2" />
                                        DEPLOY CAMPAIGN
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {ADVOCACY_CAMPAIGNS.map((campaign) => (
                                        <div key={campaign.id} className="group relative border-2 border-zinc-100 rounded-2xl overflow-hidden hover:border-orange-100 transition-all bg-white shadow-sm flex flex-col">
                                            <div className="p-4 border-b bg-orange-50/30 flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-orange-100 rounded-xl group-hover:scale-110 transition-transform">
                                                        <Megaphone className="w-4 h-4 text-orange-600" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-zinc-900 text-sm">{campaign.title}</h4>
                                                        <p className="text-[10px] font-mono text-zinc-500 font-bold tracking-tight">{campaign.id} // Link: {campaign.policy}</p>
                                                    </div>
                                                </div>
                                                <Badge className={`border-none px-2 py-0 h-5 text-[8px] font-black tracking-widest ${campaign.status === 'active' ? 'bg-green-100 text-green-700' :
                                                    campaign.status === 'planning' ? 'bg-blue-100 text-blue-700' : 'bg-zinc-100 text-zinc-500'
                                                    }`}>
                                                    {campaign.status.toUpperCase()}
                                                </Badge>
                                            </div>

                                            <div className="p-4 space-y-4 flex-1">
                                                <div className="grid grid-cols-2 gap-2">
                                                    <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-100">
                                                        <p className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Total Reach</p>
                                                        <div className="flex items-center gap-1.5">
                                                            <Users className="w-3.5 h-3.5 text-blue-600" />
                                                            <p className="text-lg font-black text-zinc-900 leading-none">{(campaign.reach / 1000000).toFixed(1)}M</p>
                                                        </div>
                                                    </div>
                                                    <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-100">
                                                        <p className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Engagement</p>
                                                        <div className="flex items-center gap-1.5">
                                                            <MessageSquare className="w-3.5 h-3.5 text-green-600" />
                                                            <p className="text-lg font-black text-zinc-900 leading-none">{(campaign.engagement / 1000).toFixed(0)}k</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="space-y-1.5">
                                                    <div className="flex justify-between items-end">
                                                        <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-tight">Campaign Saturation</span>
                                                        <span className="text-xs font-black text-zinc-900">
                                                            {campaign.completed}/{campaign.milestones} Milestones
                                                        </span>
                                                    </div>
                                                    <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-orange-500 rounded-full transition-all duration-1000"
                                                            style={{ width: `${(campaign.completed / campaign.milestones) * 100}%` }}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between pt-2">
                                                    <div className="flex items-center gap-1">
                                                        <DollarSign className="w-3 h-3 text-zinc-400" />
                                                        <span className="text-[10px] font-bold text-zinc-500">Allocation: ${(campaign.budget / 1000).toFixed(0)}k</span>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <Button variant="ghost" size="sm" className="h-7 text-[10px] font-black text-zinc-400 hover:text-zinc-600 px-2">ANALYTICS</Button>
                                                        <Button variant="outline" size="sm" className="h-7 text-[10px] font-black text-zinc-900 border-zinc-200 hover:bg-zinc-50 px-2">MANIFEST</Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* IMPACT REPORTING TAB */}
                <TabsContent value="impact">
                    <div className="space-y-6">
                        <Card className="border-none shadow-md overflow-hidden bg-white">
                            <CardHeader className="border-b py-3 px-6 bg-white">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-base flex items-center gap-2">
                                        <BarChart3 className="w-4 h-4 text-pink-600" />
                                        National Impact Synthesis
                                    </CardTitle>
                                    <Button variant="outline" size="sm" className="h-8">
                                        <Download className="w-3.5 h-3.5 mr-2" />
                                        Impact Brief
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    {/* Impact by Policy Type */}
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-xs font-black text-zinc-400 uppercase tracking-widest">Core Impact Drivers</h4>
                                            <div className="flex items-center gap-2">
                                                <div className="flex items-center gap-1">
                                                    <div className="w-2 h-2 rounded-full bg-red-500" />
                                                    <span className="text-[9px] font-bold text-zinc-500 uppercase">Mandatory</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <div className="w-2 h-2 rounded-full bg-green-500" />
                                                    <span className="text-[9px] font-bold text-zinc-500 uppercase">Voluntary</span>
                                                </div>
                                            </div>
                                        </div>
                                        <ResponsiveContainer width="100%" height={250}>
                                            <PieChart>
                                                <Pie
                                                    data={[
                                                        { name: 'Mandatory', value: 45, color: '#ef4444' },
                                                        { name: 'Voluntary', value: 30, color: '#10b981' },
                                                        { name: 'Pilot', value: 15, color: '#3b82f6' },
                                                        { name: 'Regulatory', value: 10, color: '#8b5cf6' },
                                                    ]}
                                                    dataKey="value"
                                                    nameKey="name"
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={60}
                                                    outerRadius={90}
                                                    paddingAngle={5}
                                                    stroke="none"
                                                >
                                                    {[
                                                        { name: 'Mandatory', value: 45, color: '#ef4444' },
                                                        { name: 'Voluntary', value: 30, color: '#10b981' },
                                                        { name: 'Pilot', value: 15, color: '#3b82f6' },
                                                        { name: 'Regulatory', value: 10, color: '#8b5cf6' },
                                                    ].map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                                    ))}
                                                </Pie>
                                                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>

                                    {/* Compliance Improvement */}
                                    <div className="space-y-4">
                                        <h4 className="text-xs font-black text-zinc-400 uppercase tracking-widest">Longitudinal Performance Shift</h4>
                                        <ResponsiveContainer width="100%" height={250}>
                                            <LineChart data={[
                                                { month: 'Jan', baseline: 65, withPolicy: 68 },
                                                { month: 'Mar', baseline: 66, withPolicy: 72 },
                                                { month: 'May', baseline: 67, withPolicy: 76 },
                                                { month: 'Jul', baseline: 68, withPolicy: 80 },
                                                { month: 'Sep', baseline: 69, withPolicy: 84 },
                                                { month: 'Nov', baseline: 70, withPolicy: 88 },
                                            ]}>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                                <XAxis dataKey="month" axisLine={false} tickLine={false} fontSize={10} />
                                                <YAxis domain={[60, 95]} axisLine={false} tickLine={false} fontSize={10} />
                                                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                                                <Legend iconType="circle" wrapperStyle={{ fontSize: '9px', fontWeight: 700, paddingTop: '10px' }} />
                                                <Line type="monotone" dataKey="baseline" stroke="#94a3b8" strokeWidth={2} strokeDasharray="5 5" name="PROJECTION (NO POLICY)" />
                                                <Line type="monotone" dataKey="withPolicy" stroke="#10b981" strokeWidth={4} dot={{ fill: '#10b981', r: 4 }} activeDot={{ r: 6 }} name="ACTUAL (WITH POLICY)" />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                {/* SDG Alignment */}
                                <div className="mt-8 p-6 bg-zinc-900 rounded-3xl text-white overflow-hidden relative">
                                    <div className="absolute -bottom-10 -right-10 opacity-10">
                                        <Award className="w-48 h-48" />
                                    </div>
                                    <div className="relative z-10 space-y-6">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-pink-500/20 rounded-xl">
                                                <Award className="w-5 h-5 text-pink-400" />
                                            </div>
                                            <h4 className="font-black text-sm uppercase tracking-widest text-pink-400">Biological Target Matrix (SDG)</h4>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                            <div className="space-y-1">
                                                <p className="text-sm font-black text-white">SDG 2: Zero Hunger</p>
                                                <p className="text-[11px] text-zinc-400 leading-relaxed">
                                                    <span className="text-green-400 font-bold">12.5M individuals</span> secured via biofortified delivery networks.
                                                </p>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-sm font-black text-white">SDG 3: Good Health</p>
                                                <p className="text-[11px] text-zinc-400 leading-relaxed">
                                                    <span className="text-blue-400 font-bold">18% reduction</span> in regional micronutrient deficiency markers.
                                                </p>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-sm font-black text-white">SDG 17: Partnerships</p>
                                                <p className="text-[11px] text-zinc-400 leading-relaxed">
                                                    <span className="text-purple-400 font-bold">97 entities</span> integrated into the national quality protocol.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>

            {/* Policy Dialog */}
            <Dialog open={showPolicyDialog} onOpenChange={setShowPolicyDialog}>
                <DialogContent className="max-w-2xl bg-white border-none shadow-2xl rounded-3xl p-0 overflow-hidden">
                    <DialogHeader className="p-8 bg-zinc-900 text-white">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-blue-500/20 rounded-xl">
                                <FileText className="w-5 h-5 text-blue-400" />
                            </div>
                            <DialogTitle className="text-2xl font-black">
                                {selectedPolicy ? `FRAMEWORK: ${selectedPolicy.id}` : 'DRAFT NEW POLICY'}
                            </DialogTitle>
                        </div>
                        <p className="text-zinc-400 text-xs font-bold tracking-widest uppercase">Legislative Authority & Regulatory Protocol</p>
                    </DialogHeader>
                    <div className="p-8 space-y-6">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Protocol Designation</Label>
                            <Input
                                className="h-12 bg-zinc-50 border-zinc-200 focus:ring-zinc-900 font-bold text-zinc-900 rounded-xl px-4"
                                placeholder="e.g., Mandatory Maize Fortification Act"
                                defaultValue={selectedPolicy?.title}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Structural Type</Label>
                                <Input
                                    className="h-12 bg-zinc-50 border-zinc-200 focus:ring-zinc-900 font-bold text-zinc-900 rounded-xl px-4"
                                    placeholder="Mandatory / Pilot"
                                    defaultValue={selectedPolicy?.type}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Jurisdiction</Label>
                                <Input
                                    className="h-12 bg-zinc-50 border-zinc-200 focus:ring-zinc-900 font-bold text-zinc-900 rounded-xl px-4"
                                    placeholder="Country / State"
                                    defaultValue={selectedPolicy?.country}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Strategic Scope</Label>
                            <Textarea
                                className="bg-zinc-50 border-zinc-200 focus:ring-zinc-900 font-medium text-zinc-600 rounded-xl p-4 min-h-[120px]"
                                placeholder="Define legislative objectives, industrial requirements, and expected population outcomes..."
                            />
                        </div>
                    </div>
                    <DialogFooter className="p-8 bg-zinc-50 border-t flex gap-4">
                        <Button variant="ghost" className="font-bold text-zinc-500 hover:text-zinc-900" onClick={() => setShowPolicyDialog(false)}>REQUISITION CANCEL</Button>
                        <Button className="bg-zinc-900 hover:bg-zinc-800 text-white font-black px-8 rounded-xl h-12">
                            <Send className="w-4 h-4 mr-2" />
                            {selectedPolicy ? 'EXECUTE UPDATE' : 'PROPOSE FRAMEWORK'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Advocacy Campaign Dialog */}
            <Dialog open={showAdvocacyDialog} onOpenChange={setShowAdvocacyDialog}>
                <DialogContent className="max-w-medium bg-white border-none shadow-2xl rounded-3xl p-0 overflow-hidden">
                    <DialogHeader className="p-8 bg-zinc-900 text-white">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-orange-500/20 rounded-xl">
                                <Megaphone className="w-5 h-5 text-orange-400" />
                            </div>
                            <DialogTitle className="text-2xl font-black uppercase tracking-tight">Deploy Social Campaign</DialogTitle>
                        </div>
                        <p className="text-zinc-400 text-xs font-bold tracking-widest uppercase">Awareness & Mobilization Protocol</p>
                    </DialogHeader>
                    <div className="p-8 space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Campaign Designation</Label>
                                <Input className="h-12 bg-zinc-50 border-zinc-200 font-bold rounded-xl px-4" placeholder="e.g., National Fortification Awareness" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Policy Integration</Label>
                                <Input className="h-12 bg-zinc-50 border-zinc-200 font-mono text-[10px] font-bold rounded-xl px-4" placeholder="ENTER POLICY ID (e.g., POL-001)" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Reach Target (Population)</Label>
                                <Input type="number" className="h-12 bg-zinc-50 border-zinc-200 font-bold rounded-xl px-4" placeholder="Number of individuals" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Budget Allocation (USD)</Label>
                                <Input type="number" className="h-12 bg-zinc-50 border-zinc-200 font-bold rounded-xl px-4" placeholder="Campaign budget" />
                            </div>
                        </div>
                    </div>
                    <DialogFooter className="p-8 bg-zinc-50 border-t flex gap-4">
                        <Button variant="ghost" className="font-bold text-zinc-500 hover:text-zinc-900" onClick={() => setShowAdvocacyDialog(false)}>ABORT DEPLOYMENT</Button>
                        <Button className="bg-zinc-900 hover:bg-zinc-800 text-white font-black px-8 rounded-xl h-12">
                            <Megaphone className="w-4 h-4 mr-2" />
                            EXECUTE DEPLOYMENT
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
