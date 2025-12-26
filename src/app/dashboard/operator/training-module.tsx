'use client'

import * as React from 'react'
import {
    Search, Filter, PlayCircle, BookOpen, Clock, Award,
    CheckCircle2, Lock, ChevronRight, Download, FileText,
    HelpCircle, ArrowLeft, Star, Share2, Award as CertificateIcon
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { motion, AnimatePresence } from 'framer-motion'
import { QuizEngine, SimulatorEngine } from './training-engines'

// --- TYPES ---
type Course = {
    id: string
    title: string
    category: 'Process' | 'Equipment' | 'QA'
    level: 'Beginner' | 'Intermediate' | 'Advanced'
    duration: string
    progress: number
    status: 'locked' | 'available' | 'in-progress' | 'completed'
    thumbnail: string
    description: string
    modules: Module[]
}

type Module = {
    id: string
    title: string
    type: 'video' | 'quiz' | 'simulation'
    duration: string
    completed: boolean
    videoUrl?: string
    quizQuestions?: {
        q: string
        options: string[]
        correct: number
        feedback?: string
    }[]
}

// --- MOCK DATA ---
const COURSES: Course[] = [
    {
        id: 'c1',
        title: 'Doser Calibration Masterclass',
        category: 'Process',
        level: 'Intermediate',
        duration: '45 min',
        progress: 35,
        status: 'in-progress',
        thumbnail: '/thumbnails/doser.jpg',
        description: 'Learn the precise steps to calibrate volumetric dosers for optimal fortification consistency.',
        modules: [
            { id: 'm1', title: 'Introduction to Volumetric Dosing', type: 'video', duration: '10:00', completed: true, videoUrl: '#' },
            { id: 'm2', title: 'Interactive Calibration Lab', type: 'simulation', duration: '15:00', completed: false },
            {
                id: 'm3', title: 'Calibration Knowledge Check', type: 'quiz', duration: '10:00', completed: false,
                quizQuestions: [
                    { q: 'How often should the doser be calibrated?', options: ['Daily', 'Weekly', 'Monthly'], correct: 0, feedback: 'Correct! Daily calibration ensures consistent fortification levels.' },
                    { q: 'What is the acceptable tolerance range?', options: ['+/- 2%', '+/- 5%', '+/- 10%'], correct: 1, feedback: 'Right. +/- 5% is the standard tolerance.' }
                ]
            }
        ]
    },
    {
        id: 'c2',
        title: 'Premix Handling & Storage',
        category: 'Process',
        level: 'Beginner',
        duration: '30 min',
        progress: 100,
        status: 'completed',
        thumbnail: '/thumbnails/premix.jpg',
        description: 'Best practices for storing and handling micronutrient premix to prevent degradation.',
        modules: []
    },
    {
        id: 'c3',
        title: 'QC: Iron Spot Test',
        category: 'QA',
        level: 'Advanced',
        duration: '60 min',
        progress: 0,
        status: 'available',
        thumbnail: '/thumbnails/lab.jpg',
        description: 'Master the semi-quantitative Iron Spot Test for rapid quality verification.',
        modules: []
    },
    {
        id: 'c4',
        title: 'Mixer Maintenance',
        category: 'Equipment',
        level: 'Intermediate',
        duration: '25 min',
        progress: 0,
        status: 'locked',
        thumbnail: '/thumbnails/mixer.jpg',
        description: 'Routine maintenance tasks to keep your continuous blender running smoothly.',
        modules: []
    }
]

// --- COMPONENTS ---

export function TrainingModule() {
    const [view, setView] = React.useState<'library' | 'player' | 'certificate'>('library')
    const [activeCourseId, setActiveCourseId] = React.useState<string | null>(null)
    const [searchQuery, setSearchQuery] = React.useState('')
    const [selectedCategory, setSelectedCategory] = React.useState('All')

    const activeCourse = COURSES.find(c => c.id === activeCourseId)

    const handleStartCourse = (id: string) => {
        setActiveCourseId(id)
        setView('player')
    }

    const filteredCourses = COURSES.filter(course => {
        const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory
        return matchesSearch && matchesCategory
    })

    return (
        <div className="space-y-6">
            <AnimatePresence mode='wait'>
                {view === 'library' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                        {/* Header & Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Card className="bg-gradient-to-br from-blue-600 to-blue-700 text-white border-none shadow-md">
                                <CardHeader className="pb-2"><CardDescription className="text-blue-100">My Progress</CardDescription></CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-bold">35%</div>
                                    <div className="text-sm text-blue-100 mt-1">Overall Completion</div>
                                    <Progress value={35} className="h-1.5 mt-3 bg-blue-900/30" />
                                </CardContent>
                            </Card>
                            <Card className="bg-white border-none shadow-sm">
                                <CardHeader className="pb-2"><CardDescription>Certifications</CardDescription></CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-bold text-gray-900">1</div>
                                    <div className="text-sm text-gray-500 mt-1">Earned this year</div>
                                </CardContent>
                            </Card>
                            <Card className="bg-white border-none shadow-sm">
                                <CardHeader className="pb-2"><CardDescription>Learning Hours</CardDescription></CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-bold text-gray-900">12.5</div>
                                    <div className="text-sm text-gray-500 mt-1">Total time spent</div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Search & Filter */}
                        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                            <div className="relative w-full md:w-96">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <Input
                                    placeholder="Search courses..."
                                    className="pl-10 bg-white"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full md:w-auto">
                                <TabsList className="bg-white border text-gray-500">
                                    <TabsTrigger value="All">All</TabsTrigger>
                                    <TabsTrigger value="Process">Process</TabsTrigger>
                                    <TabsTrigger value="Equipment">Equipment</TabsTrigger>
                                    <TabsTrigger value="QA">QA</TabsTrigger>
                                </TabsList>
                            </Tabs>
                        </div>

                        {/* Course Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {filteredCourses.map(course => (
                                <CourseCard key={course.id} course={course} onStart={() => handleStartCourse(course.id)} />
                            ))}
                        </div>
                    </motion.div>
                )}

                {view === 'player' && activeCourse && (
                    <CoursePlayer
                        course={activeCourse}
                        onBack={() => setView('library')}
                        onComplete={() => setView('certificate')}
                    />
                )}

                {view === 'certificate' && activeCourse && (
                    <CertificateView course={activeCourse} onBack={() => setView('library')} />
                )}
            </AnimatePresence>
        </div>
    )
}

function CourseCard({ course, onStart }: { course: Course, onStart: () => void }) {
    const isLocked = course.status === 'locked'
    const isCompleted = course.status === 'completed'

    return (
        <Card className={`overflow-hidden border-none shadow-sm hover:shadow-md transition-all group ${isLocked ? 'opacity-75' : ''}`}>
            <div className="h-40 bg-zinc-100 relative">
                {/* Mock Thumbnail Placeholder */}
                <div className="absolute inset-0 flex items-center justify-center text-gray-300">
                    <PlayCircle className="w-12 h-12" />
                </div>
                {/* Badges */}
                <div className="absolute top-3 left-3 flex gap-2">
                    <Badge variant="secondary" className="bg-white/90 backdrop-blur text-xs font-semibold">{course.category}</Badge>
                    <Badge variant="secondary" className="bg-black/50 text-white backdrop-blur text-xs">{course.level}</Badge>
                </div>
                {isCompleted && (
                    <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center backdrop-blur-[1px]">
                        <Badge className="bg-green-500 hover:bg-green-600 text-white text-md py-1 px-4 shadow-lg">Completed</Badge>
                    </div>
                )}
            </div>
            <CardContent className="p-5">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg text-gray-900 leading-tight line-clamp-2 min-h-[3rem]">{course.title}</h3>
                </div>
                <p className="text-sm text-gray-500 line-clamp-2 mb-4 h-10">{course.description}</p>

                <div className="space-y-4">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center gap-1"><Clock className="w-3 h-3" /> {course.duration}</div>
                        <div className="flex items-center gap-1"><BookOpen className="w-3 h-3" /> {course.modules.length > 0 ? `${course.modules.length} Modules` : 'Coming Soon'}</div>
                    </div>

                    <div className="space-y-1">
                        <div className="flex justify-between text-xs font-medium">
                            <span>Progress</span>
                            <span>{course.progress}%</span>
                        </div>
                        <Progress value={course.progress} className="h-1.5" />
                    </div>

                    <Button
                        size="sm"
                        className="w-full"
                        variant={isCompleted ? "outline" : "default"}
                        disabled={isLocked}
                        onClick={onStart}
                    >
                        {isLocked ? <><Lock className="w-4 h-4 mr-2" /> Locked</> :
                            isCompleted ? "Review Course" :
                                course.status === 'in-progress' ? "Continue Learning" : "Start Course"}
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}

function CoursePlayer({ course, onBack, onComplete }: { course: Course, onBack: () => void, onComplete: () => void }) {
    const [activeModuleIndex, setActiveModuleIndex] = React.useState(0)
    const activeModule = course.modules[activeModuleIndex]

    if (!activeModule) {
        return (
            <div className="flex flex-col items-center justify-center h-96 space-y-4">
                <div className="p-4 bg-gray-100 rounded-full"><BookOpen className="w-8 h-8 text-gray-400" /></div>
                <h3 className="text-xl font-medium text-gray-900">No Content Available</h3>
                <p className="text-gray-500">This course hasn't had any modules added yet.</p>
                <Button variant="outline" onClick={onBack}>Back to Library</Button>
            </div>
        )
    }

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="h-full flex flex-col xl:flex-row gap-6">
            {/* Left: Content Player */}
            <div className="flex-1 space-y-4">
                <div className="flex items-center gap-2 mb-2">
                    <Button variant="ghost" size="sm" onClick={onBack} px-0><ArrowLeft className="w-4 h-4 mr-2" /> Back to Library</Button>
                </div>

                <Card className="overflow-hidden border-none shadow-lg bg-zinc-950">
                    {activeModule.type === 'video' ? (
                        <div className="aspect-video bg-black flex items-center justify-center relative group">
                            <PlayCircle className="w-20 h-20 text-white/50 group-hover:text-white transition-colors cursor-pointer" />
                            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center text-white text-sm">
                                <span>02:14 / {activeModule.duration}</span>
                                <div className="flex gap-2">
                                    <Badge variant="outline" className="text-white border-white/20 cursor-pointer hover:bg-white/10">CC</Badge>
                                    <Badge variant="outline" className="text-white border-white/20 cursor-pointer hover:bg-white/10">1x</Badge>
                                </div>
                            </div>
                        </div>
                    ) : activeModule.type === 'simulation' ? (
                        <SimulatorEngine />
                    ) : (
                        <QuizEngine
                            questions={activeModule.quizQuestions || []}
                            onComplete={() => console.log('Quiz Done')} // In real app, update progress
                        />
                    )}
                </Card>

                <Tabs defaultValue="overview">
                    <TabsList>
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="resources">Resources</TabsTrigger>
                        <TabsTrigger value="notes">My Notes</TabsTrigger>
                    </TabsList>
                    <TabsContent value="overview" className="p-4 bg-white/50 rounded-lg border border-white/20">
                        <h2 className="text-xl font-bold mb-2">{activeModule.title}</h2>
                        <p className="text-gray-600">
                            In this module, we will cover the essential procedures for calibrating the volumetric doser.
                            Ensure you have your calibration checklist ready.
                        </p>
                    </TabsContent>
                    <TabsContent value="resources" className="space-y-2">
                        <Button variant="outline" className="w-full justify-start"><FileText className="w-4 h-4 mr-2" /> Calibration Checklist.pdf</Button>
                        <Button variant="outline" className="w-full justify-start"><FileText className="w-4 h-4 mr-2" /> Doser Manual v2.pdf</Button>
                    </TabsContent>
                    <TabsContent value="notes">
                        <div className="p-4 text-center text-gray-500 italic">No notes taken yet.</div>
                    </TabsContent>
                </Tabs>
            </div>

            {/* Right: Playlist / Syllabus */}
            <div className="w-full xl:w-96 space-y-4">
                <Card className="border-none shadow-sm h-full">
                    <CardHeader>
                        <CardTitle className="text-lg">Course Content</CardTitle>
                        <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
                            <span>{course.modules.filter(m => m.completed).length} / {course.modules.length} Completed</span>
                            <span>{course.progress}%</span>
                        </div>
                        <Progress value={course.progress} className="h-1 mt-2" />
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="divide-y">
                            {course.modules.map((mod, i) => (
                                <button
                                    key={mod.id}
                                    onClick={() => setActiveModuleIndex(i)}
                                    className={`w-full text-left p-4 flex items-start gap-3 hover:bg-gray-50 transition-colors ${i === activeModuleIndex ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''}`}
                                >
                                    <div className={`mt-0.5 ${mod.completed ? 'text-green-500' : i === activeModuleIndex ? 'text-blue-500' : 'text-gray-300'}`}>
                                        {mod.completed ? <CheckCircle2 className="w-5 h-5" /> :
                                            mod.type === 'video' ? <PlayCircle className="w-5 h-5" /> : <HelpCircle className="w-5 h-5" />}
                                    </div>
                                    <div>
                                        <h4 className={`text-sm font-medium ${i === activeModuleIndex ? 'text-blue-700' : 'text-gray-700'}`}>{mod.title}</h4>
                                        <span className="text-xs text-gray-500">{mod.duration}</span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </CardContent>
                    <CardFooter className="p-4 bg-gray-50">
                        {course.progress === 100 ? (
                            <Button className="w-full bg-green-600 hover:bg-green-700 text-white" onClick={onComplete}>
                                <CertificateIcon className="w-4 h-4 mr-2" /> View Certificate
                            </Button>
                        ) : (
                            <Button className="w-full" disabled>
                                Not Complete
                            </Button>
                        )}
                    </CardFooter>
                </Card>
            </div>
        </motion.div>
    )
}

function CertificateView({ course, onBack }: { course: Course, onBack: () => void }) {
    return (
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center justify-center p-12">
            <div className="mb-8 text-center">
                <div className="inline-flex p-4 bg-green-100 text-green-600 rounded-full mb-4">
                    <Award className="w-16 h-16" />
                </div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">Congratulations!</h1>
                <p className="text-xl text-gray-600">You have successfully completed <strong>{course.title}</strong></p>
            </div>

            <Card className="w-full max-w-3xl bg-white border-4 border-double border-orange-200 p-12 shadow-xl relative mb-8">
                <div className="text-center space-y-8">
                    <div className="text-4xl font-serif text-gray-800">Certificate of Completion</div>
                    <div className="text-gray-500 uppercase tracking-widest text-sm">This certifies that</div>
                    <div className="text-3xl font-bold text-blue-900 font-serif italic">John A. Operator</div>
                    <div className="text-gray-500 uppercase tracking-widest text-sm">has demonstrated mastery in</div>
                    <div className="text-2xl font-bold text-gray-800">{course.title}</div>
                    <div className="flex justify-between items-end pt-12 px-12">
                        <div className="text-center">
                            <div className="border-t border-gray-400 w-48 pt-2">Date</div>
                            <div className="font-mono text-sm">{new Date().toLocaleDateString()}</div>
                        </div>
                        <div className="w-24 h-24 opacity-20">
                            <Award className="w-full h-full text-orange-900" />
                        </div>
                        <div className="text-center">
                            <div className="border-t border-gray-400 w-48 pt-2">Authorized Signature</div>
                            <div className="font-serif italic text-lg">FortiMIS Director</div>
                        </div>
                    </div>
                </div>
            </Card>

            <div className="flex gap-4">
                <Button variant="outline" onClick={onBack}><ArrowLeft className="w-4 h-4 mr-2" /> Back to Courses</Button>
                <Button><Download className="w-4 h-4 mr-2" /> Download PDF</Button>
                <Button variant="secondary"><Share2 className="w-4 h-4 mr-2" /> Share</Button>
            </div>
        </motion.div>
    )
}
