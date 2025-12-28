'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Plus, FileText, Search, Edit, Copy, Archive } from 'lucide-react'

export default function ComplianceTemplatesPage() {
    const router = useRouter()
    const [loading, setLoading] = React.useState(true)
    const [templates, setTemplates] = React.useState<any[]>([])
    const [searchTerm, setSearchTerm] = React.useState('')
    const supabase = createClient()

    React.useEffect(() => {
        loadTemplates()
    }, [])

    async function loadTemplates() {
        try {
            const response = await fetch('/api/compliance/templates')
            if (response.ok) {
                const data = await response.json()
                setTemplates(data.templates || [])
            }
        } catch (error) {
            console.error('Error loading templates:', error)
        } finally {
            setLoading(false)
        }
    }

    const filteredTemplates = templates.filter(template =>
        template.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.category?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    function getStatusBadge(isActive: boolean) {
        return isActive ? (
            <Badge className="bg-green-500">Active</Badge>
        ) : (
            <Badge variant="secondary">Archived</Badge>
        )
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-lg">Loading templates...</div>
            </div>
        )
    }

    return (
        <div className="container mx-auto py-6 max-w-[1400px]">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div>
                    <h1 className="text-3xl font-bold">Compliance Templates</h1>
                    <p className="text-gray-600 mt-1">Manage audit checklist templates and versions</p>
                </div>
                <Button variant="premium">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Template
                </Button>
            </div>

            {/* Search */}
            <div className="flex gap-4 mb-6">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Search templates..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>
            </div>

            {/* Templates Grid */}
            <div className="grid gap-4">
                {filteredTemplates.length === 0 ? (
                    <Card>
                        <CardContent className="py-12 text-center">
                            <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                            <p className="text-gray-600">
                                {searchTerm ? 'No templates match your search.' : 'No templates found. Create your first template to get started.'}
                            </p>
                            <Button className="mt-4">
                                Create First Template
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    filteredTemplates.map((template) => (
                        <Card
                            key={template.id}
                            className="cursor-pointer hover:shadow-lg transition-all"
                        >
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <CardTitle className="text-lg flex items-center gap-2">
                                            <FileText className="h-5 w-5 text-[#0A3225]" />
                                            {template.name}
                                        </CardTitle>
                                        <CardDescription className="mt-1">
                                            Version {template.version} • {template.category}
                                        </CardDescription>
                                    </div>
                                    <div className="flex flex-col gap-2 items-end">
                                        {getStatusBadge(template.isActive)}
                                        <Badge variant="outline">{template.sections?.length || 0} Sections</Badge>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                                    <div>
                                        <p className="text-gray-500">Total Items</p>
                                        <p className="font-medium">
                                            {template.sections?.reduce((acc: number, section: any) =>
                                                acc + (section.items?.length || 0), 0) || 0}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">Created</p>
                                        <p className="font-medium">{new Date(template.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">Updated</p>
                                        <p className="font-medium">{new Date(template.updatedAt).toLocaleDateString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">Audits Used</p>
                                        <p className="font-medium">{template._count?.audits || 0}</p>
                                    </div>
                                </div>

                                {template.description && (
                                    <p className="text-sm text-gray-600 mb-4">{template.description}</p>
                                )}

                                <div className="flex gap-2">
                                    <Button size="sm" variant="outline">
                                        <Edit className="h-3 w-3 mr-1" />
                                        Edit
                                    </Button>
                                    <Button size="sm" variant="outline">
                                        <Copy className="h-3 w-3 mr-1" />
                                        Duplicate
                                    </Button>
                                    {template.isActive && (
                                        <Button size="sm" variant="ghost">
                                            <Archive className="h-3 w-3 mr-1" />
                                            Archive
                                        </Button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    )
}
