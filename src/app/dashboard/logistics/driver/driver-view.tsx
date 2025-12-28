'use client'

import * as React from 'react'
import {
    Truck, MapPin, Package, Phone, Navigation, Camera,
    CheckCircle2, ChevronRight, User, X, LogOut, PenTool
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'

// --- MOCK DATA ---
const DRIVERS = [
    { id: 'd1', name: 'John Doe', vehicle: 'Van 304' },
    { id: 'd2', name: 'Sarah Smith', vehicle: 'Truck 10' },
]

const MOCK_TASKS = [
    {
        id: 'del-101',
        customer: 'Green Valley Bakery',
        address: '123 Main St, Springfield',
        items: ['20x 25kg Maize Flour', '5x 50kg Sugar'],
        status: 'pending', // pending, transit, delivered
        eta: '10:30 AM',
        phone: '+254 712 345 678',
        coords: { lat: -1.2921, lng: 36.8219 }
    },
    {
        id: 'del-102',
        customer: 'Highland Supermarket',
        address: '45 Lake Rd, Kisumu',
        items: ['50x 2kg Rice Packs'],
        status: 'pending',
        eta: '2:00 PM',
        phone: '+254 722 987 654',
        coords: { lat: -0.0917, lng: 34.7680 }
    }
]

export function DriverView() {
    const [user, setUser] = React.useState<any>(null)
    const [view, setView] = React.useState<'login' | 'list' | 'detail' | 'pod'>('login')
    const [tasks, setTasks] = React.useState(MOCK_TASKS)
    const [activeTask, setActiveTask] = React.useState<any>(null)
    const [podData, setPodData] = React.useState<{ sig?: boolean, photo?: boolean }>({})

    // --- ACTIONS ---
    const handleLogin = (driverId: string) => {
        const driver = DRIVERS.find(d => d.id === driverId)
        if (driver) {
            setUser(driver)
            setView('list')
        }
    }

    const updateStatus = (taskId: string, status: string) => {
        setTasks(tasks.map(t => t.id === taskId ? { ...t, status } : t))
        // If completing, move to POD view or back to list
        if (status === 'delivered') {
            setView('list')
            setActiveTask(null)
        }
    }

    const startTrip = (task: any) => {
        updateStatus(task.id, 'transit')
    }

    const completeTrip = () => {
        setView('pod')
    }

    const submitPod = () => {
        updateStatus(activeTask.id, 'delivered')
        setPodData({})
    }

    // --- VIEWS ---

    if (view === 'login') {
        return (
            <div className="h-full flex flex-col items-center justify-center p-6 bg-slate-900 text-white min-h-screen">
                <Truck className="w-16 h-16 text-blue-500 mb-6" />
                <h1 className="text-3xl font-bold mb-2">Fortymis Logistics</h1>
                <p className="text-slate-400 mb-8">Driver Companion App v1.0</p>
                <div className="w-full space-y-4">
                    {DRIVERS.map(d => (
                        <Button
                            key={d.id}
                            variant="outline"
                            className="w-full text-lg h-14 justify-start px-4 text-slate-900 bg-white border-none hover:bg-slate-100"
                            onClick={() => handleLogin(d.id)}
                        >
                            <User className="w-5 h-5 mr-3 text-slate-500" />
                            {d.name} <span className="ml-auto text-xs text-slate-400 font-normal">{d.vehicle}</span>
                        </Button>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="h-screen flex flex-col bg-slate-50 relative">
            {/* Header */}
            <div className="bg-slate-900 text-white p-4 shadow-md shrink-0 z-10">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#0A3225] flex items-center justify-center font-bold">
                            {user.name.charAt(0)}
                        </div>
                        <div>
                            <h2 className="font-semibold leading-tight">{user.name}</h2>
                            <p className="text-xs text-slate-400">{user.vehicle} • Online</p>
                        </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => setView('login')}>
                        <LogOut className="w-5 h-5 text-slate-400" />
                    </Button>
                </div>
            </div>

            {/* List View */}
            {view === 'list' && (
                <ScrollArea className="flex-1 p-4">
                    <h3 className="font-bold text-lg text-slate-900 mb-4 flex items-center justify-between">
                        Today's Route
                        <Badge variant="secondary">{tasks.filter(t => t.status !== 'delivered').length} Left</Badge>
                    </h3>
                    <div className="space-y-4 pb-20">
                        {tasks.map((task, i) => (
                            <Card
                                key={task.id}
                                className={`border-none shadow-sm cursor-pointer transition-transform active:scale-[0.98] ${task.status === 'delivered' ? 'opacity-60 bg-slate-100' : 'bg-white'}`}
                                onClick={() => { setActiveTask(task); setView('detail') }}
                            >
                                <CardContent className="p-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <Badge variant={task.status === 'delivered' ? 'secondary' : task.status === 'transit' ? 'default' : 'outline'} className={task.status === 'transit' ? 'bg-[#0A3225] animate-pulse' : ''}>
                                            {task.status === 'transit' ? 'In Transit' : task.status}
                                        </Badge>
                                        <span className="text-xs font-mono text-slate-500">{task.eta}</span>
                                    </div>
                                    <h4 className="font-bold text-slate-900 text-lg mb-1">{task.customer}</h4>
                                    <div className="flex items-start gap-2 text-slate-600 text-sm mb-3">
                                        <MapPin className="w-4 h-4 shrink-0 mt-0.5 text-blue-500" />
                                        {task.address}
                                    </div>
                                    <div className="text-xs text-slate-400 flex items-center gap-2">
                                        <Package className="w-3 h-3" />
                                        {task.items.length} Items
                                        <span className="w-1 h-1 rounded-full bg-slate-300 mx-1" />
                                        #{i + 1} of {tasks.length}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </ScrollArea>
            )}

            {/* Detail View */}
            {view === 'detail' && activeTask && (
                <div className="flex-1 flex flex-col h-full overflow-hidden">
                    <div className="flex-1 overflow-y-auto p-4 space-y-6">
                        <Button variant="ghost" className="mb-2 pl-0 hover:bg-transparent" onClick={() => setView('list')}>
                            <ChevronRight className="w-5 h-5 rotate-180 mr-1" /> Back to list
                        </Button>

                        <div>
                            <Badge variant={activeTask.status === 'transit' ? 'default' : 'outline'} className="mb-2 bg-[#0A3225]/10 text-[#0A3225] hover:bg-[#0A3225]/10 border-none">
                                {activeTask.status === 'transit' ? '● Live Trip' : 'Pending'}
                            </Badge>
                            <h2 className="text-2xl font-bold text-slate-900 leading-tight">{activeTask.customer}</h2>
                            <p className="text-slate-500 mt-1">{activeTask.address}</p>
                        </div>

                        {/* Map Placeholder */}
                        <div className="aspect-video bg-slate-200 rounded-xl relative overflow-hidden flex items-center justify-center border-2 border-white shadow-sm">
                            <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/36.8219,-1.2921,13,0/600x400?access_token=pk.mock')] opacity-20 bg-center bg-cover" />
                            <div className="text-center relative z-10">
                                <Navigation className="w-10 h-10 text-[#0A3225] mx-auto mb-2" />
                                <p className="text-xs font-semibold text-slate-600">Turn-by-turn Navigation</p>
                            </div>
                        </div>

                        {/* Order Details */}
                        <div className="space-y-3">
                            <h3 className="font-semibold text-slate-900 border-b pb-2">Order Items</h3>
                            {activeTask.items.map((item: string, i: number) => (
                                <div key={i} className="flex items-center gap-3 p-3 bg-white rounded-lg border shadow-sm">
                                    <div className="w-8 h-8 rounded bg-[#0A3225]/5 flex items-center justify-center text-[#0A3225] font-bold text-xs">{i + 1}</div>
                                    <span className="text-sm font-medium">{item}</span>
                                </div>
                            ))}
                        </div>

                        {/* Actions */}
                        <div className="flex gap-4">
                            <Button variant="outline" className="flex-1 h-12 text-slate-700 border-slate-300">
                                <Phone className="w-4 h-4 mr-2" /> Call
                            </Button>
                            <Button variant="outline" className="flex-1 h-12 text-[#0A3225] border-[#0A3225]/20 bg-[#0A3225]/5" onClick={() => window.alert("Maps app would open here")}>
                                <Navigation className="w-4 h-4 mr-2" /> Map
                            </Button>
                        </div>
                    </div>

                    <div className="p-4 bg-white border-t safe-area-bottom">
                        {activeTask.status === 'pending' ? (
                            <Button className="w-full h-14 text-lg bg-green-600 hover:bg-green-700 shadow-lg shadow-green-200" onClick={() => startTrip(activeTask)}>
                                START TRIP
                                <Navigation className="w-5 h-5 ml-2" />
                            </Button>
                        ) : activeTask.status === 'transit' ? (
                            <Button className="w-full h-14 text-lg bg-[#0A3225] hover:bg-[#0A3225] shadow-lg shadow-blue-200" onClick={completeTrip}>
                                COMPLETE DELIVERY
                                <CheckCircle2 className="w-5 h-5 ml-2" />
                            </Button>
                        ) : (
                            <Button disabled className="w-full h-14">Delivered</Button>
                        )}
                    </div>
                </div>
            )}

            {/* POD View */}
            {view === 'pod' && (
                <div className="flex-1 flex flex-col p-6 space-y-8 bg-white min-h-screen">
                    <div className="text-center pt-8">
                        <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold">Proof of Delivery</h2>
                        <p className="text-slate-500">Collect signature to complete.</p>
                    </div>

                    <div className="space-y-6 flex-1">
                        <div
                            className={`h-48 border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-colors ${podData.sig ? 'bg-[#0A3225]/5 border-[#0A3225]/30' : 'bg-slate-50 border-slate-300'}`}
                            onClick={() => setPodData({ ...podData, sig: true })}
                        >
                            {podData.sig ? (
                                <div className="text-[#0A3225] font-handwriting text-4xl rotate-[-10deg]">John Doe</div>
                            ) : (
                                <>
                                    <PenTool className="w-8 h-8 text-slate-400 mb-2" />
                                    <span className="text-sm font-medium text-slate-500">Tap to Sign</span>
                                </>
                            )}
                        </div>

                        <div
                            className={`h-32 border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-colors ${podData.photo ? 'bg-green-50 border-green-300' : 'bg-slate-50 border-slate-300'}`}
                            onClick={() => setPodData({ ...podData, photo: true })}
                        >
                            {podData.photo ? (
                                <div className="flex items-center gap-2 text-green-700 font-semibold"><CheckCircle2 className="w-5 h-5" /> Photo Attached</div>
                            ) : (
                                <>
                                    <Camera className="w-8 h-8 text-slate-400 mb-2" />
                                    <span className="text-sm font-medium text-slate-500">Add Photo (Optional)</span>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="space-y-3 pb-8">
                        <Button
                            className="w-full h-14 text-lg"
                            disabled={!podData.sig}
                            onClick={submitPod}
                        >
                            Confirm Delivery
                        </Button>
                        <Button variant="ghost" className="w-full text-slate-400" onClick={() => setView('detail')}>Cancel</Button>
                    </div>
                </div>
            )}
        </div>
    )
}
