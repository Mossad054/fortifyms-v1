'use client'

import * as React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ComplianceTemplates } from './compliance-templates'
import { ComplianceMonitoring } from './compliance-monitoring'
import { BookOpen, Activity } from 'lucide-react'

export function ComplianceView() {
    return (
        <Tabs defaultValue="monitoring" className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-zinc-900">Compliance & Regulatory Oversight</h2>
                    <p className="text-zinc-500 text-sm">Manage national standards and monitor enforcement.</p>
                </div>
                <TabsList className="bg-white border">
                    <TabsTrigger value="monitoring" className="data-[state=active]:bg-zinc-100">
                        <Activity className="w-4 h-4 mr-2" /> Oversight Dashboard
                    </TabsTrigger>
                    <TabsTrigger value="standards" className="data-[state=active]:bg-zinc-100">
                        <BookOpen className="w-4 h-4 mr-2" /> Standards Library
                    </TabsTrigger>
                </TabsList>
            </div>

            <TabsContent value="monitoring">
                <ComplianceMonitoring />
            </TabsContent>

            <TabsContent value="standards">
                <ComplianceTemplates />
            </TabsContent>
        </Tabs>
    )
}
