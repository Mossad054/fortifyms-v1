import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Fortymis",
    description: "Fortified Food Procurement Optimization",
};

import Navbar from "@/components/navbar";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${inter.className} min-h-screen bg-[#F0EFEA] text-gray-900 font-sans antialiased selection:bg-green-100 selection:text-green-900`}>
                <Navbar />
                {children}
            </body>
        </html>
    );
}
