"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { LayoutDashboard, ArrowRight } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

interface LandingDashboardButtonProps {
    className?: string;
    variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "accent";
}

export const LandingDashboardButton = ({ className, variant = "accent" }: LandingDashboardButtonProps) => {
    const [user, setUser] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        const getUser = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                setUser(user);
            } catch (error) {
                console.error("Error getting user:", error);
            } finally {
                setIsLoading(false);
            }
        };
        getUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            setIsLoading(false);
        });

        return () => subscription.unsubscribe();
    }, [supabase]);

    const getDashboardUrl = (role: string | undefined) => {
        switch (role) {
            case 'MILL_OPERATOR': return '/dashboard/operator';
            case 'MILL_MANAGER': return '/dashboard/manager';
            case 'INSTITUTIONAL_BUYER': return '/procurement/buyer';
            case 'FWGA_INSPECTOR': return '/compliance/inspector';
            case 'SYSTEM_ADMIN': return '/analytics';
            case 'LOGISTICS_PLANNER': return '/dashboard/logistics';
            case 'FWGA_PROGRAM_MANAGER': return '/dashboard/program-manager';
            default: return '/dashboard';
        }
    };

    const dashboardUrl = user ? getDashboardUrl(user.user_metadata?.role) : "/auth";

    // We keep the label "Go to Dashboard" as requested, even if not logged in (it will redirect to auth)
    const label = "Go to Dashboard";

    return (
        <Link href={dashboardUrl}>
            <Button
                size="default"
                variant={variant === "accent" ? "default" : variant}
                className={`${variant === "accent" ? "bg-accent hover:bg-accent/90 text-primary shadow-accent/20" : "shadow-gray-200"} font-semibold px-8 h-12 text-sm rounded-xl flex items-center justify-center gap-2 transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg ${className}`}
            >
                <LayoutDashboard className="w-4 h-4" />
                {label}
                <ArrowRight className="ml-1 w-3.5 h-3.5" />
            </Button>
        </Link>
    );
};
