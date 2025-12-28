'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import {
    AlertTriangle, Clock, FileText, Package, Search,
    Filter, ChevronRight, MessageSquare, AlertCircle
} from 'lucide-react'
import { PendingReview, MOCK_PENDING_REVIEWS } from '../types'

export function PendingReviewsQueue() {
    const router = useRouter()
    const [reviews, setReviews] = React.useState<PendingReview[]>(MOCK_PENDING_REVIEWS)
    const [filterType, setFilterType] = React.useState<string>('all')
    const [filterRisk, setFilterRisk] = React.useState<string>('all')
    const [searchQuery, setSearchQuery] = React.useState('')

    // Filter logic
    const filteredReviews = reviews.filter(review => {
        const matchesType = filterType === 'all' || review.type === filterType
        const matchesRisk = filterRisk === 'all' || review.riskLevel === filterRisk
        const matchesSearch = searchQuery === '' ||
            review.millName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            review.summary.toLowerCase().includes(searchQuery.toLowerCase())

        return matchesType && matchesRisk && matchesSearch
    })

    // Sort by priority: Critical first, then by days outstanding
    const sortedReviews = filteredReviews.sort((a, b) => {
        const riskPriority = { critical: 3, major: 2, minor: 1 }
        if (riskPriority[a.riskLevel] !== riskPriority[b.riskLevel]) {
            return riskPriority[b.riskLevel] - riskPriority[a.riskLevel]
        }
        return b.daysOutstanding - a.daysOutstanding
    })

    const getRiskColor = (risk: string) => {
        switch (risk) {
            case 'critical': return 'bg-red-100 text-red-700 border-red-200'
            case 'major': return 'bg-orange-100 text-orange-700 border-orange-200'
            case 'minor': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
            default: return 'bg-gray-100 text-gray-700 border-gray-200'
        }
    }

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'audit_submission': return FileText
            case 'corrective_action': return AlertTriangle
            case 'verification_batch': return Package
            default: return FileText
        }
    }

    const getTypeLabel = (type: string) => {
        switch (type) {
            case 'audit_submission': return 'Audit Submission'
            case 'corrective_action': return 'Corrective Action'
            case 'verification_batch': return 'Verification Batch'
            default: return type
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'awaiting_review': return 'bg-[#0A3225]/10 text-[#0A3225]'
            case 'clarification_requested': return 'bg-yellow-100 text-yellow-700'
            case 'escalated': return 'bg-orange-100 text-orange-700'
            default: return 'bg-gray-100 text-gray-700'
        }
    }

    const handleRequestClarification = (reviewId: string) => {
        console.log('Request clarification for:', reviewId)
        // TODO: API call
    }

    const handleEscalate = (reviewId: string) => {
        console.log('Escalate review:', reviewId)
        // TODO: Open escalation modal
    }

    return (
        <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="border-l-4 border-l-red-500">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Critical</p>
                                <p className="text-3xl font-bold text-red-600">
                                    {reviews.filter(r => r.riskLevel === 'critical').length}
                                </p>
                            </div>
                            <AlertCircle className="w-10 h-10 text-red-500" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-orange-500">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Major</p>
                                <p className="text-3xl font-bold text-orange-600">
                                    {reviews.filter(r => r.riskLevel === 'major').length}
                                </p>
                            </div>
                            <AlertTriangle className="w-10 h-10 text-orange-500" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-yellow-500">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Minor</p>
                                <p className="text-3xl font-bold text-yellow-600">
                                    {reviews.filter(r => r.riskLevel === 'minor').length}
                                </p>
                            </div>
                            <Clock className="w-10 h-10 text-yellow-500" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-blue-500">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Total Pending</p>
                                <p className="text-3xl font-bold text-[#0A3225]">{reviews.length}</p>
                            </div>
                            <FileText className="w-10 h-10 text-blue-500" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card className="glass-card border-none shadow-sm">
                <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                                placeholder="Search by mill name or summary..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <Select value={filterType} onValueChange={setFilterType}>
                            <SelectTrigger className="w-full md:w-[200px]">
                                <SelectValue placeholder="Filter by type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Types</SelectItem>
                                <SelectItem value="audit_submission">Audit Submissions</SelectItem>
                                <SelectItem value="corrective_action">Corrective Actions</SelectItem>
                                <SelectItem value="verification_batch">Verification Batches</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={filterRisk} onValueChange={setFilterRisk}>
                            <SelectTrigger className="w-full md:w-[200px]">
                                <SelectValue placeholder="Filter by risk" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Risk Levels</SelectItem>
                                <SelectItem value="critical">Critical</SelectItem>
                                <SelectItem value="major">Major</SelectItem>
                                <SelectItem value="minor">Minor</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Reviews List */}
            <div className="space-y-3">
                {sortedReviews.length === 0 ? (
                    <Card className="glass-card border-none shadow-sm">
                        <CardContent className="p-12 text-center">
                            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No pending reviews</h3>
                            <p className="text-sm text-gray-500">All reviews have been processed</p>
                        </CardContent>
                    </Card>
                ) : (
                    sortedReviews.map(review => {
                        const TypeIcon = getTypeIcon(review.type)
                        return (
                            <Card
                                key={review.id}
                                className={`glass-card border-none shadow-sm hover:shadow-md transition-all cursor-pointer ${review.riskLevel === 'critical' ? 'border-l-4 border-l-red-500' :
                                        review.riskLevel === 'major' ? 'border-l-4 border-l-orange-500' :
                                            'border-l-4 border-l-yellow-500'
                                    }`}
                                onClick={() => router.push(`/dashboard/inspector/review/${review.id}`)}
                            >
                                <CardContent className="p-5">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex items-start gap-3 flex-1">
                                            <div className={`p-2 rounded-lg ${review.riskLevel === 'critical' ? 'bg-red-50' :
                                                    review.riskLevel === 'major' ? 'bg-orange-50' :
                                                        'bg-yellow-50'
                                                }`}>
                                                <TypeIcon className={`w-5 h-5 ${review.riskLevel === 'critical' ? 'text-red-600' :
                                                        review.riskLevel === 'major' ? 'text-orange-600' :
                                                            'text-yellow-600'
                                                    }`} />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <h4 className="font-bold text-gray-900">{review.millName}</h4>
                                                    <Badge variant="outline" className="font-mono text-xs">
                                                        {review.id}
                                                    </Badge>
                                                    <Badge className={getRiskColor(review.riskLevel)}>
                                                        {review.riskLevel.toUpperCase()}
                                                    </Badge>
                                                    <Badge variant="outline">
                                                        {getTypeLabel(review.type)}
                                                    </Badge>
                                                </div>
                                                <p className="text-sm text-gray-600 mb-2">{review.summary}</p>
                                                <div className="flex items-center gap-4 text-xs text-gray-500">
                                                    <span className="flex items-center gap-1">
                                                        📍 {review.region}, {review.country}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Clock className="w-3 h-3" />
                                                        {review.daysOutstanding} days outstanding
                                                    </span>
                                                    {review.deadline && (
                                                        <span className="flex items-center gap-1 text-red-600 font-medium">
                                                            ⏰ Deadline: {new Date(review.deadline).toLocaleDateString()}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <Badge className={getStatusColor(review.status)}>
                                            {review.status.replace('_', ' ').toUpperCase()}
                                        </Badge>
                                    </div>
                                    <div className="flex gap-2 mt-4">
                                        <Button
                                            size="sm"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                router.push(`/dashboard/inspector/review/${review.id}`)
                                            }}
                                        >
                                            Open Review
                                            <ChevronRight className="w-4 h-4 ml-1" />
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                handleRequestClarification(review.id)
                                            }}
                                        >
                                            <MessageSquare className="w-4 h-4 mr-1" />
                                            Request Clarification
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="text-orange-600 border-orange-300 hover:bg-orange-50"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                handleEscalate(review.id)
                                            }}
                                        >
                                            <AlertTriangle className="w-4 h-4 mr-1" />
                                            Escalate
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })
                )}
            </div>
        </div>
    )
}
