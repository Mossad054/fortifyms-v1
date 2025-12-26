'use client'

import * as React from 'react'
import { Plus, Search, FileText, CheckCircle2, ChevronRight, AlertTriangle, MoreVertical, Trash2, Save, Edit3, ArrowLeft } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from '@/components/ui/scroll-area'
import { Switch } from '@/components/ui/switch'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ChecklistTemplate, ChecklistSection, ChecklistItem, CommodityType, FortificationMethod, Criticality, ResponseType } from '@/lib/types/compliance-audit' // Adjust import path
import { MOCK_TEMPLATES } from '@/lib/mock-data/compliance'
import { toast } from 'sonner'

export function ComplianceTemplates() {
    const [view, setView] = React.useState<'list' | 'editor'>('list')
    const [templates, setTemplates] = React.useState<ChecklistTemplate[]>(MOCK_TEMPLATES)
    const [currentTemplate, setCurrentTemplate] = React.useState<Partial<ChecklistTemplate>>({})

    const handleCreateNew = () => {
        setCurrentTemplate({
            id: `T-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)}`,
            status: 'Draft',
            sections: []
        })
        setView('editor')
    }

    const handleEdit = (template: ChecklistTemplate) => {
        setCurrentTemplate(JSON.parse(JSON.stringify(template))) // Deep copy
        setView('editor')
    }

    const handleSave = () => {
        // Validation logic here
        if (!currentTemplate.title || !currentTemplate.commodity) {
            toast.error("Please fill in required metadata.")
            return
        }

        const updated = {
            ...currentTemplate,
            updatedAt: new Date().toISOString().split('T')[0]
        } as ChecklistTemplate

        if (templates.find(t => t.id === updated.id)) {
            setTemplates(templates.map(t => t.id === updated.id ? updated : t))
        } else {
            setTemplates([...templates, updated])
        }

        toast.success("Template saved successfully.")
        setView('list')
    }

    return (
        <div className="space-y-6">
            {view === 'list' && (
                <div className="space-y-6">
                    <div className="flex justify-between items-center bg-white p-4 rounded-xl border shadow-sm">
                        <div>
                            <h2 className="text-xl font-bold text-zinc-900">Compliance Standards Library</h2>
                            <p className="text-zinc-500 text-sm">Manage digitization of national fortification protocols.</p>
                        </div>
                        <Button className="bg-zinc-900 text-white" onClick={handleCreateNew}>
                            <Plus className="w-4 h-4 mr-2" /> New Template
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {templates.map(template => (
                            <Card key={template.id} className="hover:shadow-md transition-shadow group relative overflow-hidden">
                                {template.status === 'Published' && <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-green-500/10 to-transparent rounded-bl-full -mr-12 -mt-12 pointer-events-none" />}
                                <CardHeader className="pb-3">
                                    <div className="flex justify-between items-start mb-2">
                                        <Badge variant="outline" className="font-mono bg-zinc-50">{template.id}</Badge>
                                        <Badge className={`${template.status === 'Published' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'} hover:bg-opacity-80`}>
                                            {template.status}
                                        </Badge>
                                    </div>
                                    <CardTitle className="text-lg leading-snug">{template.title}</CardTitle>
                                    <CardDescription className="flex items-center gap-2 mt-1">
                                        <FileText className="w-3 h-3" /> {template.regulatoryReference}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="pb-3">
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        <Badge variant="secondary" className="text-xs">{template.commodity}</Badge>
                                        <span className="text-xs text-zinc-400 flex items-center">v{template.version}</span>
                                    </div>
                                    <div className="text-xs text-zinc-500">
                                        Last Updated: {template.updatedAt}
                                    </div>
                                </CardContent>
                                <CardFooter className="pt-0 flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button variant="ghost" size="sm" onClick={() => handleEdit(template)}>
                                        <Edit3 className="w-4 h-4 mr-1" /> Edit
                                    </Button>
                                    <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600">
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </div>
            )}

            {view === 'editor' && (
                <TemplateEditor
                    template={currentTemplate}
                    updateTemplate={setCurrentTemplate}
                    onSave={handleSave}
                    onCancel={() => setView('list')}
                />
            )}
        </div>
    )
}

function TemplateEditor({ template, updateTemplate, onSave, onCancel }: { template: Partial<ChecklistTemplate>, updateTemplate: (t: Partial<ChecklistTemplate>) => void, onSave: () => void, onCancel: () => void }) {
    const handleAddSection = () => {
        const newSection: ChecklistSection = {
            id: `S-${Date.now()}`,
            title: 'New Section',
            items: []
        }
        updateTemplate({ ...template, sections: [...(template.sections || []), newSection] })
    }

    const updateSection = (index: number, updated: ChecklistSection) => {
        const sections = [...(template.sections || [])]
        sections[index] = updated
        updateTemplate({ ...template, sections })
    }

    const removeSection = (index: number) => {
        const sections = [...(template.sections || [])]
        sections.splice(index, 1)
        updateTemplate({ ...template, sections })
    }

    return (
        <div className="space-y-6 animate-in slide-in-from-right-4 fade-in">
            {/* Toolbar */}
            <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b p-4 -mx-6 px-6 flex justify-between items-center rounded-b-xl">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={onCancel}><ArrowLeft className="w-4 h-4" /></Button>
                    <h2 className="text-lg font-bold">Template Editor</h2>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={onCancel}>Cancel</Button>
                    <Button className="bg-green-600 hover:bg-green-700" onClick={onSave}>
                        <Save className="w-4 h-4 mr-2" /> Save Protocol
                    </Button>
                </div>
            </div>

            {/* Metadata Card */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Protocol Metadata</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label>Regulation Title</Label>
                        <Input value={template.title || ''} onChange={e => updateTemplate({ ...template, title: e.target.value })} placeholder="e.g. KS EAS 05:2023 Maize Fortification" />
                    </div>
                    <div className="space-y-2">
                        <Label>Reference Code</Label>
                        <Input value={template.regulatoryReference || ''} onChange={e => updateTemplate({ ...template, regulatoryReference: e.target.value })} placeholder="Legal Reference" />
                    </div>
                    <div className="space-y-2">
                        <Label>Commodity</Label>
                        <Select value={template.commodity} onValueChange={(v) => updateTemplate({ ...template, commodity: v as CommodityType })}>
                            <SelectTrigger><SelectValue placeholder="Select Commodity" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Maize Flour">Maize Flour</SelectItem>
                                <SelectItem value="Rice">Rice (Fortified)</SelectItem>
                                <SelectItem value="Wheat Flour">Wheat Flour</SelectItem>
                                <SelectItem value="Salt">Salt</SelectItem>
                                <SelectItem value="Oil">Oil</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Status</Label>
                        <Select value={template.status} onValueChange={(v) => updateTemplate({ ...template, status: v as any })}>
                            <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Draft">Draft</SelectItem>
                                <SelectItem value="Published">Published (Active)</SelectItem>
                                <SelectItem value="Archived">Archived</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Sections Builder */}
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h3 className="font-bold text-zinc-900">Inspection Sections</h3>
                    <Button variant="outline" size="sm" onClick={handleAddSection}>
                        <Plus className="w-4 h-4 mr-2" /> Add Section
                    </Button>
                </div>

                <Accordion type="multiple" className="space-y-4">
                    {template.sections?.map((section, idx) => (
                        <Card key={section.id} className="border-l-4 border-l-blue-500">
                            <AccordionItem value={section.id} className="border-none">
                                <div className="flex items-center p-4">
                                    <AccordionTrigger className="flex-1 hover:no-underline py-0 pr-4">
                                        <div className="text-left">
                                            <div className="font-semibold text-lg flex items-center gap-2">
                                                {section.title}
                                                <Badge variant="outline" className="ml-2 bg-blue-50 text-blue-700">{section.items.length} Items</Badge>
                                            </div>
                                            <p className="text-sm text-zinc-500 font-normal">Section ID: {section.id}</p>
                                        </div>
                                    </AccordionTrigger>
                                    <div className="flex items-center gap-2">
                                        <Button variant="ghost" size="sm" className="text-red-500" onClick={(e) => { e.stopPropagation(); removeSection(idx) }}>
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>

                                <AccordionContent className="p-4 pt-0 border-t">
                                    <div className="space-y-4 mt-4">
                                        <div className="space-y-2">
                                            <Label>Section Title</Label>
                                            <Input value={section.title} onChange={e => {
                                                const updated = { ...section, title: e.target.value }
                                                updateSection(idx, updated)
                                            }} />
                                        </div>

                                        <div className="bg-slate-50 rounded-xl p-4 space-y-4">
                                            <h4 className="font-bold text-sm text-zinc-700 flex justify-between items-center">
                                                Checklist Items
                                                <Button size="sm" variant="ghost" onClick={() => {
                                                    const newItem: ChecklistItem = {
                                                        id: `I-${Date.now()}`,
                                                        sectionId: section.id,
                                                        text: '',
                                                        type: 'YesNo',
                                                        criticality: 'Major'
                                                    }
                                                    const updated = { ...section, items: [...section.items, newItem] }
                                                    updateSection(idx, updated)
                                                }}>
                                                    <Plus className="w-3 h-3 mr-1" /> Add Question
                                                </Button>
                                            </h4>

                                            {section.items.map((item, itemIdx) => (
                                                <div key={item.id} className="bg-white border rounded-lg p-3 space-y-3 shadow-sm relative group">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-600"
                                                        onClick={() => {
                                                            const newItems = [...section.items]
                                                            newItems.splice(itemIdx, 1)
                                                            updateSection(idx, { ...section, items: newItems })
                                                        }}
                                                    >
                                                        <Trash2 className="w-3 h-3" />
                                                    </Button>

                                                    <div className="space-y-2 pr-8">
                                                        <Input
                                                            placeholder="Question Text (e.g. Is the doser validated?)"
                                                            value={item.text}
                                                            onChange={e => {
                                                                const newItems = [...section.items]
                                                                newItems[itemIdx] = { ...item, text: e.target.value }
                                                                updateSection(idx, { ...section, items: newItems })
                                                            }}
                                                            className="font-medium"
                                                        />
                                                    </div>

                                                    <div className="flex flex-wrap gap-3">
                                                        <div className="w-32">
                                                            <Select value={item.type} onValueChange={v => {
                                                                const newItems = [...section.items]
                                                                newItems[itemIdx] = { ...item, type: v as ResponseType }
                                                                updateSection(idx, { ...section, items: newItems })
                                                            }}>
                                                                <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Type" /></SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="YesNo">Yes/No</SelectItem>
                                                                    <SelectItem value="Numeric">Numeric</SelectItem>
                                                                    <SelectItem value="Photo">Photo Evidence</SelectItem>
                                                                    <SelectItem value="Dropdown">Dropdown</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                        <div className="w-32">
                                                            <Select value={item.criticality} onValueChange={v => {
                                                                const newItems = [...section.items]
                                                                newItems[itemIdx] = { ...item, criticality: v as Criticality }
                                                                updateSection(idx, { ...section, items: newItems })
                                                            }}>
                                                                <SelectTrigger className={`h-8 text-xs border-0 ${item.criticality === 'Critical' ? 'bg-red-100 text-red-700 font-bold' : 'bg-slate-100'}`}>
                                                                    <SelectValue placeholder="Criticality" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="Minor">Minor</SelectItem>
                                                                    <SelectItem value="Major">Major</SelectItem>
                                                                    <SelectItem value="Critical">CRITICAL (Stop)</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Switch
                                                                checked={item.requiredEvidence?.includes('Photo')}
                                                                onCheckedChange={(checked: boolean) => {
                                                                    let evidence = [...(item.requiredEvidence || [])]
                                                                    if (checked) evidence.push('Photo')
                                                                    else evidence = evidence.filter(e => e !== 'Photo')

                                                                    const newItems = [...section.items]
                                                                    newItems[itemIdx] = { ...item, requiredEvidence: evidence as any }
                                                                    updateSection(idx, { ...section, items: newItems })
                                                                }}
                                                            />
                                                            <Label className="text-xs text-zinc-600">Req. Photo</Label>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        </Card>
                    ))}
                </Accordion>
            </div>
        </div>
    )
}
