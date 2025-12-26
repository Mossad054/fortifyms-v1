import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/lib/rbac'
import { prisma } from '@/lib/prisma'

/**
 * POST /api/procurement/rfps/[id]/evaluate
 * Evaluate bids for an RFP
 */
export async function POST(
    request: NextRequest,
    context: { params: { id: string } }
) {
    const { id } = context.params

    return withAuth(async (user) => {
        try {
            const rfp = await prisma.rFP.findUnique({
                where: { id },
                include: {
                    bids: {
                        include: {
                            mill: {
                                include: {
                                    complianceAudits: {
                                        orderBy: { auditDate: 'desc' },
                                        take: 1
                                    }
                                }
                            }
                        }
                    }
                }
            })

            if (!rfp) {
                return NextResponse.json(
                    { error: 'RFP not found' },
                    { status: 404 }
                )
            }

            // Get evaluation criteria from RFP
            const criteria = rfp.evaluationCriteria as any || {
                price: 40,
                quality: 30,
                delivery: 20,
                trackRecord: 10
            }

            // Evaluate each bid
            const evaluatedBids = rfp.bids.map(bid => {
                const scores: any = {}

                // Price score (lower is better, normalized to 0-100)
                const prices = rfp.bids.map(b => b.totalPrice)
                const minPrice = Math.min(...prices)
                scores.price = bid.totalPrice > 0 ? (minPrice / bid.totalPrice) * 100 : 0

                // Quality score (based on compliance)
                const latestAudit = bid.mill.complianceAudits[0]
                scores.quality = latestAudit?.score || 0

                // Delivery score (based on lead time - shorter is better)
                const leadTimes = rfp.bids.map(b => b.deliveryTimeline?.leadTime || 30)
                const minLeadTime = Math.min(...leadTimes)
                const bidLeadTime = bid.deliveryTimeline?.leadTime || 30
                scores.delivery = bidLeadTime > 0 ? (minLeadTime / bidLeadTime) * 100 : 0

                // Track record score (placeholder - would use actual order history)
                scores.trackRecord = 75 // Default score

                // Calculate weighted total
                const totalScore =
                    (scores.price * (criteria.price / 100)) +
                    (scores.quality * (criteria.quality / 100)) +
                    (scores.delivery * (criteria.delivery / 100)) +
                    (scores.trackRecord * (criteria.trackRecord / 100))

                return {
                    bidId: bid.id,
                    millId: bid.millId,
                    millName: bid.mill.name,
                    totalPrice: bid.totalPrice,
                    scores,
                    totalScore: Math.round(totalScore * 10) / 10,
                    complianceScore: latestAudit?.score || 0,
                    certificationStatus: bid.mill.certificationStatus
                }
            })

            // Sort by total score descending
            evaluatedBids.sort((a, b) => b.totalScore - a.totalScore)

            return NextResponse.json({
                rfpId: rfp.id,
                evaluationCriteria: criteria,
                evaluatedBids,
                recommendation: evaluatedBids[0] // Highest scoring bid
            })
        } catch (error) {
            console.error('Error evaluating bids:', error)
            return NextResponse.json(
                { error: 'Failed to evaluate bids' },
                { status: 500 }
            )
        }
    }, {
        requiredRoles: ['INSTITUTIONAL_BUYER', 'SYSTEM_ADMIN']
    })
}
