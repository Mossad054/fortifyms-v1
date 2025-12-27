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
    category: 'operational' | 'compliance'
    sections: string[]
    lastGenerated?: string
    popularity: number
}

interface ScheduledReport {
    id: string
    templateId: string
    templateName: string
    frequency: 'daily' | 'weekly' | 'monthly'
    recipients: string[]
    nextRun: string
    status: 'active' | 'paused'
    lastRun?: string
}

// Mock Data - Restricted for Inspector
const REPORT_TEMPLATES: ReportTemplate[] = [
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
        id: 'TPL-006',
        name: 'Site Inspection Summary',
        description: 'Summary of recent site visits and findings',
        format: 'pdf',
        category: 'compliance',
        sections: ['Site Visits', 'Key Findings', 'Violations', 'Follow-up Actions'],
        lastGenerated: '2024-12-25',
        popularity: 90
    },
]

const SCHEDULED_REPORTS: ScheduledReport[] = [
    {
        id: 'SCH-003',
        templateId: 'TPL-004',
        templateName: 'Compliance Audit Report',
        frequency: 'monthly',
        recipients: ['inspector.lead@fwga.org'],
        nextRun: '2025-01-15',
        status: 'active',
        lastRun: '2024-12-15'
    },
]

const REPORT_HISTORY = [
    { id: 'REP-155', template: 'Mill Performance Report', format: 'excel', generated: '2024-12-19', generatedBy: 'You', size: '1.8 MB' },
    { id: 'REP-153', template: 'Compliance Audit Report', format: 'pdf', generated: '2024-12-17', generatedBy: 'You', size: '3.1 MB' },
]

export function InspectorReporting() {
    const [showTemplateDialog, setShowTemplateDialog] = React.useState(false) // Keeping UI but maybe disable creation? Use for "Request Template" maybe? or just allow personal templates.
    const [showScheduleDialog, setShowScheduleDialog] = React.useState(false)
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
            case 'operational': return 'bg-blue-100 text-blue-700'
            case 'compliance': return 'bg-red-100 text-red-700'
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
                <TabsList className="grid w-full grid-cols-3 lg:w-[450px]">
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
                </TabsList>

                {/* TEMPLATES TAB */}
                <TabsContent value="templates">
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle>Available Report Templates</CardTitle>
                                    <Button variant="outline" onClick={() => setShowTemplateDialog(true)}>
                                        <Plus className="w-4 h-4 mr-2" />
                                        Custom Request
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
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
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
                                <CardTitle>My Scheduled Reports</CardTitle>
                                <Button onClick={() => setShowScheduleDialog(true)}>
                                    <Plus className="w-4 h-4 mr-2" />
                                    Schedule New
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Report Template</TableHead>
                                        <TableHead>Frequency</TableHead>
                                        <TableHead>Next Run</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {SCHEDULED_REPORTS.map((schedule) => (
                                        <TableRow key={schedule.id}>
                                            <TableCell className="font-semibold">{schedule.templateName}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline">
                                                    {schedule.frequency.toUpperCase()}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-sm">
                                                {new Date(schedule.nextRun).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell>
                                                <Badge className={schedule.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}>
                                                    {schedule.status === 'active' ? 'ACTIVE' : 'PAUSED'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button size="icon" variant="ghost">
                                                    <Trash2 className="w-4 h-4 text-red-600" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* HISTORY TAB */}
                <TabsContent value="history">
                    <Card>
                        <CardHeader>
                            <CardTitle>Generation History</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Template</TableHead>
                                        <TableHead>Format</TableHead>
                                        <TableHead>Generated</TableHead>
                                        <TableHead>Size</TableHead>
                                        <TableHead className="text-right">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {REPORT_HISTORY.map((report) => (
                                        <TableRow key={report.id}>
                                            <TableCell className="font-semibold">{report.template}</TableCell>
                                            <TableCell>
                                                <span className="text-sm uppercase">{report.format}</span>
                                            </TableCell>
                                            <TableCell className="text-sm">
                                                {new Date(report.generated).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell className="text-sm text-gray-600">{report.size}</TableCell>
                                            <TableCell className="text-right">
                                                <Button size="sm" variant="ghost">
                                                    <Download className="w-4 h-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Schedule Dialog */}
            <Dialog open={showScheduleDialog} onOpenChange={setShowScheduleDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Schedule Report</DialogTitle>
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
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowScheduleDialog(false)}>Cancel</Button>
                        <Button onClick={() => setShowScheduleDialog(false)}>Schedule</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Template Request Dialog */}
            <Dialog open={showTemplateDialog} onOpenChange={setShowTemplateDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Request Custom Report</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <Label>Describe the data you need</Label>
                        <Input placeholder="e.g. Specific analysis of Region A..." />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowTemplateDialog(false)}>Cancel</Button>
                        <Button onClick={() => setShowTemplateDialog(false)}>Send Request</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
