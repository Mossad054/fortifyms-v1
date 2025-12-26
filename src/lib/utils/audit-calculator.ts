import { ChecklistTemplate, AuditResponse } from '@/lib/types/compliance-audit'

export interface AuditResult {
    totalScore: number;
    totalMax: number;
    overallPercent: number;
    grade: string;
    criticalFailure: boolean;
    sectionFailures: string[];
    calculationHash: string;
}

export function calculateAuditResult(
    template: ChecklistTemplate,
    responses: Record<string, AuditResponse>
): AuditResult {
    let totalScore = 0
    let totalMax = 0
    let criticalFailure = false
    let sectionFailures: string[] = []

    template.sections.forEach(section => {
        let sectionScore = 0
        let sectionMax = 0

        section.items.forEach(item => {
            const response = responses[item.id]

            // Denominator Exclusion for N/A
            if (response?.isNA) return

            const itemMax = item.weight || 0
            sectionMax += itemMax

            if (response) {
                sectionScore += (response.score || 0)
                if (item.criticality === 'Critical' && response.isNonCompliant && response.flagLevel === 'Red') {
                    criticalFailure = true
                }
            }
        })

        totalScore += sectionScore
        totalMax += sectionMax

        if (section.minimumPassThreshold) {
            const percentage = sectionMax > 0 ? (sectionScore / sectionMax) * 100 : 0
            if (percentage < section.minimumPassThreshold) {
                sectionFailures.push(section.title)
            }
        }
    })

    const overallPercent = totalMax > 0 ? (totalScore / totalMax) * 100 : 0

    let grade = ''
    if (criticalFailure) grade = 'Non-Compliant (Critical Failure)'
    else if (sectionFailures.length > 0) grade = `Non-Compliant (${sectionFailures.length} Section Failures)`
    else if (overallPercent >= 90) grade = 'Excellent'
    else if (overallPercent >= 75) grade = 'Good'
    else if (overallPercent >= 60) grade = 'Needs Improvement'
    else grade = 'Non-Compliant'

    // Simple deterministic hash for demo (in production use a crypto library)
    const rawData = JSON.stringify({ totalScore, totalMax, criticalFailure, sectionFailures })
    const calculationHash = `v1-${btoa(rawData).slice(0, 16)}`

    return {
        totalScore,
        totalMax,
        overallPercent,
        grade,
        criticalFailure,
        sectionFailures,
        calculationHash
    }
}
