"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Menu, X, Leaf, ChevronDown, LayoutDashboard, LogOut } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Navigation = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [user, setUser] = useState<any>(null);
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

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

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push('/');
        router.refresh();
    };

    // Helper function to get dashboard URL based on role
    const getDashboardUrl = (role: string | undefined) => {
        switch (role) {
            case 'MILL_OPERATOR':
                return '/dashboard/operator';
            case 'MILL_MANAGER':
                return '/dashboard/manager';
            case 'INSTITUTIONAL_BUYER':
                return '/procurement/buyer';
            case 'FWGA_INSPECTOR':
                return '/compliance/inspector';
            case 'SYSTEM_ADMIN':
                return '/analytics';
            case 'LOGISTICS_PLANNER':
                return '/dashboard/logistics';
            case 'FWGA_PROGRAM_MANAGER':
                return '/dashboard/program-manager';
            default:
                return '/dashboard';
        }
    };

    const navLinks = [
        { label: "About", href: "#about" },
        { label: "Resources", href: "#resources" },
        { label: "Statistics", href: "#statistics" },
        { label: "Partners", href: "#partners" },
        { label: "Contact", href: "#contact" },
    ];

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "bg-primary/95 backdrop-blur-md shadow-sm py-4" : "bg-transparent py-6"
                }`}
        >
            <div className="container mx-auto px-4 md:px-8 flex items-center justify-between">
                <a href="/" className="flex items-center gap-2 group">
                    <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors duration-300">
                        <Leaf className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-display font-semibold text-lg text-white tracking-tight">
                        Food Fortification Portal
                    </span>
                </a>

                {/* Desktop Navigation */}
                <div className="hidden lg:flex items-center gap-8">
                    <div className="flex items-center gap-8">
                        {navLinks.map((link) => (
                            <a
                                key={link.label}
                                href={link.href}
                                className="relative group text-sm font-medium text-white/90 hover:text-white transition-colors duration-300"
                            >
                                {link.label}
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full"></span>
                            </a>
                        ))}
                    </div>
                </div>

                <div className="hidden lg:flex items-center gap-6">
                    {user ? (
                        <>
                            <Link href={getDashboardUrl(user.user_metadata?.role)}>
                                <Button className="bg-white hover:bg-white/90 text-primary font-semibold min-w-[140px] transition-all duration-300 hover:scale-105 active:scale-95 shadow-md hover:shadow-lg flex items-center gap-2">
                                    <LayoutDashboard className="w-4 h-4" />
                                    Go to Dashboard
                                </Button>
                            </Link>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:bg-white/10">
                                        <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center text-white border border-white/30 font-semibold">
                                            {user.email?.charAt(0).toUpperCase()}
                                        </div>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56" align="end" forceMount>
                                    <DropdownMenuLabel className="font-normal">
                                        <div className="flex flex-col space-y-1">
                                            <p className="text-sm font-medium leading-none">
                                                {user.user_metadata?.full_name || 'User'}
                                            </p>
                                            <p className="text-xs leading-none text-muted-foreground">
                                                {user.email}
                                            </p>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={handleSignOut} className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer">
                                        <LogOut className="mr-2 h-4 w-4" />
                                        <span>Log out</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </>
                    ) : (
                        <>
                            <Link href="/auth" className="text-sm font-medium text-white hover:text-white/80 flex items-center gap-1 hover:scale-105 transition-all duration-300">
                                Sign In
                                <ChevronDown className="w-4 h-4" />
                            </Link>
                            <Link href="/auth?tab=signup">
                                <Button className="bg-white hover:bg-white/90 text-primary font-semibold min-w-[120px] transition-all duration-300 hover:scale-105 active:scale-95 shadow-md hover:shadow-lg">
                                    Get a demo
                                </Button>
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="lg:hidden p-2 text-white"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Navigation */}
            {isMobileMenuOpen && (
                <div className="lg:hidden absolute top-full left-0 right-0 bg-primary border-t border-white/10 p-4 shadow-lg animate-in slide-in-from-top-5">
                    <div className="flex flex-col gap-4">
                        {navLinks.map((link) => (
                            <a
                                key={link.label}
                                href={link.href}
                                className="block py-2 text-white/90 hover:text-white font-medium"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                {link.label}
                            </a>
                        ))}
                        <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-white/10">
                            {user ? (
                                <>
                                    <Link href={getDashboardUrl(user.user_metadata?.role)}>
                                        <Button className="w-full bg-white text-primary hover:bg-white/90 flex items-center justify-center gap-2">
                                            <LayoutDashboard className="w-4 h-4" />
                                            Go to Dashboard
                                        </Button>
                                    </Link>
                                    <div className="px-3 py-2 bg-white/10 rounded-md">
                                        <p className="text-sm font-medium text-white">
                                            {user.user_metadata?.full_name || 'User'}
                                        </p>
                                        <p className="text-xs text-white/70">{user.email}</p>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        className="w-full justify-start text-red-300 hover:bg-red-500/10 hover:text-red-200"
                                        onClick={handleSignOut}
                                    >
                                        <LogOut className="w-4 h-4 mr-2" />
                                        Log out
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Link href="/auth">
                                        <Button variant="ghost" className="w-full justify-start text-white hover:bg-white/10 hover:text-white">
                                            Sign In
                                        </Button>
                                    </Link>
                                    <Link href="/auth?tab=signup">
                                        <Button className="w-full bg-white text-primary hover:bg-white/90">
                                            Get a demo
                                        </Button>
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};
