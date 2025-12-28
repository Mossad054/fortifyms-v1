'use client'

import * as React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { Leaf, Eye, EyeOff, Copy, CheckCircle2 } from "lucide-react"

const DEMO_USERS = [
    { role: "Mill Operator", email: "milloperator@fortify.com", password: "Test123@", technicalRole: "MILL_OPERATOR" },
    { role: "Mill Manager", email: "millmanager@fortify.com", password: "Test123@", technicalRole: "MILL_MANAGER" },
    { role: "Program Inspector", email: "programinspector@fortify.com", password: "Test123@", technicalRole: "INSPECTOR" },
    { role: "Program Manager", email: "programmanager@fortify.com", password: "Test123@", technicalRole: "PROGRAM_MANAGER" },
    { role: "Institutional Buyer", email: "institutionalbuyer@fortify.com", password: "Test123@", technicalRole: "INSTITUTIONAL_BUYER" },
    { role: "Logistics", email: "logistics@fortify.com", password: "Test123@", technicalRole: "LOGISTICS_PLANNER" },
]

const CopyButton = ({ value, label }: { value: string, label: string }) => {
    const [copied, setCopied] = React.useState(false)

    const handleCopy = async () => {
        await navigator.clipboard.writeText(value)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <button
            onClick={handleCopy}
            className="group flex items-center gap-1 text-[10px] font-bold text-[hsl(165,40%,45%)] hover:text-orange transition-all px-1.5 py-0.5 rounded bg-white border border-zinc-200 hover:border-orange/30 shadow-sm"
            title={`Copy ${label}`}
        >
            {copied ? (
                <>
                    <CheckCircle2 className="w-3 h-3 text-green-600" />
                    <span className="text-green-600">Copied</span>
                </>
            ) : (
                <>
                    <Copy className="w-3 h-3" />
                    <span>{label}</span>
                </>
            )}
        </button>
    )
}

const DemoAccountsCard = () => (
    <Card className="w-full lg:max-w-[340px] border-white/20 bg-white/95 backdrop-blur-sm shadow-2xl hidden lg:block overflow-hidden lg:absolute lg:left-8 lg:top-32 z-30">
        <div className="bg-[hsl(165,72%,14%)] py-4 px-5">
            <span className="text-[11px] font-black text-white uppercase tracking-widest flex items-center gap-2 mb-3">
                <div className="w-2.5 h-2.5 rounded-full bg-orange animate-pulse" />
                Demo Credentials
            </span>
            <div className="flex flex-col gap-2 p-2.5 bg-black/20 rounded-lg border border-white/10">
                <span className="text-[10px] text-white/70 font-bold uppercase tracking-tight">Password for all accounts:</span>
                <div className="flex justify-between items-center bg-white/10 p-2 rounded border border-white/5">
                    <code className="text-sm text-orange font-black font-mono tracking-wider">Test123@</code>
                    <CopyButton value="Test123@" label="Copy Password" />
                </div>
            </div>
        </div>
        <CardContent className="p-0">
            <div className="flex flex-col divide-y divide-zinc-100">
                {DEMO_USERS.map((user) => (
                    <div key={user.email} className="py-4 px-5 flex items-center justify-between group hover:bg-zinc-50/50 transition-colors">
                        <div className="flex flex-col min-w-0 pr-3">
                            <span className="text-[10px] font-black text-orange uppercase tracking-wide mb-1 leading-none">
                                {user.role}
                            </span>
                            <span className="text-[13px] text-zinc-600 font-bold truncate max-w-[180px]">
                                {user.email}
                            </span>
                        </div>
                        <CopyButton value={user.email} label="Copy" />
                    </div>
                ))}
            </div>
        </CardContent>
    </Card>
)

export default function AuthPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [loading, setLoading] = React.useState(false)
    const [error, setError] = React.useState("")
    const [activeTab, setActiveTab] = React.useState(searchParams.get('tab') || 'signin')
    const [showSignInPassword, setShowSignInPassword] = React.useState(false)
    const [showSignUpPassword, setShowSignUpPassword] = React.useState(false)
    const supabase = createClient()

    const [signInData, setSignInData] = React.useState({
        email: "",
        password: "",
        role: "MILL_OPERATOR"
    })

    const [signUpData, setSignUpData] = React.useState({
        name: "",
        email: "",
        password: "",
        role: "MILL_OPERATOR"
    })

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        if (!signInData.email || !signInData.password) {
            setError("Please fill in all fields")
            setLoading(false)
            return
        }

        try {
            // 1. Authenticate with Supabase first
            const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
                email: signInData.email,
                password: signInData.password,
            })

            if (authError) {
                // Provide specific feedback for wrong credentials
                if (authError.message.toLowerCase().includes("invalid login credentials")) {
                    setError("Invalid email or password. Please check your credentials and try again.")
                } else {
                    setError(authError.message)
                }
                setLoading(false)
                return
            }

            // 2. Immediate Role Check from Supabase Metadata (fastest)
            const metadataRole = authData.user?.user_metadata?.role
            if (metadataRole && metadataRole !== signInData.role) {
                await supabase.auth.signOut()
                setError(`Incorrect role selection. This account is registered as a ${metadataRole.replace('_', ' ').toLowerCase().replace('_', ' ')}. Please select the correct role from the dropdown.`)
                setLoading(false)
                return
            }

            // 3. Secondary verification via Prisma (Source of Truth)
            // If this fails due to connection issues, but metadata matched, we can proceed
            try {
                const verifyRes = await fetch("/api/auth/verify-role", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        email: signInData.email,
                        role: signInData.role
                    })
                })

                const verifyData = await verifyRes.json()

                if (!verifyRes.ok) {
                    // If it's a connection error (503) but metadata was there, we proceed gracefully
                    if (verifyRes.status === 503 && metadataRole === signInData.role) {
                        console.warn("Database connection issue, proceeding with metadata verification.")
                    } else if (!verifyData.match) {
                        await supabase.auth.signOut()
                        if (verifyData.registeredRole) {
                            setError(`Incorrect role selection. This account is registered as a ${verifyData.registeredRole.replace('_', ' ').toLowerCase().replace('_', ' ')}.`)
                        } else {
                            setError(verifyData.error || "Role verification failed.")
                        }
                        setLoading(false)
                        return
                    }
                }
            } catch (apiErr) {
                console.error("API check failed:", apiErr)
                // If API is down but metadata matches, we let them in to ensure availability
                if (!metadataRole) {
                    await supabase.auth.signOut()
                    setError("Verification service temporarily unavailable. Please try again later.")
                    setLoading(false)
                    return
                }
            }

            // 4. Successful login and role verification - redirect
            const dashboardUrl = getDashboardUrl(signInData.role)
            router.push(dashboardUrl)
            router.refresh()

        } catch (err: any) {
            console.error("Login error:", err)
            setError("An unexpected error occurred. Please try again.")
            setLoading(false)
        }
    }

    const getDashboardUrl = (role: string) => {
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
    }

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        try {
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: signUpData.email,
                password: signUpData.password,
                options: {
                    data: {
                        full_name: signUpData.name,
                        role: signUpData.role
                    }
                }
            })

            if (authError) throw authError

            if (authData.user) {
                await fetch("/api/auth/register", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(signUpData)
                })
            }

            // Successful signup - redirect to the specific dashboard directly
            const dashboardUrl = getDashboardUrl(signUpData.role)
            router.push(dashboardUrl)
            router.refresh()

        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[hsl(165,72%,14%)] via-[hsl(165,72%,18%)] to-[hsl(165,72%,12%)] relative">

            {/* Logo Header */}
            <div className="absolute top-12 left-1/2 -translate-x-1/2 z-20 w-full flex justify-center">
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors duration-300">
                        <img src="/icon.JPG" alt="Fortify Logo" className="w-full h-full object-cover" />
                    </div>
                    <span className="font-display font-semibold text-xl text-white tracking-tight">
                        Food Fortification Portal
                    </span>
                </Link>
            </div>

            <div className="flex flex-col items-center justify-center min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 relative">
                <DemoAccountsCard />

                <Card className="w-full max-w-md border-white/20 bg-white/95 backdrop-blur-sm shadow-2xl z-10">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl font-bold tracking-tight text-center text-[hsl(165,72%,14%)]">
                            Welcome
                        </CardTitle>
                        <CardDescription className="text-center text-[hsl(165,40%,35%)]">
                            Sign in to your account or create a new one
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                            <TabsList className="grid w-full grid-cols-2 mb-6 bg-[hsl(44,22%,95%)]">
                                <TabsTrigger
                                    value="signin"
                                    className="data-[state=active]:bg-[hsl(165,72%,14%)] data-[state=active]:text-white"
                                >
                                    Sign In
                                </TabsTrigger>
                                <TabsTrigger
                                    value="signup"
                                    className="data-[state=active]:bg-[hsl(165,72%,14%)] data-[state=active]:text-white"
                                >
                                    Sign Up
                                </TabsTrigger>
                            </TabsList>

                            {/* Sign In Tab */}
                            <TabsContent value="signin">
                                <form onSubmit={handleSignIn} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="signin-email" className="text-[hsl(165,72%,14%)]">Email</Label>
                                        <Input
                                            id="signin-email"
                                            type="email"
                                            placeholder="m@example.com"
                                            value={signInData.email}
                                            onChange={(e) => setSignInData({ ...signInData, email: e.target.value })}
                                            disabled={loading}
                                            className="border-[hsl(44,15%,88%)] focus:ring-[hsl(165,72%,14%)]"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="signin-password" className="text-[hsl(165,72%,14%)]">Password</Label>
                                        <div className="relative">
                                            <Input
                                                id="signin-password"
                                                type={showSignInPassword ? "text" : "password"}
                                                value={signInData.password}
                                                onChange={(e) => setSignInData({ ...signInData, password: e.target.value })}
                                                disabled={loading}
                                                className="border-[hsl(44,15%,88%)] focus:ring-[hsl(165,72%,14%)] pr-10"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowSignInPassword(!showSignInPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                            >
                                                {showSignInPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="signin-role" className="text-[hsl(165,72%,14%)]">Sign in as</Label>
                                        <select
                                            id="signin-role"
                                            className="flex h-9 w-full rounded-md border border-[hsl(44,15%,88%)] bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[hsl(165,72%,14%)] disabled:cursor-not-allowed disabled:opacity-50"
                                            value={signInData.role}
                                            onChange={(e) => setSignInData({ ...signInData, role: e.target.value })}
                                            disabled={loading}
                                        >
                                            <option value="MILL_OPERATOR">Mill Operator</option>
                                            <option value="MILL_MANAGER">Mill Manager</option>
                                            <option value="INSPECTOR">Inspector</option>
                                            <option value="PROGRAM_MANAGER">Program Manager</option>
                                            <option value="INSTITUTIONAL_BUYER">Institutional Buyer</option>
                                            <option value="LOGISTICS_PLANNER">Logistics Planner</option>
                                            <option value="SYSTEM_ADMIN">System Admin</option>
                                        </select>
                                    </div>
                                    {error && (
                                        <div className="text-sm text-red-600 font-medium bg-red-50 p-3 rounded-md">
                                            {error}
                                        </div>
                                    )}
                                    <Button
                                        className="w-full bg-[hsl(165,72%,14%)] hover:bg-[hsl(165,72%,18%)] text-white font-semibold shadow-md transition-all duration-300"
                                        type="submit"
                                        disabled={loading}
                                    >
                                        {loading && (
                                            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                        )}
                                        Sign In
                                    </Button>
                                </form>
                            </TabsContent>

                            {/* Sign Up Tab */}
                            <TabsContent value="signup">
                                <form onSubmit={handleSignUp} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="signup-name" className="text-[hsl(165,72%,14%)]">Full Name</Label>
                                        <Input
                                            id="signup-name"
                                            required
                                            value={signUpData.name}
                                            onChange={(e) => setSignUpData({ ...signUpData, name: e.target.value })}
                                            placeholder="John Doe"
                                            disabled={loading}
                                            className="border-[hsl(44,15%,88%)] focus:ring-[hsl(165,72%,14%)]"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="signup-email" className="text-[hsl(165,72%,14%)]">Email</Label>
                                        <Input
                                            id="signup-email"
                                            type="email"
                                            required
                                            value={signUpData.email}
                                            onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
                                            placeholder="m@example.com"
                                            disabled={loading}
                                            className="border-[hsl(44,15%,88%)] focus:ring-[hsl(165,72%,14%)]"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="signup-password" className="text-[hsl(165,72%,14%)]">Password</Label>
                                        <div className="relative">
                                            <Input
                                                id="signup-password"
                                                type={showSignUpPassword ? "text" : "password"}
                                                required
                                                value={signUpData.password}
                                                onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
                                                disabled={loading}
                                                className="border-[hsl(44,15%,88%)] focus:ring-[hsl(165,72%,14%)] pr-10"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                            >
                                                {showSignUpPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="signup-role" className="text-[hsl(165,72%,14%)]">Role</Label>
                                        <select
                                            id="signup-role"
                                            className="flex h-9 w-full rounded-md border border-[hsl(44,15%,88%)] bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[hsl(165,72%,14%)] disabled:cursor-not-allowed disabled:opacity-50"
                                            value={signUpData.role}
                                            onChange={(e) => setSignUpData({ ...signUpData, role: e.target.value })}
                                            disabled={loading}
                                        >
                                            <option value="MILL_OPERATOR">Mill Operator</option>
                                            <option value="MILL_MANAGER">Mill Manager</option>
                                            <option value="INSPECTOR">Inspector</option>
                                            <option value="PROGRAM_MANAGER">Program Manager</option>
                                            <option value="INSTITUTIONAL_BUYER">Institutional Buyer</option>
                                            <option value="LOGISTICS_PLANNER">Logistics Planner</option>
                                            <option value="SYSTEM_ADMIN">System Admin</option>
                                        </select>
                                    </div>
                                    {error && (
                                        <div className="text-sm text-red-600 font-medium bg-red-50 p-3 rounded-md">
                                            {error}
                                        </div>
                                    )}
                                    <Button
                                        className="w-full bg-[hsl(165,72%,14%)] hover:bg-[hsl(165,72%,18%)] text-white font-semibold shadow-md transition-all duration-300"
                                        type="submit"
                                        disabled={loading}
                                    >
                                        {loading && (
                                            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                        )}
                                        Create Account
                                    </Button>
                                </form>
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-2 text-center text-sm">
                        <div className="text-[hsl(165,40%,35%)]">
                            <Link href="/" className="underline text-[hsl(165,72%,14%)] hover:text-[hsl(165,72%,18%)] font-medium">
                                ← Back to home
                            </Link>
                        </div>
                    </CardFooter>
                </Card>

                {/* Mobile Demo Accounts */}
                <div className="lg:hidden w-full max-w-md mt-6 px-4">
                    <Card className="border-white/10 bg-white/20 backdrop-blur-md overflow-hidden">
                        <CardHeader className="py-4">
                            <CardTitle className="text-xs font-bold text-white flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-orange animate-pulse" />
                                Quick Demo Access
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="px-3 pb-4 space-y-2">
                            {DEMO_USERS.map(user => (
                                <div key={user.email} className="bg-white/95 p-3 rounded-lg border border-white/10 shadow-sm flex flex-col gap-1.5">
                                    <div className="flex justify-between items-center">
                                        <span className="text-[10px] font-black text-orange uppercase tracking-tight">{user.role}</span>
                                        <span className="text-[9px] text-[hsl(165,40%,45%)] px-1.5 py-0.5 bg-zinc-100 rounded-full">{user.technicalRole}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-[11px] gap-2 pt-1 border-t border-zinc-50">
                                        <span className="text-primary font-medium truncate flex-1">{user.email}</span>
                                        <div className="flex gap-1">
                                            <CopyButton value={user.email} label="E" />
                                            <CopyButton value={user.password} label="P" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
