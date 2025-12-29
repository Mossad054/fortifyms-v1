'use client'

import * as React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, Beaker, Save } from 'lucide-react'

function QCTestEntryPageInner() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const batchIdParam = searchParams.get('batchId')

    const [loading, setLoading] = React.useState(false)
    const [message, setMessage] = React.useState({ type: '', text: '' })
    const [batches, setBatches] = React.useState<any[]>([])
    const supabase = createClient()

    const [formData, setFormData] = React.useState({
        batchId: batchIdParam || '',
        testType: 'IRON_CONTENT',
        sampleId: '',
        testDate: new Date().toISOString().split('T')[0],
        ironContent: '',
        moistureContent: '',
        visualInspection: 'PASS',
        colorUniformity: 'PASS',
        odor: 'NORMAL',
        foreignMatter: 'NONE',
        notes: ''
    })

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
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)
        setMessage({ type: '', text: '' })

        try {
            const response = await fetch(`/api/batches/${formData.batchId}/qc`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    ironContent: formData.ironContent ? parseFloat(formData.ironContent) : null,
                    moistureContent: formData.moistureContent ? parseFloat(formData.moistureContent) : null,
                })
            })

            if (response.ok) {
                setMessage({ type: 'success', text: 'QC test recorded successfully!' })
                setTimeout(() => router.push(`/production/batches/${formData.batchId}`), 2000)
            } else {
                const error = await response.json()
                setMessage({ type: 'error', text: error.error || 'Failed to record QC test' })
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
                    <CardTitle className="flex items-center gap-2">
                        <Beaker className="h-6 w-6 text-[#0A3225]" />
                        QC Test Entry
                    </CardTitle>
                    <CardDescription>
                        Record quality control test results for batch verification
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Test Information */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Test Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="batchId">Batch *</Label>
                                    <select
                                        id="batchId"
                                        required
                                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                                        value={formData.batchId}
                                        onChange={(e) => setFormData({ ...formData, batchId: e.target.value })}
                                    >
                                        <option value="">Select Batch</option>
                                        {batches.map((batch) => (
                                            <option key={batch.id} value={batch.id}>
                                                {batch.batchId} - {batch.cropType}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="testType">Test Type *</Label>
                                    <select
                                        id="testType"
                                        required
                                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                                        value={formData.testType}
                                        onChange={(e) => setFormData({ ...formData, testType: e.target.value })}
                                    >
                                        <option value="IRON_CONTENT">Iron Content</option>
                                        <option value="VITAMIN_A">Vitamin A</option>
                                        <option value="FOLIC_ACID">Folic Acid</option>
                                        <option value="MOISTURE">Moisture Content</option>
                                        <option value="VISUAL">Visual Inspection</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="sampleId">Sample ID</Label>
                                    <Input
                                        id="sampleId"
                                        value={formData.sampleId}
                                        onChange={(e) => setFormData({ ...formData, sampleId: e.target.value })}
                                        placeholder="e.g., SAMPLE-001"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="testDate">Test Date *</Label>
                                    <Input
                                        id="testDate"
                                        type="date"
                                        required
                                        value={formData.testDate}
                                        onChange={(e) => setFormData({ ...formData, testDate: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Test Results */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Test Results</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="ironContent">Iron Content (ppm)</Label>
                                    <Input
                                        id="ironContent"
                                        type="number"
                                        step="0.1"
                                        value={formData.ironContent}
                                        onChange={(e) => setFormData({ ...formData, ironContent: e.target.value })}
                                        placeholder="e.g., 30.5"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="moistureContent">Moisture Content (%)</Label>
                                    <Input
                                        id="moistureContent"
                                        type="number"
                                        step="0.1"
                                        value={formData.moistureContent}
                                        onChange={(e) => setFormData({ ...formData, moistureContent: e.target.value })}
                                        placeholder="e.g., 12.5"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Visual Inspection */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Visual Inspection</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="visualInspection">Overall Visual *</Label>
                                    <select
                                        id="visualInspection"
                                        required
                                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                                        value={formData.visualInspection}
                                        onChange={(e) => setFormData({ ...formData, visualInspection: e.target.value })}
                                    >
                                        <option value="PASS">Pass</option>
                                        <option value="FAIL">Fail</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="colorUniformity">Color Uniformity *</Label>
                                    <select
                                        id="colorUniformity"
                                        required
                                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                                        value={formData.colorUniformity}
                                        onChange={(e) => setFormData({ ...formData, colorUniformity: e.target.value })}
                                    >
                                        <option value="PASS">Uniform</option>
                                        <option value="FAIL">Non-Uniform</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="odor">Odor *</Label>
                                    <select
                                        id="odor"
                                        required
                                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                                        value={formData.odor}
                                        onChange={(e) => setFormData({ ...formData, odor: e.target.value })}
                                    >
                                        <option value="NORMAL">Normal</option>
                                        <option value="OFF">Off Odor</option>
                                        <option value="RANCID">Rancid</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="foreignMatter">Foreign Matter *</Label>
                                    <select
                                        id="foreignMatter"
                                        required
                                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                                        value={formData.foreignMatter}
                                        onChange={(e) => setFormData({ ...formData, foreignMatter: e.target.value })}
                                    >
                                        <option value="NONE">None Detected</option>
                                        <option value="MINOR">Minor</option>
                                        <option value="MAJOR">Major</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Notes */}
                        <div className="space-y-2">
                            <Label htmlFor="notes">Additional Notes</Label>
                            <Textarea
                                id="notes"
                                value={formData.notes}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                placeholder="Any additional observations or comments..."
                                rows={4}
                            />
                        </div>

                        {message.text && (
                            <div className={`text-sm font-medium ${message.type === 'error' ? 'text-red-500' : 'text-green-500'}`}>
                                {message.text}
                            </div>
                        )}

                        <div className="flex gap-2">
                            <Button type="submit" disabled={loading}>
                                <Save className="h-4 w-4 mr-2" />
                                {loading ? 'Saving...' : 'Save QC Test'}
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

export default function QCTestEntryPage() {
    return (
        <React.Suspense fallback={<div className="p-6 text-sm text-muted-foreground">Loading...</div>}>
            <QCTestEntryPageInner />
        </React.Suspense>
    )
}
