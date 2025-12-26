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
                        location: true,
                        certificationStatus: true,
                        certificationDate: true
                    }
                },
                qcTests: {
                    select: {
                        testType: true,
                        result: true,
                        targetValue: true,
                        status: true,
                        testDate: true
                    },
                    orderBy: { testDate: 'desc' }
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
            productionDate: batch.productionDate,
            cropType: batch.cropType,
            mill: {
                name: batch.mill.name,
                location: batch.mill.location,
                certified: batch.mill.certificationStatus === 'CERTIFIED',
                certificationDate: batch.mill.certificationDate
            },
            fortification: {
                premixType: batch.premixType,
                targetLevel: batch.targetFortificationLevel,
                dosingRate: batch.premixDosingRate
            },
            quality: {
                status: batch.qcStatus,
                tests: batch.qcTests.map(test => ({
                    type: test.testType,
                    result: test.result,
                    target: test.targetValue,
                    status: test.status,
                    date: test.testDate
                }))
            },
            traceability: {
                rawMaterialLot: batch.rawMaterialLotNumber,
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
