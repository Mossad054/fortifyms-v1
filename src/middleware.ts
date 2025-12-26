import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return request.cookies.get(name)?.value
                },
                set(name: string, value: string, options: CookieOptions) {
                    request.cookies.set({
                        name,
                        value,
                        ...options,
                    })
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    })
                    response.cookies.set({
                        name,
                        value,
                        ...options,
                    })
                },
                remove(name: string, options: CookieOptions) {
                    request.cookies.set({
                        name,
                        value: '',
                        ...options,
                    })
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    })
                    response.cookies.set({
                        name,
                        value: '',
                        ...options,
                    })
                },
            },
        }
    )

    const { data: { session } } = await supabase.auth.getSession()

    // Protected routes pattern
    const protectedRoutes = ['/dashboard', '/analytics', '/compliance', '/procurement']
    const isProtectedRoute = protectedRoutes.some(path => request.nextUrl.pathname.startsWith(path))

    // 1. Redirect unauthenticated users to login
    if (isProtectedRoute && !session) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    // 2. Redirect authenticated users from root/login to their specific dashboard
    // Only redirect if they are actively visiting root or login, to avoid loops
    if (session && (request.nextUrl.pathname === '/' || request.nextUrl.pathname === '/login')) {
        const role = session.user.user_metadata?.role as string | undefined

        // Role-Based Routing Logic
        switch (role) {
            case 'MILL_OPERATOR':
                return NextResponse.redirect(new URL('/dashboard/operator', request.url))
            case 'MILL_MANAGER':
                return NextResponse.redirect(new URL('/dashboard/manager', request.url))
            case 'INSTITUTIONAL_BUYER':
                return NextResponse.redirect(new URL('/procurement/buyer', request.url))
            case 'FWGA_INSPECTOR': // Changed from INSPECTOR to match valid roles
                return NextResponse.redirect(new URL('/compliance/inspector', request.url))
            case 'SYSTEM_ADMIN': // Changed from ADMIN to match valid roles
                return NextResponse.redirect(new URL('/analytics', request.url))
            case 'LOGISTICS_PLANNER':
                return NextResponse.redirect(new URL('/dashboard/logistics', request.url))
            case 'FWGA_PROGRAM_MANAGER':
                return NextResponse.redirect(new URL('/dashboard/program-manager', request.url))
            default:
                // Fallback for new users or undefined roles
                // Don't redirect if already on a dashboard to prevent loops
                if (!request.nextUrl.pathname.startsWith('/dashboard')) {
                    return NextResponse.redirect(new URL('/dashboard', request.url))
                }
        }
    }

    return response
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - api/auth (auth routes)
         */
        '/((?!_next/static|_next/image|favicon.ico|api/auth).*)',
    ],
}
