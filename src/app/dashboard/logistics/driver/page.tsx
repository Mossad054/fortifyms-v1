'use client'

import { DriverView } from './driver-view'

// This page acts as the mobile container for the driver app
export default function DriverPage() {
    return (
        <div className="min-h-screen bg-gray-50 flex justify-center">
            <div className="w-full max-w-md bg-white min-h-screen shadow-2xl overflow-hidden">
                <DriverView />
            </div>
        </div>
    )
}
