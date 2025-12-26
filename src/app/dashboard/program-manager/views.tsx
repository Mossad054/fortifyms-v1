'use client'

import * as React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
    LineChart, Line, CartesianGrid, PieChart, Pie, Cell
} from 'recharts'

// --- Regional Performance View ---
export function RegionalPerformanceView() {
    const regionalData = [
        { name: 'Nairobi', production: 450, compliance: 92 },
        { name: 'Rift Valley', production: 320, compliance: 88 },
        { name: 'Coast', production: 280, compliance: 95 },
        { name: 'Central', production: 210, compliance: 90 },
        { name: 'Western', production: 180, compliance: 85 },
    ]

    return (
        <Card className="glass-card border-none shadow-sm">
            <CardHeader>
                <CardTitle>Regional Performance</CardTitle>
            </CardHeader>
            <CardContent className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={regionalData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e5e5" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} />
                        <YAxis axisLine={false} tickLine={false} />
                        <Tooltip cursor={{ fill: '#f9fafb' }} contentStyle={{ borderRadius: '8px', border: 'none' }} />
                        <Bar dataKey="production" name="Production (MT)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="compliance" name="Compliance Score" fill="#10b981" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}

// --- Compliance Trends View ---
export function ComplianceTrendsView() {
    const complianceTrends = [
        { name: 'Jan', rate: 82 },
        { name: 'Feb', rate: 85 },
        { name: 'Mar', rate: 88 },
        { name: 'Apr', rate: 87 },
        { name: 'May', rate: 91 },
        { name: 'Jun', rate: 94 },
    ]

    return (
        <Card className="glass-card border-none shadow-sm">
            <CardHeader>
                <CardTitle>National Compliance Trend</CardTitle>
            </CardHeader>
            <CardContent className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={complianceTrends}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e5e5" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} />
                        <YAxis domain={[0, 100]} axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={{ borderRadius: '8px', border: 'none' }} />
                        <Line type="monotone" dataKey="rate" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}
