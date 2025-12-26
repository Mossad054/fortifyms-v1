'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { ArrowLeft } from 'lucide-react'

export default function NewBatchPage() {
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
        targetFortificationLevel: '30', // Default iron ppm
        premixDosingRate: '0.2', // Default 0.2%
        expectedPremixUsage: '',
        actualPremixUsage: '',
        storageLocation: '',
        packagingType: '25KG_BAGS',
        numberOfUnits: ''
    })

    // Auto-calculate expected premix usage
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
                setTimeout(() => router.push('/production'), 2000)
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
        <div className="container mx-auto py-6 max-w-4xl">
            <Button
                variant="ghost"
                onClick={() => router.back()}
                className="mb-4"
            >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
            </Button>

            <Card>
                <CardHeader>
                    <CardTitle>Create New Batch</CardTitle>
                    <CardDescription>
                        Log production batch details for traceability and quality control
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Production Info */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Production Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="productionLine">Production Line *</Label>
                                    <select
                                        id="productionLine"
                                        required
                                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                                        value={formData.productionLine}
                                        onChange={(e) => setFormData({ ...formData, productionLine: e.target.value })}
                                    >
                                        <option value="L1">Line 1</option>
                                        <option value="L2">Line 2</option>
                                        <option value="L3">Line 3</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="productionDate">Production Date *</Label>
                                    <Input
                                        id="productionDate"
                                        type="date"
                                        required
                                        value={formData.productionDate}
                                        onChange={(e) => setFormData({ ...formData, productionDate: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="shift">Shift *</Label>
                                    <select
                                        id="shift"
                                        required
                                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                                        value={formData.shift}
                                        onChange={(e) => setFormData({ ...formData, shift: e.target.value })}
                                    >
                                        <option value="MORNING">Morning</option>
                                        <option value="AFTERNOON">Afternoon</option>
                                        <option value="NIGHT">Night</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Raw Material */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Raw Material</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="cropType">Crop Type *</Label>
                                    <select
                                        id="cropType"
                                        required
                                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                                        value={formData.cropType}
                                        onChange={(e) => setFormData({ ...formData, cropType: e.target.value })}
                                    >
                                        <option value="PARBOILED_RICE">Parboiled Rice</option>
                                        <option value="RAW_RICE">Raw Rice</option>
                                        <option value="MAIZE_WHOLE">Whole Grain Maize</option>
                                        <option value="MAIZE_REFINED">Refined Maize Flour</option>
                                        <option value="WHEAT_FLOUR">Wheat Flour</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="grade">Grade/Variety</Label>
                                    <Input
                                        id="grade"
                                        value={formData.grade}
                                        onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                                        placeholder="e.g., Long grain white rice"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="rawMaterialLotNumber">Lot Number</Label>
                                    <Input
                                        id="rawMaterialLotNumber"
                                        value={formData.rawMaterialLotNumber}
                                        onChange={(e) => setFormData({ ...formData, rawMaterialLotNumber: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="rawMaterialSource">Source/Supplier</Label>
                                    <Input
                                        id="rawMaterialSource"
                                        value={formData.rawMaterialSource}
                                        onChange={(e) => setFormData({ ...formData, rawMaterialSource: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Production Volume */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Production Volume</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="inputWeight">Input Weight (kg) *</Label>
                                    <Input
                                        id="inputWeight"
                                        type="number"
                                        step="0.01"
                                        required
                                        value={formData.inputWeight}
                                        onChange={(e) => setFormData({ ...formData, inputWeight: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="expectedOutputWeight">Expected Output (kg)</Label>
                                    <Input
                                        id="expectedOutputWeight"
                                        type="number"
                                        step="0.01"
                                        value={formData.expectedOutputWeight}
                                        onChange={(e) => setFormData({ ...formData, expectedOutputWeight: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="actualOutputWeight">Actual Output (kg)</Label>
                                    <Input
                                        id="actualOutputWeight"
                                        type="number"
                                        step="0.01"
                                        value={formData.actualOutputWeight}
                                        onChange={(e) => setFormData({ ...formData, actualOutputWeight: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Fortification Parameters */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Fortification Parameters</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="premixType">Premix Type *</Label>
                                    <Input
                                        id="premixType"
                                        required
                                        value={formData.premixType}
                                        onChange={(e) => setFormData({ ...formData, premixType: e.target.value })}
                                        placeholder="e.g., Iron + Vitamin B Complex"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="premixBatchNumber">Premix Batch Number *</Label>
                                    <Input
                                        id="premixBatchNumber"
                                        required
                                        value={formData.premixBatchNumber}
                                        onChange={(e) => setFormData({ ...formData, premixBatchNumber: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="premixManufacturer">Premix Manufacturer</Label>
                                    <Input
                                        id="premixManufacturer"
                                        value={formData.premixManufacturer}
                                        onChange={(e) => setFormData({ ...formData, premixManufacturer: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="premixExpiryDate">Premix Expiry Date</Label>
                                    <Input
                                        id="premixExpiryDate"
                                        type="date"
                                        value={formData.premixExpiryDate}
                                        onChange={(e) => setFormData({ ...formData, premixExpiryDate: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="targetFortificationLevel">Target Iron Level (ppm) *</Label>
                                    <Input
                                        id="targetFortificationLevel"
                                        type="number"
                                        step="0.1"
                                        required
                                        value={formData.targetFortificationLevel}
                                        onChange={(e) => setFormData({ ...formData, targetFortificationLevel: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="premixDosingRate">Dosing Rate (%) *</Label>
                                    <Input
                                        id="premixDosingRate"
                                        type="number"
                                        step="0.01"
                                        required
                                        value={formData.premixDosingRate}
                                        onChange={(e) => setFormData({ ...formData, premixDosingRate: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="expectedPremixUsage">Expected Premix (kg)</Label>
                                    <Input
                                        id="expectedPremixUsage"
                                        type="number"
                                        step="0.01"
                                        value={formData.expectedPremixUsage}
                                        readOnly
                                        className="bg-gray-100"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="actualPremixUsage">Actual Premix Used (kg) *</Label>
                                    <Input
                                        id="actualPremixUsage"
                                        type="number"
                                        step="0.01"
                                        required
                                        value={formData.actualPremixUsage}
                                        onChange={(e) => setFormData({ ...formData, actualPremixUsage: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Storage & Packaging */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Storage & Packaging</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="storageLocation">Storage Location</Label>
                                    <Input
                                        id="storageLocation"
                                        value={formData.storageLocation}
                                        onChange={(e) => setFormData({ ...formData, storageLocation: e.target.value })}
                                        placeholder="e.g., Warehouse A"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="packagingType">Packaging Type *</Label>
                                    <select
                                        id="packagingType"
                                        required
                                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                                        value={formData.packagingType}
                                        onChange={(e) => setFormData({ ...formData, packagingType: e.target.value })}
                                    >
                                        <option value="1KG_BAGS">1kg Bags</option>
                                        <option value="5KG_BAGS">5kg Bags</option>
                                        <option value="25KG_BAGS">25kg Bags</option>
                                        <option value="50KG_BAGS">50kg Bags</option>
                                        <option value="BULK">Bulk</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="numberOfUnits">Number of Units</Label>
                                    <Input
                                        id="numberOfUnits"
                                        type="number"
                                        value={formData.numberOfUnits}
                                        onChange={(e) => setFormData({ ...formData, numberOfUnits: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        {message.text && (
                            <div className={`text-sm font-medium ${message.type === 'error' ? 'text-red-500' : 'text-green-500'}`}>
                                {message.text}
                            </div>
                        )}

                        <div className="flex gap-2">
                            <Button type="submit" disabled={loading}>
                                {loading ? 'Creating...' : 'Create Batch'}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.back()}
                            >
                                Cancel
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
