import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/lib/rbac'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/training/courses
 * Get training courses
 */
export async function GET(request: NextRequest) {
    return withAuth(async (user) => {
        const { searchParams } = new URL(request.url)
        const category = searchParams.get('category')
        const difficulty = searchParams.get('difficulty')

        try {
            const where: any = {}

            if (category) where.category = category
            if (difficulty) where.difficulty = difficulty

            const courses = await prisma.trainingCourse.findMany({
                where,
                orderBy: { title: 'asc' },
                include: {
                    _count: {
                        select: { progress: true }
                    }
                }
            })

            return NextResponse.json({ courses })
        } catch (error) {
            console.error('Error fetching courses:', error)
            return NextResponse.json(
                { error: 'Failed to fetch courses' },
                { status: 500 }
            )
        }
    })
}

/**
 * POST /api/training/courses/[id]/enroll
 * Enroll in a course
 */
export async function POST(
    request: NextRequest,
    context: { params: { id: string } }
) {
    const { id } = context.params

    return withAuth(async (user) => {
        try {
            const userProfile = await prisma.user.findUnique({
                where: { email: user.email! },
                select: { id: true }
            })

            if (!userProfile) {
                return NextResponse.json(
                    { error: 'User profile not found' },
                    { status: 400 }
                )
            }

            // Check if already enrolled
            const existing = await prisma.trainingProgress.findFirst({
                where: {
                    userId: userProfile.id,
                    courseId: id
                }
            })

            if (existing) {
                return NextResponse.json(
                    { error: 'Already enrolled in this course' },
                    { status: 400 }
                )
            }

            const progress = await prisma.trainingProgress.create({
                data: {
                    userId: userProfile.id,
                    courseId: id,
                    status: 'IN_PROGRESS',
                    progress: 0
                },
                include: {
                    course: true
                }
            })

            return NextResponse.json({
                message: 'Enrolled successfully',
                progress
            }, { status: 201 })
        } catch (error) {
            console.error('Error enrolling in course:', error)
            return NextResponse.json(
                { error: 'Failed to enroll' },
                { status: 500 }
            )
        }
    })
}
