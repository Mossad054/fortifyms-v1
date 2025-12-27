'use client'

import * as React from 'react'
import {
    Search, BookOpen, Clock,
    CheckCircle2, Lock, PlayCircle,
    UserPlus, Users, Building2, Send
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription
} from '@/components/ui/dialog'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'

// --- TYPES ---
type Course = {
    id: string
    title: string
    category: 'Process' | 'Equipment' | 'QA'
    level: 'Beginner' | 'Intermediate' | 'Advanced'
    duration: string
    thumbnail: string
    description: string
    enrolledMills: number
}

// --- MOCK DATA ---
const COURSES: Course[] = [
    {
        id: 'c1',
        title: 'Doser Calibration Masterclass',
        category: 'Process',
        level: 'Intermediate',
        duration: '45 min',
        thumbnail: '/thumbnails/doser.jpg',
        description: 'Learn the precise steps to calibrate volumetric dosers for optimal fortification consistency.',
        enrolledMills: 12
    },
    {
        id: 'c2',
        title: 'Premix Handling & Storage',
        category: 'Process',
        level: 'Beginner',
        duration: '30 min',
        thumbnail: '/thumbnails/premix.jpg',
        description: 'Best practices for storing and handling micronutrient premix to prevent degradation.',
        enrolledMills: 24
    },
    {
        id: 'c3',
        title: 'QC: Iron Spot Test',
        category: 'QA',
        level: 'Advanced',
        duration: '60 min',
        thumbnail: '/thumbnails/lab.jpg',
        description: 'Master the semi-quantitative Iron Spot Test for rapid quality verification.',
        enrolledMills: 8
    },
]

const ASSIGNED_TRAININGS = [
    { id: 'AT-001', courseTitle: 'Doser Calibration Masterclass', millName: 'Nairobi Millers Ltd', assignedDate: '2024-12-20', status: 'not_started', progress: 0 },
    { id: 'AT-002', courseTitle: 'Premix Handling & Storage', millName: 'Mombasa Flour Mills', assignedDate: '2024-12-18', status: 'in_progress', progress: 45 },
    { id: 'AT-003', courseTitle: 'QC: Iron Spot Test', millName: 'Kampala Grains', assignedDate: '2024-12-15', status: 'completed', progress: 100 },
]

export function TrainingRollout() {
    const [activeTab, setActiveTab] = React.useState('library')
    const [searchQuery, setSearchQuery] = React.useState('')
    const [selectedCourse, setSelectedCourse] = React.useState<Course | null>(null)
    const [showAssignDialog, setShowAssignDialog] = React.useState(false)

    const filteredCourses = COURSES.filter(course =>
        course.title.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const handleRolloutClick = (course: Course) => {
        setSelectedCourse(course)
        setShowAssignDialog(true)
    }

    const handleAssign = () => {
        // Logic to assign course
        setShowAssignDialog(false)
        alert(`Assigned "${selectedCourse?.title}" successfully!`)
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Training Management</h2>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList>
                    <TabsTrigger value="library">Course Library</TabsTrigger>
                    <TabsTrigger value="active">Active Rollouts</TabsTrigger>
                </TabsList>

                {/* COURSE LIBRARY TAB */}
                <TabsContent value="library" className="space-y-6">
                    <div className="flex gap-4">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input
                                placeholder="Search training modules..."
                                className="pl-10"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredCourses.map(course => (
                            <Card key={course.id} className="overflow-hidden hover:shadow-md transition-all">
                                <div className="h-40 bg-zinc-100 relative flex items-center justify-center">
                                    {/* Placeholder styling */}
                                    <BookOpen className="w-12 h-12 text-zinc-300" />
                                    <div className="absolute top-3 left-3 flex gap-2">
                                        <Badge variant="secondary" className="bg-white/90 backdrop-blur">{course.category}</Badge>
                                        <Badge variant="secondary" className="bg-black/50 text-white backdrop-blur">{course.level}</Badge>
                                    </div>
                                </div>
                                <CardContent className="p-5">
                                    <h3 className="font-bold text-lg mb-2">{course.title}</h3>
                                    <p className="text-sm text-gray-500 line-clamp-2 mb-4 h-10">{course.description}</p>
                                    <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                                        <div className="flex items-center gap-1"><Clock className="w-3 h-3" /> {course.duration}</div>
                                        <div className="flex items-center gap-1"><Building2 className="w-3 h-3" /> {course.enrolledMills} Mills Enrolled</div>
                                    </div>
                                    <Button className="w-full" onClick={() => handleRolloutClick(course)}>
                                        <UserPlus className="w-4 h-4 mr-2" />
                                        Roll Out to Mill
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                {/* ACTIVE ROLLOUTS TAB */}
                <TabsContent value="active">
                    <Card>
                        <CardHeader>
                            <CardTitle>Training Status Overview</CardTitle>
                            <CardDescription>Track completion rates across assigned mills</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {ASSIGNED_TRAININGS.map(training => (
                                    <div key={training.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <h4 className="font-semibold">{training.courseTitle}</h4>
                                                <Badge variant="outline" className="text-xs">{training.id}</Badge>
                                            </div>
                                            <p className="text-sm text-gray-500 flex items-center gap-2">
                                                <Building2 className="w-3 h-3" />
                                                {training.millName}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-6">
                                            <div className="w-32">
                                                <div className="flex justify-between text-xs mb-1">
                                                    <span>Progress</span>
                                                    <span>{training.progress}%</span>
                                                </div>
                                                <Progress value={training.progress} className="h-1.5" />
                                            </div>
                                            <Badge className={
                                                training.status === 'completed' ? 'bg-green-100 text-green-700' :
                                                    training.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                                                        'bg-gray-100 text-gray-700'
                                            }>
                                                {training.status === 'completed' ? 'Completed' :
                                                    training.status === 'in_progress' ? 'In Progress' : 'Not Started'}
                                            </Badge>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Assign Dialog */}
            <Dialog open={showAssignDialog} onOpenChange={setShowAssignDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Roll Out Training</DialogTitle>
                        <DialogDescription>
                            Assign <strong>{selectedCourse?.title}</strong> to a specific mill or user group.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Select Mill</Label>
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a mill..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="mill1">Nairobi Millers Ltd</SelectItem>
                                    <SelectItem value="mill2">Mombasa Flour Mills</SelectItem>
                                    <SelectItem value="mill3">Kampala Grains</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Due Date (Optional)</Label>
                            <Input type="date" />
                        </div>
                        <div className="space-y-2">
                            <Label>Priority</Label>
                            <Select defaultValue="normal">
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="low">Low</SelectItem>
                                    <SelectItem value="normal">Normal</SelectItem>
                                    <SelectItem value="high">High (Mandatory)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowAssignDialog(false)}>Cancel</Button>
                        <Button onClick={handleAssign}>
                            <Send className="w-4 h-4 mr-2" />
                            Assign Training
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
