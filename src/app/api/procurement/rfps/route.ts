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
            const userProfile = await prisma.user.findUnique({
                where: { email: user.email! },
                select: { role: true }
            })

            const where: any = {}

            if (status) where.status = status
            if (commodity) where.commodity = commodity

            // Buyers see only their RFPs
            if (userProfile?.role === 'INSTITUTIONAL_BUYER') {
                const buyerProfile = await prisma.buyerProfile.findUnique({
                    where: { userId: (await prisma.user.findUnique({ where: { email: user.email! } }))!.id }
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
                quantity,
                qualityRequirements,
                deliveryDeadline,
                deliveryLocations,
                pricingTerms,
                evaluationCriteria,
                eligibilityCriteria
            } = body

            const userProfile = await prisma.user.findUnique({
                where: { email: user.email! },
                select: { id: true }
            })

            const buyerProfile = await prisma.buyerProfile.findUnique({
                where: { userId: userProfile!.id }
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
                    commodity,
                    quantity,
                    qualityRequirements: qualityRequirements || {},
                    deliveryDeadline: new Date(deliveryDeadline),
                    deliveryLocations: deliveryLocations || [],
                    pricingTerms: pricingTerms || {},
                    evaluationCriteria: evaluationCriteria || {},
                    eligibilityCriteria: eligibilityCriteria || {},
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
