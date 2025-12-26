'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
    Truck, Map, Package, LayoutDashboard, Settings, MapPin, Search
} from 'lucide-react'
import { FleetStatusView, DeliveriesListView, FleetListView } from './views'

export default function LogisticsDashboard() {
    const router = useRouter()
    const [activeTab, setActiveTab] = React.useState('overview')

    return (
        <div className="p-6 space-y-8 max-w-[1600px] mx-auto min-h-screen bg-[#F0EFEA]/30">

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 glass-panel p-6 rounded-2xl">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                        <Truck className="w-8 h-8 text-blue-600" />
                        Logistics Planner
                    </h1>
                    <p className="text-gray-600 mt-2">Manage fleet, optimize routes, and track deliveries</p>
                </div>
                <Button
                    variant="default"
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={() => router.push('/dashboard/logistics/routes')}
                >
                    <MapPin className="w-4 h-4 mr-2" />
                    Optimize Routes
                </Button>
            </div>

            {/* Main Tabs Navigation */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="grid w-full grid-cols-4 md:w-[600px] bg-white/40 p-1 backdrop-blur-md rounded-xl border border-white/20 shadow-sm">
                    <TabsTrigger value="overview" className="flex items-center gap-2">
                        <LayoutDashboard className="h-4 w-4" />
                        Overview
                    </TabsTrigger>
                    <TabsTrigger value="fleet" className="flex items-center gap-2">
                        <Truck className="h-4 w-4" />
                        Fleet
                    </TabsTrigger>
                    <TabsTrigger value="deliveries" className="flex items-center gap-2">
                        <Package className="h-4 w-4" />
                        Deliveries
                    </TabsTrigger>
                    <TabsTrigger value="map" className="flex items-center gap-2">
                        <Map className="h-4 w-4" />
                        Live Map
                    </TabsTrigger>
                </TabsList>

                {/* --- OVERVIEW TAB --- */}
                <TabsContent value="overview" className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <h2 className="text-lg font-semibold text-gray-900">Fleet Quick Status</h2>
                        <FleetStatusView />
                    </div>
                    <div className="space-y-6">
                        <h2 className="text-lg font-semibold text-gray-900">Recent Deliveries</h2>
                        <DeliveriesListView />
                    </div>
                </TabsContent>

                {/* --- FLEET TAB --- */}
                <TabsContent value="fleet">
                    <FleetStatusView />
                    <FleetListView />
                </TabsContent>

                {/* --- DELIVERIES TAB --- */}
                <TabsContent value="deliveries">
                    <DeliveriesListView />
                </TabsContent>

                {/* --- MAP TAB --- */}
                <TabsContent value="map">
                    <Card className="h-[500px] bg-slate-100 flex items-center justify-center">
                        <div className="text-center">
                            <Map className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                            <p className="text-gray-500 font-medium">Interactive Route Map Integration</p>
                        </div>
                    </Card>
                </TabsContent>

            </Tabs>
        </div>
    )
}
