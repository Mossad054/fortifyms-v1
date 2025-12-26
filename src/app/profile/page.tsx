'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'

export default function ProfilePage() {
    const router = useRouter()
    const [loading, setLoading] = React.useState(true)
    const [saving, setSaving] = React.useState(false)
    const [message, setMessage] = React.useState({ type: '', text: '' })
    const supabase = createClient()

    const [profile, setProfile] = React.useState({
        name: '',
        email: '',
        role: '',
        phoneNumber: '',
        timezone: 'UTC',
        language: 'en'
    })

    React.useEffect(() => {
        loadProfile()
    }, [])

    async function loadProfile() {
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                router.push('/login')
                return
            }

            const response = await fetch('/api/users/me')
            if (response.ok) {
                const data = await response.json()
                setProfile({
                    name: data.name || '',
                    email: data.email || '',
                    role: data.role || '',
                    phoneNumber: data.profile?.phoneNumber || '',
                    timezone: data.profile?.timezone || 'UTC',
                    language: data.profile?.language || 'en'
                })
            }
        } catch (error) {
            console.error('Error loading profile:', error)
        } finally {
            setLoading(false)
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setSaving(true)
        setMessage({ type: '', text: '' })

        try {
            const response = await fetch('/api/users/me', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: profile.name,
                    phoneNumber: profile.phoneNumber,
                    timezone: profile.timezone,
                    language: profile.language
                })
            })

            if (response.ok) {
                setMessage({ type: 'success', text: 'Profile updated successfully' })
            } else {
                const error = await response.json()
                setMessage({ type: 'error', text: error.error || 'Failed to update profile' })
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'An error occurred' })
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-lg">Loading...</div>
            </div>
        )
    }

    return (
        <div className="container mx-auto py-10 max-w-2xl">
            <Card>
                <CardHeader>
                    <CardTitle>User Profile</CardTitle>
                    <CardDescription>
                        Manage your account settings and preferences
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={profile.email}
                                disabled
                                className="bg-gray-100"
                            />
                            <p className="text-sm text-gray-500">Email cannot be changed</p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="role">Role</Label>
                            <Input
                                id="role"
                                value={profile.role.replace(/_/g, ' ')}
                                disabled
                                className="bg-gray-100"
                            />
                            <p className="text-sm text-gray-500">Role is assigned by administrators</p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                                id="name"
                                value={profile.name}
                                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                placeholder="John Doe"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phoneNumber">Phone Number</Label>
                            <Input
                                id="phoneNumber"
                                type="tel"
                                value={profile.phoneNumber}
                                onChange={(e) => setProfile({ ...profile, phoneNumber: e.target.value })}
                                placeholder="+254 700 000000"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="timezone">Timezone</Label>
                            <select
                                id="timezone"
                                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                value={profile.timezone}
                                onChange={(e) => setProfile({ ...profile, timezone: e.target.value })}
                            >
                                <option value="UTC">UTC</option>
                                <option value="Africa/Nairobi">East Africa Time (EAT)</option>
                                <option value="Africa/Lagos">West Africa Time (WAT)</option>
                                <option value="Africa/Johannesburg">South Africa Time (SAST)</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="language">Language</Label>
                            <select
                                id="language"
                                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                value={profile.language}
                                onChange={(e) => setProfile({ ...profile, language: e.target.value })}
                            >
                                <option value="en">English</option>
                                <option value="fr">French</option>
                                <option value="sw">Swahili</option>
                            </select>
                        </div>

                        {message.text && (
                            <div className={`text-sm font-medium ${message.type === 'error' ? 'text-red-500' : 'text-green-500'}`}>
                                {message.text}
                            </div>
                        )}

                        <div className="flex gap-2">
                            <Button type="submit" disabled={saving}>
                                {saving ? 'Saving...' : 'Save Changes'}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.push('/analytics')}
                            >
                                Cancel
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
