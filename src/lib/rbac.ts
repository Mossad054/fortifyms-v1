import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

// Valid roles as defined in the system
export const VALID_ROLES = [
    'MILL_OPERATOR',
    'MILL_TECHNICIAN',
    'MILL_MANAGER',
    'INSPECTOR',
    'PROGRAM_MANAGER',
    'INSTITUTIONAL_BUYER',
    'LOGISTICS_PLANNER',
    'SYSTEM_ADMIN'
] as const

export type UserRole = typeof VALID_ROLES[number]

// Role hierarchy for permission checking
export const ROLE_HIERARCHY: Record<UserRole, number> = {
    SYSTEM_ADMIN: 100,
    PROGRAM_MANAGER: 90,
    INSPECTOR: 80,
    MILL_MANAGER: 70,
    INSTITUTIONAL_BUYER: 60,
    LOGISTICS_PLANNER: 50,
    MILL_TECHNICIAN: 40,
    MILL_OPERATOR: 30,
}

// Permission sets for each role
export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
    SYSTEM_ADMIN: ['*'], // All permissions
    PROGRAM_MANAGER: [
        'view:all_mills',
        'view:analytics',
        'view:reports',
        'manage:users',
        'view:compliance',
        'export:data'
    ],
    INSPECTOR: [
        'view:assigned_mills',
        'review:audits',
        'approve:compliance',
        'view:analytics',
        'manage:certifications'
    ],
    MILL_MANAGER: [
        'manage:mill',
        'create:batches',
        'view:batches',
        'submit:audits',
        'manage:equipment',
        'manage:staff',
        'create:bids',
        'view:orders',
        'view:analytics'
    ],
    MILL_TECHNICIAN: [
        'create:batches',
        'view:batches',
        'log:maintenance',
        'calibrate:equipment',
        'run:diagnostics',
        'view:training'
    ],
    MILL_OPERATOR: [
        'create:batches',
        'view:batches',
        'record:qc',
        'view:diagnostics',
        'view:training'
    ],
    INSTITUTIONAL_BUYER: [
        'create:rfp',
        'view:bids',
        'create:orders',
        'view:deliveries',
        'rate:suppliers'
    ],
    LOGISTICS_PLANNER: [
        'view:orders',
        'plan:routes',
        'assign:drivers',
        'track:deliveries',
        'update:delivery_status'
    ]
}

/**
 * Get the current authenticated user with their role
 */
export async function getCurrentUser() {
    const supabase = createClient()

    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
        return null
    }

    return user
}

/**
 * Check if user has a specific permission
 */
export function hasPermission(userRole: UserRole, permission: string): boolean {
    const permissions = ROLE_PERMISSIONS[userRole]

    // System admin has all permissions
    if (permissions.includes('*')) {
        return true
    }

    return permissions.includes(permission)
}

/**
 * Check if user has any of the specified roles
 */
export function hasRole(userRole: UserRole, allowedRoles: UserRole[]): boolean {
    return allowedRoles.includes(userRole)
}

/**
 * Check if user has sufficient role level
 */
export function hasMinimumRole(userRole: UserRole, minimumRole: UserRole): boolean {
    return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[minimumRole]
}

/**
 * Middleware to protect API routes with role-based access
 */
export async function withAuth(
    handler: (user: any) => Promise<NextResponse>,
    options?: {
        requiredRoles?: UserRole[]
        requiredPermissions?: string[]
        minimumRole?: UserRole
    }
) {
    const user = await getCurrentUser()

    if (!user) {
        return NextResponse.json(
            { error: 'Unauthorized - Please login' },
            { status: 401 }
        )
    }

    // Get user role from metadata
    const userRole = user.user_metadata?.role as UserRole

    if (!userRole || !VALID_ROLES.includes(userRole)) {
        return NextResponse.json(
            { error: 'Invalid user role' },
            { status: 403 }
        )
    }

    // Check role requirements
    if (options?.requiredRoles && !hasRole(userRole, options.requiredRoles)) {
        return NextResponse.json(
            { error: 'Insufficient permissions - Role not authorized' },
            { status: 403 }
        )
    }

    // Check minimum role level
    if (options?.minimumRole && !hasMinimumRole(userRole, options.minimumRole)) {
        return NextResponse.json(
            { error: 'Insufficient permissions - Higher role required' },
            { status: 403 }
        )
    }

    // Check specific permissions
    if (options?.requiredPermissions) {
        const hasAllPermissions = options.requiredPermissions.every(
            permission => hasPermission(userRole, permission)
        )

        if (!hasAllPermissions) {
            return NextResponse.json(
                { error: 'Insufficient permissions' },
                { status: 403 }
            )
        }
    }

    return handler(user)
}
