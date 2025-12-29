import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/lib/rbac'
import { prisma } from '@/lib/prisma'

/**
 * POST /api/training/certificates/generate
 * Generate training certificate
 */
export async function POST(request: NextRequest) {
    return withAuth(async (user) => {
        try {
            const body = await request.json()
            const { progressId } = body

            const progress = await prisma.trainingProgress.findUnique({
                where: { id: progressId },
                include: {
                    course: true,
                    user: true
                }
            })

            if (!progress) {
                return NextResponse.json(
                    { error: 'Training progress not found' },
                    { status: 404 }
                )
            }

            const score = progress.score ?? 0
            if (progress.status !== 'COMPLETED' || score < 80) {
                return NextResponse.json(
                    { error: 'Course not completed or quiz score below 80%' },
                    { status: 400 }
                )
            }

            // Generate unique certificate ID
            const certificateId = `CERT-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`

            const certificate = {
                id: certificateId,
                userName: progress.user.name,
                courseTitle: progress.course.title,
                completionDate: progress.completedAt,
                score: progress.score ?? 0,
                issuedDate: new Date(),
                expiryDate: null
            }

            // Update progress with certificate info
            await prisma.trainingProgress.update({
                where: { id: progressId },
                data: {
                    certificateId
                }
            })

            return NextResponse.json({
                message: 'Certificate generated successfully',
                certificate
            }, { status: 201 })
        } catch (error) {
            console.error('Error generating certificate:', error)
            return NextResponse.json(
                { error: 'Failed to generate certificate' },
                { status: 500 }
            )
        }
    })
}

/**
 * GET /api/training/certificates/[id]
 * Get certificate details (public endpoint for verification)
 */
export async function GET(
    request: NextRequest,
    context: { params: { id: string } }
) {
    const { id } = context.params

    try {
        const progress = await prisma.trainingProgress.findFirst({
            where: { certificateId: id },
            include: {
                course: {
                    select: {
                        title: true,
                        category: true
                    }
                },
                user: {
                    select: {
                        name: true,
                        mill: {
                            select: {
                                name: true
                            }
                        }
                    }
                }
            }
        })

        if (!progress) {
            return NextResponse.json(
                { error: 'Certificate not found', verified: false },
                { status: 404 }
            )
        }

        const certificate = {
            verified: true,
            certificateId: progress.certificateId,
            userName: progress.user.name,
            millName: progress.user.mill?.name,
            courseTitle: progress.course.title,
            category: progress.course.category,
            completionDate: progress.completedAt,
            score: progress.score ?? 0,
            issuedDate: progress.completedAt,
            status: 'VALID' // Could add expiry logic here
        }

        return NextResponse.json({ certificate })
    } catch (error) {
        console.error('Error verifying certificate:', error)
        return NextResponse.json(
            { error: 'Verification failed', verified: false },
            { status: 500 }
        )
    }
}
