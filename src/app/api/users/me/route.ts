import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/rbac'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/users/me
 * Get current user profile with mill information
 */
export async function GET(request: NextRequest) {
    const user = await getCurrentUser()

    if (!user) {
        return NextResponse.json(
            { error: 'Unauthorized' },
            { status: 401 }
        )
    }

    try {
        // Get user profile from database
        const userProfile = await prisma.user.findUnique({
            where: { email: user.email! },
            include: {
                mill: {
                    select: {
                        id: true,
                        name: true,
                        code: true,
                        country: true,
                        region: true,
                        address: true,
                        phone: true,
                        email: true,
                        registrationNumber: true,
                        certificationStatus: true,
                        certificationDate: true
                    }
                },
                profile: true
            }
        })

        if (!userProfile) {
            // User exists in Supabase but not in our database yet
            return NextResponse.json({
                id: user.id,
                email: user.email,
                name: user.user_metadata?.name,
                role: user.user_metadata?.role,
                needsProfileSetup: true
            })
        }

        return NextResponse.json({
            id: userProfile.id,
            email: userProfile.email,
            name: userProfile.name,
            role: userProfile.role,
            image: userProfile.image,
            isActive: userProfile.isActive,
            mill: userProfile.mill,
            profile: userProfile.profile,
            needsProfileSetup: false
        })
    } catch (error) {
        console.error('Error fetching user profile:', error)
        return NextResponse.json(
            { error: 'Failed to fetch user profile' },
            { status: 500 }
        )
    }
}

/**
 * PATCH /api/users/me
 * Update current user profile
 */
export async function PATCH(request: NextRequest) {
    const user = await getCurrentUser()

    if (!user) {
        return NextResponse.json(
            { error: 'Unauthorized' },
            { status: 401 }
        )
    }

    try {
        const body = await request.json()
        const { name, image, timezone, language, phoneNumber } = body

        // Update user in database
        const updatedUser = await prisma.user.update({
            where: { email: user.email! },
            data: {
                name,
                image,
                profile: {
                    upsert: {
                        create: {
                            timezone: timezone || 'UTC',
                            language: language || 'en',
                            phone: phoneNumber
                        },
                        update: {
                            timezone,
                            language,
                            phone: phoneNumber
                        }
                    }
                }
            },
            include: {
                profile: true,
                mill: true
            }
        })

        return NextResponse.json({
            message: 'Profile updated successfully',
            user: updatedUser
        })
    } catch (error) {
        console.error('Error updating user profile:', error)
        return NextResponse.json(
            { error: 'Failed to update profile' },
            { status: 500 }
        )
    }
}
