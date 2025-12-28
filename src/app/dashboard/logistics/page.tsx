'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
    Truck, Map, Package, LayoutDashboard, Settings, MapPin, Search
} from 'lucide-react'
import { FleetStatusView, DeliveriesListView, FleetListView, LogisticsAnalyticsView } from './views'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Loader2, BarChart } from 'lucide-react'

import { NotificationCenter } from '@/components/ui/notification-center'

export default function LogisticsDashboard() {
    const router = useRouter()
    const [activeTab, setActiveTab] = React.useState('overview')
    const [isOptimizing, setIsOptimizing] = React.useState(false)

    const handleOptimizeRoutes = () => {
        setIsOptimizing(true)
        setTimeout(() => {
            setIsOptimizing(false)
        }, 3000)
    }

    return (
        <div className="p-6 space-y-8 max-w-[1600px] mx-auto min-h-screen bg-white">

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 glass-panel p-6 rounded-2xl">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                        <Truck className="w-8 h-8 text-[#0A3225]" />
                        Logistics Planner
                    </h1>
                    <p className="text-gray-600 mt-2">Manage fleet, optimize routes, and track deliveries</p>
                </div>
                <div className="flex gap-3 items-center">
                    <NotificationCenter />
                    <Button
                        variant="default"
                        className="bg-[#0A3225] hover:bg-[#0A3225] shadow-lg shadow-blue-600/20"
                        onClick={handleOptimizeRoutes}
                        disabled={isOptimizing}
                    >
                        {isOptimizing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <MapPin className="w-4 h-4 mr-2" />}
                        {isOptimizing ? 'Optimizing...' : 'Optimize Routes'}
                    </Button>
                </div>
            </div>

            {/* Main Tabs Navigation */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="grid w-full grid-cols-5 bg-white/60 p-1 backdrop-blur-md rounded-xl border border-white/20 shadow-sm">
                    <TabsTrigger
                        value="overview"
                        className="flex items-center gap-2 font-bold text-gray-600 data-[state=active]:bg-[#0A3225] data-[state=active]:text-white transition-all"
                    >
                        <LayoutDashboard className="h-4 w-4" />
                        <span className="hidden lg:inline">Overview</span>
                    </TabsTrigger>
                    <TabsTrigger
                        value="fleet"
                        className="flex items-center gap-2 font-bold text-gray-600 data-[state=active]:bg-[#0A3225] data-[state=active]:text-white transition-all"
                    >
                        <Truck className="h-4 w-4" />
                        <span className="hidden lg:inline">Fleet</span>
                    </TabsTrigger>
                    <TabsTrigger
                        value="deliveries"
                        className="flex items-center gap-2 font-bold text-gray-600 data-[state=active]:bg-[#0A3225] data-[state=active]:text-white transition-all"
                    >
                        <Package className="h-4 w-4" />
                        <span className="hidden lg:inline">Deliveries</span>
                    </TabsTrigger>
                    <TabsTrigger
                        value="analytics"
                        className="flex items-center gap-2 font-bold text-gray-600 data-[state=active]:bg-[#0A3225] data-[state=active]:text-white transition-all"
                    >
                        <BarChart className="h-4 w-4" />
                        <span className="hidden lg:inline">Analytics</span>
                    </TabsTrigger>
                    <TabsTrigger
                        value="map"
                        className="flex items-center gap-2 font-bold text-gray-600 data-[state=active]:bg-[#0A3225] data-[state=active]:text-white transition-all"
                    >
                        <Map className="h-4 w-4" />
                        <span className="hidden lg:inline">Live Map</span>
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

                {/* --- ANALYTICS TAB --- */}
                <TabsContent value="analytics">
                    <LogisticsAnalyticsView />
                </TabsContent>

                {/* --- MAP TAB --- */}
                <TabsContent value="map">
                    <Card className="h-[600px] bg-slate-100 flex items-center justify-center border-none shadow-inner">
                        <div className="text-center">
                            <Map className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-slate-600">Live Asset Map</h3>
                            <p className="text-slate-500">Interactive integration with Google Maps / Leaflet</p>
                        </div>
                    </Card>
                </TabsContent>

            </Tabs>

            {/* Optimization Dialog */}
            <Dialog open={isOptimizing} onOpenChange={setIsOptimizing}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Optimizing Logistics Routes</DialogTitle>
                        <DialogDescription>Analyzing traffic patterns, fuel efficiency, and delivery windows...</DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col items-center justify-center py-8 space-y-4">
                        <Loader2 className="w-12 h-12 text-[#0A3225] animate-spin" />
                        <p className="text-sm text-gray-500">Calculating best paths for 12 active vehicles...</p>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
