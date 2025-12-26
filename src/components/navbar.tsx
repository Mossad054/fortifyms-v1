'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'
import {
    LogOut,
    User,
    Menu,
    X,
    LayoutDashboard,
    Settings
} from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function Navbar() {
    const [user, setUser] = useState<any>(null)
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const pathname = usePathname()
    const router = useRouter()
    const supabase = createClient()

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            setUser(user)
        }
        getUser()

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null)
        })

        return () => subscription.unsubscribe()
    }, [supabase])

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        router.push('/login')
    }

    // Don't show navbar on login or register pages
    if (pathname === '/login' || pathname === '/register') return null

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-white/20 bg-white/60 backdrop-blur-xl">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-700 flex items-center justify-center text-white font-bold shadow-lg shadow-green-900/20">
                                F
                            </div>
                            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 hidden sm:block">
                                Fortifymis
                            </span>
                        </Link>
                    </div>

                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-4">
                            {/* Navigation Links can go here */}
                        </div>
                    </div>

                    <div className="hidden md:block">
                        <div className="ml-4 flex items-center md:ml-6">
                            {user ? (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:bg-white/50">
                                            <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 border border-green-200">
                                                {user.email?.charAt(0).toUpperCase()}
                                            </div>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-56" align="end" forceMount>
                                        <DropdownMenuLabel className="font-normal">
                                            <div className="flex flex-col space-y-1">
                                                <p className="text-sm font-medium leading-none">User Account</p>
                                                <p className="text-xs leading-none text-muted-foreground">
                                                    {user.email}
                                                </p>
                                            </div>
                                        </DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={() => router.push('/profile')}>
                                            <User className="mr-2 h-4 w-4" />
                                            <span>Profile</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                            <Settings className="mr-2 h-4 w-4" />
                                            <span>Settings</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={handleSignOut} className="text-red-600 focus:text-red-600 focus:bg-red-50">
                                            <LogOut className="mr-2 h-4 w-4" />
                                            <span>Log out</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            ) : (
                                <Link href="/login">
                                    <Button variant="premium" size="sm" className="shadow-lg shadow-green-900/10">
                                        Sign In
                                    </Button>
                                </Link>
                            )}
                        </div>
                    </div>

                    <div className="-mr-2 flex md:hidden">
                        <Button
                            variant="ghost"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
                        >
                            <span className="sr-only">Open main menu</span>
                            {isMenuOpen ? (
                                <X className="block h-6 w-6" aria-hidden="true" />
                            ) : (
                                <Menu className="block h-6 w-6" aria-hidden="true" />
                            )}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-white/90 backdrop-blur-md border-b">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {/* Mobile links */}
                    </div>
                    <div className="pt-4 pb-4 border-t border-gray-200">
                        {user ? (
                            <div className="flex items-center px-5">
                                <div className="flex-shrink-0">
                                    <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold">
                                        {user.email?.charAt(0).toUpperCase()}
                                    </div>
                                </div>
                                <div className="ml-3">
                                    <div className="text-base font-medium leading-none text-gray-800">{user.email}</div>
                                    <div className="text-sm font-medium leading-none text-gray-500 mt-1">{user.user_metadata?.role}</div>
                                </div>
                                <Button variant="ghost" size="icon" className="ml-auto text-red-600" onClick={handleSignOut}>
                                    <LogOut className="h-5 w-5" />
                                </Button>
                            </div>
                        ) : (
                            <div className="px-5">
                                <Link href="/login" className="block w-full">
                                    <Button className="w-full" variant="premium">Sign In</Button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    )
}
