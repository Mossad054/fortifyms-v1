'use client'

import * as React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
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
    FileText, Globe, CheckCircle2,
    Building2, BookOpen
} from 'lucide-react'

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
    guidelineUrl?: string
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
        guidelineUrl: '#'
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
        guidelineUrl: '#'
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
        guidelineUrl: '#'
    },
]

export function PolicyViewer() {
    const [selectedPolicy, setSelectedPolicy] = React.useState<Policy | null>(null)
    const [showPolicyDialog, setShowPolicyDialog] = React.useState(false)

    const getStatusColor = (status: PolicyStatus) => {
        switch (status) {
            case 'proposed': return 'bg-gray-100 text-gray-700'
            case 'adopted': return 'bg-[#0A3225]/10 text-[#0A3225]'
            case 'implementing': return 'bg-yellow-100 text-yellow-700'
            case 'monitoring': return 'bg-green-100 text-green-700'
            case 'completed': return 'bg-purple-100 text-orange'
            default: return 'bg-gray-100 text-gray-700'
        }
    }

    const getTypeColor = (type: PolicyType) => {
        switch (type) {
            case 'mandatory': return 'bg-red-100 text-red-700 border-red-200'
            case 'voluntary': return 'bg-green-100 text-green-700 border-green-200'
            case 'pilot': return 'bg-[#0A3225]/10 text-[#0A3225] border-[#0A3225]/20'
            case 'regulatory': return 'bg-purple-100 text-orange border-orange/20'
            default: return 'bg-gray-100 text-gray-700 border-gray-200'
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <BookOpen className="w-6 h-6 text-zinc-600" />
                        Policy Guidelines & Standards
                    </h2>
                    <p className="text-gray-500">
                        View current regulatory frameworks and compliance guidelines.
                    </p>
                </div>
            </div>

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
                                            className="h-8 text-[11px] font-bold text-[#0A3225] hover:text-[#0A3225] hover:bg-[#0A3225]/5"
                                            onClick={() => {
                                                setSelectedPolicy(policy)
                                                setShowPolicyDialog(true)
                                            }}
                                        >
                                            View Details
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Dialog open={showPolicyDialog} onOpenChange={setShowPolicyDialog}>
                <DialogContent className="max-w-xl">
                    <DialogHeader>
                        <DialogTitle>Policy Details</DialogTitle>
                    </DialogHeader>
                    {selectedPolicy && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-bold">{selectedPolicy.title}</h3>
                                <p className="text-sm text-gray-500 font-mono">{selectedPolicy.id} • {selectedPolicy.country}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <p className="text-xs text-gray-500 uppercase font-bold">Status</p>
                                    <Badge className={`mt-2 ${getStatusColor(selectedPolicy.status)}`}>
                                        {selectedPolicy.status.toUpperCase()}
                                    </Badge>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <p className="text-xs text-gray-500 uppercase font-bold">Type</p>
                                    <Badge className={`mt-2 ${getTypeColor(selectedPolicy.type)}`}>
                                        {selectedPolicy.type.toUpperCase()}
                                    </Badge>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <h4 className="font-semibold text-sm">Implementation Summary</h4>
                                <div className="p-4 border rounded-lg">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm font-medium">Compliance Progress</span>
                                        <span className="text-sm font-bold">{selectedPolicy.implementationProgress}%</span>
                                    </div>
                                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-[#0A3225] rounded-full"
                                            style={{ width: `${selectedPolicy.implementationProgress}%` }}
                                        />
                                    </div>
                                    <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
                                        <Building2 className="w-4 h-4" />
                                        <span>{selectedPolicy.millsAffected} Mills directly affected</span>
                                    </div>
                                </div>
                            </div>

                            <Button className="w-full" variant="outline">
                                <FileText className="w-4 h-4 mr-2" />
                                Download Official PDF
                            </Button>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}
