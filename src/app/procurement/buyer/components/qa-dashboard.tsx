'use client'

import * as React from 'react'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table'
import {
    ClipboardCheck, AlertTriangle, Search, Microscope, FileText, CheckCircle2, History
} from 'lucide-react'

// --- BACKEND / DATA LAYER ---

interface QCRecord {
    id: string
    batchId: string
    product: string
    supplier: string
    dateReceived: string
    result: 'pass' | 'fail' | 'conditional'
    inspector: string
    cocUrl: string // Certificate of Conformity
}

interface Issue {
    id: string
    orderId: string
    type: string
    description: string
    status: 'open' | 'resolved' | 'investigating'
    dateReported: string
}

const MOCK_QC_RECORDS: QCRecord[] = [
    { id: 'QC-2301', batchId: 'B-2024-88', product: 'Maize Flour', supplier: 'Nairobi Millers', dateReceived: '2024-12-26', result: 'pass', inspector: 'J. Doe', cocUrl: '#' },
    { id: 'QC-2302', batchId: 'B-2024-89', product: 'Wheat Flour', supplier: 'Mombasa Grains', dateReceived: '2024-12-25', result: 'conditional', inspector: 'A. Smith', cocUrl: '#' },
    { id: 'QC-2303', batchId: 'B-2024-90', product: 'Cooking Oil', supplier: 'Kampala Millers', dateReceived: '2024-12-22', result: 'fail', inspector: 'J. Doe', cocUrl: '#' },
    { id: 'QC-2298', batchId: 'B-2024-85', product: 'Maize Flour', supplier: 'Nairobi Millers', dateReceived: '2024-12-20', result: 'pass', inspector: 'M. Johnson', cocUrl: '#' },
]

const MOCK_ISSUES: Issue[] = [
    { id: 'ISS-001', orderId: 'ORD-2024-003', type: 'Quality', description: 'Vitamin A levels below standard in batch B-2024-90', status: 'investigating', dateReported: '2024-12-23' },
    { id: 'ISS-002', orderId: 'ORD-2024-001', type: 'Packaging', description: 'Damaged sacks in shipment #44', status: 'resolved', dateReported: '2024-12-10' },
]

// --- FRONTEND COMPONENTS ---

export function QADashboard() {
    const [selectedQC, setSelectedQC] = React.useState<QCRecord | null>(null)
    const [selectedIssue, setSelectedIssue] = React.useState<Issue | null>(null)
    const [isLogInspectionOpen, setIsLogInspectionOpen] = React.useState(false)
    const [isViewCoAModalOpen, setIsViewCoAModalOpen] = React.useState(false)
    const [isIssueDetailsOpen, setIsIssueDetailsOpen] = React.useState(false)

    // Traceability State
    const [traceBatchId, setTraceBatchId] = React.useState('')
    const [isTracing, setIsTracing] = React.useState(false)
    const [traceResult, setTraceResult] = React.useState<any>(null)

    const handleViewCoA = (record: QCRecord) => {
        setSelectedQC(record)
        setIsViewCoAModalOpen(true)
    }

    const handleIssueDetails = (issue: Issue) => {
        setSelectedIssue(issue)
        setIsIssueDetailsOpen(true)
    }

    const handleTrace = () => {
        if (!traceBatchId) return
        setIsTracing(true)
        setTimeout(() => {
            setTraceResult({
                batchId: traceBatchId,
                product: 'Fortified Maize Flour',
                miller: 'Nairobi Millers Ltd',
                productionDate: '2024-12-10',
                journey: [
                    { stage: 'Milling', location: 'Nairobi Facility', date: '2024-12-10', status: 'completed' },
                    { stage: 'QC Check', location: 'Nairobi Lab', date: '2024-12-11', status: 'completed' },
                    { stage: 'Dispatch', location: 'Warehouse A', date: '2024-12-12', status: 'completed' },
                    { stage: 'Transit', location: 'Truck KCA 123', date: '2024-12-13', status: 'completed' },
                    { stage: 'Received', location: 'Regional Depot', date: '2024-12-14', status: 'current' }
                ]
            })
            setIsTracing(false)
        }, 1500)
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-green-50/50 border-green-100">
                    <CardContent className="p-6 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-green-800">Pass Rate (30d)</p>
                            <h3 className="text-3xl font-bold text-green-900">96.5%</h3>
                        </div>
                        <CheckCircle2 className="w-8 h-8 text-green-500" />
                    </CardContent>
                </Card>
                <Card className="bg-orange-50/50 border-orange-100">
                    <CardContent className="p-6 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-orange-800">Conditional Approvals</p>
                            <h3 className="text-3xl font-bold text-orange-900">3</h3>
                        </div>
                        <AlertTriangle className="w-8 h-8 text-orange-500" />
                    </CardContent>
                </Card>
                <Card className="bg-red-50/50 border-red-100">
                    <CardContent className="p-6 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-red-800">Rejections</p>
                            <h3 className="text-3xl font-bold text-red-900">1</h3>
                        </div>
                        <AlertTriangle className="w-8 h-8 text-red-500" />
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="qc-results" className="space-y-6">
                <TabsList>
                    <TabsTrigger value="qc-results">Incoming QC</TabsTrigger>
                    <TabsTrigger value="issues">Issue Log</TabsTrigger>
                    <TabsTrigger value="traceability">Traceability</TabsTrigger>
                </TabsList>

                <TabsContent value="qc-results">
                    <div className="flex justify-between mb-4">
                        <div className="relative w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input placeholder="Search Batch ID..." className="pl-9" />
                        </div>
                        <Button onClick={() => setIsLogInspectionOpen(true)}><Microscope className="w-4 h-4 mr-2" /> Log New Inspection</Button>
                    </div>
                    <Card>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Inspection ID</TableHead>
                                        <TableHead>Batch #</TableHead>
                                        <TableHead>Product</TableHead>
                                        <TableHead>Supplier</TableHead>
                                        <TableHead>Result</TableHead>
                                        <TableHead>Certificate</TableHead>
                                        <TableHead>Date</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {MOCK_QC_RECORDS.map(record => (
                                        <TableRow key={record.id}>
                                            <TableCell className="font-mono">{record.id}</TableCell>
                                            <TableCell className="font-medium">{record.batchId}</TableCell>
                                            <TableCell>{record.product}</TableCell>
                                            <TableCell>{record.supplier}</TableCell>
                                            <TableCell>
                                                <Badge className={`
                                                    ${record.result === 'pass' ? 'bg-green-100 text-green-700' : ''}
                                                    ${record.result === 'fail' ? 'bg-red-100 text-red-700' : ''}
                                                    ${record.result === 'conditional' ? 'bg-yellow-100 text-yellow-700' : ''}
                                                `}>
                                                    {record.result.toUpperCase()}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Button size="sm" variant="ghost" className="text-[#0A3225] h-8" onClick={() => handleViewCoA(record)}>
                                                    <FileText className="w-3 h-3 mr-1" /> View CoC
                                                </Button>
                                            </TableCell>
                                            <TableCell>{record.dateReceived}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="issues">
                    <Card>
                        <CardHeader><CardTitle>Quality Issue Tracker</CardTitle></CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Issue ID</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Description</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Reported</TableHead>
                                        <TableHead>Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {MOCK_ISSUES.map(issue => (
                                        <TableRow key={issue.id}>
                                            <TableCell className="font-mono">{issue.id}</TableCell>
                                            <TableCell>{issue.type}</TableCell>
                                            <TableCell className="max-w-[300px] truncate">{issue.description}</TableCell>
                                            <TableCell>
                                                <Badge variant={issue.status === 'resolved' ? 'outline' : 'default'} className={
                                                    issue.status === 'investigating' ? 'bg-orange-100 text-orange-800' :
                                                        issue.status === 'resolved' ? 'text-green-700 border-green-200' : ''
                                                }>{issue.status}</Badge>
                                            </TableCell>
                                            <TableCell>{issue.dateReported}</TableCell>
                                            <TableCell><Button size="sm" variant="outline" onClick={() => handleIssueDetails(issue)}>Details</Button></TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="traceability">
                    <Card>
                        <CardHeader>
                            <CardTitle>Batch Traceability</CardTitle>
                            <CardDescription>Enter a Batch ID to see its journey from mill to delivery.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex gap-4 max-w-lg mb-8">
                                <Input
                                    placeholder="Enter Batch ID (e.g. B-2024-88)"
                                    value={traceBatchId}
                                    onChange={(e) => setTraceBatchId(e.target.value)}
                                />
                                <Button onClick={handleTrace} disabled={isTracing}>
                                    {isTracing ? 'Tracing...' : 'Trace'}
                                </Button>
                            </div>

                            {!traceResult ? (
                                <div className="border rounded-lg p-8 bg-gray-50 text-center text-gray-400">
                                    <History className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                    <p>Search for a batch to view its history</p>
                                </div>
                            ) : (
                                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                                    <div className="grid grid-cols-3 gap-6 p-4 bg-slate-50 rounded-lg">
                                        <div>
                                            <div className="text-xs text-gray-500 uppercase tracking-widest font-semibold">Product</div>
                                            <div className="font-bold text-lg">{traceResult.product}</div>
                                        </div>
                                        <div>
                                            <div className="text-xs text-gray-500 uppercase tracking-widest font-semibold">Miller</div>
                                            <div className="font-bold text-lg">{traceResult.miller}</div>
                                        </div>
                                        <div>
                                            <div className="text-xs text-gray-500 uppercase tracking-widest font-semibold">Production Date</div>
                                            <div className="font-bold text-lg">{traceResult.productionDate}</div>
                                        </div>
                                    </div>

                                    <div className="relative border-l-2 border-dashed border-gray-200 ml-6 space-y-12 pb-4">
                                        {traceResult.journey.map((step: any, index: number) => (
                                            <div key={index} className="relative pl-8">
                                                <div className={`absolute -left-[9px] w-4 h-4 rounded-full border-2 border-white ${step.status === 'completed' ? 'bg-green-500' : 'bg-[#0A3225]/50 shadow-[0_0_0_4px_rgba(59,130,246,0.2)]'}`}></div>
                                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 shadow-sm border p-4 rounded-lg bg-white">
                                                    <div>
                                                        <div className="font-bold text-gray-900">{step.stage}</div>
                                                        <div className="text-sm text-gray-500">{step.location}</div>
                                                    </div>
                                                    <div className="text-sm font-medium text-gray-600 bg-gray-50 px-2 py-1 rounded">{step.date}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* --- DIALOGS --- */}

            {/* 1. Log New Inspection Dialog */}
            <Dialog open={isLogInspectionOpen} onOpenChange={setIsLogInspectionOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Log New Inspection</DialogTitle>
                        <DialogDescription>Record incoming QC results for a delivery</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Batch ID</label>
                                <Input placeholder="e.g. B-2024-99" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Supplier</label>
                                <Input placeholder="Select Supplier" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Lab Result Status</label>
                            <div className="flex gap-4">
                                <Button variant="outline" className="flex-1 hover:bg-green-50 hover:text-green-700 hover:border-green-200">PASS</Button>
                                <Button variant="outline" className="flex-1 hover:bg-red-50 hover:text-red-700 hover:border-red-200">FAIL</Button>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Notes</label>
                            <Input placeholder="Additional observations..." />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsLogInspectionOpen(false)}>Cancel</Button>
                        <Button onClick={() => setIsLogInspectionOpen(false)}>Submit Record</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* 2. View CoA Dialog */}
            <Dialog open={isViewCoAModalOpen} onOpenChange={setIsViewCoAModalOpen}>
                <DialogContent className="max-w-3xl h-[80vh] flex flex-col">
                    <DialogHeader>
                        <DialogTitle>Certificate of Analysis</DialogTitle>
                        <DialogDescription>Batch {selectedQC?.batchId} • {selectedQC?.product}</DialogDescription>
                    </DialogHeader>
                    <div className="flex-1 bg-slate-100 rounded-lg border-2 border-dashed flex items-center justify-center m-4">
                        <div className="text-center text-slate-400">
                            <FileText className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                            <p className="font-medium">Certificate Document Preview</p>
                            <p className="text-xs">Generated from Digital QA System</p>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline"><History className="w-4 h-4 mr-2" /> View History</Button>
                        <Button onClick={() => setIsViewCoAModalOpen(false)}>Download PDF</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* 3. Issue Details Dialog */}
            <Dialog open={isIssueDetailsOpen} onOpenChange={setIsIssueDetailsOpen}>
                <DialogContent className="max-w-xl">
                    <DialogHeader>
                        <DialogTitle>Quality Issue #{selectedIssue?.id}</DialogTitle>
                        <DialogDescription className="text-red-600 font-medium">Status: {selectedIssue?.status.toUpperCase()}</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-6 py-4">
                        <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                            <h4 className="font-bold text-red-900 text-sm mb-1">{selectedIssue?.type} Issue</h4>
                            <p className="text-red-800">{selectedIssue?.description}</p>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-sm mb-3">Investigation Timeline</h4>
                            <div className="space-y-4 text-sm">
                                <div className="flex gap-3">
                                    <div className="text-slate-400 w-24 text-right">24 Dec 10:00</div>
                                    <div>Issue reported by inbound team.</div>
                                </div>
                                <div className="flex gap-3">
                                    <div className="text-slate-400 w-24 text-right">24 Dec 14:30</div>
                                    <div>Samples sent to external lab for verification.</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
