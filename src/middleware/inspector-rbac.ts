import { NextRequest, NextResponse } from 'next/server'

/**
 * RBAC Middleware for Inspector Role
 * 
 * Enforces read-only access to operational data for inspectors.
 * Inspectors can only:
 * - Read (GET) production, QC, maintenance, and equipment data
 * - Full access to inspector-specific endpoints
 * - Full access to compliance review workflows
 * 
 * Inspectors CANNOT:
 * - Create, update, or delete operational data
 * - Modify batch records
 * - Edit QC results
 * - Approve maintenance tasks
 */

// Operational endpoints that must be read-only for inspectors
const OPERATIONAL_ENDPOINTS = [
    '/api/batches',
    '/api/qc',
    '/api/maintenance',
    '/api/equipment',
    '/api/production',
]

// Inspector-specific endpoints with full access
const INSPECTOR_ENDPOINTS = [
    '/api/inspector',
    '/api/compliance/audits',
    '/api/compliance/reviews',
]

export function inspectorRBACMiddleware(req: NextRequest) {
    // This would normally get the session from cookies/headers
    // For now, we'll check a header or cookie
    const role = req.headers.get('x-user-role') || req.cookies.get('user_role')?.value

    // Only apply middleware to inspector role
    if (role !== 'inspector') {
        return NextResponse.next()
    }

    const path = req.nextUrl.pathname
    const method = req.method

    // Check if this is an operational endpoint
    const isOperationalEndpoint = OPERATIONAL_ENDPOINTS.some(endpoint =>
        path.startsWith(endpoint)
    )

    // Check if this is an inspector-specific endpoint
    const isInspectorEndpoint = INSPECTOR_ENDPOINTS.some(endpoint =>
        path.startsWith(endpoint)
    )

    // Allow full access to inspector endpoints
    if (isInspectorEndpoint) {
        return NextResponse.next()
    }

    // Enforce read-only for operational endpoints
    if (isOperationalEndpoint && method !== 'GET') {
        return new NextResponse(
            JSON.stringify({
                error: 'Forbidden',
                message: 'Inspectors have read-only access to operational data',
                code: 'INSPECTOR_READ_ONLY'
            }),
            {
                status: 403,
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        )
    }

    // Log inspector access for audit trail
    if (isOperationalEndpoint || isInspectorEndpoint) {
        logInspectorAccess({
            inspectorId: req.headers.get('x-user-id') || 'unknown',
            path,
            method,
            timestamp: new Date().toISOString(),
            ip: req.ip || req.headers.get('x-forwarded-for') || 'unknown',
        })
    }

    return NextResponse.next()
}

// Helper function to log inspector access
async function logInspectorAccess(data: {
    inspectorId: string
    path: string
    method: string
    timestamp: string
    ip: string
}) {
    // TODO: Implement actual logging to database
    console.log('[INSPECTOR ACCESS]', data)

    // In production, this would write to audit trail table:
    // await db.inspectorAuditTrail.create({ data })
}

// Export for use in middleware.ts
export const config = {
    matcher: [
        '/api/batches/:path*',
        '/api/qc/:path*',
        '/api/maintenance/:path*',
        '/api/equipment/:path*',
        '/api/production/:path*',
        '/api/inspector/:path*',
        '/api/compliance/:path*',
    ],
}
