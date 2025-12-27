'use client'

import * as React from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from '@/components/ui/button'
import { Bell } from 'lucide-react'

export function NotificationCenter() {
    const alerts = [
        { id: 1, title: 'Compliance Alert', msg: 'Doser calibration overdue by 2 days.', type: 'critical', time: '2h ago' },
        { id: 2, title: 'New Course', msg: 'Advanced Premix Handling module available.', type: 'info', time: '5h ago' },
        { id: 3, title: 'System Update', msg: 'Maintenance scheduled for tonight.', type: 'default', time: '1d ago' },
    ]

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative rounded-full w-10 h-10">
                    <Bell className="w-6 h-6 text-zinc-600" />
                    <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>
                    <div className="flex justify-between items-center">
                        <span>Notifications</span>
                        <span className="text-xs text-muted-foreground font-normal">3 unread</span>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="max-h-[300px] overflow-y-auto">
                    {alerts.map(alert => (
                        <DropdownMenuItem key={alert.id} className="cursor-pointer flex flex-col items-start p-3 focus:bg-zinc-50">
                            <div className="flex w-full justify-between items-start mb-1">
                                <span className={`font-medium text-sm ${alert.type === 'critical' ? 'text-red-600' : 'text-zinc-900'}`}>
                                    {alert.title}
                                </span>
                                <span className="text-xs text-muted-foreground">{alert.time}</span>
                            </div>
                            <p className="text-xs text-zinc-500 leading-snug line-clamp-2">
                                {alert.msg}
                            </p>
                        </DropdownMenuItem>
                    ))}
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="justify-center text-xs text-muted-foreground cursor-pointer">
                    Mark all as read
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
