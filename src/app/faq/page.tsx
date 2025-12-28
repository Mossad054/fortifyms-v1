import { Navigation } from "@/components/landing/Navigation";
import { FAQ } from "@/components/landing/FAQ";
import { Footer } from "@/components/landing/Footer";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata = {
    title: "Frequently Asked Questions | Food Fortification Portal",
    description: "Find answers to common questions about the Food Fortification Portal and how it supports the global fortification ecosystem.",
};

export default function FAQPage() {
    return (
        <div className="min-h-screen bg-background">
            <Navigation />
            <main className="pt-24 pb-12">
                <div className="container mx-auto px-4 lg:px-8">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-orange font-bold hover:gap-3 transition-all mb-8 group"
                    >
                        <ArrowRight className="w-4 h-4 rotate-180" />
                        Return to Home Page
                    </Link>
                </div>
                <FAQ />
            </main>
            <Footer />
        </div>
    );
}
