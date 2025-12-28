'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
    CartesianGrid, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts'
import {
    TrendingUp, TrendingDown, Factory, Package, AlertTriangle,
    CheckCircle, Download, FileText, BarChart3, Calendar, Plus, Lightbulb
} from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6']

// Mock data for analytics
const productionAnalytics = [
    { month: 'Jan', maize: 4500, rice: 3200, wheat: 2100 },
    { month: 'Feb', maize: 4800, rice: 3400, wheat: 2300 },
    { month: 'Mar', maize: 5200, rice: 3800, wheat: 2500 },
    { month: 'Apr', maize: 4900, rice: 3600, wheat: 2400 },
    { month: 'May', maize: 5500, rice: 4000, wheat: 2700 },
    { month: 'Jun', maize: 5800, rice: 4200, wheat: 2900 },
]

const qcMetrics = [
    { name: 'Pass', value: 92 },
    { name: 'Marginal', value: 6 },
    { name: 'Fail', value: 2 },
]

const yieldTrends = [
    { week: 'W1', yield: 94.2 },
    { week: 'W2', yield: 95.1 },
    { week: 'W3', yield: 93.8 },
    { week: 'W4', yield: 96.3 },
    { week: 'W5', yield: 95.7 },
    { week: 'W6', yield: 96.8 },
]

const millPerformance = [
    { mill: 'Mill A', efficiency: 96, compliance: 98, output: 5800 },
    { mill: 'Mill B', efficiency: 94, compliance: 95, output: 5200 },
    { mill: 'Mill C', efficiency: 92, compliance: 97, output: 4900 },
    { mill: 'Mill D', efficiency: 89, compliance: 93, output: 4500 },
]

// --- ANALYTICS VIEW ---
export function AnalyticsView() {
    const [period, setPeriod] = React.useState('monthly');
    const [product, setProduct] = React.useState('all');

    return (
        <div className="space-y-6">
            {/* Filters & Controls */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/50 p-4 rounded-xl border shadow-sm">
                <div className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-[#0A3225]" />
                    <h3 className="font-semibold text-gray-900">Performance Analytics</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                    <Select value={product} onValueChange={setProduct}>
                        <SelectTrigger className="w-[180px] bg-white">
                            <SelectValue placeholder="All Products" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Products</SelectItem>
                            <SelectItem value="maize">Maize Flour</SelectItem>
                            <SelectItem value="rice">Fortified Rice</SelectItem>
                            <SelectItem value="wheat">Wheat Flour</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select value={period} onValueChange={setPeriod}>
                        <SelectTrigger className="w-[140px] bg-white">
                            <SelectValue placeholder="Period" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                            <SelectItem value="quarterly">Quarterly</SelectItem>
                            <SelectItem value="yearly">Yearly</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button variant="outline" className="bg-white">
                        <Download className="w-4 h-4 mr-2" />
                        Export Data
                    </Button>
                </div>
            </div>



            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard
                    title="Avg. Production Yield"
                    value="95.3%"
                    change="+2.1%"
                    trend="up"
                    icon={TrendingUp}
                />
                <MetricCard
                    title="QC Pass Rate"
                    value="92%"
                    change="+1.5%"
                    trend="up"
                    icon={CheckCircle}
                />
                <MetricCard
                    title="Total Output (MT)"
                    value="32.4"
                    change="+8.3%"
                    trend="up"
                    icon={Package}
                />
                <MetricCard
                    title="Critical Alerts"
                    value="3"
                    change="-2 from last week"
                    trend="down"
                    icon={AlertTriangle}
                />
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Production Trends */}
                <Card className="glass-card border-none shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-lg">Production Trends (6 Months)</CardTitle>
                        <Button variant="ghost" size="sm">
                            <Download className="w-4 h-4 mr-2" />
                            Export
                        </Button>
                    </CardHeader>
                    <CardContent className="h-[300px] min-w-0">
                        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                            <AreaChart data={productionAnalytics}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e5e5" />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} />
                                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none' }} />
                                <Area type="monotone" dataKey="maize" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                                <Area type="monotone" dataKey="rice" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
                                <Area type="monotone" dataKey="wheat" stackId="1" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.6} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* QC Metrics */}
                <Card className="glass-card border-none shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-lg">QC Test Results Distribution</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px] relative min-w-0">
                        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                            <PieChart>
                                <Pie
                                    data={qcMetrics}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={70}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {qcMetrics.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-3xl font-bold text-gray-900">92%</span>
                            <span className="text-xs text-muted-foreground uppercase tracking-wider">Pass Rate</span>
                        </div>
                    </CardContent>
                </Card>

                {/* Yield Trends */}
                <Card className="glass-card border-none shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-lg">Weekly Yield Performance</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px] min-w-0">
                        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                            <LineChart data={yieldTrends}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e5e5" />
                                <XAxis dataKey="week" axisLine={false} tickLine={false} />
                                <YAxis domain={[90, 100]} axisLine={false} tickLine={false} />
                                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none' }} />
                                <Line type="monotone" dataKey="yield" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981', r: 5 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Mill Performance Ranking */}
                <Card className="glass-card border-none shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-lg">Mill Performance Ranking</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px] min-w-0">
                        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                            <BarChart data={millPerformance} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e5e5e5" />
                                <XAxis type="number" axisLine={false} tickLine={false} />
                                <YAxis dataKey="mill" type="category" axisLine={false} tickLine={false} width={60} />
                                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none' }} />
                                <Bar dataKey="efficiency" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            {/* AI Interpretation Card (Moved to Bottom) */}
            <Card className="border-[#0A3225]/20 bg-[#0A3225]/5/30 shadow-sm">
                <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-[#0A3225]/10 rounded-xl text-[#0A3225] shrink-0">
                            <Lightbulb className="w-6 h-6" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="font-bold text-lg text-[#0A3225]">Performance Insights & Recommendations</h3>
                            <p className="text-sm text-[#0A3225]">
                                Based on {period} data for <span className="font-semibold">{product === 'all' ? 'all products' : product}</span>:
                            </p>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-sm text-gray-700 list-disc pl-4">
                                <li>Production output is <span className="text-green-600 font-bold">trending up 5%</span> compared to previous period.</li>
                                <li>Wheat Flour efficiency dropped slightly; recommend checking <span className="font-medium">Mill B settings</span>.</li>
                                <li>Inventory levels for Premix are improved; maintain current reorder points.</li>
                                <li>QC Pass Rate for Rice is excellent (99%), significantly above target.</li>
                            </ul>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

// --- REPORTS VIEW ---
export function ReportsView() {
    const router = useRouter()
    const [activeTab, setActiveTab] = React.useState<'generate' | 'scheduled' | 'history'>('generate')
    const [selectedCategory, setSelectedCategory] = React.useState<'all' | 'operational' | 'management' | 'regulatory'>('all')
    const [selectedTemplate, setSelectedTemplate] = React.useState<any | null>(null)
    const [previewOpen, setPreviewOpen] = React.useState(false)

    // Handle preview
    const handlePreview = (template: any) => {
        setSelectedTemplate(template)
        setPreviewOpen(true)
    }

    // Import mock data (in real app, these would come from the report-types file)
    const reportTemplates = [
        { id: 'daily-production', name: 'Daily Production Summary', category: 'operational', description: 'Total output by line/mill, QC results, issues encountered, target vs actual', icon: 'Factory', sections: ['Production Output', 'QC Results', 'Issues Log', 'Performance Metrics'], estimatedTime: '2-3 minutes' },
        { id: 'weekly-maintenance', name: 'Weekly Maintenance Report', category: 'operational', description: 'Completed maintenance activities, overdue tasks, equipment status', icon: 'Wrench', sections: ['Completed Tasks', 'Overdue Items', 'Equipment Status', 'Upcoming Schedule'], estimatedTime: '3-4 minutes' },
        { id: 'monthly-compliance', name: 'Monthly Compliance Report', category: 'operational', description: 'Audit status, non-conformances and resolutions, training completion', icon: 'Shield', sections: ['Audit Status', 'Non-Conformances', 'Training Records', 'Compliance Score'], estimatedTime: '4-5 minutes' },
        { id: 'monthly-performance', name: 'Monthly Performance Dashboard', category: 'management', description: 'Executive summary with key metrics, production/quality/compliance highlights, financial summary', icon: 'BarChart', sections: ['Executive Summary', 'Key Metrics', 'Highlights', 'Financial Overview', 'Issues & Resolutions'], estimatedTime: '5-6 minutes' },
        { id: 'quarterly-review', name: 'Quarterly Business Review', category: 'management', description: 'Comprehensive performance analysis, trends and forecasts, strategic recommendations', icon: 'TrendingUp', sections: ['Performance Analysis', 'Trends & Forecasts', 'Strategic Recommendations', 'Benchmarking'], estimatedTime: '8-10 minutes' },
        { id: 'compliance-audit', name: 'Compliance Audit Report', category: 'regulatory', description: 'Detailed findings by section, evidence attachments, corrective actions, sign-off approvals', icon: 'FileCheck', sections: ['Audit Findings', 'Evidence Documentation', 'Corrective Actions', 'Approvals'], estimatedTime: '6-8 minutes' },
        { id: 'batch-production', name: 'Batch Production Report', category: 'regulatory', description: 'Batch-by-batch records, QC test results, traceability documentation for authorities', icon: 'Package', sections: ['Batch Records', 'QC Test Results', 'Traceability Data', 'Certifications'], estimatedTime: '4-5 minutes' },
    ]

    const generatedReports = [
        { id: 'RPT-001', templateId: 'daily-production', name: 'Daily Production Summary - Dec 25', date: '2024-12-25', type: 'Production', status: 'Ready', size: '2.4 MB', format: 'PDF' },
        { id: 'RPT-002', templateId: 'monthly-compliance', name: 'Monthly Compliance Report - December', date: '2024-12-20', type: 'Compliance', status: 'Ready', size: '3.1 MB', format: 'PDF' },
        { id: 'RPT-003', templateId: 'weekly-maintenance', name: 'Weekly Maintenance Report - Week 51', date: '2024-12-22', type: 'Maintenance', status: 'Ready', size: '1.8 MB', format: 'Excel' },
        { id: 'RPT-004', templateId: 'batch-production', name: 'Batch Production Report - Q4 2024', date: '2024-12-15', type: 'Regulatory', status: 'Ready', size: '5.2 MB', format: 'PDF' },
        { id: 'RPT-005', templateId: 'monthly-performance', name: 'Monthly Performance Dashboard - November', date: '2024-12-01', type: 'Management', status: 'Ready', size: '4.7 MB', format: 'PowerPoint' },
    ]

    const scheduledReports = [
        { id: 'SCH-001', templateId: 'daily-production', name: 'Daily Production Summary - Auto', recurrence: 'daily', time: '08:00', recipients: ['manager@mill.com', 'supervisor@mill.com'], enabled: true, lastRun: '2024-12-25 08:00', nextRun: '2024-12-26 08:00' },
        { id: 'SCH-002', templateId: 'weekly-maintenance', name: 'Weekly Maintenance Report - Auto', recurrence: 'weekly', time: 'Monday 09:00', recipients: ['maintenance@mill.com'], enabled: true, lastRun: '2024-12-23 09:00', nextRun: '2024-12-30 09:00' },
        { id: 'SCH-003', templateId: 'monthly-compliance', name: 'Monthly Compliance Report - Auto', recurrence: 'monthly', time: '1st of month 10:00', recipients: ['compliance@mill.com', 'manager@mill.com'], enabled: false, nextRun: '2025-01-01 10:00' },
    ]

    const filteredTemplates = selectedCategory === 'all'
        ? reportTemplates
        : reportTemplates.filter(t => t.category === selectedCategory)

    const getCategoryBadgeColor = (category: string) => {
        switch (category) {
            case 'operational': return 'bg-[#0A3225]/10 text-[#0A3225]'
            case 'management': return 'bg-purple-100 text-orange'
            case 'regulatory': return 'bg-green-100 text-green-700'
            default: return 'bg-gray-100 text-gray-700'
        }
    }

    const [generating, setGenerating] = React.useState<string | null>(null)

    const handleGenerateReport = (templateId: string) => {
        setGenerating(templateId)
        // Simulate API call
        setTimeout(() => {
            setGenerating(null)
            alert(`Report generated successfully! Download started for ${templateId}.`)
        }, 1500)
    }

    return (
        <div className="space-y-6">
            {/* Tab Navigation */}
            <div className="flex gap-2 border-b">
                <button
                    className={`px-4 py-2 font-medium transition-colors ${activeTab === 'generate' ? 'border-b-2 border-blue-600 text-[#0A3225]' : 'text-gray-600 hover:text-gray-900'
                        }`}
                    onClick={() => setActiveTab('generate')}
                >
                    Generate Reports
                </button>
                <button
                    className={`px-4 py-2 font-medium transition-colors ${activeTab === 'scheduled' ? 'border-b-2 border-blue-600 text-[#0A3225]' : 'text-gray-600 hover:text-gray-900'
                        }`}
                    onClick={() => setActiveTab('scheduled')}
                >
                    Scheduled Reports
                </button>
                <button
                    className={`px-4 py-2 font-medium transition-colors ${activeTab === 'history' ? 'border-b-2 border-blue-600 text-[#0A3225]' : 'text-gray-600 hover:text-gray-900'
                        }`}
                    onClick={() => setActiveTab('history')}
                >
                    Report History
                </button>
            </div>

            {/* Generate Reports Tab */}
            {activeTab === 'generate' && (
                <div className="space-y-6">
                    {/* Category Filter */}
                    <div className="flex gap-2">
                        <Button
                            variant={selectedCategory === 'all' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setSelectedCategory('all')}
                        >
                            All Templates
                        </Button>
                        <Button
                            variant={selectedCategory === 'operational' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setSelectedCategory('operational')}
                        >
                            Operational
                        </Button>
                        <Button
                            variant={selectedCategory === 'management' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setSelectedCategory('management')}
                        >
                            Management
                        </Button>
                        <Button
                            variant={selectedCategory === 'regulatory' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setSelectedCategory('regulatory')}
                        >
                            Regulatory
                        </Button>
                    </div>

                    {/* Template Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredTemplates.map(template => (
                            <Card key={template.id} className="glass-card border-none shadow-sm hover:shadow-md transition-all">
                                <CardHeader>
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="p-3 bg-[#0A3225]/5 rounded-xl">
                                            <FileText className="w-6 h-6 text-[#0A3225]" />
                                        </div>
                                        <Badge className={getCategoryBadgeColor(template.category)}>
                                            {template.category}
                                        </Badge>
                                    </div>
                                    <CardTitle className="text-lg">{template.name}</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <p className="text-sm text-gray-600">{template.description}</p>

                                    <div className="space-y-2">
                                        <p className="text-xs font-medium text-gray-700">Sections:</p>
                                        <div className="flex flex-wrap gap-1">
                                            {template.sections.slice(0, 3).map((section, idx) => (
                                                <Badge key={idx} variant="outline" className="text-xs">
                                                    {section}
                                                </Badge>
                                            ))}
                                            {template.sections.length > 3 && (
                                                <Badge variant="outline" className="text-xs">
                                                    +{template.sections.length - 3} more
                                                </Badge>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                        <Calendar className="w-3 h-3" />
                                        Est. {template.estimatedTime}
                                    </div>

                                    <div className="flex gap-2">
                                        <Button
                                            className="flex-1"
                                            size="sm"
                                            onClick={() => handleGenerateReport(template.id)}
                                            disabled={generating === template.id}
                                        >
                                            {generating === template.id ? (
                                                <span className="animate-pulse">Generating...</span>
                                            ) : (
                                                <>
                                                    <Download className="w-4 h-4 mr-2" />
                                                    Generate
                                                </>
                                            )}
                                        </Button>
                                        <Button variant="outline" size="sm" onClick={() => handlePreview(template)}>
                                            Preview
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            )}

            {/* Report Preview Dialog */}
            <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
                <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
                    <DialogHeader>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-[#0A3225]/5 rounded-lg">
                                <FileText className="w-5 h-5 text-[#0A3225]" />
                            </div>
                            <div>
                                <DialogTitle>{selectedTemplate?.name}</DialogTitle>
                                <DialogDescription>Preview of report structure and sample data</DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>

                    <ScrollArea className="flex-1 border rounded-lg bg-white p-8">
                        {/* Mock Report Paper UI */}
                        <div className="max-w-3xl mx-auto space-y-8 text-sm">
                            {/* Report Header */}
                            <div className="border-b pb-6 flex justify-between items-start">
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900 mb-1">Fortis Mill Management</h1>
                                    <h2 className="text-xl text-gray-600">{selectedTemplate?.name}</h2>
                                    <p className="text-gray-500 mt-2">Generated: {new Date().toLocaleDateString()}</p>
                                </div>
                                <div className="text-right text-gray-500">
                                    <p>Report ID: PREVIEW-001</p>
                                    <p>Classification: Internal Use</p>
                                </div>
                            </div>

                            {/* Dynamic Sections based on template */}
                            {selectedTemplate?.sections.map((section: string, idx: number) => (
                                <div key={idx} className="space-y-4">
                                    <h3 className="text-lg font-bold text-gray-800 border-l-4 border-blue-500 pl-3">{section}</h3>
                                    <div className="bg-slate-50 p-4 rounded border border-gray-100 min-h-[100px] flex items-center justify-center text-gray-400 italic">
                                        [Placeholder data visualization for {section}]
                                    </div>
                                    <p className="text-gray-600 leading-relaxed">
                                        Sample narrative text explaining the metrics observed in the {section} section.
                                        This area would typically contain detailed analysis, tables, or itemized lists relevant to the specific reporting period.
                                    </p>
                                </div>
                            ))}

                            {/* Footer */}
                            <div className="border-t pt-6 text-center text-gray-400 text-xs">
                                <p>© 2024 Fortis Management Systems. All rights reserved.</p>
                                <p>This report is automatically generated. Please verify critical data points with the source system.</p>
                            </div>
                        </div>
                    </ScrollArea>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setPreviewOpen(false)}>Close Preview</Button>
                        <Button onClick={() => { setPreviewOpen(false); handleGenerateReport(selectedTemplate?.id); }}>
                            <Download className="w-4 h-4 mr-2" />
                            Generate Full Report
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Scheduled Reports Tab */}
            {activeTab === 'scheduled' && (
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold">Scheduled Reports</h3>
                        <Button>
                            <Plus className="w-4 h-4 mr-2" />
                            New Schedule
                        </Button>
                    </div>

                    <Card className="glass-card border-none shadow-sm">
                        <CardContent className="p-0">
                            <div className="divide-y">
                                {scheduledReports.map(schedule => (
                                    <div key={schedule.id} className="p-4 hover:bg-slate-50 transition-colors">
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h4 className="font-bold text-gray-900">{schedule.name}</h4>
                                                    <Badge className={schedule.enabled ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}>
                                                        {schedule.enabled ? 'Enabled' : 'Disabled'}
                                                    </Badge>
                                                </div>
                                                <p className="text-sm text-gray-600 mb-2">
                                                    {schedule.recurrence.charAt(0).toUpperCase() + schedule.recurrence.slice(1)} at {schedule.time}
                                                </p>
                                                <div className="flex items-center gap-4 text-xs text-gray-500">
                                                    <span>Recipients: {schedule.recipients.length}</span>
                                                    {schedule.lastRun && <span>Last run: {schedule.lastRun}</span>}
                                                    <span>Next run: {schedule.nextRun}</span>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button variant="outline" size="sm">Edit</Button>
                                                <Button variant="outline" size="sm">
                                                    {schedule.enabled ? 'Disable' : 'Enable'}
                                                </Button>
                                                <Button variant="outline" size="sm">Run Now</Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Report History Tab */}
            {activeTab === 'history' && (
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold">Generated Reports</h3>
                        <Button variant="outline">
                            <Download className="w-4 h-4 mr-2" />
                            Export All
                        </Button>
                    </div>

                    <Card className="glass-card border-none shadow-sm">
                        <CardContent className="p-0">
                            <div className="divide-y">
                                {generatedReports.map(report => (
                                    <div key={report.id} className="p-4 hover:bg-slate-50 transition-colors">
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-4">
                                                <div className="p-2 bg-gray-50 rounded-lg">
                                                    <FileText className="w-5 h-5 text-gray-600" />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-gray-900">{report.name}</h4>
                                                    <p className="text-sm text-gray-500">
                                                        {report.type} • {report.date} • {report.size} • {report.format}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <Badge variant={report.status === 'Ready' ? 'secondary' : 'outline'}>
                                                    {report.status}
                                                </Badge>
                                                {report.status === 'Ready' && (
                                                    <>
                                                        <Button size="sm" variant="outline">
                                                            <Download className="w-4 h-4 mr-2" />
                                                            Download
                                                        </Button>
                                                        <Button size="sm" variant="ghost">
                                                            Share
                                                        </Button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    )
}

// Helper component for metric cards
function MetricCard({ title, value, change, trend, icon: Icon }: any) {
    return (
        <Card className="glass-card border-none shadow-sm">
            <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <div className={`p-3 rounded-xl ${trend === 'up' ? 'bg-green-50' : 'bg-orange-50'}`}>
                        <Icon className={`w-6 h-6 ${trend === 'up' ? 'text-green-600' : 'text-orange-600'}`} />
                    </div>
                    <span className={`flex items-center text-xs font-semibold px-2.5 py-1 rounded-full ${trend === 'up' ? 'bg-green-50 text-green-700' : 'bg-orange-50 text-orange-700'
                        }`}>
                        {trend === 'up' ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                        {change}
                    </span>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-1 tracking-tight">{value}</h3>
                <p className="text-sm text-gray-500 font-medium">{title}</p>
            </CardContent>
        </Card>
    )
}
