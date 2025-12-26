'use client'

import * as React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
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
    FileText, Download, Calendar, Send, Clock, CheckCircle2,
    FileSpreadsheet, Presentation, Mail, Users, Settings,
    Play, Pause, Trash2, Eye, Copy, Plus
} from 'lucide-react'

// Report Types
interface ReportTemplate {
    id: string
    name: string
    description: string
    format: 'pdf' | 'excel' | 'pptx'
    category: 'executive' | 'operational' | 'compliance' | 'donor'
    sections: string[]
    lastGenerated?: string
    popularity: number
}

interface ScheduledReport {
    id: string
    templateId: string
    templateName: string
    frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly'
    recipients: string[]
    nextRun: string
    status: 'active' | 'paused'
    lastRun?: string
}

// Mock Data
const REPORT_TEMPLATES: ReportTemplate[] = [
    {
        id: 'TPL-001',
        name: 'Executive Summary Dashboard',
        description: 'High-level KPIs and trends for leadership',
        format: 'pdf',
        category: 'executive',
        sections: ['Hero Metrics', 'Compliance Trends', 'Geographic Overview', 'Policy Impact'],
        lastGenerated: '2024-12-20',
        popularity: 95
    },
    {
        id: 'TPL-002',
        name: 'Mill Performance Report',
        description: 'Detailed mill-by-mill analysis with benchmarking',
        format: 'excel',
        category: 'operational',
        sections: ['Top Performers', 'At-Risk Mills', 'Benchmarking', 'Recommendations'],
        lastGenerated: '2024-12-19',
        popularity: 88
    },
    {
        id: 'TPL-003',
        name: 'Donor Impact Presentation',
        description: 'Visual presentation for donor reporting',
        format: 'pptx',
        category: 'donor',
        sections: ['Program Reach', 'Nutritional Outcomes', 'SDG Alignment', 'Success Stories'],
        lastGenerated: '2024-12-18',
        popularity: 92
    },
    {
        id: 'TPL-004',
        name: 'Compliance Audit Report',
        description: 'Regulatory compliance and QC analysis',
        format: 'pdf',
        category: 'compliance',
        sections: ['Compliance Rates', 'QC Failures', 'Corrective Actions', 'Training Gaps'],
        lastGenerated: '2024-12-21',
        popularity: 85
    },
    {
        id: 'TPL-005',
        name: 'Procurement Analytics',
        description: 'Institutional supply and buyer analytics',
        format: 'excel',
        category: 'operational',
        sections: ['RFP Activity', 'Delivery Performance', 'Buyer Satisfaction', 'Market Coverage'],
        lastGenerated: '2024-12-20',
        popularity: 78
    },
]

const SCHEDULED_REPORTS: ScheduledReport[] = [
    {
        id: 'SCH-001',
        templateId: 'TPL-001',
        templateName: 'Executive Summary Dashboard',
        frequency: 'weekly',
        recipients: ['director@fwga.org', 'pm@fwga.org'],
        nextRun: '2024-12-27',
        status: 'active',
        lastRun: '2024-12-20'
    },
    {
        id: 'SCH-002',
        templateId: 'TPL-003',
        templateName: 'Donor Impact Presentation',
        frequency: 'monthly',
        recipients: ['donors@fwga.org', 'communications@fwga.org'],
        nextRun: '2025-01-01',
        status: 'active',
        lastRun: '2024-12-01'
    },
    {
        id: 'SCH-003',
        templateId: 'TPL-004',
        templateName: 'Compliance Audit Report',
        frequency: 'quarterly',
        recipients: ['compliance@fwga.org', 'legal@fwga.org'],
        nextRun: '2025-01-15',
        status: 'paused',
        lastRun: '2024-10-15'
    },
]

const REPORT_HISTORY = [
    { id: 'REP-156', template: 'Executive Summary Dashboard', format: 'pdf', generated: '2024-12-20', generatedBy: 'John Doe', size: '2.4 MB' },
    { id: 'REP-155', template: 'Mill Performance Report', format: 'excel', generated: '2024-12-19', generatedBy: 'Jane Smith', size: '1.8 MB' },
    { id: 'REP-154', template: 'Donor Impact Presentation', format: 'pptx', generated: '2024-12-18', generatedBy: 'John Doe', size: '5.2 MB' },
    { id: 'REP-153', template: 'Compliance Audit Report', format: 'pdf', generated: '2024-12-17', generatedBy: 'Sarah Johnson', size: '3.1 MB' },
]

export function ExportReporting() {
    const [showTemplateDialog, setShowTemplateDialog] = React.useState(false)
    const [showScheduleDialog, setShowScheduleDialog] = React.useState(false)
    const [selectedTemplate, setSelectedTemplate] = React.useState<ReportTemplate | null>(null)
    const [generatingReport, setGeneratingReport] = React.useState(false)

    const getFormatIcon = (format: string) => {
        switch (format) {
            case 'pdf': return <FileText className="w-4 h-4 text-red-600" />
            case 'excel': return <FileSpreadsheet className="w-4 h-4 text-green-600" />
            case 'pptx': return <Presentation className="w-4 h-4 text-orange-600" />
            default: return <FileText className="w-4 h-4" />
        }
    }

    const getCategoryColor = (category: string) => {
        switch (category) {
            case 'executive': return 'bg-purple-100 text-purple-700'
            case 'operational': return 'bg-blue-100 text-blue-700'
            case 'compliance': return 'bg-red-100 text-red-700'
            case 'donor': return 'bg-green-100 text-green-700'
            default: return 'bg-gray-100 text-gray-700'
        }
    }

    const handleGenerateReport = (template: ReportTemplate) => {
        setGeneratingReport(true)
        // Simulate report generation
        setTimeout(() => {
            setGeneratingReport(false)
            alert(`Report "${template.name}" generated successfully!`)
        }, 2000)
    }

    return (
        <div className="space-y-6">
            <Tabs defaultValue="templates" className="space-y-6">
                <TabsList className="grid w-full grid-cols-4 lg:w-[600px]">
                    <TabsTrigger value="templates">
                        <FileText className="w-4 h-4 mr-2" />
                        Templates
                    </TabsTrigger>
                    <TabsTrigger value="scheduled">
                        <Calendar className="w-4 h-4 mr-2" />
                        Scheduled
                    </TabsTrigger>
                    <TabsTrigger value="history">
                        <Clock className="w-4 h-4 mr-2" />
                        History
                    </TabsTrigger>
                    <TabsTrigger value="custom">
                        <Settings className="w-4 h-4 mr-2" />
                        Custom
                    </TabsTrigger>
                </TabsList>

                {/* TEMPLATES TAB */}
                <TabsContent value="templates">
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle>Report Templates Library</CardTitle>
                                    <Button onClick={() => setShowTemplateDialog(true)}>
                                        <Plus className="w-4 h-4 mr-2" />
                                        Create Template
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {REPORT_TEMPLATES.map((template) => (
                                        <Card key={template.id} className="border-2 hover:border-blue-300 transition-colors">
                                            <CardContent className="p-4">
                                                <div className="flex items-start justify-between mb-3">
                                                    <div className="flex items-center gap-2">
                                                        {getFormatIcon(template.format)}
                                                        <h4 className="font-bold">{template.name}</h4>
                                                    </div>
                                                    <Badge className={getCategoryColor(template.category)}>
                                                        {template.category.toUpperCase()}
                                                    </Badge>
                                                </div>

                                                <p className="text-sm text-gray-600 mb-3">{template.description}</p>

                                                <div className="mb-3">
                                                    <p className="text-xs font-semibold text-gray-700 mb-1">Sections Included:</p>
                                                    <div className="flex flex-wrap gap-1">
                                                        {template.sections.map((section, idx) => (
                                                            <Badge key={idx} variant="outline" className="text-xs">
                                                                {section}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                                                    <span>Last generated: {template.lastGenerated}</span>
                                                    <span className="flex items-center gap-1">
                                                        <Users className="w-3 h-3" />
                                                        {template.popularity}% popularity
                                                    </span>
                                                </div>

                                                <div className="flex gap-2">
                                                    <Button
                                                        size="sm"
                                                        className="flex-1"
                                                        onClick={() => handleGenerateReport(template)}
                                                        disabled={generatingReport}
                                                    >
                                                        <Download className="w-4 h-4 mr-2" />
                                                        {generatingReport ? 'Generating...' : 'Generate'}
                                                    </Button>
                                                    <Button size="sm" variant="outline">
                                                        <Eye className="w-4 h-4" />
                                                    </Button>
                                                    <Button size="sm" variant="outline">
                                                        <Copy className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Quick Generate Panel */}
                        <Card className="border-2 border-blue-200 bg-blue-50/30">
                            <CardHeader>
                                <CardTitle className="text-lg">Quick Generate</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <Label className="text-sm mb-2">Report Type</Label>
                                        <Select>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select template" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {REPORT_TEMPLATES.map((t) => (
                                                    <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Label className="text-sm mb-2">Date Range</Label>
                                        <Select>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select range" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="7d">Last 7 Days</SelectItem>
                                                <SelectItem value="30d">Last 30 Days</SelectItem>
                                                <SelectItem value="90d">Last 90 Days</SelectItem>
                                                <SelectItem value="12m">Last 12 Months</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Label className="text-sm mb-2">Format</Label>
                                        <Select>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select format" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="pdf">PDF Document</SelectItem>
                                                <SelectItem value="excel">Excel Spreadsheet</SelectItem>
                                                <SelectItem value="pptx">PowerPoint Presentation</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="flex gap-2 mt-4">
                                    <Button className="flex-1">
                                        <Download className="w-4 h-4 mr-2" />
                                        Generate & Download
                                    </Button>
                                    <Button variant="outline">
                                        <Send className="w-4 h-4 mr-2" />
                                        Generate & Email
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* SCHEDULED REPORTS TAB */}
                <TabsContent value="scheduled">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle>Scheduled Reports</CardTitle>
                                <Button onClick={() => setShowScheduleDialog(true)}>
                                    <Plus className="w-4 h-4 mr-2" />
                                    Schedule Report
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Schedule ID</TableHead>
                                        <TableHead>Report Template</TableHead>
                                        <TableHead>Frequency</TableHead>
                                        <TableHead>Recipients</TableHead>
                                        <TableHead>Next Run</TableHead>
                                        <TableHead>Last Run</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {SCHEDULED_REPORTS.map((schedule) => (
                                        <TableRow key={schedule.id}>
                                            <TableCell className="font-mono text-xs">{schedule.id}</TableCell>
                                            <TableCell className="font-semibold">{schedule.templateName}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline">
                                                    {schedule.frequency.toUpperCase()}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1">
                                                    <Mail className="w-3 h-3 text-gray-500" />
                                                    <span className="text-sm">{schedule.recipients.length} recipients</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-sm">
                                                {new Date(schedule.nextRun).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell className="text-sm text-gray-500">
                                                {schedule.lastRun ? new Date(schedule.lastRun).toLocaleDateString() : 'Never'}
                                            </TableCell>
                                            <TableCell>
                                                <Badge className={schedule.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}>
                                                    {schedule.status === 'active' ? (
                                                        <><Play className="w-3 h-3 mr-1" />ACTIVE</>
                                                    ) : (
                                                        <><Pause className="w-3 h-3 mr-1" />PAUSED</>
                                                    )}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex gap-1 justify-end">
                                                    <Button size="sm" variant="ghost">
                                                        {schedule.status === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                                                    </Button>
                                                    <Button size="sm" variant="ghost">
                                                        <Settings className="w-4 h-4" />
                                                    </Button>
                                                    <Button size="sm" variant="ghost">
                                                        <Trash2 className="w-4 h-4 text-red-600" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>

                            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                                <div className="flex items-start gap-2">
                                    <Calendar className="w-5 h-5 text-blue-600 mt-0.5" />
                                    <div>
                                        <h4 className="font-semibold text-sm text-blue-900">Automated Distribution</h4>
                                        <p className="text-xs text-blue-700 mt-1">
                                            Scheduled reports are automatically generated and emailed to recipients.
                                            All reports are also archived in the History tab for 90 days.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* HISTORY TAB */}
                <TabsContent value="history">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle>Report Generation History</CardTitle>
                                <Button variant="outline">
                                    <Download className="w-4 h-4 mr-2" />
                                    Export History
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Report ID</TableHead>
                                        <TableHead>Template</TableHead>
                                        <TableHead>Format</TableHead>
                                        <TableHead>Generated</TableHead>
                                        <TableHead>Generated By</TableHead>
                                        <TableHead>Size</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {REPORT_HISTORY.map((report) => (
                                        <TableRow key={report.id}>
                                            <TableCell className="font-mono text-xs">{report.id}</TableCell>
                                            <TableCell className="font-semibold">{report.template}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    {getFormatIcon(report.format)}
                                                    <span className="text-sm uppercase">{report.format}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-sm">
                                                {new Date(report.generated).toLocaleString()}
                                            </TableCell>
                                            <TableCell className="text-sm">{report.generatedBy}</TableCell>
                                            <TableCell className="text-sm text-gray-600">{report.size}</TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex gap-1 justify-end">
                                                    <Button size="sm" variant="ghost">
                                                        <Download className="w-4 h-4" />
                                                    </Button>
                                                    <Button size="sm" variant="ghost">
                                                        <Eye className="w-4 h-4" />
                                                    </Button>
                                                    <Button size="sm" variant="ghost">
                                                        <Send className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* CUSTOM BUILDER TAB */}
                <TabsContent value="custom">
                    <Card>
                        <CardHeader>
                            <CardTitle>Custom Report Builder</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                <div>
                                    <Label className="text-sm mb-2">Report Name</Label>
                                    <Input placeholder="e.g., Monthly Performance Review" />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label className="text-sm mb-2">Output Format</Label>
                                        <Select>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select format" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="pdf">PDF Document</SelectItem>
                                                <SelectItem value="excel">Excel Spreadsheet</SelectItem>
                                                <SelectItem value="pptx">PowerPoint Presentation</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Label className="text-sm mb-2">Category</Label>
                                        <Select>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="executive">Executive</SelectItem>
                                                <SelectItem value="operational">Operational</SelectItem>
                                                <SelectItem value="compliance">Compliance</SelectItem>
                                                <SelectItem value="donor">Donor</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div>
                                    <Label className="text-sm mb-3">Select Sections to Include</Label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {[
                                            'Hero Metrics',
                                            'Geographic Distribution',
                                            'Compliance Trends',
                                            'Production Volume',
                                            'QC Performance',
                                            'Training Analytics',
                                            'Top Performing Mills',
                                            'At-Risk Mills',
                                            'Benchmarking Analysis',
                                            'Procurement Activity',
                                            'Delivery Performance',
                                            'Market Coverage',
                                            'Policy Landscape',
                                            'Advocacy Campaigns',
                                            'Impact Assessment',
                                            'SDG Contribution'
                                        ].map((section) => (
                                            <div key={section} className="flex items-center space-x-2 p-2 border rounded hover:bg-gray-50">
                                                <Checkbox id={section} />
                                                <Label htmlFor={section} className="text-sm cursor-pointer flex-1">
                                                    {section}
                                                </Label>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label className="text-sm mb-2">Date Range</Label>
                                        <Select>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select range" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="7d">Last 7 Days</SelectItem>
                                                <SelectItem value="30d">Last 30 Days</SelectItem>
                                                <SelectItem value="90d">Last 90 Days</SelectItem>
                                                <SelectItem value="12m">Last 12 Months</SelectItem>
                                                <SelectItem value="custom">Custom Range</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Label className="text-sm mb-2">Country Filter</Label>
                                        <Select>
                                            <SelectTrigger>
                                                <SelectValue placeholder="All countries" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All Countries</SelectItem>
                                                <SelectItem value="kenya">Kenya</SelectItem>
                                                <SelectItem value="uganda">Uganda</SelectItem>
                                                <SelectItem value="tanzania">Tanzania</SelectItem>
                                                <SelectItem value="rwanda">Rwanda</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="flex gap-2 pt-4">
                                    <Button className="flex-1">
                                        <Download className="w-4 h-4 mr-2" />
                                        Generate Report
                                    </Button>
                                    <Button variant="outline">
                                        <FileText className="w-4 h-4 mr-2" />
                                        Save as Template
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Template Creation Dialog */}
            <Dialog open={showTemplateDialog} onOpenChange={setShowTemplateDialog}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Create Report Template</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label>Template Name</Label>
                            <Input placeholder="e.g., Quarterly Impact Report" />
                        </div>
                        <div>
                            <Label>Description</Label>
                            <Input placeholder="Brief description of the report purpose" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>Format</Label>
                                <Select>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select format" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="pdf">PDF</SelectItem>
                                        <SelectItem value="excel">Excel</SelectItem>
                                        <SelectItem value="pptx">PowerPoint</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label>Category</Label>
                                <Select>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="executive">Executive</SelectItem>
                                        <SelectItem value="operational">Operational</SelectItem>
                                        <SelectItem value="compliance">Compliance</SelectItem>
                                        <SelectItem value="donor">Donor</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowTemplateDialog(false)}>Cancel</Button>
                        <Button>
                            <CheckCircle2 className="w-4 h-4 mr-2" />
                            Create Template
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Schedule Report Dialog */}
            <Dialog open={showScheduleDialog} onOpenChange={setShowScheduleDialog}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Schedule Automated Report</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label>Report Template</Label>
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select template" />
                                </SelectTrigger>
                                <SelectContent>
                                    {REPORT_TEMPLATES.map((t) => (
                                        <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>Frequency</Label>
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select frequency" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="daily">Daily</SelectItem>
                                    <SelectItem value="weekly">Weekly</SelectItem>
                                    <SelectItem value="monthly">Monthly</SelectItem>
                                    <SelectItem value="quarterly">Quarterly</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>Email Recipients (comma-separated)</Label>
                            <Input placeholder="email1@example.com, email2@example.com" />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowScheduleDialog(false)}>Cancel</Button>
                        <Button>
                            <Calendar className="w-4 h-4 mr-2" />
                            Schedule Report
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
