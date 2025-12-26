'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Camera, MapPin, Clock, Trash2, FileIcon, Loader2 } from 'lucide-react'
import { Evidence } from '@/lib/types/evidence'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'

interface EvidenceUploadProps {
    itemId: string
    auditId: string
    existingEvidence?: Evidence[]
    onUpload: (evidence: Evidence) => void
    onDelete: (id: string) => void
}

export function EvidenceUpload({ itemId, auditId, existingEvidence = [], onUpload, onDelete }: EvidenceUploadProps) {
    const [isUploading, setIsUploading] = React.useState(false)

    const handleSimulatedUpload = async () => {
        setIsUploading(true)
        // Simulate network delay and metadata capture
        await new Promise(resolve => setTimeout(resolve, 1500))

        const newEvidence: Evidence = {
            id: `EV-${Math.random().toString(36).substr(2, 9)}`,
            url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158', // Placeholder for actual upload
            type: 'Photo',
            itemId,
            auditId,
            uploadedAt: new Date().toISOString(),
            uploadedBy: 'Inspector-M001',
            metadata: {
                geolocation: {
                    lat: -1.2921,
                    lng: 36.8219
                },
                device: 'iPhone 15 Pro • iOS 17.4',
                hash: 'sha256-abc123xyz' // Simulated for legal defensibility
            }
        }

        onUpload(newEvidence)
        setIsUploading(false)
        toast.success("Evidence Captured", {
            description: "GPS & Timestamp metadata locked."
        })
    }

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap gap-3">
                {existingEvidence.map((ev) => (
                    <div key={ev.id} className="relative group w-32 h-32 rounded-lg overflow-hidden border">
                        <img src={ev.url} alt="Evidence" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-2 text-center">
                            <Badge variant="secondary" className="text-[8px] mb-1">
                                {new Date(ev.uploadedAt).toLocaleTimeString()}
                            </Badge>
                            <Button
                                variant="destructive"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() => onDelete(ev.id)}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                        {ev.metadata?.geolocation && (
                            <div className="absolute top-1 left-1">
                                <MapPin className="w-3 h-3 text-white drop-shadow-md" />
                            </div>
                        )}
                    </div>
                ))}

                <Button
                    variant="outline"
                    className="w-32 h-32 border-dashed flex flex-col gap-2 hover:bg-zinc-50 border-zinc-300"
                    onClick={handleSimulatedUpload}
                    disabled={isUploading}
                >
                    {isUploading ? (
                        <Loader2 className="h-6 w-6 animate-spin text-zinc-400" />
                    ) : (
                        <>
                            <Camera className="h-6 w-6 text-zinc-400" />
                            <span className="text-[10px] font-medium text-zinc-500">Capture Proof</span>
                        </>
                    )}
                </Button>
            </div>

            {existingEvidence.length > 0 && (
                <p className="text-[10px] text-zinc-500 font-medium flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Regulatory Metadata: {existingEvidence.length} files with GPS & Device IDs locked.
                </p>
            )}
        </div>
    )
}
