'use client'

import * as React from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
    ArrowLeft, Package, QrCode, Download, Edit, CheckCircle,
    XCircle, Clock, FileText, Beaker
} from 'lucide-react'

export default function BatchDetailPage() {
    const router = useRouter()
    const params = useParams()
    const batchId = params.id as string
    const [loading, setLoading] = React.useState(true)
    const [batch, setBatch] = React.useState<any>(null)
    const supabase = createClient()

    React.useEffect(() => {
        if (batchId) {
            loadBatch()
        }
    }, [batchId])

    async function loadBatch() {
        try {
            const response = await fetch(`/api/batches/${batchId}`)
            if (response.ok) {
                const data = await response.json()
                setBatch(data.batch)
            }
        } catch (error) {
            console.error('Error loading batch:', error)
        } finally {
            setLoading(false)
        }
    }

    function getStatusBadge(status: string) {
        const variants: Record<string, any> = {
            ACTIVE: { className: 'bg-green-500', label: 'Active' },
            COMPLETED: { className: 'bg-blue-500', label: 'Completed' },
            QUARANTINED: { className: 'bg-red-500', label: 'Quarantined' },
            RELEASED: { className: 'bg-purple-500', label: 'Released' },
        }
        const config = variants[status] || variants.ACTIVE
        return <Badge className={config.className}>{config.label}</Badge>
    }

    function getQCBadge(status: string) {
        if (status === 'PASS') return <Badge className="bg-green-600"><CheckCircle className="h-3 w-3 mr-1" />Pass</Badge>
        if (status === 'FAIL') return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Fail</Badge>
        return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Pending</Badge>
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-lg">Loading batch details...</div>
            </div>
        )
    }

    if (!batch) {
        return (
            <div className="container mx-auto py-6">
                <Card>
                    <CardContent className="py-12 text-center">
                        <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                        <p className="text-gray-600">Batch not found</p>
                        <Button className="mt-4" onClick={() => router.push('/production/batches')}>
                            Back to Batches
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="container mx-auto py-6 max-w-[1400px]">
            {/* Header */}
            <Button
                variant="ghost"
                onClick={() => router.push('/production/batches')}
                className="mb-4"
            >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Batches
            </Button>

            <div className="flex justify-between items-start mb-6">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <Package className="h-8 w-8 text-green-600" />
                        {batch.batchId}
                    </h1>
                    <p className="text-gray-600 mt-1">
                        {batch.cropType?.replace(/_/g, ' ')} • {new Date(batch.productionDate).toLocaleDateString()}
                    </p>
                </div>
                <div className="flex gap-2">
                    {getStatusBadge(batch.status)}
                    {batch.qcStatus && getQCBadge(batch.qcStatus)}
                </div>
            </div>

            <Tabs defaultValue="overview" className="space-y-6">
                <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="qc">QC Tests</TabsTrigger>
                    <TabsTrigger value="traceability">Traceability</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                    {/* Production Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Production Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                <div>
                                    <p className="text-sm text-gray-500">Production Line</p>
                                    <p className="font-semibold text-lg">{batch.productionLine}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Shift</p>
                                    <p className="font-semibold text-lg">{batch.shift}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Operator</p>
                                    <p className="font-semibold text-lg">{batch.operator?.name || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Created</p>
                                    <p className="font-semibold text-lg">{new Date(batch.createdAt).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Raw Material & Production Volume */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Raw Material</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <p className="text-sm text-gray-500">Crop Type</p>
                                    <p className="font-medium">{batch.cropType?.replace(/_/g, ' ')}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Grade/Variety</p>
                                    <p className="font-medium">{batch.grade || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Lot Number</p>
                                    <p className="font-medium">{batch.rawMaterialLotNumber || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Source/Supplier</p>
                                    <p className="font-medium">{batch.rawMaterialSource || 'N/A'}</p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Production Volume</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <p className="text-sm text-gray-500">Input Weight</p>
                                    <p className="font-medium text-lg">{batch.inputWeight?.toFixed(2)} kg</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Expected Output</p>
                                    <p className="font-medium">{batch.expectedOutputWeight?.toFixed(2) || 'N/A'} kg</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Actual Output</p>
                                    <p className="font-medium text-lg text-green-600">{batch.actualOutputWeight?.toFixed(2) || 'Pending'} kg</p>
                                </div>
                                {batch.actualOutputWeight && batch.expectedOutputWeight && (
                                    <div>
                                        <p className="text-sm text-gray-500">Yield Efficiency</p>
                                        <p className="font-medium">
                                            {((batch.actualOutputWeight / batch.expectedOutputWeight) * 100).toFixed(1)}%
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Fortification Parameters */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Fortification Parameters</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                <div>
                                    <p className="text-sm text-gray-500">Premix Type</p>
                                    <p className="font-medium">{batch.premixType}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Batch Number</p>
                                    <p className="font-medium">{batch.premixBatchNumber}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Dosing Rate</p>
                                    <p className="font-medium">{batch.premixDosingRate}%</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Target Iron Level</p>
                                    <p className="font-medium">{batch.targetFortificationLevel} ppm</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Expected Premix</p>
                                    <p className="font-medium">{batch.expectedPremixUsage?.toFixed(2)} kg</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Actual Premix Used</p>
                                    <p className="font-medium text-green-600">{batch.actualPremixUsage?.toFixed(2)} kg</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Manufacturer</p>
                                    <p className="font-medium">{batch.premixManufacturer || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Expiry Date</p>
                                    <p className="font-medium">
                                        {batch.premixExpiryDate ? new Date(batch.premixExpiryDate).toLocaleDateString() : 'N/A'}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="qc" className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold">Quality Control Tests</h2>
                        <Button onClick={() => router.push(`/production/qc?batchId=${batch.id}`)}>
                            <Beaker className="h-4 w-4 mr-2" />
                            Add QC Test
                        </Button>
                    </div>

                    {batch.qcTests && batch.qcTests.length > 0 ? (
                        <div className="grid gap-4">
                            {batch.qcTests.map((test: any) => (
                                <Card key={test.id}>
                                    <CardHeader>
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <CardTitle className="text-lg">
                                                    Test #{test.id} - {test.testType}
                                                </CardTitle>
                                                <CardDescription>
                                                    {new Date(test.testDate).toLocaleString()}
                                                </CardDescription>
                                            </div>
                                            {getQCBadge(test.status)}
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                            <div>
                                                <p className="text-gray-500">Iron Content</p>
                                                <p className="font-medium">{test.ironContent || 'N/A'} ppm</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-500">Moisture</p>
                                                <p className="font-medium">{test.moistureContent || 'N/A'}%</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-500">Tested By</p>
                                                <p className="font-medium">{test.tester?.name || 'N/A'}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-500">Sample ID</p>
                                                <p className="font-medium">{test.sampleId || 'N/A'}</p>
                                            </div>
                                        </div>
                                        {test.notes && (
                                            <div className="mt-4 p-3 bg-gray-50 rounded-md">
                                                <p className="text-sm text-gray-700">{test.notes}</p>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <Card>
                            <CardContent className="py-12 text-center">
                                <Beaker className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                                <p className="text-gray-600">No QC tests recorded yet</p>
                                <Button className="mt-4" onClick={() => router.push(`/production/qc?batchId=${batch.id}`)}>
                                    Add First Test
                                </Button>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>

                <TabsContent value="traceability" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>QR Code & Traceability</CardTitle>
                            <CardDescription>Scan to verify batch authenticity</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {batch.qrCode ? (
                                <div className="flex flex-col items-center gap-4">
                                    <div className="p-4 bg-white border rounded-lg">
                                        <img
                                            src={`data:image/png;base64,${batch.qrCode}`}
                                            alt="Batch QR Code"
                                            className="w-64 h-64"
                                        />
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            onClick={() => window.open(`/api/batches/${batch.id}/qr`, '_blank')}
                                        >
                                            <Download className="h-4 w-4 mr-2" />
                                            Download QR Code
                                        </Button>
                                        <Button
                                            variant="outline"
                                            onClick={() => window.print()}
                                        >
                                            <FileText className="h-4 w-4 mr-2" />
                                            Print Label
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <QrCode className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                                    <p className="text-gray-600">QR Code not generated yet</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Storage & Packaging</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                <div>
                                    <p className="text-sm text-gray-500">Storage Location</p>
                                    <p className="font-medium">{batch.storageLocation || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Packaging Type</p>
                                    <p className="font-medium">{batch.packagingType?.replace(/_/g, ' ')}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Number of Units</p>
                                    <p className="font-medium">{batch.numberOfUnits || 'N/A'}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
