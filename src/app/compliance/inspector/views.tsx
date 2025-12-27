'use client'

import * as React from 'react'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MapPin, Calendar, CheckCheck, FileText, ChevronRight, Activity, Clock, AlertCircle } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator' // UI Component

// --- Types ---
interface ScheduleItem {
    id: string
    mill: string
    location: string
    date: string
    type: 'Surprise' | 'Scheduled' | 'Follow-up'
    status: 'Pending' | 'Confirmed' | 'Completed'
    requirements: string[]
    contactPerson: string
    findings?: string // Only for completed
    notes?: string
}

const MOCK_SCHEDULE: ScheduleItem[] = [
    {
        id: 'SCH-101',
        mill: 'Golden Grain Mills',
        location: 'Nairobi',
        date: '2024-12-28T14:00:00',
        type: 'Surprise',
        status: 'Confirmed',
        requirements: ['Full Audit Checklist', 'Premix Sampling', 'Staff Interview'],
        contactPerson: 'John Kamau (Manager)',
        notes: 'Previous flag on doser calibration.'
    },
    {
        id: 'SCH-102',
        mill: 'Rift Valley Processors',
        location: 'Nakuru',
        date: '2025-01-03T09:00:00',
        type: 'Scheduled',
        status: 'Pending',
        requirements: ['Routine Inspection', 'Document Review'],
        contactPerson: 'Sarah Ochieng'
    },
    {
        id: 'SCH-099',
        mill: 'Coastal Millers',
        location: 'Mombasa',
        date: '2024-12-20T10:00:00',
        type: 'Scheduled',
        status: 'Completed',
        requirements: ['Routine Inspection'],
        contactPerson: 'Ahmed Ali',
        findings: 'Overall compliance good. Minor issue with record keeping rectified on-site.'
    },
    {
        id: 'SCH-098',
        mill: 'Unga Limited',
        location: 'Nairobi',
        date: '2024-12-15T09:00:00',
        type: 'Follow-up',
        status: 'Completed',
        requirements: ['Verify CAPA implementation'],
        contactPerson: 'Peter Njoroge',
        findings: 'CAPA implemented effectively. Issue closed.'
    }
]

// --- Schedule View ---
export function ScheduleView() {
    const [selectedSchedule, setSelectedSchedule] = React.useState<ScheduleItem | null>(null)

    const upcoming = MOCK_SCHEDULE.filter(s => s.status !== 'Completed')
    const completed = MOCK_SCHEDULE.filter(s => s.status === 'Completed')

    return (
        <div className="space-y-8">
            {/* Upcoming Schedule */}
            <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-blue-600" />
                    Upcoming Visits
                </h3>
                <div className="grid gap-4">
                    {upcoming.map((audit) => (
                        <ScheduleCard
                            key={audit.id}
                            audit={audit}
                            onClick={() => setSelectedSchedule(audit)}
                        />
                    ))}
                    {upcoming.length === 0 && <p className="text-gray-500 italic">No upcoming audits scheduled.</p>}
                </div>
            </div>

            <Separator />

            {/* Completed History */}
            <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <CheckCheck className="w-5 h-5 text-green-600" />
                    Recently Completed
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {completed.map((audit) => (
                        <CompletedScheduleCard
                            key={audit.id}
                            audit={audit}
                            onClick={() => setSelectedSchedule(audit)}
                        />
                    ))}
                </div>
            </div>

            {/* Schedule Details Modal */}
            <Dialog open={!!selectedSchedule} onOpenChange={() => setSelectedSchedule(null)}>
                <DialogContent className="sm:max-w-[600px] bg-white">
                    <DialogHeader>
                        <DialogTitle className="text-xl flex items-center gap-2">
                            {selectedSchedule?.mill}
                            <Badge variant="outline">{selectedSchedule?.type}</Badge>
                        </DialogTitle>
                        <DialogDescription>
                            Schedule ID: {selectedSchedule?.id}
                        </DialogDescription>
                    </DialogHeader>

                    {selectedSchedule && (
                        <div className="space-y-6 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <h4 className="text-sm font-medium text-gray-500">Date & Time</h4>
                                    <p className="font-semibold text-gray-900">
                                        {new Date(selectedSchedule.date).toLocaleString()}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-sm font-medium text-gray-500">Location</h4>
                                    <p className="font-semibold text-gray-900">{selectedSchedule.location}</p>
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-sm font-medium text-gray-500">Contact Person</h4>
                                    <p className="font-medium text-gray-900">{selectedSchedule.contactPerson}</p>
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-sm font-medium text-gray-500">Status</h4>
                                    <Badge className={selectedSchedule.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}>
                                        {selectedSchedule.status}
                                    </Badge>
                                </div>
                            </div>

                            <Separator />

                            <div className="space-y-3">
                                <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                                    <FileText className="w-4 h-4" /> Audit Requirements
                                </h4>
                                <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                                    {selectedSchedule.requirements.map((req, i) => (
                                        <li key={i}>{req}</li>
                                    ))}
                                </ul>
                            </div>

                            {selectedSchedule.status === 'Completed' && (
                                <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                                    <h4 className="font-semibold text-green-900 mb-2">Findings Summary</h4>
                                    <p className="text-sm text-green-800">{selectedSchedule.findings}</p>
                                </div>
                            )}

                            {selectedSchedule.notes && (
                                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
                                    <h4 className="font-semibold text-yellow-900 mb-2 flex items-center gap-2">
                                        <AlertCircle className="w-4 h-4" /> Preparation Notes
                                    </h4>
                                    <p className="text-sm text-yellow-800">{selectedSchedule.notes}</p>
                                </div>
                            )}

                            <div className="flex justify-end gap-3 pt-4">
                                <Button variant="outline" onClick={() => setSelectedSchedule(null)}>Close</Button>
                                {selectedSchedule.status !== 'Completed' && (
                                    <Button className="bg-zinc-900 text-white">Start Audit Now</Button>
                                )}
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}

function ScheduleCard({ audit, onClick }: { audit: ScheduleItem, onClick: () => void }) {
    const dateObj = new Date(audit.date)
    const day = dateObj.getDate()
    const month = dateObj.toLocaleString('default', { month: 'short' })
    const time = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

    return (
        <Card className="hover:shadow-md transition-all cursor-pointer group border-l-4 border-l-blue-500" onClick={onClick}>
            <CardContent className="p-5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-xl bg-blue-50 flex flex-col items-center justify-center text-blue-700 border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <span className="font-bold text-xl leading-none">{day}</span>
                        <span className="text-xs font-medium uppercase">{month}</span>
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900 text-lg">{audit.mill}</h3>
                        <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                            <MapPin className="w-3 h-3" />
                            {audit.location}
                            <span className="w-1 h-1 bg-gray-300 rounded-full" />
                            <Clock className="w-3 h-3" />
                            {time}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <Badge variant={audit.type === 'Surprise' ? 'destructive' : 'secondary'} className="px-3 py-1">
                        {audit.type}
                    </Badge>
                    <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-blue-500 transition-colors" />
                </div>
            </CardContent>
        </Card>
    )
}

function CompletedScheduleCard({ audit, onClick }: { audit: ScheduleItem, onClick: () => void }) {
    return (
        <Card className="hover:shadow-md transition-all cursor-pointer bg-gray-50/50 hover:bg-white" onClick={onClick}>
            <CardContent className="p-4">
                <div className="flex justify-between items-start mb-3">
                    <div>
                        <h4 className="font-bold text-gray-900">{audit.mill}</h4>
                        <p className="text-xs text-gray-500">{new Date(audit.date).toLocaleDateString()}</p>
                    </div>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Completed</Badge>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                    {audit.findings || "No findings recorded."}
                </p>
                <div className="flex justify-end">
                    <span className="text-xs font-medium text-blue-600 flex items-center group-hover:underline">
                        View Report <ChevronRight className="w-3 h-3 ml-1" />
                    </span>
                </div>
            </CardContent>
        </Card>
    )
}


// --- Audits View ---
export function AuditsView() {
    // const router = useRouter() // Disable router for now to prevent navigation away

    return (
        <div className="space-y-6">
            <Card className="border-dashed border-2 bg-gray-50/50 hover:bg-gray-50 transition-colors">
                <CardContent className="p-8 flex flex-col items-center justify-center text-center">
                    <div className="p-4 bg-white rounded-full shadow-sm mb-4">
                        <CheckCheck className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Start New Inspection</h3>
                    <p className="text-sm text-gray-500 max-w-sm mt-2 mb-6">
                        Use the "New Audit Draft" button above to initiate a new scheduled or surprise audit checklist.
                    </p>
                </CardContent>
            </Card>

            <div className="space-y-4">
                <h3 className="text-lg font-semibold px-1">Inspection History (Offline)</h3>
                {/* Re-using Schedule Items style for history mock */}
                {[1, 2].map(i => (
                    <Card key={i} className="opacity-75">
                        <CardContent className="p-4 flex justify-between items-center">
                            <div className="flex gap-3 items-center">
                                <FileText className="w-4 h-4 text-gray-400" />
                                <span className="text-gray-600 font-medium">Synced Audit #AUD-88{i}</span>
                            </div>
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-none">Synced</Badge>
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
