import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ user: null }, { status: 200 })
    }

    const user = session.user as any
    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        millId: user.millId
      }
    })
  } catch (error) {
    console.error('Session API error:', error)
    return NextResponse.json({ user: null }, { status: 500 })
  }
}
