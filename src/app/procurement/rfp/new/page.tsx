'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { format } from 'date-fns'
import { Calendar as CalendarIcon, ArrowLeft, Save } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function NewRFPPage() {
    const router = useRouter()
    const [date, setDate] = React.useState<Date>()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        // TODO: Implement API call
        console.log("Submitting RFP...")
        // Simulate success
        setTimeout(() => router.push('/procurement/buyer'), 1000)
    }

    return (
        <div className="p-6 max-w-4xl mx-auto min-h-screen">
            <Button
                variant="ghost"
                className="mb-6 hover:bg-gray-100"
                onClick={() => router.back()}
            >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
            </Button>

            <Card className="glass-card">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-gray-900">Create New Request for Proposal (RFP)</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-8">

                        {/* Basic Information */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">1. Commodity Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="commodity">Commodity Type</Label>
                                    <Select required>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select commodity" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="maize_flour">Maize Flour (Fortified)</SelectItem>
                                            <SelectItem value="wheat_flour">Wheat Flour (Fortified)</SelectItem>
                                            <SelectItem value="rice">Fortified Rice</SelectItem>
                                            <SelectItem value="oil">Edible Oil</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="quantity">Quantity (Metric Tonnes)</Label>
                                    <Input type="number" id="quantity" placeholder="e.g. 50" required />
                                </div>
                            </div>
                        </div>

                        {/* Delivery */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">2. Delivery Requirements</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label>Expected Delivery Date</Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-full justify-start text-left font-normal",
                                                    !date && "text-muted-foreground"
                                                )}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {date ? format(date, "PPP") : <span>Pick a date</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <Calendar
                                                mode="single"
                                                selected={date}
                                                onSelect={setDate}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="location">Delivery Location</Label>
                                    <Select required>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select region" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="nairobi">Nairobi Central Depot</SelectItem>
                                            <SelectItem value="mombasa">Mombasa Port Warehouse</SelectItem>
                                            <SelectItem value="kisumu">Kisumu Regional Hub</SelectItem>
                                            <SelectItem value="nakuru">Nakuru Distribution Center</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>

                        {/* Specifications */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">3. Quality Specifications</h3>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="specs">Detailed Requirements</Label>
                                    <Textarea
                                        id="specs"
                                        placeholder="E.g., Must meet KEBS standard KS EAS 768:2019..."
                                        className="min-h-[100px]"
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="budget">Max Budget per MT (Optional)</Label>
                                        <Input type="number" id="budget" placeholder="KES" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="compliance">Compliance Level</Label>
                                        <Select defaultValue="strict">
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select level" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="strict">Strict (Certified Mills Only)</SelectItem>
                                                <SelectItem value="standard">Standard</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <CardFooter className="px-0 pt-4 flex justify-end gap-4">
                            <Button type="button" variant="ghost" onClick={() => router.back()}>Cancel</Button>
                            <Button type="submit" variant="premium" className="shadow-lg shadow-green-900/10 w-40">
                                <Save className="w-4 h-4 mr-2" />
                                Publish RFP
                            </Button>
                        </CardFooter>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
