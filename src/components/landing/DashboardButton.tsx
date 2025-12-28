"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { LayoutDashboard, ArrowRight } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

interface LandingDashboardButtonProps {
    className?: string;
    variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "accent";
}

export const LandingDashboardButton = ({ className, variant = "accent" }: LandingDashboardButtonProps) => {
    const [user, setUser] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showMessage, setShowMessage] = useState(false);
    const supabase = createClient();
    const router = useRouter();

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
            case 'INSPECTOR': return '/compliance/inspector';
            case 'SYSTEM_ADMIN': return '/analytics';
            case 'LOGISTICS_PLANNER': return '/dashboard/logistics';
            case 'PROGRAM_MANAGER': return '/dashboard/program-manager';
            default: return '/dashboard';
        }
    };

    const handleClick = (e: React.MouseEvent) => {
        if (!user) {
            e.preventDefault();
            setShowMessage(true);
            setTimeout(() => {
                router.push('/auth');
            }, 1500);
            setTimeout(() => setShowMessage(false), 3000);
        }
    };

    const dashboardUrl = user ? getDashboardUrl(user.user_metadata?.role) : "/auth";

    // We keep the label "Go to Dashboard" as requested, even if not logged in (it will redirect to auth)
    const label = "Go to Dashboard";

    return (
        <>
            {showMessage && (
                <div className="fixed top-4 right-4 z-50 bg-orange text-white px-6 py-3 rounded-lg shadow-lg animate-fade-in">
                    Please sign in or sign up to access the dashboard
                </div>
            )}
            <Link href={dashboardUrl} onClick={handleClick}>
                <Button
                    size="default"
                    variant={variant === "accent" ? "default" : variant}
                    className={`${variant === "accent" ? "bg-accent hover:bg-orange text-primary shadow-accent/20" : "shadow-gray-200"} font-semibold px-8 h-12 text-sm rounded-xl flex items-center justify-center gap-2 transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg ${className}`}
                >
                    <LayoutDashboard className="w-4 h-4" />
                    {label}
                    <ArrowRight className="ml-1 w-3.5 h-3.5" />
                </Button>
            </Link>
        </>
    );
};
