import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/lib/rbac'
import { prisma } from '@/lib/prisma'

/**
 * POST /api/batches/[id]/qc
 * Add QC test result to a batch
 */
export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    return withAuth(async (user) => {
        try {
            const body = await request.json()
            const {
                sampleId,
                sampleCollectionPoint,
                sampleCollectionTime,
                testType,
                testMethod,
                testLocation,
                labCertificateNumber,
                result,
                targetValue,
                tolerance,
                visualInspection,
                notes
            } = body

            // Get user profile
            const userProfile = await prisma.user.findUnique({
                where: { email: user.email! },
                select: { id: true }
            })

            if (!userProfile) {
                return NextResponse.json(
                    { error: 'User profile not found' },
                    { status: 400 }
                )
            }

            // Determine test status based on result vs target
            let status = 'PASS'
            if (targetValue && tolerance) {
                const lowerBound = targetValue * (1 - tolerance / 100)
                const upperBound = targetValue * (1 + tolerance / 100)

                if (result < lowerBound * 0.75 || result > upperBound * 1.25) {
                    status = 'FAIL'
                } else if (result < lowerBound || result > upperBound) {
                    status = 'MARGINAL'
                } else if (result >= targetValue * 0.95 && result <= targetValue * 1.05) {
                    status = 'EXCELLENT'
                }
            }

            const qcTest = await prisma.qCTest.create({
                data: {
                    batchId: params.id,
                    testerId: userProfile.id,
                    sampleId,
                    sampleCollectionPoint,
                    sampleCollectionTime: sampleCollectionTime ? new Date(sampleCollectionTime) : new Date(),
                    testType,
                    testMethod,
                    testLocation,
                    testDate: new Date(),
                    labCertificateNumber,
                    result,
                    targetValue,
                    tolerance,
                    status,
                    visualInspection: visualInspection || {},
                    notes
                }
            })

            // Update batch QC status based on all tests
            const allTests = await prisma.qCTest.findMany({
                where: { batchId: params.id }
            })

            let batchQCStatus = 'PASS'
            const hasFail = allTests.some(t => t.status === 'FAIL')
            const hasMarginal = allTests.some(t => t.status === 'MARGINAL')
            const allExcellent = allTests.every(t => t.status === 'EXCELLENT')

            if (hasFail) {
                batchQCStatus = 'FAIL'
            } else if (hasMarginal) {
                batchQCStatus = 'MARGINAL'
            } else if (allExcellent && allTests.length > 0) {
                batchQCStatus = 'EXCELLENT'
            }

            await prisma.batchLog.update({
                where: { id: params.id },
                data: { qcStatus: batchQCStatus }
            })

            // Create alert if QC failed
            if (status === 'FAIL') {
                const batch = await prisma.batchLog.findUnique({
                    where: { id: params.id },
                    select: { batchId: true, millId: true }
                })

                await prisma.alert.create({
                    data: {
                        type: 'QC_FAILURE',
                        severity: 'CRITICAL',
                        title: 'QC Test Failed',
                        message: `Batch ${batch?.batchId} failed ${testType} test. Result: ${result}, Target: ${targetValue}`,
                        resourceType: 'BATCH',
                        resourceId: params.id,
                        millId: batch?.millId,
                        status: 'ACTIVE'
                    }
                })
            }

            return NextResponse.json({
                message: 'QC test recorded successfully',
                qcTest,
                batchQCStatus
            }, { status: 201 })
        } catch (error) {
            console.error('Error recording QC test:', error)
            return NextResponse.json(
                { error: 'Failed to record QC test' },
                { status: 500 }
            )
        }
    }, {
        requiredPermissions: ['record:qc']
    })
}

/**
 * GET /api/batches/[id]/qc
 * Get all QC tests for a batch
 */
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    return withAuth(async (user) => {
        try {
            const qcTests = await prisma.qCTest.findMany({
                where: { batchId: params.id },
                include: {
                    tester: {
                        select: {
                            id: true,
                            name: true,
                            email: true
                        }
                    }
                },
                orderBy: { testDate: 'desc' }
            })

            return NextResponse.json({ qcTests })
        } catch (error) {
            console.error('Error fetching QC tests:', error)
            return NextResponse.json(
                { error: 'Failed to fetch QC tests' },
                { status: 500 }
            )
        }
    }, {
        requiredPermissions: ['view:batches']
    })
}
