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
    const protectedRoutes = ['/dashboard', '/analytics', '/compliance', '/procurement', '/equipment', '/maintenance', '/production', '/profile', '/settings']
    const isProtectedRoute = protectedRoutes.some(path => request.nextUrl.pathname.startsWith(path))

    // Public auth routes
    const authRoutes = ['/auth', '/login', '/register']
    const isAuthRoute = authRoutes.some(path => request.nextUrl.pathname.startsWith(path))

    // 1. Redirect unauthenticated users trying to access protected routes to /auth
    if (isProtectedRoute && !session) {
        return NextResponse.redirect(new URL('/auth', request.url))
    }

    // 2. Redirect authenticated users from auth pages to landing page
    // Let them navigate to their dashboards from there
    if (session && isAuthRoute) {
        return NextResponse.redirect(new URL('/', request.url))
    }

    // 3. Allow authenticated users to stay on landing page (/)
    // They will see auth-aware navigation with dashboard links

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
