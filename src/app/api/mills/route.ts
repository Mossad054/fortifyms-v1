import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/lib/rbac'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/mills
 * Get list of mills (filtered by user role)
 */
export async function GET(request: NextRequest) {
    return withAuth(async (user) => {
        const { searchParams } = new URL(request.url)
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '10')
        const search = searchParams.get('search') || ''

        const userRole = user.user_metadata?.role
        const skip = (page - 1) * limit

        try {
            const where: any = {}

            // Filter by search term
            if (search) {
                where.OR = [
                    { name: { contains: search, mode: 'insensitive' } },
                    { code: { contains: search, mode: 'insensitive' } },
                    { registrationNumber: { contains: search, mode: 'insensitive' } }
                ]
            }

            // Role-based filtering
            if (userRole === 'MILL_OPERATOR' || userRole === 'MILL_TECHNICIAN' || userRole === 'MILL_MANAGER') {
                // Only show their own mill
                const userProfile = await prisma.user.findUnique({
                    where: { email: user.email! },
                    select: { millId: true }
                })

                if (userProfile?.millId) {
                    where.id = userProfile.millId
                } else {
                    return NextResponse.json({ mills: [], total: 0, page, limit })
                }
            }

            const [mills, total] = await Promise.all([
                prisma.mill.findMany({
                    where,
                    skip,
                    take: limit,
                    orderBy: { name: 'asc' },
                    include: {
                        _count: {
                            select: {
                                users: true,
                                batches: true,
                                equipment: true
                            }
                        }
                    }
                }),
                prisma.mill.count({ where })
            ])

            return NextResponse.json({
                mills,
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            })
        } catch (error) {
            console.error('Error fetching mills:', error)
            return NextResponse.json(
                { error: 'Failed to fetch mills' },
                { status: 500 }
            )
        }
    }, {
        requiredPermissions: ['view:batches'] // Basic permission all mill users have
    })
}

/**
 * POST /api/mills
 * Create a new mill (admin only)
 */
export async function POST(request: NextRequest) {
    return withAuth(async (user) => {
        try {
            const body = await request.json()
            const {
                name,
                code,
                registrationNumber,
                country,
                region,
                address,
                phone,
                email,
                commodities,
                location
            } = body

            // Validate required fields
            if (!name || !code || !country) {
                return NextResponse.json(
                    { error: 'Name, code, and country are required' },
                    { status: 400 }
                )
            }

            // Check if code already exists
            const existing = await prisma.mill.findUnique({
                where: { code }
            })

            if (existing) {
                return NextResponse.json(
                    { error: 'Mill code already exists' },
                    { status: 400 }
                )
            }

            const mill = await prisma.mill.create({
                data: {
                    name,
                    code,
                    registrationNumber,
                    country,
                    region,
                    address,
                    phone,
                    email,
                    certificationStatus: 'PENDING'
                }
            })

            // Log the action
            await prisma.auditLog.create({
                data: {
                    userId: (await prisma.user.findUnique({ where: { email: user.email! } }))!.id,
                    action: 'MILL_CREATE',
                    resourceType: 'MILL',
                    resourceId: mill.id,
                    newValues: JSON.stringify(mill),
                    ipAddress: request.ip || 'unknown',
                    userAgent: request.headers.get('user-agent') || 'unknown'
                }
            })

            return NextResponse.json({
                message: 'Mill created successfully',
                mill
            }, { status: 201 })
        } catch (error) {
            console.error('Error creating mill:', error)
            return NextResponse.json(
                { error: 'Failed to create mill' },
                { status: 500 }
            )
        }
    }, {
        requiredRoles: ['SYSTEM_ADMIN', 'PROGRAM_MANAGER']
    })
}
