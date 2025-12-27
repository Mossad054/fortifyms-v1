'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Globe, FileText, TrendingUp, Users, AlertCircle, ArrowRight, CheckCircle2, ChevronRight, BarChart3, Building2, UploadCloud, PieChart, Target, Zap, Plus, Settings } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

// Types
interface Policy {
    id: string
    title: string
    region: string
    status: 'Active' | 'Draft' | 'Review'
    complianceRate: number
    lastAudit: string
    nextReview: string
}

interface RegulatoryLandscape {
    country: string
    status: 'Mandatory' | 'Voluntary' | 'No Standards'
    legislation: string
    yearEnacted: string
    gapAnalysis: string
}

// Mock Data
const POLICIES: Policy[] = [
    { id: 'POL-001', title: 'National Premix Standards 2024', region: 'Kenya', status: 'Active', complianceRate: 98, lastAudit: '2024-11-15', nextReview: '2025-05-15' },
    { id: 'POL-002', title: 'Importation Protocols - Maize', region: 'East Africa', status: 'Review', complianceRate: 85, lastAudit: '2024-10-20', nextReview: '2025-01-10' },
    { id: 'POL-003', title: 'Small Scale Miller Exemption', region: 'Rural Districts', status: 'Draft', complianceRate: 0, lastAudit: 'N/A', nextReview: 'N/A' },
]

const REGULATORY_LANDSCAPE: RegulatoryLandscape[] = [
    { country: 'Kenya', status: 'Mandatory', legislation: 'KS EAS 767:2019', yearEnacted: '2019', gapAnalysis: 'Fully Aligned' },
    { country: 'Uganda', status: 'Mandatory', legislation: 'US EAS 767', yearEnacted: '2020', gapAnalysis: 'Minor Gaps in QC' },
    { country: 'Tanzania', status: 'Voluntary', legislation: 'TZS 2023 (Draft)', yearEnacted: 'Pending', gapAnalysis: 'Enforcement Mechanism Missing' },
]

const ADVOCACY_CAMPAIGNS = [
    { id: 'CAM-001', title: 'Fortify Future 2025', target: 'Legislators', reach: '150 MPs', status: 'Active', impact: 'High' },
    { id: 'CAM-002', title: 'Consumer Awareness Wk', target: 'Public', reach: '5M Citizens', status: 'Planning', impact: 'Pending' },
]

export function PolicyAdvocacy() {
    const [activeTab, setActiveTab] = useState('landscape')

    // Landscape State
    const [landscapes, setLandscapes] = useState(REGULATORY_LANDSCAPE)
    const [showAddLandscape, setShowAddLandscape] = useState(false)
    const [newLandscape, setNewLandscape] = useState<Partial<RegulatoryLandscape>>({})

    // Framework Wizard State
    const [showFrameworkWizard, setShowFrameworkWizard] = useState(false)
    const [frameworkStep, setFrameworkStep] = useState(1)
    const [frameworkData, setFrameworkData] = useState<any>({})

    // Implementation Report State
    const [showImplementationDialog, setShowImplementationDialog] = useState(false)
    const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null)

    // Manifest Adjustment State
    const [showManifestDialog, setShowManifestDialog] = useState(false)

    // Campaign Deployment State
    const [showCampaignWizard, setShowCampaignWizard] = useState(false)
    const [campaignStep, setCampaignStep] = useState(1)
    const [campaignData, setCampaignData] = useState<any>({})

    // Asset Management State
    const [showAssetDialog, setShowAssetDialog] = useState(false)
    const [selectedCampaignForAssets, setSelectedCampaignForAssets] = useState<string | null>(null)

    // Impact Brief State
    const [showImpactBrief, setShowImpactBrief] = useState(false)

    // Handlers
    const handleAssetManage = (campaignId: string) => {
        setSelectedCampaignForAssets(campaignId)
        setShowAssetDialog(true)
    }

    const handleFrameworkUpload = () => {
        // Simulate upload
        const input = document.createElement('input')
        input.type = 'file'
        input.accept = '.pdf,.docx'
        input.onchange = (e: any) => {
            const file = e.target.files[0]
            if (file) {
                toast.success("File Uploaded", { description: `${file.name} attached to framework.` })
                setFrameworkData({ ...frameworkData, documentName: file.name })
            }
        }
        input.click()
    }
    const handleAddLandscape = () => {
        if (!newLandscape.country || !newLandscape.status) {
            toast.error("Please fill in required fields")
            return
        }
        setLandscapes([...landscapes, newLandscape as RegulatoryLandscape])
        setShowAddLandscape(false)
        setNewLandscape({})
        toast.success("New Landscape Added")
    }

    const handleFrameworkFinish = () => {
        toast.success("Framework Drafted", { description: `${frameworkData.title || 'New Policy'} added to roadmap.` })
        setShowFrameworkWizard(false)
        setFrameworkStep(1)
        setFrameworkData({})
    }

    const handleCampaignLaunch = () => {
        toast.success("Campaign Deployed", { description: `${campaignData.name || 'Campaign'} represents a ${campaignData.budget || '$0'} investment.` })
        setShowCampaignWizard(false)
        setCampaignStep(1)
        setCampaignData({})
    }

    return (
        <div className="space-y-6">
            <Tabs defaultValue="landscape" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="grid w-full grid-cols-5 lg:w-[800px]">
                    <TabsTrigger value="landscape">Landscape</TabsTrigger>
                    <TabsTrigger value="adoption">Adoption</TabsTrigger>
                    <TabsTrigger value="implementation">Implementation</TabsTrigger>
                    <TabsTrigger value="advocacy">Advocacy</TabsTrigger>
                    <TabsTrigger value="impact">Impact</TabsTrigger>
                </TabsList>

                {/* 1. REGULATORY LANDSCAPE */}
                <TabsContent value="landscape" className="space-y-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight">Regulatory Landscape</h2>
                            <p className="text-muted-foreground">Monitor regional compliance standards and gaps.</p>
                        </div>
                        <Button onClick={() => setShowAddLandscape(true)}>
                            <Plus className="w-4 h-4 mr-2" /> Add Landscape
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {landscapes.map((item, idx) => (
                            <Card key={idx} className="border-l-4 border-l-blue-500">
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <CardTitle className="text-xl flex items-center gap-2">
                                            <Globe className="w-5 h-5 text-blue-500" /> {item.country}
                                        </CardTitle>
                                        <Badge variant={item.status === 'Mandatory' ? 'default' : 'secondary'}>{item.status}</Badge>
                                    </div>
                                    <CardDescription>Legislation: {item.legislation}</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Enacted:</span>
                                        <span className="font-medium">{item.yearEnacted}</span>
                                    </div>
                                    <div className="bg-slate-50 p-3 rounded-md text-sm">
                                        <span className="font-semibold text-slate-700">Gap Analysis:</span>
                                        <p className="text-slate-600 mt-1">{item.gapAnalysis}</p>
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Button variant="ghost" className="w-full text-blue-600 hover:text-blue-700">View Legal Text <ArrowRight className="w-4 h-4 ml-2" /></Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                {/* 2. POLICY ADOPTION */}
                <TabsContent value="adoption" className="space-y-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight">Policy Adoption Roadmap</h2>
                            <p className="text-muted-foreground">Manage the pipeline of new fortification policies.</p>
                        </div>
                        <Button className="bg-green-600 hover:bg-green-700" onClick={() => setShowFrameworkWizard(true)}>
                            <Plus className="w-4 h-4 mr-2" /> Draft New Framework
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { stage: 'Drafting', count: 2, items: ['Rice Fortification Bill', 'Salt Iodine Revision'] },
                            { stage: 'Stakeholder Review', count: 1, items: ['Premix Tax Exemption'] },
                            { stage: 'Final Approval', count: 1, items: ['Oil Fortification Standard'] },
                        ].map(col => (
                            <Card key={col.stage} className="bg-slate-50/50">
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-sm font-medium uppercase text-muted-foreground flex justify-between">
                                        {col.stage} <Badge variant="outline">{col.count}</Badge>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {col.items.map(item => (
                                        <div key={item} className="bg-white p-3 rounded shadow-sm border flex justify-between items-center group cursor-pointer hover:border-blue-300 transition-colors">
                                            <span className="font-medium text-sm">{item}</span>
                                            <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500" />
                                        </div>
                                    ))}
                                    <Button variant="ghost" size="sm" className="w-full text-muted-foreground border-dashed border-2">+ Add Item</Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                {/* 3. IMPLEMENTATION MONITORING */}
                <TabsContent value="implementation" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Active Policy Implementation Status</CardTitle>
                            <CardDescription>Tracking real-world application of enacted standards.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                {POLICIES.map(policy => (
                                    <div key={policy.id} className="flex flex-col md:flex-row items-center justify-between p-4 border rounded-xl hover:bg-slate-50 transition-colors gap-4">
                                        <div className="flex items-center gap-4 flex-1">
                                            <div className={`p-2 rounded-lg ${policy.complianceRate > 90 ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                                <Building2 className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-base">{policy.title}</h4>
                                                <div className="flex gap-2 text-sm text-muted-foreground mt-1">
                                                    <Badge variant="outline">{policy.region}</Badge>
                                                    <span>Last Audit: {policy.lastAudit}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-end">
                                            <div className="text-center">
                                                <div className="text-2xl font-bold">{policy.complianceRate}%</div>
                                                <div className="text-xs text-muted-foreground uppercase">Compliance</div>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button variant="outline" size="sm" onClick={() => setShowManifestDialog(true)}>Adjust Manifest</Button>
                                                <Button size="sm" onClick={() => { setSelectedPolicy(policy); setShowImplementationDialog(true); }}>View Details</Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* 4. ADVOCACY */}
                <TabsContent value="advocacy" className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold">Advocacy Campaigns</h2>
                        <Button onClick={() => setShowCampaignWizard(true)}>
                            <Zap className="w-4 h-4 mr-2" /> Deploy Campaign
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {ADVOCACY_CAMPAIGNS.map(camp => (
                            <Card key={camp.id}>
                                <CardHeader>
                                    <div className="flex justify-between">
                                        <Badge>{camp.status}</Badge>
                                        <Users className="w-5 h-5 text-muted-foreground" />
                                    </div>
                                    <CardTitle className="mt-2">{camp.title}</CardTitle>
                                    <CardDescription>Target: {camp.target}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-slate-50 p-3 rounded">
                                            <div className="text-xs text-muted-foreground">Estimated Reach</div>
                                            <div className="text-lg font-bold">{camp.reach}</div>
                                        </div>
                                        <div className="bg-slate-50 p-3 rounded">
                                            <div className="text-xs text-muted-foreground">Impact Score</div>
                                            <div className="text-lg font-bold">{camp.impact}</div>
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Button variant="outline" className="w-full" onClick={() => handleAssetManage(camp.id)}>Manage Assets</Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>

                    {/* Asset Management Dialog */}
                    <Dialog open={showAssetDialog} onOpenChange={setShowAssetDialog}>
                        <DialogContent className="max-w-3xl">
                            <DialogHeader>
                                <DialogTitle>Campaign Asset Library</DialogTitle>
                                <DialogDescription>Manage creative assets for {ADVOCACY_CAMPAIGNS.find(c => c.id === selectedCampaignForAssets)?.title}</DialogDescription>
                            </DialogHeader>
                            <Tabs defaultValue="images" className="w-full">
                                <TabsList>
                                    <TabsTrigger value="images">Images & Graphics</TabsTrigger>
                                    <TabsTrigger value="video">Video Content</TabsTrigger>
                                    <TabsTrigger value="docs">Press Kits & Docs</TabsTrigger>
                                </TabsList>
                                <TabsContent value="images" className="space-y-4">
                                    <div className="grid grid-cols-3 gap-4 mt-4">
                                        <Card className="overflow-hidden group relative cursor-pointer">
                                            <div className="bg-slate-200 h-32 flex items-center justify-center text-slate-400 group-hover:bg-slate-300 transition-colors">
                                                <Globe className="w-8 h-8" />
                                            </div>
                                            <CardFooter className="p-2 text-xs font-medium">campaign_banner_v1.jpg</CardFooter>
                                        </Card>
                                        <Card className="overflow-hidden group relative cursor-pointer">
                                            <div className="bg-slate-200 h-32 flex items-center justify-center text-slate-400 group-hover:bg-slate-300 transition-colors">
                                                <Users className="w-8 h-8" />
                                            </div>
                                            <CardFooter className="p-2 text-xs font-medium">social_post_01.png</CardFooter>
                                        </Card>
                                        <div className="border-2 border-dashed rounded-xl flex flex-col items-center justify-center min-h-[160px] cursor-pointer hover:bg-slate-50 text-slate-400">
                                            <UploadCloud className="w-8 h-8 mb-2" />
                                            <span className="text-sm">Upload Image</span>
                                        </div>
                                    </div>
                                </TabsContent>
                                <TabsContent value="video">
                                    <div className="py-12 text-center text-muted-foreground">No video assets uploaded yet.</div>
                                </TabsContent>
                                <TabsContent value="docs">
                                    <div className="py-12 text-center text-muted-foreground">No documents uploaded yet.</div>
                                </TabsContent>
                            </Tabs>
                            <DialogFooter>
                                <Button onClick={() => setShowAssetDialog(false)}>Done</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </TabsContent>

                {/* 5. IMPACT */}
                <TabsContent value="impact" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card className="md:col-span-2">
                            <CardHeader>
                                <CardTitle>Health Outcomes Correlation</CardTitle>
                                <CardDescription>Mapping fortification compliance to reduction in deficiency rates.</CardDescription>
                            </CardHeader>
                            <CardContent className="h-[300px] flex items-end justify-center bg-white border rounded-xl p-8 gap-6">
                                {[
                                    { year: '2020', val: 45, label: 'Baseline' },
                                    { year: '2021', val: 55, label: 'Pilot' },
                                    { year: '2022', val: 72, label: 'Expansion' },
                                    { year: '2023', val: 88, label: 'Scaling' },
                                    { year: '2024', val: 95, label: 'Current' }
                                ].map((d, i) => (
                                    <div key={d.year} className="flex flex-col items-center gap-2 group cursor-pointer w-full max-w-[60px]">
                                        <div className="text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity mb-1">{d.val}%</div>
                                        <div className="w-full bg-blue-100 rounded-t-md relative hover:bg-blue-200 transition-all duration-500" style={{ height: `${d.val * 2}px` }}>
                                            <div className="absolute bottom-0 w-full bg-blue-500 rounded-t-md transition-all duration-1000" style={{ height: `${d.val * 2 * (d.val / 100)}px` }}></div>
                                        </div>
                                        <div className="text-xs text-muted-foreground font-medium">{d.year}</div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Key Metrics</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {[
                                        { label: 'Lives Impacted', val: '12.5M' },
                                        { label: 'DALYs Averted', val: '450k' },
                                        { label: 'Economic Return', val: '$1 : $8' }
                                    ].map(m => (
                                        <div key={m.label} className="flex justify-between items-center border-b pb-2 last:border-0 last:pb-0">
                                            <span className="text-sm text-muted-foreground">{m.label}</span>
                                            <span className="font-bold text-lg">{m.val}</span>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                            <Button size="lg" className="w-full bg-purple-600 hover:bg-purple-700" onClick={() => setShowImpactBrief(true)}>
                                <FileText className="w-4 h-4 mr-2" /> Generate Impact Brief
                            </Button>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>

            {/* DIALOGS */}

            {/* 1. Add Landscape Dialog */}
            <Dialog open={showAddLandscape} onOpenChange={setShowAddLandscape}>
                <DialogContent>
                    <DialogHeader><DialogTitle>Add Regulatory Landscape</DialogTitle></DialogHeader>
                    <div className="space-y-4 py-2">
                        <div className="space-y-2">
                            <Label>Country/Region</Label>
                            <Select onValueChange={v => setNewLandscape({ ...newLandscape, country: v })}>
                                <SelectTrigger><SelectValue placeholder="Select Country" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Nigeria">Nigeria</SelectItem>
                                    <SelectItem value="Ethiopia">Ethiopia</SelectItem>
                                    <SelectItem value="Rwanda">Rwanda</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Status</Label>
                            <Select onValueChange={v => setNewLandscape({ ...newLandscape, status: v as any })}>
                                <SelectTrigger><SelectValue placeholder="Select Status" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Mandatory">Mandatory</SelectItem>
                                    <SelectItem value="Voluntary">Voluntary</SelectItem>
                                    <SelectItem value="No Standards">No Standards</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Relevant Legislation</Label>
                            <Input placeholder="e.g. Act 204 of 2023" onChange={e => setNewLandscape({ ...newLandscape, legislation: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <Label>Year Enacted</Label>
                            <Input placeholder="YYYY" onChange={e => setNewLandscape({ ...newLandscape, yearEnacted: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <Label>Gap Analysis Summary</Label>
                            <Textarea placeholder="Brief assessment of current gaps..." onChange={e => setNewLandscape({ ...newLandscape, gapAnalysis: e.target.value })} />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowAddLandscape(false)}>Cancel</Button>
                        <Button onClick={handleAddLandscape}>Save Landscape</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* 2. Framework Wizard */}
            <Dialog open={showFrameworkWizard} onOpenChange={setShowFrameworkWizard}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Draft New Policy Framework</DialogTitle>
                        <DialogDescription>Step {frameworkStep} of 4</DialogDescription>
                    </DialogHeader>
                    <div className="py-4 min-h-[300px]">
                        {frameworkStep === 1 && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                                <h3 className="font-semibold text-lg">Landscape & Goals</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Target Region</Label>
                                        <Input placeholder="e.g. National" onChange={e => setFrameworkData({ ...frameworkData, region: e.target.value })} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Policy Type</Label>
                                        <Select onValueChange={v => setFrameworkData({ ...frameworkData, type: v })}>
                                            <SelectTrigger><SelectValue placeholder="Type" /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="mandate">Mandatory Standard</SelectItem>
                                                <SelectItem value="incentive">Fiscal Incentive</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Framework Title</Label>
                                    <Input placeholder="Official Title" onChange={e => setFrameworkData({ ...frameworkData, title: e.target.value })} />
                                </div>
                                <div
                                    className={`space-y-2 border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${frameworkData.documentName ? 'bg-green-50 border-green-200' : 'hover:bg-slate-50'}`}
                                    onClick={handleFrameworkUpload}
                                >
                                    {frameworkData.documentName ? (
                                        <>
                                            <FileText className="w-8 h-8 text-green-500 mb-2" />
                                            <span className="text-sm font-medium text-green-700">{frameworkData.documentName}</span>
                                            <span className="text-xs text-green-600">Click to replace</span>
                                        </>
                                    ) : (
                                        <>
                                            <UploadCloud className="w-8 h-8 text-blue-500 mb-2" />
                                            <span className="text-sm font-medium">Upload Framework Document (PDF/DOCX)</span>
                                            <span className="text-xs text-muted-foreground">Drag & drop or click to browse</span>
                                        </>
                                    )}
                                </div>
                            </div>
                        )}
                        {frameworkStep === 2 && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                                <h3 className="font-semibold text-lg">Key Performance Indicators</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Target Coverage (%)</Label>
                                        <Input type="number" placeholder="80" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Compliance Goal (%)</Label>
                                        <Input type="number" placeholder="95" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Primary Impact Metric</Label>
                                    <Select>
                                        <SelectTrigger><SelectValue placeholder="Select Metric" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="anemia">Anemia Reduction</SelectItem>
                                            <SelectItem value="goiter">Goiter Rate</SelectItem>
                                            <SelectItem value="ntd">NTD Prevention</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        )}
                        {frameworkStep === 3 && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                                <h3 className="font-semibold text-lg">Localization</h3>
                                <p className="text-sm text-muted-foreground mb-4">Select regions for phased rollout:</p>
                                <div className="grid grid-cols-2 gap-2">
                                    {['North (Arid)', 'Central (Urban)', 'Coastal', 'West (Agrarian)'].map(r => (
                                        <div key={r} className="flex items-center space-x-2 border p-3 rounded">
                                            <Checkbox id={r} />
                                            <label htmlFor={r} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">{r}</label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        {frameworkStep === 4 && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 text-center">
                                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle2 className="w-8 h-8 text-blue-600" />
                                </div>
                                <h3 className="font-bold text-xl">Ready to Submit</h3>
                                <p className="text-muted-foreground">The framework "{frameworkData.title || 'New Policy'}" will be added to the roadmap as a Draft.</p>
                                <Card className="text-left mt-4 max-w-sm mx-auto bg-slate-50">
                                    <CardContent className="p-4 space-y-2 text-sm">
                                        <div className="flex justify-between"><span>Type:</span> <span className="font-medium">{frameworkData.type}</span></div>
                                        <div className="flex justify-between"><span>Region:</span> <span className="font-medium">{frameworkData.region}</span></div>
                                        <div className="flex justify-between text-blue-600"><span>Document:</span> <span className="font-medium underline cursor-pointer">framework_v1.pdf</span></div>
                                    </CardContent>
                                </Card>
                            </div>
                        )}
                    </div>
                    <DialogFooter>
                        {frameworkStep > 1 && <Button variant="outline" onClick={() => setFrameworkStep(frameworkStep - 1)}>Back</Button>}
                        {frameworkStep < 4 ? (
                            <Button onClick={() => setFrameworkStep(frameworkStep + 1)}>Next</Button>
                        ) : (
                            <Button className="bg-green-600" onClick={handleFrameworkFinish}>Finish & Add</Button>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* 3. Implementation Details Dialog */}
            <Dialog open={showImplementationDialog} onOpenChange={setShowImplementationDialog}>
                <DialogContent className="max-w-3xl">
                    <DialogHeader>
                        <div className="flex justify-between items-start pr-4">
                            <div>
                                <DialogTitle className="text-xl">{selectedPolicy?.title}</DialogTitle>
                                <DialogDescription className="mt-1">Implementation Report & Audit History</DialogDescription>
                            </div>
                            <Badge className="text-lg px-3 py-1 bg-green-100 text-green-700 hover:bg-green-200">{selectedPolicy?.complianceRate}% Compliant</Badge>
                        </div>
                    </DialogHeader>
                    <div className="py-2 space-y-6">
                        <div className="grid grid-cols-3 gap-4">
                            <Card>
                                <CardContent className="pt-6 text-center">
                                    <div className="text-2xl font-bold">142</div>
                                    <div className="text-xs text-muted-foreground mt-1">Active Mills</div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="pt-6 text-center">
                                    <div className="text-2xl font-bold text-red-600">12</div>
                                    <div className="text-xs text-muted-foreground mt-1">Critical Failures</div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="pt-6 text-center">
                                    <div className="text-2xl font-bold text-blue-600">98%</div>
                                    <div className="text-xs text-muted-foreground mt-1">Premix Retention</div>
                                </CardContent>
                            </Card>
                        </div>

                        <Card className="bg-slate-50">
                            <CardHeader className="pb-2"><CardTitle className="text-sm">Recent Audit Timeline</CardTitle></CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="flex gap-4 items-start">
                                            <div className="w-2 h-2 rounded-full bg-blue-500 mt-2" />
                                            <div className="flex-1">
                                                <div className="flex justify-between">
                                                    <span className="font-semibold text-sm">Zone B Inspection Sweep</span>
                                                    <span className="text-xs text-muted-foreground">2 days ago</span>
                                                </div>
                                                <p className="text-xs text-slate-600">Checking 15 facilities. avg score 88%.</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowImplementationDialog(false)}>Close</Button>
                        <Button><FileText className="w-4 h-4 mr-2" /> Download Full Report</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* 4. Manifest Adjustment Dialog */}
            <Dialog open={showManifestDialog} onOpenChange={setShowManifestDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Adjust Monitoring Manifest</DialogTitle>
                        <DialogDescription>Modify sampling frequency and targets.</DialogDescription>
                    </DialogHeader>
                    <div className="py-4 space-y-4">
                        <div className="space-y-2">
                            <Label>Sampling Frequency</Label>
                            <Select defaultValue="monthly">
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="weekly">Weekly</SelectItem>
                                    <SelectItem value="monthly">Monthly</SelectItem>
                                    <SelectItem value="quarterly">Quarterly</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Required Sample Size (n)</Label>
                            <Input type="number" defaultValue="50" />
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox id="alerts" defaultChecked />
                            <Label htmlFor="alerts">Auto-trigger alerts on failure &gt; 5%</Label>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowManifestDialog(false)}>Cancel</Button>
                        <Button onClick={() => { toast.success("Manifest Updated"); setShowManifestDialog(false) }}>Save Changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* 5. Campaign Deployment Wizard */}
            <Dialog open={showCampaignWizard} onOpenChange={setShowCampaignWizard}>
                <DialogContent className="max-w-xl">
                    <DialogHeader>
                        <DialogTitle>Deploy Advocacy Campaign</DialogTitle>
                        <DialogDescription>Step {campaignStep} of 5</DialogDescription>
                    </DialogHeader>
                    <div className="py-4 min-h-[250px]">
                        {campaignStep === 1 && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                                <Label>Campaign Basics</Label>
                                <Input placeholder="Campaign Name" onChange={e => setCampaignData({ ...campaignData, name: e.target.value })} />
                                <div className="grid grid-cols-2 gap-4">
                                    <Input placeholder="Total Budget ($)" type="number" onChange={e => setCampaignData({ ...campaignData, budget: e.target.value })} />
                                    <Input placeholder="Target Audience" onChange={e => setCampaignData({ ...campaignData, target: e.target.value })} />
                                </div>
                            </div>
                        )}
                        {campaignStep === 2 && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                                <Label>Select Channels</Label>
                                <div className="grid grid-cols-2 gap-3">
                                    {['Social Media', 'Radio/TV', 'Print', 'Direct Mail', 'Events'].map(c => (
                                        <div key={c} className="border p-3 rounded flex items-center gap-2 cursor-pointer hover:bg-slate-50">
                                            <Checkbox id={c} />
                                            <Label htmlFor={c} className="cursor-pointer">{c}</Label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        {campaignStep === 3 && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                                <Label>Key Messages & Strategy</Label>
                                <Textarea placeholder="Core message for this campaign..." className="min-h-[100px]" onChange={e => setCampaignData({ ...campaignData, message: e.target.value })} />
                                <div className="space-y-2">
                                    <Label>Partner Organizations</Label>
                                    <Select>
                                        <SelectTrigger><SelectValue placeholder="Select Lead Partner" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="moh">Ministry of Health</SelectItem>
                                            <SelectItem value="unicef">UNICEF</SelectItem>
                                            <SelectItem value="gain">GAIN</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        )}
                        {campaignStep === 4 && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                                <Label>Timeline & Milestones</Label>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Start Date</Label>
                                        <Input type="date" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>End Date</Label>
                                        <Input type="date" />
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2 mt-4">
                                    <Checkbox id="milestone1" />
                                    <Label htmlFor="milestone1">Launch Event</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Checkbox id="milestone2" />
                                    <Label htmlFor="milestone2">Mid-term Review</Label>
                                </div>
                            </div>
                        )}
                        {campaignStep === 5 && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 text-center">
                                <div className="p-6 border-2 border-dashed rounded-xl bg-slate-50 space-y-2">
                                    <h3 className="font-bold text-lg">{campaignData.name || 'Campaign Draft'}</h3>
                                    <p className="text-sm text-muted-foreground">Targeting: {campaignData.target || 'General Public'}</p>
                                    <p className="text-lg font-bold text-green-600">Budget: ${campaignData.budget || '0'}</p>
                                    <p className="text-xs text-slate-400">Ready to launch across 3 channels.</p>
                                </div>
                            </div>
                        )}
                    </div>
                    <DialogFooter>
                        {campaignStep > 1 && <Button variant="outline" onClick={() => setCampaignStep(campaignStep - 1)}>Back</Button>}
                        {campaignStep < 5 ? (
                            <Button onClick={() => setCampaignStep(campaignStep + 1)}>Next</Button>
                        ) : (
                            <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleCampaignLaunch}>
                                <Zap className="w-4 h-4 mr-2" /> Launch Campaign
                            </Button>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* 6. Impact Brief Modal */}
            <Dialog open={showImpactBrief} onOpenChange={setShowImpactBrief}>
                <DialogContent className="max-w-4xl h-[90vh] overflow-auto">
                    <div className="p-8 bg-white" id="impact-brief">
                        <div className="flex justify-between items-center border-b-4 border-black pb-6 mb-8">
                            <div>
                                <h1 className="text-4xl font-black uppercase tracking-tighter">Impact Brief</h1>
                                <p className="text-xl text-slate-500 font-light">Fortification Program Q4 2024</p>
                            </div>
                            <div className="text-right">
                                <div className="text-3xl font-black text-purple-600">FGWA</div>
                                <div className="text-sm font-bold tracking-widest text-slate-400">OFFICIAL REPORT</div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-12 mb-12">
                            <div className="space-y-4">
                                <h3 className="text-xl font-bold uppercase border-b pb-2">Outcome Summary</h3>
                                <p className="text-lg leading-relaxed text-slate-700">
                                    Initial monitoring indicates a <span className="font-bold bg-green-100 px-1">15% reduction</span> in prevalence of neural tube defects in the pilot regions. Compliance among large-scale millers remains steady at 98%, securing nutritional intake for over 12 million citizens.
                                </p>
                            </div>
                            <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 flex flex-col items-center justify-center text-center">
                                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Total Lives Impacted</h4>
                                <div className="text-6xl font-black text-blue-600">12.5M</div>
                                <div className="flex items-center gap-2 text-green-600 mt-2 font-bold"><TrendingUp className="w-4 h-4" /> +2.3M YoY</div>
                            </div>
                        </div>

                        <div className="bg-black text-white p-8 rounded-2xl mb-12">
                            <div className="grid grid-cols-3 gap-8 text-center divide-x divide-slate-800">
                                <div>
                                    <div className="text-4xl font-bold text-yellow-400">450k</div>
                                    <div className="text-sm font-medium mt-1 text-slate-400">DALYs Averted</div>
                                </div>
                                <div>
                                    <div className="text-4xl font-bold text-green-400">$1 : $8</div>
                                    <div className="text-sm font-medium mt-1 text-slate-400">Economic ROI</div>
                                </div>
                                <div>
                                    <div className="text-4xl font-bold text-blue-400">92%</div>
                                    <div className="text-sm font-medium mt-1 text-slate-400">School Attendance</div>
                                </div>
                            </div>
                        </div>

                        <div className="text-center text-sm text-slate-400">
                            Generated by FGWA Manager Dashboard • {new Date().toLocaleDateString()}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowImpactBrief(false)}>Close</Button>
                        <Button onClick={() => { toast.success("Brief Downloaded"); setShowImpactBrief(false) }}><Download className="w-4 h-4 mr-2" /> Download PDF</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

// Missing Icon Import Fix
import { Download } from 'lucide-react'
