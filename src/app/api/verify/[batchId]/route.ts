import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/verify/[batchId]
 * Public endpoint to verify batch authenticity
 */
export async function GET(
    request: NextRequest,
    { params }: { params: { batchId: string } }
) {
    try {
        const batch = await prisma.batchLog.findFirst({
            where: { batchId: params.batchId },
            include: {
                mill: {
                    select: {
                        name: true,
                        code: true,
                        region: true,
                        certificationStatus: true,
                        certificationDate: true
                    }
                },
                qcTests: {
                    select: {
                        testType: true,
                        result: true,
                        status: true,
                        createdAt: true
                    },
                    orderBy: { createdAt: 'desc' }
                }
            }
        })

        if (!batch) {
            return NextResponse.json(
                { error: 'Batch not found', verified: false },
                { status: 404 }
            )
        }

        const certificate = {
            verified: true,
            batchId: batch.batchId,
            productionDate: batch.batchDateTime,
            cropType: batch.cropType,
            mill: {
                name: batch.mill.name,
                location: batch.mill.region,
                certified: batch.mill.certificationStatus === 'CERTIFIED',
                certificationDate: batch.mill.certificationDate
            },
            fortification: {
                premixType: batch.premixType,
                targetLevel: batch.targetFortification,
                dosingRate: batch.dosingRate
            },
            quality: {
                status: batch.status,
                tests: batch.qcTests.map(test => ({
                    type: test.testType,
                    result: test.result,
                    status: test.status,
                    date: test.createdAt
                }))
            },
            traceability: {
                rawMaterialLot: batch.rawMaterialLot,
                rawMaterialSource: batch.rawMaterialSource,
                premixBatch: batch.premixBatchNumber,
                premixManufacturer: batch.premixManufacturer
            }
        }

        return NextResponse.json({ certificate })
    } catch (error) {
        console.error('Error verifying batch:', error)
        return NextResponse.json(
            { error: 'Verification failed', verified: false },
            { status: 500 }
        )
    }
}
