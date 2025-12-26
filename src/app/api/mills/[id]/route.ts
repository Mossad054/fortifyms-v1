import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/lib/rbac'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/mills/[id]
 * Get mill details
 */
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    return withAuth(async (user) => {
        try {
            const mill = await prisma.mill.findUnique({
                where: { id: params.id },
                include: {
                    users: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            role: true,
                            isActive: true
                        }
                    },
                    equipment: {
                        select: {
                            id: true,
                            name: true,
                            type: true,
                            status: true,
                            lastCalibration: true
                        }
                    },
                    _count: {
                        select: {
                            batches: true,
                            complianceAudits: true
                        }
                    }
                }
            })

            if (!mill) {
                return NextResponse.json(
                    { error: 'Mill not found' },
                    { status: 404 }
                )
            }

            return NextResponse.json({ mill })
        } catch (error) {
            console.error('Error fetching mill:', error)
            return NextResponse.json(
                { error: 'Failed to fetch mill' },
                { status: 500 }
            )
        }
    })
}

/**
 * PATCH /api/mills/[id]
 * Update mill details
 */
export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    return withAuth(async (user) => {
        try {
            const body = await request.json()
            const {
                name,
                registrationNumber,
                region,
                address,
                phone,
                email,
                commodities,
                location,
                certificationStatus
            } = body

            const mill = await prisma.mill.update({
                where: { id: params.id },
                data: {
                    name,
                    registrationNumber,
                    region,
                    address,
                    phone,
                    email,
                    commodities,
                    location,
                    certificationStatus
                }
            })

            // Log the action
            const dbUser = await prisma.user.findUnique({ where: { email: user.email! } })
            if (dbUser) {
                await prisma.auditLog.create({
                    data: {
                        userId: dbUser.id,
                        action: 'MILL_UPDATE',
                        resourceType: 'MILL',
                        resourceId: mill.id,
                        newValues: JSON.stringify(body),
                        ipAddress: request.ip || 'unknown',
                        userAgent: request.headers.get('user-agent') || 'unknown'
                    }
                })
            }

            return NextResponse.json({
                message: 'Mill updated successfully',
                mill
            })
        } catch (error) {
            console.error('Error updating mill:', error)
            return NextResponse.json(
                { error: 'Failed to update mill' },
                { status: 500 }
            )
        }
    }, {
        requiredRoles: ['SYSTEM_ADMIN', 'FWGA_PROGRAM_MANAGER', 'MILL_MANAGER']
    })
}
