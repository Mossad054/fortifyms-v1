"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, ShieldCheck, LayoutDashboard } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import dashboardImg from "@/assets/dashboard.JPG";

export const Hero = () => {
    const [user, setUser] = useState<any>(null);
    const supabase = createClient();

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        };
        getUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, [supabase]);

    // Helper function to get dashboard URL based on role
    const getDashboardUrl = (role: string | undefined) => {
        switch (role) {
            case 'MILL_OPERATOR':
                return '/dashboard/operator';
            case 'MILL_MANAGER':
                return '/dashboard/manager';
            case 'INSTITUTIONAL_BUYER':
                return '/procurement/buyer';
            case 'INSPECTOR':
                return '/compliance/inspector';
            case 'SYSTEM_ADMIN':
                return '/analytics';
            case 'LOGISTICS_PLANNER':
                return '/dashboard/logistics';
            case 'PROGRAM_MANAGER':
                return '/dashboard/program-manager';
            default:
                return '/dashboard';
        }
    };

    return (
        <section className="relative min-h-screen flex items-center pt-24 pb-32 overflow-hidden bg-primary text-white">
            {/* Background Gradients - Subtle glows to match the clean dark look */}
            <div className="absolute top-[-20%] left-[-10%] w-[1000px] h-[1000px] bg-white/5 rounded-full blur-3xl opacity-50 pointer-events-none" />
            <div className="absolute top-[20%] right-[-10%] w-[800px] h-[800px] bg-accent/5 rounded-full blur-3xl opacity-30 pointer-events-none" />

            <div className="container mx-auto px-4 lg:px-8 relative z-10 grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

                {/* Left Column: Text Content */}
                <div className="max-w-2xl">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 text-white/90 text-sm font-medium mb-8 animate-fade-in backdrop-blur-sm">
                        <ShieldCheck className="w-4 h-4 text-orange" />
                        Trusted by all stakeholders
                    </div>

                    {/* Main Headline */}
                    <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] mb-8 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
                        <span className="text-orange">Strengthening Public Health Through</span> <span className="text-accent">Food Fortification.</span>
                    </h1>

                    {/* Description */}
                    <p className="text-lg md:text-xl text-white/80 mb-6 leading-relaxed max-w-xl animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
                        Your comprehensive resources portal  for food fortification,quality assurance , compliance and policy tracking, and data-driven insights to combat micronutrient deficiencies. .
                    </p>

                    {/* CTA Button */}
                    <div className="flex flex-col sm:flex-row items-center gap-4 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
                        {user ? (
                            <Link href={getDashboardUrl(user.user_metadata?.role)}>
                                <Button size="lg" className="bg-accent hover:bg-orange text-primary font-semibold min-w-[180px] h-14 text-base rounded-xl flex items-center gap-2 transition-all duration-300">
                                    <LayoutDashboard className="w-5 h-5" />
                                    Go to Dashboard
                                    <ArrowRight className="ml-1 w-4 h-4" />
                                </Button>
                            </Link>
                        ) : (
                            <Link href="/auth">
                                <Button size="lg" className="bg-accent hover:bg-orange text-primary font-semibold min-w-[160px] h-14 text-base rounded-xl transition-all duration-300">
                                    Get a demo
                                    <ArrowRight className="ml-2 w-4 h-4" />
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>

                {/* Right Column: Dashboard Image & Floating Cards */}
                <div className="relative animate-fade-in lg:h-auto mt-12 lg:mt-0 lg:pb-16 block" style={{ animationDelay: "0.5s" }}>
                    {/* Main Image Container */}
                    <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl border-4 border-white/5 bg-white/5">
                        <img
                            src={dashboardImg.src}
                            alt="Fortification Dashboard Interface"
                            className="w-full h-auto object-cover"
                        />
                    </div>

                    {/* Floating Card: Compliance Rate (Bottom Left) */}
                    <div className="absolute -bottom-6 -left-6 bg-teal-800/90 backdrop-blur-md p-5 rounded-2xl shadow-xl border border-white/10 text-white animate-float z-20" style={{ animationDelay: "1s" }}>
                        <p className="text-3xl font-bold mb-1">94.2%</p>
                        <p className="text-sm text-white/80 font-medium">Compliance Rate</p>
                    </div>

                    {/* Floating Card: Lives Impacted (Top Right) */}
                    <div className="absolute top-10 -right-10 bg-accent text-primary p-4 px-6 rounded-2xl shadow-xl shadow-accent/20 animate-float z-20" style={{ animationDelay: "2s" }}>
                        <p className="text-2xl font-bold mb-0">Up to 500 million</p>
                        <p className="text-xs font-semibold uppercase tracking-wider opacity-80">People Impacted</p>
                    </div>
                </div>
            </div>

            {/* Wave Divider & Features Strip */}
            <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0]">
                {/* Features Strip */}
                <div className="absolute bottom-20 left-0 w-full z-20">
                    <div className="container mx-auto px-4 lg:px-8">
                        <div className="flex flex-wrap gap-8 text-white/90 text-sm font-medium">
                            <div className="flex items-center gap-2 group cursor-default transition-colors">
                                <span className="bg-accent/20 p-1 rounded-full group-hover:bg-accent transition-colors duration-300"><ShieldCheck className="w-3 h-3 text-accent group-hover:text-primary transition-colors duration-300" /></span>
                                <span className="group-hover:text-accent transition-colors duration-300">One-click compliance</span>
                            </div>
                            <div className="flex items-center gap-2 group cursor-default transition-colors">
                                <span className="bg-accent/20 p-1 rounded-full group-hover:bg-accent transition-colors duration-300"><ShieldCheck className="w-3 h-3 text-accent group-hover:text-primary transition-colors duration-300" /></span>
                                <span className="group-hover:text-accent transition-colors duration-300">Global standards</span>
                            </div>
                            <div className="flex items-center gap-2 group cursor-default transition-colors">
                                <span className="bg-accent/20 p-1 rounded-full group-hover:bg-accent transition-colors duration-300"><ShieldCheck className="w-3 h-3 text-accent group-hover:text-primary transition-colors duration-300" /></span>
                                <span className="group-hover:text-accent transition-colors duration-300">Evidence-based</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Wave SVG */}
                <svg className="relative block w-[calc(118%+1.3px)] h-[80px] -rotate-180" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                    <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="fill-white"></path>
                </svg>
            </div>
        </section>
    );
};
