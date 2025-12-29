import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/lib/rbac'
import { prisma } from '@/lib/prisma'

/**
 * POST /api/procurement/rfps/[id]/award
 * Award RFP to winning bid
 */
export async function POST(
    request: NextRequest,
    context: { params: { id: string } }
) {
    const { id } = context.params

    return withAuth(async (user) => {
        try {
            const body = await request.json()
            const { bidId, notes } = body

            if (!bidId) {
                return NextResponse.json(
                    { error: 'Bid ID is required' },
                    { status: 400 }
                )
            }

            const rfp = await prisma.rFP.findUnique({
                where: { id },
                include: {
                    bids: true
                }
            })

            if (!rfp) {
                return NextResponse.json(
                    { error: 'RFP not found' },
                    { status: 404 }
                )
            }

            const winningBid = rfp.bids.find(b => b.id === bidId)

            if (!winningBid) {
                return NextResponse.json(
                    { error: 'Bid not found' },
                    { status: 404 }
                )
            }

            // Update RFP status
            await prisma.rFP.update({
                where: { id },
                data: {
                    status: 'AWARDED',
                    awardedBidId: bidId
                }
            })

            // Update winning bid
            await prisma.bid.update({
                where: { id: bidId },
                data: { status: 'ACCEPTED' }
            })

            // Update other bids to rejected
            await prisma.bid.updateMany({
                where: {
                    rfpId: id,
                    id: { not: bidId }
                },
                data: { status: 'REJECTED' }
            })

            // Create purchase order
            const purchaseOrder = await prisma.purchaseOrder.create({
                data: {
                    poNumber: `PO-${Date.now()}`,
                    rfpId: id,
                    bidId: bidId,
                    buyerId: rfp.buyerId,
                    millId: winningBid.millId,
                    productSpecs: JSON.stringify({ commodity: rfp.commodity }),
                    quantity: rfp.totalVolume,
                    unitPrice: winningBid.unitPrice,
                    totalAmount: winningBid.totalBidAmount,
                    deliverySchedule: winningBid.deliverySchedule || '',
                    paymentTerms: winningBid.paymentTerms || 'Standard',
                    qualityStandards: rfp.qualitySpecs || 'Standard',
                    status: 'CONFIRMED'
                }
            })

            // Notify mill
            await prisma.alert.create({
                data: {
                    type: 'NEW_RFP_MATCH',
                    category: 'PROCUREMENT',
                    severity: 'MEDIUM',
                    title: 'Congratulations! Your Bid Was Accepted',
                    message: `Your bid for ${rfp.title} has been accepted. Purchase Order: ${purchaseOrder.poNumber}`,
                    sourceType: 'PURCHASE_ORDER',
                    sourceId: purchaseOrder.id,
                    millId: winningBid.millId,
                    status: 'ACTIVE'
                }
            })

            return NextResponse.json({
                message: 'RFP awarded successfully',
                purchaseOrder
            }, { status: 201 })
        } catch (error) {
            console.error('Error awarding RFP:', error)
            return NextResponse.json(
                { error: 'Failed to award RFP' },
                { status: 500 }
            )
        }
    }, {
        requiredRoles: ['INSTITUTIONAL_BUYER', 'SYSTEM_ADMIN']
    })
}
