'use client'

import * as React from 'react'
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, Search, Settings, Wrench, Calendar, MoreHorizontal, ArrowLeft, Trash2, Save, Clock } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

// --- TYPES ---

export type MaintenanceSchedule = {
    id: string
    type: 'Calibration' | 'Cleaning' | 'Lubrication' | 'Inspection' | 'Replacement'
    frequencyDays: number // e.g., 7 for weekly, 30 for monthly
    lastPerformed?: string
    nextDue: string
    assignedTo: string // Role or Person
}

export type Equipment = {
    id: string
    name: string
    type: string
    make: string
    model: string
    serial: string
    location: string
    installDate: string
    status: 'Active' | 'Maintenance' | 'Offline'
    schedules: MaintenanceSchedule[]
}

const MOCK_EQUIPMENT: Equipment[] = [
    {
        id: 'EQ-001', name: 'Volumetric Doser A', type: 'Doser', make: 'Bühler', model: 'MSDA', serial: 'SN-9982', location: 'Line 1', installDate: '2022-05-10', status: 'Active',
        schedules: [
            { id: 'sch-1', type: 'Calibration', frequencyDays: 7, nextDue: '2024-10-25', assignedTo: 'Quality Officer' },
            { id: 'sch-2', type: 'Cleaning', frequencyDays: 1, nextDue: '2024-10-19', assignedTo: 'Operator' }
        ]
    },
    {
        id: 'EQ-002', name: 'High Speed Mixer', type: 'Mixer', make: 'Bühler', model: 'MKA', serial: 'SN-2211', location: 'Line 1', installDate: '2021-08-15', status: 'Maintenance',
        schedules: [
            { id: 'sch-3', type: 'Lubrication', frequencyDays: 30, nextDue: '2024-11-01', assignedTo: 'Maintenance Tech' }
        ]
    },
    {
        id: 'EQ-003', name: 'Premix Feeder', type: 'Feeder', make: 'Schenck', model: 'Multicor', serial: 'SN-4432', location: 'Line 2', installDate: '2023-01-20', status: 'Active',
        schedules: []
    },
]

export function MaintenanceRegistry({ onBack }: { onBack: () => void }) {
    const [view, setView] = React.useState<'list' | 'edit'>('list')
    const [equipment, setEquipment] = React.useState(MOCK_EQUIPMENT)
    const [searchTerm, setSearchTerm] = React.useState('')

    // Edit/Add Form State
    const [editingId, setEditingId] = React.useState<string | null>(null)
    const [formData, setFormData] = React.useState<Partial<Equipment>>({ status: 'Active', schedules: [] })

    // Handler to open Add New
    const handleAddNew = () => {
        setEditingId(null)
        setFormData({ status: 'Active', schedules: [] })
        setView('edit')
    }

    // Handler to open Edit
    const handleEdit = (eq: Equipment) => {
        setEditingId(eq.id)
        setFormData({ ...eq })
        setView('edit')
    }

    const handleSave = () => {
        if (!formData.name || !formData.type) return // Validation

        if (editingId) {
            // Update existing
            setEquipment(equipment.map(e => e.id === editingId ? { ...e, ...formData } as Equipment : e))
        } else {
            // Create new
            const newId = `EQ-${Math.floor(Math.random() * 10000)}`
            setEquipment([...equipment, { ...formData, id: newId, schedules: formData.schedules || [] } as Equipment])
        }
        setView('list')
    }

    const filtered = equipment.filter(e =>
        e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.location.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="space-y-4 h-full flex flex-col">
            <AnimatePresence mode='wait'>
                {view === 'list' ? (
                    <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col h-full space-y-4">
                        <div className="flex justify-between items-center shrink-0">
                            <div className="relative w-72">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input placeholder="Search equipment..." className="pl-8" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" onClick={onBack}><ArrowLeft className="w-4 h-4 mr-2" /> Back</Button>
                                <Button onClick={handleAddNew}><Plus className="w-4 h-4 mr-2" /> Add Asset</Button>
                            </div>
                        </div>

                        <Card className="flex-1 overflow-hidden border shadow-sm">
                            <Table>
                                <TableHeader className="bg-slate-50">
                                    <TableRow>
                                        <TableHead>Asset ID</TableHead>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Location</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Schedules</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filtered.map((eq) => (
                                        <TableRow key={eq.id} className="hover:bg-slate-50/50 cursor-pointer" onClick={() => handleEdit(eq)}>
                                            <TableCell className="font-mono text-xs text-zinc-500">{eq.id}</TableCell>
                                            <TableCell className="font-medium">
                                                {eq.name}
                                                <div className="text-xs text-muted-foreground">{eq.make} {eq.model}</div>
                                            </TableCell>
                                            <TableCell>{eq.type}</TableCell>
                                            <TableCell>{eq.location}</TableCell>
                                            <TableCell>
                                                <Badge variant="secondary" className={
                                                    eq.status === 'Active' ? 'bg-green-100 text-green-700 hover:bg-green-100' :
                                                        eq.status === 'Maintenance' ? 'bg-orange-100 text-orange-700 hover:bg-orange-100' :
                                                            'bg-slate-100'
                                                }>{eq.status}</Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-wrap gap-1">
                                                    {eq.schedules.length > 0 ? eq.schedules.map(s => (
                                                        <Badge key={s.id} variant="outline" className="text-[10px] font-normal border-zinc-200 text-zinc-600 bg-white">
                                                            {s.type}
                                                        </Badge>
                                                    )) : <span className="text-xs text-zinc-400 italic">None defined</span>}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={(e) => { e.stopPropagation(); handleEdit(eq) }}>
                                                    <Settings className="w-4 h-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Card>
                    </motion.div>
                ) : (
                    <EquipmentForm
                        key="edit"
                        initialData={formData}
                        isEditing={!!editingId}
                        onCancel={() => setView('list')}
                        onSave={(data) => { setFormData(data); handleSave(); }}
                    />
                )}
            </AnimatePresence>
        </div>
    )
}

function EquipmentForm({ initialData, isEditing, onCancel, onSave }: { initialData: Partial<Equipment>, isEditing: boolean, onCancel: () => void, onSave: (data: Partial<Equipment>) => void }) {
    const [data, setData] = React.useState(initialData)
    const [activeTab, setActiveTab] = React.useState('details')

    // Schedule Builder State
    const [newSchedule, setNewSchedule] = React.useState<Partial<MaintenanceSchedule>>({ frequencyDays: 7, type: 'Inspection' })

    const addSchedule = () => {
        if (!newSchedule.type || !newSchedule.frequencyDays) return
        const schedule: MaintenanceSchedule = {
            id: `sch-${Date.now()}`,
            type: newSchedule.type as any,
            frequencyDays: parseInt(newSchedule.frequencyDays.toString()),
            nextDue: new Date(Date.now() + (newSchedule.frequencyDays * 86400000)).toISOString().split('T')[0], // Mock Next Due
            assignedTo: newSchedule.assignedTo || 'Technician'
        }
        setData({ ...data, schedules: [...(data.schedules || []), schedule] })
        setNewSchedule({ frequencyDays: 7, type: 'Inspection', assignedTo: '' }) // Reset
    }

    const removeSchedule = (id: string) => {
        setData({ ...data, schedules: data.schedules?.filter(s => s.id !== id) })
    }

    return (
        <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="h-full flex flex-col">
            <Card className="flex-1 flex flex-col overflow-hidden shadow-lg border-t-4 border-t-blue-600">
                <CardHeader className="border-b bg-slate-50/50 pb-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Button variant="ghost" size="sm" onClick={onCancel} className="h-8 w-8 p-0 border rounded-full bg-white shadow-sm"><ArrowLeft className="w-4 h-4" /></Button>
                            <div>
                                <CardTitle>{isEditing ? `Edit ${data.name}` : 'New Equipment'}</CardTitle>
                                <CardDescription>Manage asset details and maintenance schedules.</CardDescription>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" onClick={onCancel}>Discard</Button>
                            <Button onClick={() => onSave(data)}><Save className="w-4 h-4 mr-2" /> Save Changes</Button>
                        </div>
                    </div>
                </CardHeader>

                <div className="flex-1 overflow-hidden flex flex-col">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
                        <div className="px-6 pt-4 border-b">
                            <TabsList className="bg-transparent border-b-0 p-0 h-auto space-x-6">
                                <TabsTrigger value="details" className="bg-transparent border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:shadow-none rounded-none px-0 pb-2 text-zinc-500 data-[state=active]:text-blue-700">Detailed Specs</TabsTrigger>
                                <TabsTrigger value="schedules" className="bg-transparent border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:shadow-none rounded-none px-0 pb-2 text-zinc-500 data-[state=active]:text-blue-700">Maintenance Schedules</TabsTrigger>
                                <TabsTrigger value="history" className="bg-transparent border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:shadow-none rounded-none px-0 pb-2 text-zinc-500 data-[state=active]:text-blue-700">History & Logs</TabsTrigger>
                            </TabsList>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/30">
                            <TabsContent value="details" className="m-0 space-y-6 max-w-4xl">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-4 p-4 bg-white rounded-lg border shadow-sm">
                                        <h3 className="font-semibold text-sm flex items-center text-zinc-900"><Settings className="w-4 h-4 mr-2" /> Basic Info</h3>
                                        <div className="space-y-3">
                                            <div className="space-y-1"><Label>Asset Name</Label><Input value={data.name} onChange={e => setData({ ...data, name: e.target.value })} /></div>
                                            <div className="space-y-1"><Label>Asset Type</Label>
                                                <Select value={data.type} onValueChange={v => setData({ ...data, type: v })}>
                                                    <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="Doser">Doser</SelectItem>
                                                        <SelectItem value="Mixer">Mixer</SelectItem>
                                                        <SelectItem value="Feeder">Feeder</SelectItem>
                                                        <SelectItem value="Sensor">Sensor</SelectItem>
                                                        <SelectItem value="Scale">Scale</SelectItem>
                                                        <SelectItem value="Conveyor">Conveyor</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-1"><Label>Status</Label>
                                                <Select value={data.status} onValueChange={v => setData({ ...data, status: v as any })}>
                                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="Active">Operational (Active)</SelectItem>
                                                        <SelectItem value="Maintenance">Under Maintenance</SelectItem>
                                                        <SelectItem value="Offline">Offline / Decommissioned</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4 p-4 bg-white rounded-lg border shadow-sm">
                                        <h3 className="font-semibold text-sm flex items-center text-zinc-900"><Wrench className="w-4 h-4 mr-2" /> Technical Specs</h3>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="space-y-1"><Label>Manufacturer</Label><Input value={data.make} onChange={e => setData({ ...data, make: e.target.value })} /></div>
                                            <div className="space-y-1"><Label>Model</Label><Input value={data.model} onChange={e => setData({ ...data, model: e.target.value })} /></div>
                                            <div className="space-y-1 col-span-2"><Label>Serial Number</Label><Input value={data.serial} onChange={e => setData({ ...data, serial: e.target.value })} /></div>
                                            <div className="space-y-1"><Label>Install Date</Label><Input type="date" value={data.installDate} onChange={e => setData({ ...data, installDate: e.target.value })} /></div>
                                            <div className="space-y-1"><Label>Location</Label><Input value={data.location} onChange={e => setData({ ...data, location: e.target.value })} /></div>
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="schedules" className="m-0 max-w-4xl">
                                <div className="grid grid-cols-3 gap-6">
                                    {/* Existing Schedules List */}
                                    <div className="col-span-2 space-y-4">
                                        <h3 className="font-semibold text-sm text-zinc-700">Defined Schedules</h3>
                                        {data.schedules && data.schedules.length > 0 ? (
                                            <div className="grid gap-3">
                                                {data.schedules.map(sch => (
                                                    <div key={sch.id} className="bg-white p-4 rounded-lg border shadow-sm flex items-center justify-between group">
                                                        <div className="flex items-start gap-3">
                                                            <div className={`p-2 rounded-full ${sch.type === 'Calibration' ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'}`}>
                                                                <Clock className="w-5 h-5" />
                                                            </div>
                                                            <div>
                                                                <h4 className="font-semibold text-zinc-900">{sch.type}</h4>
                                                                <div className="text-sm text-zinc-500 flex items-center gap-3 mt-1">
                                                                    <span>Every {sch.frequencyDays} days</span>
                                                                    <span className="text-zinc-300">|</span>
                                                                    <span>Next: {sch.nextDue}</span>
                                                                    <span className="text-zinc-300">|</span>
                                                                    <Badge variant="outline" className="text-xs h-5 font-normal">{sch.assignedTo}</Badge>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => removeSchedule(sch.id)}>
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center p-8 border-2 border-dashed rounded-lg bg-white text-zinc-400">
                                                <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                                <p>No maintenance schedules defined.</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Add New Schedule Panel */}
                                    <div className="space-y-4">
                                        <h3 className="font-semibold text-sm text-zinc-700">Add Schedule Rule</h3>
                                        <Card className="border-none shadow-md">
                                            <CardContent className="p-4 space-y-3">
                                                <div className="space-y-1">
                                                    <Label>Type</Label>
                                                    <Select value={newSchedule.type} onValueChange={v => setNewSchedule({ ...newSchedule, type: v as any })}>
                                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="Calibration">Calibration</SelectItem>
                                                            <SelectItem value="Cleaning">Cleaning</SelectItem>
                                                            <SelectItem value="Inspection">Inspection</SelectItem>
                                                            <SelectItem value="Lubrication">Lubrication</SelectItem>
                                                            <SelectItem value="Replacement">Replacement</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="space-y-1">
                                                    <Label>Frequency (Days)</Label>
                                                    <Input type="number" min="1" value={newSchedule.frequencyDays} onChange={e => setNewSchedule({ ...newSchedule, frequencyDays: parseInt(e.target.value) })} />
                                                </div>
                                                <div className="space-y-1">
                                                    <Label>Assigned To</Label>
                                                    <Input placeholder="Role or Name" value={newSchedule.assignedTo} onChange={e => setNewSchedule({ ...newSchedule, assignedTo: e.target.value })} />
                                                </div>
                                                <Button className="w-full mt-2" onClick={addSchedule}>Add Schedule</Button>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="history" className="m-0 max-w-4xl space-y-4">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="font-semibold text-zinc-900">Equipment History</h3>
                                    <Button variant="outline" size="sm" onClick={() => { /* Export logic */ }}>
                                        <FileText className="w-4 h-4 mr-2" /> Export Audit Log
                                    </Button>
                                </div>
                                <div className="space-y-4">
                                    <div className="bg-white p-4 rounded-lg border shadow-sm">
                                        <h4 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-4">Calibration Drift Trend</h4>
                                        <div className="h-40 bg-slate-50 rounded flex items-end justify-between p-4 px-8 border-b border-l">
                                            {[49.8, 50.1, 49.9, 50.2, 49.7, 50.0, 50.1].map((val, i) => (
                                                <div key={i} className="flex flex-col items-center gap-2 group relative">
                                                    <div className="absolute bottom-full mb-1 bg-black text-white text-[10px] px-1 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                                        {val}g
                                                    </div>
                                                    <div
                                                        className="w-8 bg-blue-500 hover:bg-blue-600 rounded-t transition-all"
                                                        style={{ height: `${(val - 49) * 80}px` }}
                                                    />
                                                    <span className="text-[10px] text-zinc-400">Oct {10 + i}</span>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="text-center mt-2 text-xs text-zinc-400">Target: 50.0g</div>
                                    </div>

                                    <div className="divide-y border rounded-lg bg-white">
                                        <div className="p-3 bg-slate-50 text-xs font-semibold text-zinc-500 flex justify-between">
                                            <span>Date</span>
                                            <span>Activity</span>
                                            <span>Technician</span>
                                            <span>Result</span>
                                        </div>
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="p-3 text-sm flex justify-between items-center hover:bg-slate-50">
                                                <span className="text-zinc-600">2024-10-{20 - i}</span>
                                                <span className="font-medium">Weekly Calibration</span>
                                                <span>Tech A</span>
                                                <Badge variant="outline" className="text-green-600 bg-green-50 border-green-200">Passed</Badge>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </TabsContent>
                        </div>
                    </Tabs>
                </div>
            </Card>
        </motion.div>
    )
}
