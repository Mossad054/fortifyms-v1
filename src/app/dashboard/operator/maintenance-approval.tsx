'use client'

import * as React from 'react'
import {
    CheckCircle2, XCircle, AlertTriangle, FileText, User, Calendar,
    ArrowRight, Eye, ShieldCheck, CheckSquare, MessageSquare, Clock
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
    Dialog, DialogContent, DialogDescription, DialogFooter,
    DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from '@/components/ui/textarea'
import { MaintenanceTask } from './maintenance-types'

export function MaintenanceApproval({ tasks, onApprove, onReject }: { tasks: MaintenanceTask[], onApprove: (id: string, notes: string) => void, onReject: (id: string, notes: string) => void }) {
    const [selectedTask, setSelectedTask] = React.useState<MaintenanceTask | null>(null)
    const [reviewNotes, setReviewNotes] = React.useState('')

    const pendingTasks = tasks.filter(t => t.status === 'Completed' || t.status === 'Escalated')

    const handleAction = (action: 'approve' | 'reject') => {
        if (!selectedTask) return
        if (action === 'approve') onApprove(selectedTask.id, reviewNotes)
        else onReject(selectedTask.id, reviewNotes)
        setSelectedTask(null)
        setReviewNotes('')
    }

    return (
        <div className="h-full flex gap-6">
            {/* List of Pending Approvals */}
            <Card className="w-1/3 flex flex-col border-none shadow-sm">
                <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <CheckSquare className="w-5 h-5 text-blue-600" /> Pending Review
                        <Badge variant="secondary" className="ml-auto">{pendingTasks.length}</Badge>
                    </CardTitle>
                    <CardDescription>Tasks awaiting sign-off</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 overflow-hidden p-0">
                    <ScrollArea className="h-full">
                        <div className="flex flex-col gap-1 p-4">
                            {pendingTasks.length === 0 && (
                                <div className="text-center py-12 text-zinc-400">
                                    <CheckCircle2 className="w-8 h-8 mx-auto mb-2 opacity-20" />
                                    <p className="text-sm">All caught up!</p>
                                </div>
                            )}
                            {pendingTasks.map(task => (
                                <div
                                    key={task.id}
                                    onClick={() => setSelectedTask(task)}
                                    className={`p-3 rounded-lg border cursor-pointer transition-all hover:shadow-sm ${selectedTask?.id === task.id ? 'bg-blue-50 border-blue-200 ring-1 ring-blue-200' : 'bg-white hover:border-blue-300'}`}
                                >
                                    <div className="flex justify-between items-start mb-1">
                                        <Badge variant="outline" className="text-[10px] h-5 bg-white">{task.equipment}</Badge>
                                        <span className="text-[10px] text-zinc-500">{task.dueDate}</span>
                                    </div>
                                    <h4 className="font-semibold text-sm text-zinc-900 line-clamp-1">{task.title}</h4>
                                    <div className="flex items-center gap-2 mt-2">
                                        <div className="flex items-center text-xs text-zinc-500">
                                            <User className="w-3 h-3 mr-1" /> Tech A
                                        </div>
                                        {task.status === 'Escalated' && <Badge variant="destructive" className="ml-auto h-5 text-[10px]">Escalated</Badge>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                </CardContent>
            </Card>

            {/* Task Detail View (Empty State or Selected) */}
            <div className="flex-1">
                {selectedTask ? (
                    <Card className="h-full flex flex-col border-none shadow-sm">
                        <CardHeader className="border-b bg-slate-50/50 pb-4">
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <Badge variant={selectedTask.status === 'Escalated' ? 'destructive' : 'default'} className={selectedTask.status === 'Completed' ? 'bg-green-600' : ''}>
                                            {selectedTask.status}
                                        </Badge>
                                        <span className="text-xs text-zinc-400 font-mono">ID: {selectedTask.id}</span>
                                    </div>
                                    <CardTitle className="text-xl">{selectedTask.title}</CardTitle>
                                    <CardDescription className="flex items-center gap-2 mt-1">
                                        <Calendar className="w-4 h-4" /> Completed on {selectedTask.dueDate} by Tech A
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="flex-1 overflow-y-auto p-6 space-y-6">
                            {/* Execution Summary */}
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <h3 className="font-semibold text-sm text-zinc-900 border-b pb-1">Execution Details</h3>
                                    <div className="space-y-2">
                                        {selectedTask.steps.map((step, i) => (
                                            <div key={step.id} className="flex items-start gap-2 text-sm">
                                                <div className={`mt-0.5 w-4 h-4 rounded-full flex items-center justify-center text-[10px] shrink-0 ${step.completed ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                    {step.completed ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                                                </div>
                                                <div className="flex-1">
                                                    <span className={step.completed ? 'text-zinc-600' : 'text-zinc-400'}>{step.text}</span>
                                                    {step.isCalibration && (
                                                        <div className="mt-1 flex items-center gap-3 text-xs bg-slate-50 p-1.5 rounded border">
                                                            <span className="text-zinc-500">Target: {step.calibrationTarget}g</span>
                                                            <span className="font-bold text-zinc-700">Actual: {step.calibrationValue || '--'}g</span>
                                                            {step.calibrationValue && step.calibrationTarget && Math.abs(step.calibrationValue - step.calibrationTarget) > (step.calibrationTarget * 0.05) && (
                                                                <span className="text-red-600 flex items-center gap-1 font-bold"><AlertTriangle className="w-3 h-3" /> Deviation</span>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <h3 className="font-semibold text-sm text-zinc-900 border-b pb-1">Notes & Evidence</h3>
                                    <div className="bg-slate-50 p-3 rounded-lg border text-sm text-zinc-600 min-h-[80px]">
                                        {selectedTask.notes || <span className="text-zinc-400 italic">No notes provided.</span>}
                                    </div>
                                    <div className="flex gap-2">
                                        <div className="border border-dashed rounded p-2 flex items-center gap-2 text-xs text-blue-600 bg-blue-50 cursor-pointer hover:bg-blue-100 transition-colors">
                                            <FileText className="w-4 h-4" /> View Compliance Cert
                                        </div>
                                        <div className="border border-dashed rounded p-2 flex items-center gap-2 text-xs text-blue-600 bg-blue-50 cursor-pointer hover:bg-blue-100 transition-colors">
                                            <Eye className="w-4 h-4" /> View Photos (2)
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <hr className="my-4 border-zinc-200" />

                            <div className="space-y-3">
                                <h3 className="font-semibold text-sm text-zinc-900">Manager Review</h3>
                                <Textarea
                                    placeholder="Add approval comments or rejection reason..."
                                    value={reviewNotes}
                                    onChange={e => setReviewNotes(e.target.value)}
                                    className="min-h-[80px]"
                                />
                            </div>

                        </CardContent>
                        <CardFooter className="justify-between border-t p-6 bg-slate-50">
                            <Button variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => handleAction('reject')}>
                                <XCircle className="w-4 h-4 mr-2" /> Reject & Request Visual
                            </Button>
                            <Button className="bg-green-600 hover:bg-green-700 w-40" onClick={() => handleAction('approve')}>
                                <ShieldCheck className="w-4 h-4 mr-2" /> Approve
                            </Button>
                        </CardFooter>
                    </Card>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-zinc-400 bg-slate-50/50 rounded-xl border border-dashed">
                        <CheckSquare className="w-16 h-16 mb-4 opacity-20" />
                        <p>Select a task to review details</p>
                    </div>
                )}
            </div>
        </div>
    )
}
