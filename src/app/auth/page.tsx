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
import { Leaf } from "lucide-react"

export default function AuthPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [loading, setLoading] = React.useState(false)
    const [error, setError] = React.useState("")
    const [activeTab, setActiveTab] = React.useState(searchParams.get('tab') || 'signin')
    const supabase = createClient()

    const [signInData, setSignInData] = React.useState({
        email: "",
        password: ""
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

        const { error } = await supabase.auth.signInWithPassword({
            email: signInData.email,
            password: signInData.password,
        })

        if (error) {
            setError(error.message)
            setLoading(false)
        } else {
            router.push("/")
            router.refresh()
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

            // Redirect to landing page with success message
            router.push("/?message=Account created successfully")
            router.refresh()

        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[hsl(165,72%,14%)] via-[hsl(165,72%,18%)] to-[hsl(165,72%,12%)] flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            {/* Logo Header */}
            <Link href="/" className="flex items-center gap-2 mb-8 group">
                <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors duration-300">
                    <Leaf className="w-6 h-6 text-white" />
                </div>
                <span className="font-display font-semibold text-xl text-white tracking-tight">
                    Food Fortification Portal
                </span>
            </Link>

            <Card className="w-full max-w-md border-white/20 bg-white/95 backdrop-blur-sm shadow-2xl">
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
                                    <Input
                                        id="signin-password"
                                        type="password"
                                        value={signInData.password}
                                        onChange={(e) => setSignInData({ ...signInData, password: e.target.value })}
                                        disabled={loading}
                                        className="border-[hsl(44,15%,88%)] focus:ring-[hsl(165,72%,14%)]"
                                    />
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
                                    <Input
                                        id="signup-password"
                                        type="password"
                                        required
                                        value={signUpData.password}
                                        onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
                                        disabled={loading}
                                        className="border-[hsl(44,15%,88%)] focus:ring-[hsl(165,72%,14%)]"
                                    />
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
                                        <option value="FWGA_INSPECTOR">FWGA Inspector</option>
                                        <option value="FWGA_PROGRAM_MANAGER">FWGA Program Manager</option>
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
        </div>
    )
}
