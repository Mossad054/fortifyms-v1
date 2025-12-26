import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/lib/rbac'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/compliance/templates
 * Get compliance checklist templates
 */
export async function GET(request: NextRequest) {
  return withAuth(async (user) => {
    const { searchParams } = new URL(request.url)
    const commodity = searchParams.get('commodity')
    const country = searchParams.get('country')
    const active = searchParams.get('active')

    try {
      const where: any = {}

      if (commodity) where.commodity = commodity
      if (country) where.country = country
      if (active === 'true') where.isActive = true

      const templates = await prisma.complianceTemplate.findMany({
        where,
        orderBy: { version: 'desc' },
        include: {
          _count: {
            select: { audits: true }
          }
        }
      })

      return NextResponse.json({ templates })
    } catch (error) {
      console.error('Error fetching templates:', error)
      return NextResponse.json(
        { error: 'Failed to fetch templates' },
        { status: 500 }
      )
    }
  })
}

/**
 * POST /api/compliance/templates
 * Create a new compliance template
 */
export async function POST(request: NextRequest) {
  return withAuth(async (user) => {
    try {
      const body = await request.json()
      const {
        name,
        description,
        commodity,
        country,
        standard,
        certificationType,
        sections,
        scoringRules
      } = body

      if (!name || !commodity || !sections) {
        return NextResponse.json(
          { error: 'Name, commodity, and sections are required' },
          { status: 400 }
        )
      }

      // Get latest version for this template name
      const latestVersion = await prisma.complianceTemplate.findFirst({
        where: { name },
        orderBy: { version: 'desc' },
        select: { version: true }
      })

      const version = latestVersion ? latestVersion.version + 1 : 1

      const template = await prisma.complianceTemplate.create({
        data: {
          name,
          description,
          commodity,
          country,
          standard,
          certificationType,
          version,
          sections,
          scoringRules: scoringRules || {
            passingThreshold: 75,
            categories: {
              excellent: { min: 90, max: 100 },
              good: { min: 75, max: 89 },
              needsImprovement: { min: 60, max: 74 },
              nonCompliant: { min: 0, max: 59 }
            }
          },
          isActive: true
        }
      })

      // Log the action
      const dbUser = await prisma.user.findUnique({ where: { email: user.email! } })
      if (dbUser) {
        await prisma.auditLog.create({
          data: {
            userId: dbUser.id,
            action: 'TEMPLATE_CREATE',
            resourceType: 'COMPLIANCE_TEMPLATE',
            resourceId: template.id,
            newValues: JSON.stringify(template),
            ipAddress: request.ip || 'unknown',
            userAgent: request.headers.get('user-agent') || 'unknown'
          }
        })
      }

      return NextResponse.json({
        message: 'Template created successfully',
        template
      }, { status: 201 })
    } catch (error) {
      console.error('Error creating template:', error)
      return NextResponse.json(
        { error: 'Failed to create template' },
        { status: 500 }
      )
    }
  }, {
    requiredRoles: ['SYSTEM_ADMIN', 'FWGA_PROGRAM_MANAGER', 'FWGA_INSPECTOR']
  })
}