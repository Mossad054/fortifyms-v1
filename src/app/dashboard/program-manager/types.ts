// Program Manager Dashboard Type Definitions

export type ProgramMetrics = {
    totalFortifiedOutput: {
        value: number // kg
        monthlyTrend: { month: string; value: number }[]
        momChange: number // %
        yoyChange: number // %
    }
    activeCertifiedMills: {
        total: number
        certified: number
        provisional: number
        suspended: number
        newThisMonth: number
    }
    avgComplianceRate: {
        value: number // %
        distribution: {
            aboveTarget: number // % of mills ≥90%
            marginal: number // % of mills 70-89%
            critical: number // % of mills <70%
        }
        trend: { month: string; value: number }[]
    }
    institutionalDeliveries: {
        completedOrders: number
        onTimeRate: number // %
        qualityIssueRate: number // %
        totalValue: number
    }
    peopleReached: {
        value: number
        assumptions: {
            perCapitaConsumption: number // kg/year
            distributionEfficiency: number // %
        }
        breakdown: {
            byRegion: { region: string; count: number }[]
            byCommodity: { commodity: string; count: number }[]
        }
    }
}

export type MillPerformance = {
    millId: string
    millName: string
    region: string
    country: string
    performanceScore: number
    complianceScore: number
    productionConsistency: number
    buyerSatisfaction: number
    ranking: {
        overall: number
        regional: number
        percentile: number
    }
    riskLevel: 'low' | 'medium' | 'high' | 'critical'
    bestPractices?: string[]
}

export type GeographicData = {
    mills: {
        id: string
        name: string
        coordinates: { lat: number; lng: number }
        complianceScore: number
        productionVolume: number
        certificationStatus: string
    }[]
    buyers: {
        id: string
        name: string
        type: 'school' | 'hospital' | 'relief_agency'
        coordinates: { lat: number; lng: number }
    }[]
    supplyRoutes: {
        millId: string
        buyerId: string
        volume: number
    }[]
    regionalProduction: {
        region: string
        totalOutput: number
    }[]
}

// Mock data for development
export const MOCK_PROGRAM_METRICS: ProgramMetrics = {
    totalFortifiedOutput: {
        value: 12500000, // 12.5M kg
        monthlyTrend: [
            { month: 'Jan', value: 950000 },
            { month: 'Feb', value: 980000 },
            { month: 'Mar', value: 1020000 },
            { month: 'Apr', value: 1050000 },
            { month: 'May', value: 1080000 },
            { month: 'Jun', value: 1100000 },
            { month: 'Jul', value: 1050000 },
            { month: 'Aug', value: 1070000 },
            { month: 'Sep', value: 1090000 },
            { month: 'Oct', value: 1110000 },
            { month: 'Nov', value: 1000000 },
            { month: 'Dec', value: 1000000 }
        ],
        momChange: 0, // No change Nov to Dec
        yoyChange: 15.2 // 15.2% increase year-over-year
    },
    activeCertifiedMills: {
        total: 42,
        certified: 35,
        provisional: 5,
        suspended: 2,
        newThisMonth: 3
    },
    avgComplianceRate: {
        value: 87,
        distribution: {
            aboveTarget: 45, // 45% of mills
            marginal: 40,
            critical: 15
        },
        trend: [
            { month: 'Jan', value: 82 },
            { month: 'Feb', value: 83 },
            { month: 'Mar', value: 84 },
            { month: 'Apr', value: 85 },
            { month: 'May', value: 86 },
            { month: 'Jun', value: 87 },
            { month: 'Jul', value: 86 },
            { month: 'Aug', value: 87 },
            { month: 'Sep', value: 88 },
            { month: 'Oct', value: 87 },
            { month: 'Nov', value: 87 },
            { month: 'Dec', value: 87 }
        ]
    },
    institutionalDeliveries: {
        completedOrders: 156,
        onTimeRate: 92,
        qualityIssueRate: 3,
        totalValue: 4500000
    },
    peopleReached: {
        value: 2250000,
        assumptions: {
            perCapitaConsumption: 50, // kg/year
            distributionEfficiency: 90 // %
        },
        breakdown: {
            byRegion: [
                { region: 'Nairobi', count: 650000 },
                { region: 'Rift Valley', count: 520000 },
                { region: 'Coast', count: 450000 },
                { region: 'Central', count: 380000 },
                { region: 'Western', count: 250000 }
            ],
            byCommodity: [
                { commodity: 'Maize', count: 1350000 },
                { commodity: 'Wheat', count: 650000 },
                { commodity: 'Rice', count: 250000 }
            ]
        }
    }
}
