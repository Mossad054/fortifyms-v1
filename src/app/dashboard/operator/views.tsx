'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import {
    Plus, Package, Search, Download, Beaker, Save,
    ArrowLeft, QrCode
} from 'lucide-react'

// --- Batch Creation View ---
export function BatchCreationView() {
    const router = useRouter()
    const [loading, setLoading] = React.useState(false)
    const [message, setMessage] = React.useState({ type: '', text: '' })
    const supabase = createClient()

    const [formData, setFormData] = React.useState({
        productionLine: 'L1',
        productionDate: new Date().toISOString().split('T')[0],
        shift: 'MORNING',
        cropType: 'MAIZE_REFINED',
        grade: '',
        rawMaterialLotNumber: '',
        rawMaterialSource: '',
        inputWeight: '',
        expectedOutputWeight: '',
        actualOutputWeight: '',
        premixType: '',
        premixBatchNumber: '',
        premixManufacturer: '',
        premixExpiryDate: '',
        targetFortificationLevel: '30',
        premixDosingRate: '0.2',
        expectedPremixUsage: '',
        actualPremixUsage: '',
        storageLocation: '',
        packagingType: '25KG_BAGS',
        numberOfUnits: ''
    })

    React.useEffect(() => {
        if (formData.inputWeight && formData.premixDosingRate) {
            const expected = (parseFloat(formData.inputWeight) * parseFloat(formData.premixDosingRate)) / 100
            setFormData(prev => ({ ...prev, expectedPremixUsage: expected.toFixed(2) }))
        }
    }, [formData.inputWeight, formData.premixDosingRate])

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)
        setMessage({ type: '', text: '' })

        try {
            const response = await fetch('/api/batches', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    inputWeight: parseFloat(formData.inputWeight),
                    expectedOutputWeight: parseFloat(formData.expectedOutputWeight) || null,
                    actualOutputWeight: parseFloat(formData.actualOutputWeight) || null,
                    expectedPremixUsage: parseFloat(formData.expectedPremixUsage),
                    actualPremixUsage: parseFloat(formData.actualPremixUsage),
                    premixDosingRate: parseFloat(formData.premixDosingRate),
                    numberOfUnits: parseInt(formData.numberOfUnits) || null
                })
            })

            if (response.ok) {
                const data = await response.json()
                setMessage({ type: 'success', text: `Batch ${data.batch.batchId} created successfully!` })
                // Optional: Reset form or navigate to list tab
            } else {
                const error = await response.json()
                setMessage({ type: 'error', text: error.error || 'Failed to create batch' })
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'An error occurred' })
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card className="glass-card border-none shadow-sm">
            <CardHeader>
                <CardTitle>Create New Batch</CardTitle>
                <CardDescription>Log production batch details for traceability</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Simplified for brevity - Core fields */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label>Production Line</Label>
                            <select
                                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                                value={formData.productionLine}
                                onChange={e => setFormData({ ...formData, productionLine: e.target.value })}
                            >
                                <option value="L1">Line 1</option>
                                <option value="L2">Line 2</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <Label>Shift</Label>
                            <select
                                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                                value={formData.shift}
                                onChange={e => setFormData({ ...formData, shift: e.target.value })}
                            >
                                <option value="MORNING">Morning</option>
                                <option value="AFTERNOON">Afternoon</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <Label>Date</Label>
                            <Input type="date" value={formData.productionDate} onChange={e => setFormData({ ...formData, productionDate: e.target.value })} />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Crop Type</Label>
                            <select
                                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                                value={formData.cropType}
                                onChange={e => setFormData({ ...formData, cropType: e.target.value })}
                            >
                                <option value="MAIZE_REFINED">Maize Flour</option>
                                <option value="WHEAT_FLOUR">Wheat Flour</option>
                                <option value="RICE">Rice</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <Label>Input Weight (kg)</Label>
                            <Input type="number" value={formData.inputWeight} onChange={e => setFormData({ ...formData, inputWeight: e.target.value })} />
                        </div>
                    </div>

                    <Button type="submit" disabled={loading} variant="premium" className="w-full md:w-auto">
                        {loading ? 'Creating...' : 'Create Batch'}
                    </Button>
                    {message.text && (
                        <p className={`text-sm mt-2 ${message.type === 'error' ? 'text-red-500' : 'text-green-600'}`}>
                            {message.text}
                        </p>
                    )}
                </form>
            </CardContent>
        </Card>
    )
}

// --- QC Tests View ---
export function QCTestsView() {
    const [loading, setLoading] = React.useState(false)
    const [batches, setBatches] = React.useState<any[]>([])

    // Condensed form data state
    const [formData, setFormData] = React.useState({
        batchId: '',
        testType: 'IRON_CONTENT',
        ironContent: '',
        moistureContent: '',
        visualInspection: 'PASS'
    })

    React.useEffect(() => {
        fetch('/api/batches').then(res => res.json()).then(data => setBatches(data.batches || []))
    }, [])

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)
        try {
            const res = await fetch(`/api/batches/${formData.batchId}/qc`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    ironContent: parseFloat(formData.ironContent),
                    moistureContent: parseFloat(formData.moistureContent)
                })
            })
            if (res.ok) alert('QC Test Recorded')
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card className="glass-card border-none shadow-sm">
            <CardHeader>
                <CardTitle>Record QC Test</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Label>Select Batch</Label>
                        <select
                            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                            value={formData.batchId}
                            onChange={e => setFormData({ ...formData, batchId: e.target.value })}
                        >
                            <option value="">-- Select --</option>
                            {batches.map(b => (
                                <option key={b.id} value={b.id}>{b.batchId}</option>
                            ))}
                        </select>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Iron (ppm)</Label>
                            <Input type="number" value={formData.ironContent} onChange={e => setFormData({ ...formData, ironContent: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <Label>Visual Check</Label>
                            <select
                                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                                value={formData.visualInspection}
                                onChange={e => setFormData({ ...formData, visualInspection: e.target.value })}
                            >
                                <option value="PASS">Pass</option>
                                <option value="FAIL">Fail</option>
                            </select>
                        </div>
                    </div>
                    <Button type="submit" disabled={loading} variant="premium">Save Test Result</Button>
                </form>
            </CardContent>
        </Card>
    )
}

// --- Batches List View ---
export function BatchesListView() {
    const [batches, setBatches] = React.useState<any[]>([])
    const router = useRouter()

    React.useEffect(() => {
        fetch('/api/batches').then(res => res.json()).then(data => setBatches(data.batches || []))
    }, [])

    return (
        <Card className="glass-card border-none shadow-sm">
            <CardHeader>
                <CardTitle>Production History</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {batches.map((batch) => (
                        <div key={batch.id} className="flex items-center justify-between p-4 bg-white/50 rounded-lg border border-white/60">
                            <div>
                                <h4 className="font-bold text-gray-900">{batch.batchId}</h4>
                                <p className="text-sm text-gray-500">{batch.cropType?.replace('_', ' ')} • {new Date(batch.productionDate).toLocaleDateString()}</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <Badge className={batch.status === 'COMPLETED' ? 'bg-blue-500' : 'bg-green-500'}>{batch.status}</Badge>
                                <Button variant="ghost" size="sm" onClick={() => window.open(`/api/batches/${batch.id}/qr`, '_blank')}>
                                    <QrCode className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    ))}
                    {batches.length === 0 && <p className="text-gray-500 text-center py-8">No batches found.</p>}
                </div>
            </CardContent>
        </Card>
    )
}
