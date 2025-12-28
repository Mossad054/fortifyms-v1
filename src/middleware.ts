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
    const isAuthRoute = request.nextUrl.pathname.startsWith('/auth')

    // 1. Redirect /login and /register to /auth to ensure role selection is used
    const legacyAuthRoutes = ['/login', '/register']
    if (legacyAuthRoutes.some(path => request.nextUrl.pathname.startsWith(path))) {
        return NextResponse.redirect(new URL('/auth', request.url))
    }

    // 2. Redirect unauthenticated users trying to access protected routes to /auth
    if (isProtectedRoute && !session) {
        return NextResponse.redirect(new URL('/auth', request.url))
    }

    // 3. Roll-based access enforcement for dashboards
    if (session && isProtectedRoute) {
        const userRole = session.user.user_metadata?.role;
        const path = request.nextUrl.pathname;

        // Map paths to required roles
        const rolePaths: Record<string, string[]> = {
            '/dashboard/operator': ['MILL_OPERATOR'],
            '/dashboard/manager': ['MILL_MANAGER'],
            '/dashboard/logistics': ['LOGISTICS_PLANNER'],
            '/dashboard/program-manager': ['PROGRAM_MANAGER'],
            '/compliance/inspector': ['INSPECTOR'],
            '/analytics': ['SYSTEM_ADMIN'],
            '/procurement/buyer': ['INSTITUTIONAL_BUYER'],
        }

        // Check if current path is a restricted role path
        for (const [restrictedPath, allowedRoles] of Object.entries(rolePaths)) {
            if (path.startsWith(restrictedPath)) {
                if (!allowedRoles.includes(userRole)) {
                    // Unauthorized access for this role - redirect back to landing or their dashboard
                    return NextResponse.redirect(new URL('/', request.url))
                }
            }
        }
    }

    // 4. Redirect authenticated users from auth pages to their dashboard
    if (session && isAuthRoute) {
        const userRole = session.user.user_metadata?.role;
        const getDashboardUrl = (role: string) => {
            switch (role) {
                case 'MILL_OPERATOR': return '/dashboard/operator';
                case 'MILL_MANAGER': return '/dashboard/manager';
                case 'LOGISTICS_PLANNER': return '/dashboard/logistics';
                case 'PROGRAM_MANAGER': return '/dashboard/program-manager';
                case 'INSPECTOR': return '/compliance/inspector';
                case 'SYSTEM_ADMIN': return '/analytics';
                case 'INSTITUTIONAL_BUYER': return '/procurement/buyer';
                default: return '/';
            }
        };
        const dashboardUrl = getDashboardUrl(userRole);
        return NextResponse.redirect(new URL(dashboardUrl, request.url))
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
