'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MapPin, Calendar, AlertTriangle, FileCheck, ChevronRight, Activity, Plus } from 'lucide-react'

// --- Schedule View ---
export function ScheduleView() {
    const upcomingAudits = [
        { id: 'AUD-991', mill: 'Golden Grain Mills', location: 'Nairobi', date: 'Today, 14:00', type: 'Surprise' },
        { id: 'AUD-992', mill: 'Rift Valley Processors', location: 'Nakuru', date: 'Tomorrow, 09:00', type: 'Scheduled' },
        { id: 'AUD-993', mill: 'Coastal Millers', location: 'Mombasa', date: 'Oct 24, 10:00', type: 'Scheduled' },
    ]

    return (
        <div className="space-y-4">
            {upcomingAudits.map((audit) => (
                <Card key={audit.id} className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-5 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-xl bg-green-50 flex items-center justify-center text-green-700 font-bold text-lg">
                                {audit.date.split(',')[0].substring(0, 3)}
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900">{audit.mill}</h3>
                                <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                                    <MapPin className="w-3 h-3" />
                                    {audit.location} • {audit.date.split(',')[1]}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <Badge variant={audit.type === 'Surprise' ? 'destructive' : 'outline'}>
                                {audit.type}
                            </Badge>
                            <ChevronRight className="w-5 h-5 text-gray-300" />
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}

// --- Audits View ---
export function AuditsView() {
    const router = useRouter()

    return (
        <div className="space-y-6">
            <Card className="border-dashed border-2 bg-gray-50/50 hover:bg-gray-50 transition-colors">
                <CardContent className="p-8 flex flex-col items-center justify-center text-center">
                    <div className="p-4 bg-white rounded-full shadow-sm mb-4">
                        <FileCheck className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Start New Inspection</h3>
                    <p className="text-sm text-gray-500 max-w-sm mt-2 mb-6">
                        Initiate a new scheduled or surprise audit checklist for a registered facility.
                    </p>
                    <Button onClick={() => router.push('/compliance/audits/new')} size="lg" className="shadow-lg shadow-green-900/10">
                        <Plus className="w-4 h-4 mr-2" />
                        Begin Audit
                    </Button>
                </CardContent>
            </Card>

            <div className="space-y-4">
                <h3 className="text-lg font-semibold px-1">Recent History</h3>
                {/* Re-using Schedule Items style for history mock */}
                {[1, 2].map(i => (
                    <Card key={i} className="opacity-75">
                        <CardContent className="p-4 flex justify-between items-center">
                            <div className="flex gap-3 items-center">
                                <FileCheck className="w-4 h-4 text-gray-400" />
                                <span className="text-gray-600 font-medium">Completed Audit #AUD-88{i}</span>
                            </div>
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-none">Passed</Badge>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}

// --- Flags View ---
export function FlagsView() {
    const recentFlags = [
        { id: 'FLG-001', mill: 'Golden Grain Mills', issue: 'Premix Dosing Low', severity: 'HIGH' },
        { id: 'FLG-002', mill: 'Super Meal Ltd', issue: 'Lab Report Missing', severity: 'MEDIUM' },
    ]

    return (
        <Card className="glass-card border-none bg-red-50/50 border-red-100">
            <CardContent className="p-5">
                <div className="space-y-4">
                    {recentFlags.map((flag) => (
                        <div key={flag.id} className="flex gap-3 items-start pb-4 border-b border-red-100 last:border-0 last:pb-0">
                            <div className="mt-1">
                                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-gray-900">{flag.issue}</p>
                                <p className="text-xs text-gray-500">{flag.mill}</p>
                            </div>
                            <Badge className="ml-auto bg-red-100 text-red-700 hover:bg-red-200 border-none">{flag.severity}</Badge>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
