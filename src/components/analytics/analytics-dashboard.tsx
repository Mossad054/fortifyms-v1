
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

export function AnalyticsDashboard({ userRole, millId }: { userRole: string, millId: string }) {
    return (
        <Card>
            <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4">Fortify Analytics Dashboard (Placeholder)</h2>
                <p>Role: {userRole}</p>
                <p>Mill ID: {millId}</p>
            </CardContent>
        </Card>
    );
}
