import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/lib/rbac'
import { prisma } from '@/lib/prisma'

/**
 * POST /api/training/diagnostics
 * Start new diagnostic session
 */
export async function POST(request: NextRequest) {
    return withAuth(async (user) => {
        try {
            const body = await request.json()
            const { category, cropType, equipmentType } = body

            const userProfile = await prisma.user.findUnique({
                where: { email: user.email! },
                select: { id: true, millId: true }
            })

            if (!userProfile) {
                return NextResponse.json(
                    { error: 'User profile not found' },
                    { status: 400 }
                )
            }

            const diagnostic = await prisma.diagnosticResult.create({
                data: {
                    userId: userProfile.id,
                    millId: userProfile.millId,
                    category,
                    cropType,
                    equipmentType,
                    status: 'IN_PROGRESS',
                    responses: {},
                    recommendations: []
                }
            })

            return NextResponse.json({
                message: 'Diagnostic session started',
                diagnostic
            }, { status: 201 })
        } catch (error) {
            console.error('Error starting diagnostic:', error)
            return NextResponse.json(
                { error: 'Failed to start diagnostic' },
                { status: 500 }
            )
        }
    })
}

/**
 * PATCH /api/training/diagnostics/[id]
 * Update diagnostic responses
 */
export async function PATCH(
    request: NextRequest,
    context: { params: { id: string } }
) {
    const { id } = context.params

    return withAuth(async (user) => {
        try {
            const body = await request.json()
            const { responses, completed } = body

            const updateData: any = {
                responses,
                updatedAt: new Date()
            }

            if (completed) {
                // Analyze responses and generate recommendations
                const recommendations = analyzeResponses(responses)

                updateData.status = 'COMPLETED'
                updateData.completedAt = new Date()
                updateData.recommendations = recommendations
                updateData.severity = determineSeverity(recommendations)
            }

            const diagnostic = await prisma.diagnosticResult.update({
                where: { id },
                data: updateData
            })

            // Create alerts for critical issues
            if (completed && diagnostic.severity === 'CRITICAL') {
                await prisma.alert.create({
                    data: {
                        type: 'CRITICAL_NON_COMPLIANCE',
                        category: 'TRAINING_COMPLIANCE',
                        severity: 'CRITICAL',
                        title: 'Critical Issue Identified in Diagnostic',
                        message: `Diagnostic for ${diagnostic.category} identified critical issues requiring immediate attention`,
                        sourceType: 'DIAGNOSTIC',
                        sourceId: diagnostic.id,
                        millId: diagnostic.millId,
                        status: 'ACTIVE'
                    }
                })
            }

            return NextResponse.json({
                message: 'Diagnostic updated successfully',
                diagnostic
            })
        } catch (error) {
            console.error('Error updating diagnostic:', error)
            return NextResponse.json(
                { error: 'Failed to update diagnostic' },
                { status: 500 }
            )
        }
    })
}

/**
 * Analyze diagnostic responses and generate recommendations
 */
function analyzeResponses(responses: any): any[] {
    const recommendations: any[] = []

    // Example logic - would be more sophisticated in production
    Object.entries(responses).forEach(([key, value]: [string, any]) => {
        if (key.includes('temperature') && typeof value === 'number') {
            if (value > 25) {
                recommendations.push({
                    issue: 'Temperature out of range',
                    description: `Temperature reading of ${value}°C exceeds recommended maximum of 25°C`,
                    action: 'Install temperature monitoring and ventilation system',
                    priority: 'HIGH',
                    trainingModule: 'Premix Storage Best Practices'
                })
            }
        }

        if (key.includes('calibration') && value === false) {
            recommendations.push({
                issue: 'Calibration overdue',
                description: 'Equipment calibration is overdue',
                action: 'Schedule immediate calibration and upload certificate',
                priority: 'CRITICAL',
                trainingModule: 'Doser Calibration Procedures'
            })
        }
    })

    return recommendations
}

/**
 * Determine overall severity based on recommendations
 */
function determineSeverity(recommendations: any[]): string {
    if (recommendations.some(r => r.priority === 'CRITICAL')) return 'CRITICAL'
    if (recommendations.some(r => r.priority === 'HIGH')) return 'HIGH'
    if (recommendations.length > 0) return 'MEDIUM'
    return 'LOW'
}
