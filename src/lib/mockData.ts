
export const generateMockInspectorDashboard = () => ({
    stats: {
        totalAudits: 45,
        pendingReviews: 12,
        completedAudits: 33,
        avgCompliance: 88,
    },
    recentAudits: [],
    upcomingVisits: [],
});

export const generateMockManagerDashboard = () => ({
    stats: {
        productionVolume: 1200,
        complianceScore: 95,
        openIssues: 2,
        lastAuditDate: '2024-11-20',
    },
    alerts: [],
    productionTrends: [],
});

export const generateMockOperatorDashboard = () => ({
    dailyTasks: [],
    equipmentStatus: [],
    recentLogs: [],
});

export const generateMockProgramManagerDashboard = () => ({
    programStats: {
        totalMills: 150,
        avgCompliance: 82,
        criticalAlerts: 5,
    },
    regionalPerformance: [],
    complianceTrends: [],
});
