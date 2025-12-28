import { NextRequest, NextResponse } from "next/server"
import { prisma as db } from "@/lib/prisma"

export async function POST(request: NextRequest) {
    try {
        const { email, role } = await request.json()

        if (!email || !role) {
            return NextResponse.json(
                { error: "Email and role are required" },
                { status: 400 }
            )
        }

        const user = await db.user.findUnique({
            where: { email }
        })

        if (!user) {
            return NextResponse.json(
                { error: "No profile found for this email in our database." },
                { status: 404 }
            )
        }

        if (user.role !== role) {
            return NextResponse.json({
                match: false,
                registeredRole: user.role
            })
        }

        return NextResponse.json({
            match: true
        })

    } catch (error: any) {
        console.error("Verify role error:", error)

        // Handle Prisma connection errors specifically
        if (error.code === 'P1001' || error.name === 'PrismaClientInitializationError') {
            return NextResponse.json(
                { error: "Database connection error. Please try again in a few moments." },
                { status: 503 }
            )
        }

        return NextResponse.json(
            { error: "Verification service currently unavailable." },
            { status: 500 }
        )
    }
}
