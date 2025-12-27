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
    DialogDescription,
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
    Play, Pause, Trash2, Eye, Copy, Plus, X, ArrowLeft, ArrowRight
} from 'lucide-react'
import { toast } from 'sonner'
import { Separator } from '@/components/ui/separator'

import { REPORT_TEMPLATES, SCHEDULED_REPORTS, addTemplate, ReportTemplate } from '@/lib/mock-data/reports'

const REPORT_HISTORY = [
    { id: 'REP-156', template: 'Executive Summary Dashboard', format: 'pdf', generated: '2024-12-20', generatedBy: 'John Doe', size: '2.4 MB' },
    { id: 'REP-155', template: 'Mill Performance Report', format: 'excel', generated: '2024-12-19', generatedBy: 'Jane Smith', size: '1.8 MB' },
    { id: 'REP-154', template: 'Donor Impact Presentation', format: 'pptx', generated: '2024-12-18', generatedBy: 'John Doe', size: '5.2 MB' },
    { id: 'REP-153', template: 'Compliance Audit Report', format: 'pdf', generated: '2024-12-17', generatedBy: 'Sarah Johnson', size: '3.1 MB' },
]

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

export function ExportReporting() {
    const [templates, setTemplates] = React.useState<ReportTemplate[]>(REPORT_TEMPLATES)
    const [showTemplateDialog, setShowTemplateDialog] = React.useState(false)
    const [showScheduleDialog, setShowScheduleDialog] = React.useState(false)
    const [showPreviewDialog, setShowPreviewDialog] = React.useState(false)
    const [selectedTemplate, setSelectedTemplate] = React.useState<ReportTemplate | null>(null)
    const [generatingReport, setGeneratingReport] = React.useState<string | null>(null)

    // Template Creation Wizard State
    const [wizardStep, setWizardStep] = React.useState(1)
    const [newTemplate, setNewTemplate] = React.useState<Partial<ReportTemplate>>({
        sections: []
    })

    const handleGenerateReport = (template: ReportTemplate) => {
        setGeneratingReport(template.id)
        toast.info("Generating report...", { description: `Preparing ${template.name}` })
        setTimeout(() => {
            setGeneratingReport(null)
            toast.success("Report generated!", {
                description: `${template.name} has been downloaded successfully.`,
                action: {
                    label: "Open",
                    onClick: () => console.log("Opening report")
                }
            })
        }, 2000)
    }

    const handleCreateTemplate = () => {
        if (!newTemplate.name || !newTemplate.category || !newTemplate.format) {
            toast.error("Missing required fields", { description: "Please complete all steps." })
            return
        }

        const template: ReportTemplate = {
            id: `TPL-${Date.now()}`,
            name: newTemplate.name,
            description: newTemplate.description || 'Custom report template',
            format: newTemplate.format as any,
            category: newTemplate.category as any,
            sections: newTemplate.sections || [],
            lastGenerated: 'Never',
            popularity: 0
        }

        addTemplate(template)
        setTemplates([template, ...templates])
        setShowTemplateDialog(false)
        setNewTemplate({ sections: [] })
        setWizardStep(1)

        // Scroll to top to see new template
        window.scrollTo({ top: 0, behavior: 'smooth' })

        toast.success("Template created successfully", {
            description: `${template.name} has been added to your library.`,
            action: {
                label: "View Report",
                onClick: () => {
                    setSelectedTemplate(template)
                    setShowPreviewDialog(true)
                }
            }
        })
    }

    const toggleSection = (section: string) => {
        const sections = newTemplate.sections || []
        if (sections.includes(section)) {
            setNewTemplate({ ...newTemplate, sections: sections.filter(s => s !== section) })
        } else {
            setNewTemplate({ ...newTemplate, sections: [...sections, section] })
        }
    }

    const PreviewModal = () => (
        <Dialog open={showPreviewDialog} onOpenChange={setShowPreviewDialog}>
            <DialogContent className="max-w-4xl h-[80vh] flex flex-col p-0 overflow-hidden bg-zinc-100">
                <div className="p-4 border-b bg-white flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-100 rounded-lg">
                            <FileText className="w-5 h-5 text-red-600" />
                        </div>
                        <div>
                            <DialogTitle className="text-base font-bold text-zinc-900">
                                {selectedTemplate?.name || 'Report Preview'}
                            </DialogTitle>
                            <DialogDescription className="text-xs">
                                Previewing generated output structure
                            </DialogDescription>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => setShowPreviewDialog(false)}>Close</Button>
                        <Button size="sm" onClick={() => {
                            if (selectedTemplate) {
                                setShowPreviewDialog(false)
                                handleGenerateReport(selectedTemplate)
                            }
                        }}>
                            <Download className="w-4 h-4 mr-2" /> Download
                        </Button>
                    </div>
                </div>

                <div className="flex-1 overflow-auto p-8 flex justify-center">
                    <div className="bg-white shadow-xl w-full max-w-[800px] min-h-[900px] p-12 flex flex-col gap-8">
                        {/* Fake Report Header */}
                        <div className="flex justify-between items-end border-b-4 border-zinc-900 pb-6">
                            <div>
                                <h1 className="text-3xl font-black text-zinc-900 uppercase tracking-tight mb-2">{selectedTemplate?.name}</h1>
                                <p className="text-zinc-500 font-medium">Generated: {new Date().toLocaleDateString()}</p>
                            </div>
                            <div className="text-right">
                                <div className="font-bold text-xl text-blue-600">FORTYMIS</div>
                                <div className="text-xs text-zinc-400">OFFICIAL REPORT</div>
                            </div>
                        </div>

                        {/* Report Sections */}
                        <div className="space-y-8">
                            {selectedTemplate?.sections.map((section, idx) => (
                                <div key={idx} className="space-y-4">
                                    <h3 className="text-lg font-bold text-zinc-800 uppercase border-l-4 border-blue-500 pl-3">{section}</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="h-32 bg-zinc-50 rounded-lg border border-dashed border-zinc-200 flex items-center justify-center text-zinc-300">
                                            Chart Placeholder
                                        </div>
                                        <div className="space-y-2">
                                            <div className="h-4 bg-zinc-100 rounded w-3/4"></div>
                                            <div className="h-4 bg-zinc-100 rounded w-full"></div>
                                            <div className="h-4 bg-zinc-100 rounded w-5/6"></div>
                                            <div className="h-4 bg-zinc-100 rounded w-2/3"></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {selectedTemplate?.sections.length === 0 && (
                                <div className="text-center py-20 text-zinc-400 italic">No sections selected for preview</div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="mt-auto pt-8 border-t flex justify-between text-xs text-zinc-400">
                            <div>Confidential & Proprietary</div>
                            <div>Page 1 of 5</div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )

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
                                    {templates.map((template) => (
                                        <Card key={template.id} className="border-2 hover:border-blue-300 transition-colors">
                                            <CardContent className="p-4">
                                                <div className="flex items-start justify-between mb-3">
                                                    <div className="flex items-center gap-2">
                                                        {getFormatIcon(template.format)}
                                                        <div>
                                                            <h4 className="font-bold flex items-center gap-2">
                                                                {template.name}
                                                                {template.lastGenerated === 'Never' && (
                                                                    <Badge variant="secondary" className="text-[10px] h-5 bg-green-100 text-green-700">NEW</Badge>
                                                                )}
                                                            </h4>
                                                        </div>
                                                    </div>
                                                    <Badge className={getCategoryColor(template.category)}>
                                                        {template.category.toUpperCase()}
                                                    </Badge>
                                                </div>

                                                <p className="text-sm text-gray-600 mb-3 line-clamp-2 min-h-[2.5em]">{template.description}</p>

                                                <div className="mb-3">
                                                    <p className="text-xs font-semibold text-gray-700 mb-1">Sections Included:</p>
                                                    <div className="flex flex-wrap gap-1">
                                                        {template.sections.slice(0, 3).map((section, idx) => (
                                                            <Badge key={idx} variant="outline" className="text-xs">
                                                                {section}
                                                            </Badge>
                                                        ))}
                                                        {template.sections.length > 3 && (
                                                            <Badge variant="outline" className="text-xs">+{template.sections.length - 3} more</Badge>
                                                        )}
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
                                                        disabled={generatingReport === template.id}
                                                    >
                                                        <Download className="w-4 h-4 mr-2" />
                                                        {generatingReport === template.id ? '...' : 'Generate'}
                                                    </Button>
                                                    <Button size="sm" variant="outline" onClick={() => {
                                                        setSelectedTemplate(template)
                                                        setShowPreviewDialog(true)
                                                    }}>
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
                                                {templates.map((t) => (
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
                                    <Button className="flex-1" onClick={() => toast.success("Quick report generated!")}>
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

                {/* HISTORY TAB - Keeping existing structure but with functional enhancements if needed later */}
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
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* CUSTOM BUILDER TAB - Placeholder for now */}
                <TabsContent value="custom">
                    <Card>
                        <CardHeader>
                            <CardTitle>Custom Report Builder</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-center py-10 text-gray-500">
                                <Settings className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                <p>Custom builder features are currently in development.</p>
                                <Button className="mt-4" onClick={() => setShowTemplateDialog(true)}>Use Template Wizard</Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Template Creation Wizard */}
            <Dialog open={showTemplateDialog} onOpenChange={setShowTemplateDialog}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Create New Report Template</DialogTitle>
                        <DialogDescription>Step {wizardStep} of 3</DialogDescription>
                    </DialogHeader>

                    <div className="py-4">
                        {wizardStep === 1 && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                                <div>
                                    <Label>Template Name</Label>
                                    <Input
                                        placeholder="e.g., Monthly Field Operations Review"
                                        value={newTemplate.name || ''}
                                        onChange={e => setNewTemplate({ ...newTemplate, name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <Label>Description</Label>
                                    <Input
                                        placeholder="Brief purpose of this report"
                                        value={newTemplate.description || ''}
                                        onChange={e => setNewTemplate({ ...newTemplate, description: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label>Category</Label>
                                        <Select value={newTemplate.category} onValueChange={v => setNewTemplate({ ...newTemplate, category: v as any })}>
                                            <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="executive">Executive</SelectItem>
                                                <SelectItem value="operational">Operational</SelectItem>
                                                <SelectItem value="compliance">Compliance</SelectItem>
                                                <SelectItem value="donor">Donor</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Label>Default Format</Label>
                                        <Select value={newTemplate.format} onValueChange={v => setNewTemplate({ ...newTemplate, format: v as any })}>
                                            <SelectTrigger><SelectValue placeholder="Select format" /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="pdf">PDF</SelectItem>
                                                <SelectItem value="excel">Excel</SelectItem>
                                                <SelectItem value="pptx">PowerPoint</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>
                        )}

                        {wizardStep === 2 && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                                <Label>Select Included Sections</Label>
                                <div className="grid grid-cols-2 gap-3">
                                    {[
                                        'Hero Metrics', 'Geographic Distribution', 'Compliance Trends',
                                        'Production Volume', 'QC Performance', 'Training Analytics',
                                        'Top Performing Mills', 'At-Risk Mills', 'Benchmarking Analysis',
                                        'Procurement Activity', 'Policy Landscape', 'Impact Assessment'
                                    ].map((section) => (
                                        <div
                                            key={section}
                                            className={`flex items-center space-x-2 p-3 border rounded-lg cursor-pointer transition-colors ${newTemplate.sections?.includes(section) ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'}`}
                                            onClick={() => toggleSection(section)}
                                        >
                                            <Checkbox checked={newTemplate.sections?.includes(section)} />
                                            <Label className="text-sm cursor-pointer flex-1">{section}</Label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {wizardStep === 3 && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                                <div className="bg-gray-50 p-6 rounded-xl border border-dashed text-center">
                                    <h4 className="font-bold text-gray-900 text-lg mb-2">{newTemplate.name}</h4>
                                    <Badge className="mb-4">{newTemplate.category?.toUpperCase()}</Badge>

                                    <Separator className="my-4" />

                                    <div className="text-left max-w-sm mx-auto space-y-2">
                                        <p className="text-sm font-semibold text-gray-500 uppercase text-xs tracking-wider">Included Sections:</p>
                                        <ul className="list-disc pl-5 text-sm text-gray-700">
                                            {newTemplate.sections?.map(s => <li key={s}>{s}</li>)}
                                        </ul>
                                    </div>

                                    <div className="mt-6 flex justify-center gap-2 text-sm text-gray-500">
                                        <span>Format: <strong>{newTemplate.format?.toUpperCase()}</strong></span>
                                        <span>•</span>
                                        <span>Ready to Create</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <DialogFooter className="flex justify-between sm:justify-between w-full">
                        {wizardStep > 1 ? (
                            <Button variant="outline" onClick={() => setWizardStep(wizardStep - 1)}>
                                <ArrowLeft className="w-4 h-4 mr-2" /> Back
                            </Button>
                        ) : (
                            <Button variant="outline" onClick={() => setShowTemplateDialog(false)}>Cancel</Button>
                        )}

                        {wizardStep < 3 ? (
                            <Button onClick={() => setWizardStep(wizardStep + 1)}>
                                Next <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        ) : (
                            <Button onClick={handleCreateTemplate} className="bg-green-600 hover:bg-green-700">
                                <CheckCircle2 className="w-4 h-4 mr-2" /> Finish & Create
                            </Button>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Schedule Report Dialog (Placeholder for now) */}
            <Dialog open={showScheduleDialog} onOpenChange={setShowScheduleDialog}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Schedule Automated Report</DialogTitle>
                    </DialogHeader>
                    <div className="py-8 text-center text-gray-500">
                        Calendar scheduling interface coming next.
                    </div>
                </DialogContent>
            </Dialog>

            {/* Preview Modal */}
            <PreviewModal />
        </div>
    )
}
