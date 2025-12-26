'use client'

import * as React from 'react'
import {
    Settings, PlayCircle, CheckCircle2, AlertTriangle, HelpCircle,
    ChevronRight, ChevronLeft, Save, RefreshCw, BookOpen, PenTool,
    Thermometer, Activity, ArrowRight, XCircle, RotateCcw, ArrowLeft
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { motion, AnimatePresence } from 'framer-motion'

// --- TYPES ---
type DiagnosticQuestion = {
    id: string
    type: 'yes_no' | 'range' | 'numeric'
    text: string
    help?: string
    target?: string
    min?: number
    max?: number
    targetRange?: [number, number]
    targetValue?: number
    tolerance?: number
}

// --- DIAGNOSTICS VIEW ---
import { DiagnosticModule } from './diagnostic-module'

export function DiagnosticsView({ onNavigateToMaintenance }: { onNavigateToMaintenance?: () => void }) {
    return <DiagnosticModule onLaunchCalibration={onNavigateToMaintenance} />
}

// --- MAINTENANCE VIEW ---
import { MaintenanceModule } from './maintenance-module'

export function MaintenanceView(props: any) {
    return <MaintenanceModule {...props} />
}

// --- TRAINING VIEW ---
import { TrainingModule } from './training-module'

export function TrainingView() {
    return <TrainingModule />
}
