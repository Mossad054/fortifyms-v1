'use client'

import * as React from 'react'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card'
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line
} from 'recharts'
import { ArrowDownRight, ArrowUpRight, DollarSign, Wallet } from 'lucide-react'

// --- BACKEND / DATA LAYER ---

const SPEND_TREND_DATA = [
    { month: 'Jan', spend: 45000, budget: 50000 },
    { month: 'Feb', spend: 52000, budget: 50000 },
    { month: 'Mar', spend: 48000, budget: 50000 },
    { month: 'Apr', spend: 61000, budget: 60000 },
    { month: 'May', spend: 55000, budget: 60000 },
    { month: 'Jun', spend: 67000, budget: 60000 },
]

const CATEGORY_SPEND_DATA = [
    { name: 'Maize', value: 400000 },
    { name: 'Wheat', value: 300000 },
    { name: 'Oil', value: 150000 },
    { name: 'Logistics', value: 80000 },
]

// --- FRONTEND COMPONENTS ---

export function SpendAnalytics() {
    return (
        <div className="space-y-6">
            {/* Top Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between space-y-0 pb-2">
                            <p className="text-sm font-medium text-gray-500">Total Spend (YTD)</p>
                            <DollarSign className="w-4 h-4 text-green-500" />
                        </div>
                        <div className="text-2xl font-bold">$328,000</div>
                        <p className="text-xs text-green-600 flex items-center mt-1">
                            <ArrowUpRight className="w-3 h-3 mr-1" /> +12% from last year
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between space-y-0 pb-2">
                            <p className="text-sm font-medium text-gray-500">Budget Utilization</p>
                            <Wallet className="w-4 h-4 text-blue-500" />
                        </div>
                        <div className="text-2xl font-bold">89%</div>
                        <p className="text-xs text-gray-500 mt-1">On track for Q2</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between space-y-0 pb-2">
                            <p className="text-sm font-medium text-gray-500">Savings</p>
                            <ArrowDownRight className="w-4 h-4 text-green-500" />
                        </div>
                        <div className="text-2xl font-bold">$12,450</div>
                        <p className="text-xs text-green-600 mt-1">Via competitive bidding</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between space-y-0 pb-2">
                            <p className="text-sm font-medium text-gray-500">Avg Cost/Kg (Maize)</p>
                            <BarChart className="w-4 h-4 text-orange-500" />
                        </div>
                        <div className="text-2xl font-bold">$0.45</div>
                        <p className="text-xs text-red-600 flex items-center mt-1">
                            <ArrowUpRight className="w-3 h-3 mr-1" /> +2% M/M
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>Spend vs Budget Trend</CardTitle>
                        <CardDescription>Monthly procurement spend analysis</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={SPEND_TREND_DATA}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="month" />
                                    <YAxis tickFormatter={(value) => `$${value / 1000}k`} />
                                    <Tooltip formatter={(value) => `$${value}`} />
                                    <Legend />
                                    <Bar dataKey="spend" name="Actual Spend" fill="#22c55e" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="budget" name="Budget Limit" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>Cost Efficiency Analysis</CardTitle>
                        <CardDescription>Average unit cost trends over 6 months</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={SPEND_TREND_DATA}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="spend" stroke="#3b82f6" strokeWidth={2} name="Unit Cost Index" />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
