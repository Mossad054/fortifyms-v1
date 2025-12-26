import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Activity, ShieldCheck, Factory } from "lucide-react";

export default function Home() {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <main className="flex-1 flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full pt-20 pb-16">

                <div className="inline-flex items-center rounded-full border border-green-200 bg-green-50 px-3 py-1 text-sm font-medium text-green-800 mb-8 animate-fade-in-up">
                    <span className="flex h-2 w-2 rounded-full bg-green-600 mr-2"></span>
                    System Operational • v2.0
                </div>

                <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 mb-6 max-w-4xl">
                    FortifyMIS <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">Portal</span>
                </h1>

                <p className="text-xl text-gray-600 max-w-2xl mb-10 leading-relaxed">
                    The next-generation platform for ensuring traceability, compliance, and quality in food fortification supply chains.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 w-full justify-center mb-20">
                    <Link href="/login">
                        <Button size="lg" variant="premium" className="w-full sm:w-auto px-10 text-base h-12 rounded-full shadow-lg shadow-green-900/20">
                            Secure Login
                        </Button>
                    </Link>
                </div>

                {/* Feature Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
                    <FeatureCard
                        icon={Factory}
                        title="Production Monitoring"
                        description="Real-time tracking of fortification levels and premix usage efficiency."
                    />
                    <FeatureCard
                        icon={ShieldCheck}
                        title="Digital Compliance"
                        description="Automated audit workflows with instant certification generation."
                    />
                    <FeatureCard
                        icon={Activity}
                        title="Predictive Analytics"
                        description="AI-driven insights to prevent quality deviations before they occur."
                    />
                </div>
            </main>

            {/* Footer */}
            <footer className="py-8 text-center text-sm text-gray-500 border-t border-gray-200/50 bg-white/30 backdrop-blur-sm">
                <p>&copy; {new Date().getFullYear()} FortifyMIS. All rights reserved.</p>
            </footer>
        </div>
    );
}

function FeatureCard({ icon: Icon, title, description }: any) {
    return (
        <div className="p-6 rounded-2xl bg-white/50 border border-white/40 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 backdrop-blur-sm text-left group">
            <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center mb-4 group-hover:bg-green-100 transition-colors">
                <Icon className="w-6 h-6 text-green-700" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
            <p className="text-gray-600 leading-relaxed">{description}</p>
        </div>
    )
}
