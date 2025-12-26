import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/lib/rbac'
import { prisma } from '@/lib/prisma'
import QRCode from 'qrcode'

/**
 * GET /api/batches/[id]/qr
 * Generate QR code for batch
 */
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    return withAuth(async (user) => {
        try {
            const batch = await prisma.batchLog.findUnique({
                where: { id: params.id },
                include: {
                    mill: {
                        select: {
                            name: true,
                            code: true,
                            certificationStatus: true
                        }
                    },
                    qcTests: {
                        select: {
                            testType: true,
                            result: true,
                            status: true
                        }
                    }
                }
            })

            if (!batch) {
                return NextResponse.json(
                    { error: 'Batch not found' },
                    { status: 404 }
                )
            }

            // Generate verification URL
            const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/verify/${batch.batchId}`

            // Generate QR code
            const qrCodeDataUrl = await QRCode.toDataURL(verificationUrl, {
                width: 300,
                margin: 2,
                color: {
                    dark: '#000000',
                    light: '#FFFFFF'
                }
            })

            return NextResponse.json({
                qrCode: qrCodeDataUrl,
                verificationUrl,
                batchId: batch.batchId
            })
        } catch (error) {
            console.error('Error generating QR code:', error)
            return NextResponse.json(
                { error: 'Failed to generate QR code' },
                { status: 500 }
            )
        }
    })
}
