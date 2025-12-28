'use client'

import * as React from 'react'
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BarChart, FileText, Download, Share2, Calendar, Filter } from 'lucide-react'
import { toast } from 'sonner'

export function BuyerReports() {
    const handleGenerate = (reportName: string) => {
        toast.success("Report Generated", { description: `${reportName} is ready for download.` })
    }

    const handleShare = (reportName: string) => {
        toast.success("Report Shared", { description: `Link to ${reportName} sent to stakeholders.` })
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div>
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <FileText className="w-5 h-5 text-[#0A3225]" /> Procurement Reports
                    </h2>
                    <p className="text-xs text-gray-500">Generate, view, and share strategic sourcing insights</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm"><Calendar className="w-4 h-4 mr-2" /> Last 30 Days</Button>
                    <Button variant="outline" size="sm"><Filter className="w-4 h-4 mr-2" /> Filter</Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                {/* 1. Supplier Performance Report */}
                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader>
                        <CardTitle className="text-base flex justify-between items-start">
                            Supplier Performance
                            <Badge variant="secondary" className="bg-purple-100 text-orange">Monthly</Badge>
                        </CardTitle>
                        <CardDescription>Aggregate scoring of all active suppliers based on delivery, quality, and cost.</CardDescription>
                    </CardHeader>
                    <CardContent className="h-32 bg-slate-50 flex items-center justify-center border-y border-dashed">
                        <BarChart className="w-12 h-12 text-slate-300" />
                    </CardContent>
                    <CardFooter className="flex gap-2 pt-4">
                        <Button className="flex-1" variant="outline" onClick={() => handleGenerate("Supplier Performance Report")}>
                            <Download className="w-4 h-4 mr-2" /> PDF
                        </Button>
                        <Button className="flex-1" variant="outline" onClick={() => handleShare("Supplier Performance Report")}>
                            <Share2 className="w-4 h-4 mr-2" /> Share
                        </Button>
                    </CardFooter>
                </Card>

                {/* 2. Spend Analysis Report */}
                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader>
                        <CardTitle className="text-base flex justify-between items-start">
                            Spend Analysis
                            <Badge variant="secondary" className="bg-green-100 text-green-700">Financial</Badge>
                        </CardTitle>
                        <CardDescription>Detailed breakdown of procurement spend by category, supplier, and region.</CardDescription>
                    </CardHeader>
                    <CardContent className="h-32 bg-slate-50 flex items-center justify-center border-y border-dashed">
                        <BarChart className="w-12 h-12 text-slate-300" />
                    </CardContent>
                    <CardFooter className="flex gap-2 pt-4">
                        <Button className="flex-1" variant="outline" onClick={() => handleGenerate("Spend Analysis Report")}>
                            <Download className="w-4 h-4 mr-2" /> CSV
                        </Button>
                        <Button className="flex-1" variant="outline" onClick={() => handleShare("Spend Analysis Report")}>
                            <Share2 className="w-4 h-4 mr-2" /> Share
                        </Button>
                    </CardFooter>
                </Card>

                {/* 3. Quality Compliance Report */}
                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader>
                        <CardTitle className="text-base flex justify-between items-start">
                            Quality Compliance
                            <Badge variant="secondary" className="bg-red-100 text-red-700">Critical</Badge>
                        </CardTitle>
                        <CardDescription>Summary of incoming inspection results, rejection rates, and deficiency trends.</CardDescription>
                    </CardHeader>
                    <CardContent className="h-32 bg-slate-50 flex items-center justify-center border-y border-dashed">
                        <BarChart className="w-12 h-12 text-slate-300" />
                    </CardContent>
                    <CardFooter className="flex gap-2 pt-4">
                        <Button className="flex-1" variant="outline" onClick={() => handleGenerate("Quality Compliance Report")}>
                            <Download className="w-4 h-4 mr-2" /> PDF
                        </Button>
                        <Button className="flex-1" variant="outline" onClick={() => handleShare("Quality Compliance Report")}>
                            <Share2 className="w-4 h-4 mr-2" /> Share
                        </Button>
                    </CardFooter>
                </Card>

                {/* 4. Traceability Audit Log */}
                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader>
                        <CardTitle className="text-base flex justify-between items-start">
                            Traceability Audit Log
                            <Badge variant="secondary" className="bg-[#0A3225]/10 text-[#0A3225]">Audit</Badge>
                        </CardTitle>
                        <CardDescription>Full history of batch movements and chain of custody for audit purposes.</CardDescription>
                    </CardHeader>
                    <CardContent className="h-32 bg-slate-50 flex items-center justify-center border-y border-dashed">
                        <BarChart className="w-12 h-12 text-slate-300" />
                    </CardContent>
                    <CardFooter className="flex gap-2 pt-4">
                        <Button className="flex-1" variant="outline" onClick={() => handleGenerate("Traceability Audit Log")}>
                            <Download className="w-4 h-4 mr-2" /> Excel
                        </Button>
                        <Button className="flex-1" variant="outline" onClick={() => handleShare("Traceability Audit Log")}>
                            <Share2 className="w-4 h-4 mr-2" /> Share
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}
