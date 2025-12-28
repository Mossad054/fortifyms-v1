'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Plus, Package, Search, QrCode, Download } from 'lucide-react'

export default function ProductionBatchesPage() {
    const router = useRouter()
    const [loading, setLoading] = React.useState(true)
    const [batches, setBatches] = React.useState<any[]>([])
    const [searchTerm, setSearchTerm] = React.useState('')
    const supabase = createClient()

    React.useEffect(() => {
        loadBatches()
    }, [])

    async function loadBatches() {
        try {
            const response = await fetch('/api/batches')
            if (response.ok) {
                const data = await response.json()
                setBatches(data.batches || [])
            }
        } catch (error) {
            console.error('Error loading batches:', error)
        } finally {
            setLoading(false)
        }
    }

    const filteredBatches = batches.filter(batch =>
        batch.batchId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        batch.cropType?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    function getStatusBadge(status: string) {
        const variants: Record<string, any> = {
            ACTIVE: { className: 'bg-green-500', label: 'Active' },
            COMPLETED: { className: 'bg-[#0A3225]/50', label: 'Completed' },
            QUARANTINED: { className: 'bg-red-500', label: 'Quarantined' },
            RELEASED: { className: 'bg-orange', label: 'Released' },
        }
        const config = variants[status] || variants.ACTIVE
        return <Badge className={config.className}>{config.label}</Badge>
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-lg">Loading batches...</div>
            </div>
        )
    }

    return (
        <div className="container mx-auto py-6 max-w-[1400px]">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div>
                    <h1 className="text-3xl font-bold">Production Batches</h1>
                    <p className="text-gray-600 mt-1">Track and manage fortified product batches</p>
                </div>
                <Button onClick={() => router.push('/production/batches/new')} variant="premium">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Batch
                </Button>
            </div>

            {/* Search & Filters */}
            <div className="flex gap-4 mb-6">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Search by Batch ID or Crop Type..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>
            </div>

            {/* Batches Grid */}
            <div className="grid gap-4">
                {filteredBatches.length === 0 ? (
                    <Card>
                        <CardContent className="py-12 text-center">
                            <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                            <p className="text-gray-600">
                                {searchTerm ? 'No batches match your search.' : 'No batches found. Create your first batch to get started.'}
                            </p>
                            <Button className="mt-4" onClick={() => router.push('/production/batches/new')}>
                                Create First Batch
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    filteredBatches.map((batch) => (
                        <Card
                            key={batch.id}
                            className="cursor-pointer hover:shadow-lg transition-all"
                            onClick={() => router.push(`/production/batches/${batch.id}`)}
                        >
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <CardTitle className="text-lg flex items-center gap-2">
                                            <Package className="h-5 w-5 text-green-600" />
                                            {batch.batchId}
                                        </CardTitle>
                                        <CardDescription className="mt-1">
                                            {batch.cropType?.replace(/_/g, ' ')} • {new Date(batch.productionDate).toLocaleDateString()}
                                        </CardDescription>
                                    </div>
                                    <div className="flex flex-col gap-2 items-end">
                                        {getStatusBadge(batch.status)}
                                        {batch.qcStatus && (
                                            <Badge variant={batch.qcStatus === 'PASS' ? 'default' : 'destructive'} className={batch.qcStatus === 'PASS' ? 'bg-green-600' : ''}>
                                                QC: {batch.qcStatus}
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                                    <div>
                                        <p className="text-gray-500">Line</p>
                                        <p className="font-medium">{batch.productionLine}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">Input Weight</p>
                                        <p className="font-medium">{batch.inputWeight?.toFixed(2)} kg</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">Output Weight</p>
                                        <p className="font-medium">{batch.actualOutputWeight?.toFixed(2) || 'N/A'} kg</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">Premix Used</p>
                                        <p className="font-medium">{batch.actualPremixUsage?.toFixed(2)} kg</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">Operator</p>
                                        <p className="font-medium">{batch.operator?.name || 'N/A'}</p>
                                    </div>
                                </div>
                                {batch.qrCode && (
                                    <div className="mt-4 pt-4 border-t flex items-center gap-2">
                                        <QrCode className="h-4 w-4 text-gray-400" />
                                        <span className="text-xs text-gray-500">QR Code Available</span>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            className="ml-auto"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                window.open(`/api/batches/${batch.id}/qr`, '_blank')
                                            }}
                                        >
                                            <Download className="h-3 w-3 mr-1" />
                                            Download
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    )
}
