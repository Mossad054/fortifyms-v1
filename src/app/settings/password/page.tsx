
"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/utils/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"

export default function ChangePasswordPage() {
    const router = useRouter()
    const [loading, setLoading] = React.useState(false)
    const [message, setMessage] = React.useState({ type: "", text: "" })
    const [formData, setFormData] = React.useState({
        newPassword: "",
        confirmPassword: ""
    })
    const supabase = createClient()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setMessage({ type: "", text: "" })

        if (formData.newPassword !== formData.confirmPassword) {
            setMessage({ type: "error", text: "New passwords do not match" })
            setLoading(false)
            return
        }

        try {
            const { error } = await supabase.auth.updateUser({
                password: formData.newPassword
            })

            if (error) throw error

            setMessage({ type: "success", text: "Password updated successfully" })
            setFormData({ newPassword: "", confirmPassword: "" })

        } catch (err: any) {
            setMessage({ type: "error", text: err.message })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="container mx-auto py-10">
            <Card className="max-w-md mx-auto">
                <CardHeader>
                    <CardTitle>Change Password</CardTitle>
                    <CardDescription>
                        Update your account password
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="newPassword">New Password</Label>
                            <Input
                                id="newPassword"
                                type="password"
                                required
                                value={formData.newPassword}
                                onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm New Password</Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                required
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                            />
                        </div>

                        {message.text && (
                            <div className={`text-sm font-medium ${message.type === 'error' ? 'text-red-500' : 'text-green-500'}`}>
                                {message.text}
                            </div>
                        )}

                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? "Updating..." : "Update Password"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
