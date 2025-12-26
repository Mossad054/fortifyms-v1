import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/lib/rbac'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/batches/[id]
 * Get batch details
 */
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    return withAuth(async (user) => {
        try {
            const batch = await prisma.batchLog.findUnique({
                where: { id: params.id },
                include: {
                    mill: {
                        select: {
                            id: true,
                            name: true,
                            code: true,
                            location: true
                        }
                    },
                    operator: {
                        select: {
                            id: true,
                            name: true,
                            email: true
                        }
                    },
                    qcTests: {
                        include: {
                            tester: {
                                select: {
                                    id: true,
                                    name: true
                                }
                            }
                        },
                        orderBy: {
                            testDate: 'desc'
                        }
                    }
                }
            })

            if (!batch) {
                return NextResponse.json(
                    { error: 'Batch not found' },
                    { status: 404 }
                )
            }

            return NextResponse.json({ batch })
        } catch (error) {
            console.error('Error fetching batch:', error)
            return NextResponse.json(
                { error: 'Failed to fetch batch' },
                { status: 500 }
            )
        }
    }, {
        requiredPermissions: ['view:batches']
    })
}

/**
 * PATCH /api/batches/[id]
 * Update batch details
 */
export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    return withAuth(async (user) => {
        try {
            const body = await request.json()
            const {
                actualOutputWeight,
                actualPremixUsage,
                storageLocation,
                numberOfUnits,
                notes
            } = body

            // Recalculate if weights changed
            const currentBatch = await prisma.batchLog.findUnique({
                where: { id: params.id }
            })

            if (!currentBatch) {
                return NextResponse.json(
                    { error: 'Batch not found' },
                    { status: 404 }
                )
            }

            const updateData: any = {}

            if (actualOutputWeight !== undefined) {
                updateData.actualOutputWeight = actualOutputWeight
                updateData.yieldPercentage = currentBatch.inputWeight
                    ? (actualOutputWeight / currentBatch.inputWeight) * 100
                    : 0
            }

            if (actualPremixUsage !== undefined) {
                updateData.actualPremixUsage = actualPremixUsage
                updateData.premixVariance = currentBatch.expectedPremixUsage
                    ? ((actualPremixUsage - currentBatch.expectedPremixUsage) / currentBatch.expectedPremixUsage) * 100
                    : 0
            }

            if (storageLocation) updateData.storageLocation = storageLocation
            if (numberOfUnits !== undefined) updateData.numberOfUnits = numberOfUnits
            if (notes) updateData.notes = notes

            const batch = await prisma.batchLog.update({
                where: { id: params.id },
                data: updateData
            })

            return NextResponse.json({
                message: 'Batch updated successfully',
                batch
            })
        } catch (error) {
            console.error('Error updating batch:', error)
            return NextResponse.json(
                { error: 'Failed to update batch' },
                { status: 500 }
            )
        }
    }, {
        requiredPermissions: ['create:batches'] // Same permission for updates
    })
}
