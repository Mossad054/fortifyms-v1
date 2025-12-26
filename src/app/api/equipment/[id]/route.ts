import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/lib/rbac'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/equipment/[id]
 * Get equipment details
 */
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    return withAuth(async (user) => {
        try {
            const equipment = await prisma.equipment.findUnique({
                where: { id: params.id },
                include: {
                    mill: true,
                    maintenanceTasks: {
                        orderBy: { dueDate: 'desc' },
                        take: 10
                    }
                }
            })

            if (!equipment) {
                return NextResponse.json(
                    { error: 'Equipment not found' },
                    { status: 404 }
                )
            }

            return NextResponse.json({ equipment })
        } catch (error) {
            console.error('Error fetching equipment:', error)
            return NextResponse.json(
                { error: 'Failed to fetch equipment' },
                { status: 500 }
            )
        }
    })
}

/**
 * PATCH /api/equipment/[id]
 * Update equipment details
 */
export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    return withAuth(async (user) => {
        try {
            const body = await request.json()
            const {
                name,
                status,
                location,
                calibrationFrequency,
                lastCalibration,
                specifications,
                notes
            } = body

            const updateData: any = {}
            if (name) updateData.name = name
            if (status) updateData.status = status
            if (location) updateData.location = location
            if (calibrationFrequency !== undefined) updateData.calibrationFrequency = calibrationFrequency
            if (lastCalibration) updateData.lastCalibration = new Date(lastCalibration)
            if (specifications) updateData.specifications = specifications
            if (notes) updateData.notes = notes

            const equipment = await prisma.equipment.update({
                where: { id: params.id },
                data: updateData
            })

            return NextResponse.json({
                message: 'Equipment updated successfully',
                equipment
            })
        } catch (error) {
            console.error('Error updating equipment:', error)
            return NextResponse.json(
                { error: 'Failed to update equipment' },
                { status: 500 }
            )
        }
    }, {
        requiredPermissions: ['manage:equipment']
    })
}
