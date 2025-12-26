'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts'
import { MapPin, Calendar, Clock, DollarSign } from 'lucide-react'

// --- RFP View ---
export function RFPListView() {
    const rfpData = [
        { id: 'RFP-2023-001', title: 'Maize Flour Supply - Q1', status: 'OPEN', responses: 5, deadline: '2 Days' },
        { id: 'RFP-2023-002', title: 'Fortified Rice - 50MT', status: 'REVIEW', responses: 3, deadline: 'Closed' },
        { id: 'RFP-2023-003', title: 'Oil Premix Procurement', status: 'DRAFT', responses: 0, deadline: '-' },
    ]

    return (
        <Card className="glass-card border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xl font-bold text-gray-900">Recent Request for Proposals</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4 pt-4">
                    {rfpData.map((rfp, i) => (
                        <div
                            key={rfp.id}
                            className="flex items-center justify-between p-4 rounded-xl bg-white/50 border border-white/60 hover:bg-white hover:shadow-md transition-all cursor-pointer group"
                        >
                            <div className="flex flex-col gap-1">
                                <span className="font-semibold text-gray-900 group-hover:text-green-700 transition-colors">{rfp.title}</span>
                                <span className="text-xs text-muted-foreground flex items-center gap-2">
                                    <span className="font-mono">{rfp.id}</span>
                                    <span>•</span>
                                    <span>{rfp.responses} Bids Received</span>
                                </span>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="text-right hidden sm:block">
                                    <span className="text-xs font-medium text-gray-500 block">Deadline</span>
                                    <span className="text-sm font-semibold text-gray-900">{rfp.deadline}</span>
                                </div>
                                <Badge variant={rfp.status === 'OPEN' ? 'default' : 'secondary'} className={`w-20 justify-center ${rfp.status === 'OPEN' ? 'bg-green-600' : ''}`}>
                                    {rfp.status}
                                </Badge>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}

// --- Spend Analysis View ---
export function SpendAnalysisView() {
    const spendTrend = [
        { month: 'Jan', amount: 45000 },
        { month: 'Feb', amount: 52000 },
        { month: 'Mar', amount: 48000 },
        { month: 'Apr', amount: 61000 },
        { month: 'May', amount: 55000 },
        { month: 'Jun', amount: 67000 },
    ]

    return (
        <Card className="glass-card border-none shadow-sm">
            <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-900">Monthly Spend Analysis</CardTitle>
            </CardHeader>
            <CardContent className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={spendTrend}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                        <XAxis dataKey="month" axisLine={false} tickLine={false} />
                        <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `$${value / 1000}k`} />
                        <Tooltip
                            cursor={{ fill: '#f3f4f6' }}
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                        <Bar dataKey="amount" fill="#16a34a" radius={[6, 6, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}
