import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/lib/rbac'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/batches
 * Get list of batches
 */
export async function GET(request: NextRequest) {
    return withAuth(async (user) => {
        const { searchParams } = new URL(request.url)
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '20')
        const millId = searchParams.get('millId')
        const status = searchParams.get('status')

        const skip = (page - 1) * limit

        try {
            // Get user's mill
            const userProfile = await prisma.user.findUnique({
                where: { email: user.email! },
                select: { millId: true, role: true }
            })

            const where: any = {}

            // Role-based filtering
            if (userProfile?.role !== 'SYSTEM_ADMIN' && userProfile?.role !== 'FWGA_PROGRAM_MANAGER') {
                if (!userProfile?.millId) {
                    return NextResponse.json({ batches: [], total: 0, page, limit })
                }
                where.millId = userProfile.millId
            } else if (millId) {
                where.millId = millId
            }

            if (status) {
                where.qcStatus = status
            }

            const [batches, total] = await Promise.all([
                prisma.batchLog.findMany({
                    where,
                    skip,
                    take: limit,
                    orderBy: { productionDate: 'desc' },
                    include: {
                        mill: {
                            select: {
                                id: true,
                                name: true,
                                code: true
                            }
                        },
                        operator: {
                            select: {
                                id: true,
                                name: true
                            }
                        },
                        qcTests: {
                            select: {
                                id: true,
                                testType: true,
                                result: true,
                                status: true,
                                testDate: true
                            }
                        }
                    }
                }),
                prisma.batchLog.count({ where })
            ])

            return NextResponse.json({
                batches,
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            })
        } catch (error) {
            console.error('Error fetching batches:', error)
            return NextResponse.json(
                { error: 'Failed to fetch batches' },
                { status: 500 }
            )
        }
    }, {
        requiredPermissions: ['view:batches']
    })
}

/**
 * POST /api/batches
 * Create a new batch
 */
export async function POST(request: NextRequest) {
    return withAuth(async (user) => {
        try {
            const body = await request.json()
            const {
                productionLine,
                productionDate,
                shift,
                cropType,
                grade,
                rawMaterialLotNumber,
                rawMaterialSource,
                inputWeight,
                expectedOutputWeight,
                actualOutputWeight,
                premixType,
                premixBatchNumber,
                premixManufacturer,
                premixExpiryDate,
                targetFortificationLevel,
                premixDosingRate,
                expectedPremixUsage,
                actualPremixUsage,
                doserSettings,
                mixerSettings,
                processParameters,
                storageLocation,
                packagingType,
                numberOfUnits
            } = body

            // Get user's mill
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

            // Get mill info for batch ID generation
            const mill = await prisma.mill.findUnique({
                where: { id: userProfile.millId },
                select: { code: true }
            })

            // Generate batch ID: [MillCode]-[Line]-[YYYYMMDD]-[Sequence]
            const date = new Date(productionDate)
            const dateStr = date.toISOString().split('T')[0].replace(/-/g, '')

            // Get today's batch count for sequence
            const todayStart = new Date(date.setHours(0, 0, 0, 0))
            const todayEnd = new Date(date.setHours(23, 59, 59, 999))

            const todayBatchCount = await prisma.batchLog.count({
                where: {
                    millId: userProfile.millId,
                    productionDate: {
                        gte: todayStart,
                        lte: todayEnd
                    }
                }
            })

            const sequence = (todayBatchCount + 1).toString().padStart(4, '0')
            const batchId = `${mill?.code}-${productionLine}-${dateStr}-${sequence}`

            // Calculate premix variance
            const premixVariance = expectedPremixUsage
                ? ((actualPremixUsage - expectedPremixUsage) / expectedPremixUsage) * 100
                : 0

            // Calculate yield
            const yieldPercentage = inputWeight
                ? (actualOutputWeight / inputWeight) * 100
                : 0

            const batch = await prisma.batchLog.create({
                data: {
                    batchId,
                    millId: userProfile.millId,
                    operatorId: userProfile.id,
                    productionLine,
                    productionDate: new Date(productionDate),
                    shift,
                    cropType,
                    grade,
                    rawMaterialLotNumber,
                    rawMaterialSource,
                    inputWeight,
                    expectedOutputWeight,
                    actualOutputWeight,
                    yieldPercentage,
                    premixType,
                    premixBatchNumber,
                    premixManufacturer,
                    premixExpiryDate: premixExpiryDate ? new Date(premixExpiryDate) : null,
                    targetFortificationLevel,
                    premixDosingRate,
                    expectedPremixUsage,
                    actualPremixUsage,
                    premixVariance,
                    doserSettings: doserSettings || {},
                    mixerSettings: mixerSettings || {},
                    processParameters: processParameters || {},
                    storageLocation,
                    packagingType,
                    numberOfUnits,
                    qcStatus: 'PENDING' // Initial status
                },
                include: {
                    mill: {
                        select: {
                            name: true,
                            code: true
                        }
                    }
                }
            })

            // Check for premix variance alert
            if (Math.abs(premixVariance) > 10) {
                // Create alert for high variance
                await prisma.alert.create({
                    data: {
                        type: 'PREMIX_VARIANCE',
                        severity: Math.abs(premixVariance) > 15 ? 'CRITICAL' : 'HIGH',
                        title: 'Premix Usage Anomaly Detected',
                        message: `Batch ${batchId} has ${premixVariance.toFixed(1)}% premix variance`,
                        resourceType: 'BATCH',
                        resourceId: batch.id,
                        millId: userProfile.millId,
                        status: 'ACTIVE'
                    }
                })
            }

            // Log the action
            await prisma.auditLog.create({
                data: {
                    userId: userProfile.id,
                    action: 'BATCH_CREATE',
                    resourceType: 'BATCH',
                    resourceId: batch.id,
                    newValues: JSON.stringify(batch),
                    ipAddress: request.ip || 'unknown',
                    userAgent: request.headers.get('user-agent') || 'unknown'
                }
            })

            return NextResponse.json({
                message: 'Batch created successfully',
                batch
            }, { status: 201 })
        } catch (error) {
            console.error('Error creating batch:', error)
            return NextResponse.json(
                { error: 'Failed to create batch' },
                { status: 500 }
            )
        }
    }, {
        requiredPermissions: ['create:batches']
    })
}
