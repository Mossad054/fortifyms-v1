import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/lib/rbac'
import { prisma } from '@/lib/prisma'

/**
 * POST /api/compliance/audits/[id]/annotations
 * Add annotation/comment to audit
 */
export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    return withAuth(async (user) => {
        try {
            const body = await request.json()
            const { sectionId, itemId, comment, annotationType } = body

            const userProfile = await prisma.user.findUnique({
                where: { email: user.email! }
            })

            if (!userProfile) {
                return NextResponse.json(
                    { error: 'User profile not found' },
                    { status: 400 }
                )
            }

            const annotation = await prisma.complianceAnnotation.create({
                data: {
                    auditId: params.id,
                    annotatorId: userProfile.id,
                    itemId,
                    content: comment,
                    type: annotationType || 'TEXT_CALLOUT',
                    position: JSON.stringify({ x: 0, y: 0 }) // Default position
                },
                include: {
                    annotator: {
                        select: {
                            id: true,
                            name: true
                        }
                    }
                }
            })

            return NextResponse.json({
                message: 'Annotation added successfully',
                annotation
            }, { status: 201 })
        } catch (error) {
            console.error('Error adding annotation:', error)
            return NextResponse.json(
                { error: 'Failed to add annotation' },
                { status: 500 }
            )
        }
    })
}

/**
 * GET /api/compliance/audits/[id]/annotations
 * Get all annotations for an audit
 */
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    return withAuth(async (user) => {
        try {
            const annotations = await prisma.complianceAnnotation.findMany({
                where: { auditId: params.id },
                include: {
                    annotator: {
                        select: {
                            id: true,
                            name: true,
                            role: true
                        }
                    }
                },
                orderBy: { createdAt: 'desc' }
            })

            return NextResponse.json({ annotations })
        } catch (error) {
            console.error('Error fetching annotations:', error)
            return NextResponse.json(
                { error: 'Failed to fetch annotations' },
                { status: 500 }
            )
        }
    })
}
