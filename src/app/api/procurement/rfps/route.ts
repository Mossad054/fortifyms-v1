import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/lib/rbac'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/procurement/rfps
 * Get RFPs (Request for Proposals)
 */
export async function GET(request: NextRequest) {
    return withAuth(async (user) => {
        const { searchParams } = new URL(request.url)
        const status = searchParams.get('status')
        const commodity = searchParams.get('commodity')

        try {
            const where: any = {}

            if (status) where.status = status
            if (commodity) where.commodity = commodity

            // If the current user is a buyer (has BuyerProfile), scope to their RFPs
            const dbUser = await prisma.user.findUnique({ where: { email: user.email! }, select: { id: true } })
            if (dbUser) {
                const buyerProfile = await prisma.buyerProfile.findUnique({
                    where: { userId: dbUser.id }
                })
                if (buyerProfile) {
                    where.buyerId = buyerProfile.id
                }
            }

            const rfps = await prisma.rFP.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                include: {
                    buyer: {
                        select: {
                            id: true,
                            organizationName: true
                        }
                    },
                    _count: {
                        select: { bids: true }
                    }
                }
            })

            return NextResponse.json({ rfps })
        } catch (error) {
            console.error('Error fetching RFPs:', error)
            return NextResponse.json(
                { error: 'Failed to fetch RFPs' },
                { status: 500 }
            )
        }
    })
}

/**
 * POST /api/procurement/rfps
 * Create new RFP
 */
export async function POST(request: NextRequest) {
    return withAuth(async (user) => {
        try {
            const body = await request.json()
            const {
                title,
                commodity,
                totalVolume,
                unitPackaging,
                qualitySpecs,
                bidDeadline,
                deliveryLocations,
                preferredPaymentTerms,
                evaluationCriteria,
                eligibilityCriteria
            } = body

            const dbUser = await prisma.user.findUnique({
                where: { email: user.email! },
                select: { id: true }
            })

            if (!dbUser) {
                return NextResponse.json({ error: 'User not found' }, { status: 404 })
            }

            const buyerProfile = await prisma.buyerProfile.findUnique({
                where: { userId: dbUser.id }
            })

            if (!buyerProfile) {
                return NextResponse.json(
                    { error: 'Buyer profile not found' },
                    { status: 400 }
                )
            }

            const rfp = await prisma.rFP.create({
                data: {
                    buyerId: buyerProfile.id,
                    title,
                    referenceNumber: `RFP-${Date.now()}`,
                    commodity,
                    totalVolume: parseFloat(totalVolume),
                    unitPackaging: unitPackaging || 'CUSTOM',
                    qualitySpecs: typeof qualitySpecs === 'object' ? JSON.stringify(qualitySpecs) : qualitySpecs,
                    bidDeadline: new Date(bidDeadline),
                    deliveryLocations: typeof deliveryLocations === 'object' ? JSON.stringify(deliveryLocations) : deliveryLocations,
                    preferredPaymentTerms: preferredPaymentTerms || 'NET_30',
                    evaluationCriteria: typeof evaluationCriteria === 'object' ? JSON.stringify(evaluationCriteria) : evaluationCriteria,
                    status: 'OPEN'
                }
            })

            return NextResponse.json({
                message: 'RFP created successfully',
                rfp
            }, { status: 201 })
        } catch (error) {
            console.error('Error creating RFP:', error)
            return NextResponse.json(
                { error: 'Failed to create RFP' },
                { status: 500 }
            )
        }
    }, {
        requiredRoles: ['INSTITUTIONAL_BUYER', 'SYSTEM_ADMIN']
    })
}
