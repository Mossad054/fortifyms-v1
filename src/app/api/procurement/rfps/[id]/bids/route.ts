import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/lib/rbac'
import { prisma } from '@/lib/prisma'

/**
 * POST /api/procurement/rfps/[id]/bids
 * Submit bid for RFP
 */
export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    return withAuth(async (user) => {
        try {
            const body = await request.json()
            const {
                pricePerUnit,
                totalPrice,
                deliveryTimeline,
                qualityAssurance,
                supportingDocuments
            } = body

            const userProfile = await prisma.user.findUnique({
                where: { email: user.email! },
                select: { id: true, millId: true }
            })

            if (!userProfile?.millId) {
                return NextResponse.json(
                    { error: 'User not associated with a mill' },
                    { status: 400 }
                )
            }

            // Check if mill is certified
            const mill = await prisma.mill.findUnique({
                where: { id: userProfile.millId },
                select: { certificationStatus: true }
            })

            if (mill?.certificationStatus !== 'CERTIFIED') {
                return NextResponse.json(
                    { error: 'Mill must be certified to submit bids' },
                    { status: 403 }
                )
            }

            const bid = await prisma.bid.create({
                data: {
                    rfpId: params.id,
                    millId: userProfile.millId,
                    pricePerUnit,
                    totalPrice,
                    deliveryTimeline,
                    qualityAssurance: qualityAssurance || {},
                    supportingDocuments: supportingDocuments || [],
                    status: 'SUBMITTED'
                }
            })

            return NextResponse.json({
                message: 'Bid submitted successfully',
                bid
            }, { status: 201 })
        } catch (error) {
            console.error('Error submitting bid:', error)
            return NextResponse.json(
                { error: 'Failed to submit bid' },
                { status: 500 }
            )
        }
    }, {
        requiredRoles: ['MILL_MANAGER', 'SYSTEM_ADMIN']
    })
}

/**
 * GET /api/procurement/rfps/[id]/bids
 * Get bids for RFP
 */
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    return withAuth(async (user) => {
        try {
            const bids = await prisma.bid.findMany({
                where: { rfpId: params.id },
                include: {
                    mill: {
                        select: {
                            id: true,
                            name: true,
                            certificationStatus: true,
                            certificationDate: true
                        }
                    }
                },
                orderBy: { createdAt: 'desc' }
            })

            return NextResponse.json({ bids })
        } catch (error) {
            console.error('Error fetching bids:', error)
            return NextResponse.json(
                { error: 'Failed to fetch bids' },
                { status: 500 }
            )
        }
    })
}
