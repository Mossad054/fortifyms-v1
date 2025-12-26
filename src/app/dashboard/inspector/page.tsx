'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
    ShieldCheck, FileText, Building2, MapPin, AlertTriangle,
    BarChart3, Download, Settings
} from 'lucide-react'
import { PendingReviewsQueue } from './components/pending-reviews'
import { AssignedMillsView } from './components/assigned-mills'
import { RegionalOverviewView } from './components/regional-overview'

import { InspectionWizard } from './components/inspection-wizard'

export default function InspectorDashboard() {
    const router = useRouter()
    const [activeTab, setActiveTab] = React.useState('pending')
    const [showInspectionWizard, setShowInspectionWizard] = React.useState(false)

    return (
        <div className="p-6 space-y-8 max-w-[1600px] mx-auto min-h-screen bg-[#F0EFEA]/30">
            <InspectionWizard open={showInspectionWizard} onOpenChange={setShowInspectionWizard} />
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-premium-dark flex items-center gap-2">
                        <ShieldCheck className="w-8 h-8 text-green-600" />
                        FWGA Inspector Portal
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Regulatory inspection and compliance oversight
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button onClick={() => setShowInspectionWizard(true)} className="bg-zinc-900 text-white hover:bg-zinc-800">
                        <ShieldCheck className="w-4 h-4 mr-2" />
                        Start Inspection
                    </Button>
                    <Button variant="outline" className="bg-white">
                        <MapPin className="w-4 h-4 mr-2" />
                        Regional Map
                    </Button>
                    <Button variant="outline" className="bg-white">
                        <Download className="w-4 h-4 mr-2" />
                        Export Evidence
                    </Button>
                </div>
            </div>

            {/* Main Tabs Navigation */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="grid w-full grid-cols-5 lg:w-[700px] bg-white/40 p-1 backdrop-blur-md rounded-xl border border-white/20 shadow-sm">
                    <TabsTrigger value="pending" className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        <span className="hidden lg:inline">Pending Reviews</span>
                    </TabsTrigger>
                    <TabsTrigger value="mills" className="flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        <span className="hidden lg:inline">My Mills</span>
                    </TabsTrigger>
                    <TabsTrigger value="regional" className="flex items-center gap-2">
                        <BarChart3 className="h-4 w-4" />
                        <span className="hidden lg:inline">Regional</span>
                    </TabsTrigger>
                    <TabsTrigger value="escalations" className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4" />
                        <span className="hidden lg:inline">Escalations</span>
                    </TabsTrigger>
                    <TabsTrigger value="audit-trail" className="flex items-center gap-2">
                        <Settings className="h-4 w-4" />
                        <span className="hidden lg:inline">Audit Trail</span>
                    </TabsTrigger>
                </TabsList>

                {/* --- PENDING REVIEWS TAB (DEFAULT) --- */}
                <TabsContent value="pending">
                    <PendingReviewsQueue />
                </TabsContent>

                {/* --- MY MILLS TAB --- */}
                <TabsContent value="mills">
                    <AssignedMillsView />
                </TabsContent>

                {/* --- REGIONAL OVERVIEW TAB --- */}
                <TabsContent value="regional">
                    <RegionalOverviewView />
                </TabsContent>

                {/* --- ESCALATIONS TAB --- */}
                <TabsContent value="escalations">
                    <Card className="glass-card border-none shadow-sm">
                        <CardContent className="p-12 text-center">
                            <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                Escalation Management
                            </h3>
                            <p className="text-sm text-gray-500 mb-4">
                                Track and manage escalated issues
                            </p>
                            <p className="text-xs text-gray-400">Coming in Phase 4</p>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* --- AUDIT TRAIL TAB --- */}
                <TabsContent value="audit-trail">
                    <Card className="glass-card border-none shadow-sm">
                        <CardContent className="p-12 text-center">
                            <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                Audit Trail
                            </h3>
                            <p className="text-sm text-gray-500 mb-4">
                                Immutable log of all inspector actions
                            </p>
                            <p className="text-xs text-gray-400">Coming in Phase 5</p>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
