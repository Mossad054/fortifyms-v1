import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Driver | Fortymis Logistics',
    description: 'Mobile Driver App',
}

export default function DriverLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-zinc-100">
            {children}
        </div>
    )
}
