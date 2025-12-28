"use client";

import { Navigation } from "@/components/landing/Navigation";
import { Footer } from "@/components/landing/Footer";
import { BookOpen, Globe, MapPin, Library, Search, History, CheckCircle2, X } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function InformationHubPage() {
    return (
        <div className="min-h-screen bg-white text-gray-900 font-sans">
            <Navigation />

            <main className="pt-32 pb-24">
                <div className="container mx-auto px-4 lg:px-8">
                    {/* Header Section */}
                    <div className="max-w-4xl mb-16 relative">
                        <Link href="/#services" className="inline-flex items-center gap-2 text-orange font-bold uppercase tracking-wider text-sm mb-6 hover:gap-3 transition-all">
                            <X className="w-5 h-5" />
                            Back to Services
                        </Link>

                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 rounded-2xl bg-green-50 text-green-600">
                                <BookOpen className="w-10 h-10" strokeWidth={1.5} />
                            </div>
                            <h1 className="font-display text-4xl lg:text-6xl font-bold text-[#0A3225] leading-tight">
                                The Knowledge Backbone of <br /> Global Food Fortification
                            </h1>
                        </div>

                        <p className="text-xl text-gray-600 leading-relaxed font-medium max-w-3xl border-l-4 border-green-600 pl-8 mt-8">
                            The Information Hub is a centralized, authoritative resource designed to ensure every stakeholder works from the same, up-to-date fortification guidance. It transforms fragmented guidelines, standards, and research into a structured, searchable, and actionable knowledge system.
                        </p>
                    </div>

                    {/* Features Grid */}
                    <div className="grid lg:grid-cols-2 gap-12 mb-24">
                        {/* 1. Global & International Guidelines */}
                        <div className="bg-gray-50 rounded-3xl p-10 border border-gray-100 shadow-sm transition-all hover:shadow-md">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-2 rounded-xl bg-white text-green-600 shadow-sm">
                                    <Globe className="w-6 h-6" />
                                </div>
                                <h2 className="font-display text-2xl font-bold text-[#0A3225]">1. Global & International Guidelines</h2>
                            </div>
                            <p className="text-gray-600 mb-6 font-medium">Access officially recognized guidance from leading global health and standards bodies.</p>

                            <div className="space-y-6">
                                <div>
                                    <h4 className="text-sm uppercase tracking-wider font-bold text-green-600 mb-3">Includes:</h4>
                                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-gray-700">
                                        {[
                                            "WHO food fortification guidelines",
                                            "FAO fortification and nutrition standards",
                                            "Codex Alimentarius references",
                                            "Global micronutrient fortification recommendations"
                                        ].map(item => (
                                            <li key={item} className="flex gap-2 items-start text-sm">
                                                <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="p-6 bg-white rounded-2xl border border-gray-100">
                                    <h4 className="text-sm uppercase tracking-wider font-bold text-gray-400 mb-3">How it’s used:</h4>
                                    <ul className="space-y-2 text-sm text-gray-600">
                                        <li>• Inspectors reference standards during audits</li>
                                        <li>• Mills align production and fortification levels</li>
                                        <li>• Program managers ensure national alignment with global best practices</li>
                                    </ul>
                                </div>

                                <div className="text-sm bg-green-600 text-white p-4 rounded-xl">
                                    <span className="font-bold uppercase tracking-tight mr-2">Benefit:</span>
                                    Ensures consistency, credibility, and global alignment across all fortification activities.
                                </div>
                            </div>
                        </div>

                        {/* 2. Regional & National Standards */}
                        <div className="bg-gray-50 rounded-3xl p-10 border border-gray-100 shadow-sm transition-all hover:shadow-md">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-2 rounded-xl bg-white text-green-600 shadow-sm">
                                    <MapPin className="w-6 h-6" />
                                </div>
                                <h2 className="font-display text-2xl font-bold text-[#0A3225]">2. Regional & National Standards</h2>
                            </div>
                            <p className="text-gray-600 mb-6 font-medium">Localized standards mapped to country- and region-specific regulatory requirements.</p>

                            <div className="space-y-6">
                                <div>
                                    <h4 className="text-sm uppercase tracking-wider font-bold text-green-600 mb-3">Includes:</h4>
                                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-gray-700">
                                        {[
                                            "National Bureau of Standards specifications",
                                            "Regional fortification policies",
                                            "Commodity-specific thresholds",
                                            "Approved premix formulations"
                                        ].map(item => (
                                            <li key={item} className="flex gap-2 items-start text-sm">
                                                <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="p-6 bg-white rounded-2xl border border-gray-100">
                                    <h4 className="text-sm uppercase tracking-wider font-bold text-gray-400 mb-3">How it’s used:</h4>
                                    <ul className="space-y-2 text-sm text-gray-600">
                                        <li>• Mills view only standards relevant to their operating country</li>
                                        <li>• Inspectors apply correct regulatory thresholds automatically</li>
                                        <li>• Buyers verify compliance eligibility during procurement</li>
                                    </ul>
                                </div>

                                <div className="text-sm bg-green-600 text-white p-4 rounded-xl">
                                    <span className="font-bold uppercase tracking-tight mr-2">Benefit:</span>
                                    Eliminates ambiguity and reduces compliance errors caused by outdated or mismatched regulations.
                                </div>
                            </div>
                        </div>

                        {/* 3. Research & Evidence Library */}
                        <div className="bg-gray-50 rounded-3xl p-10 border border-gray-100 shadow-sm transition-all hover:shadow-md">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-2 rounded-xl bg-white text-orange shadow-sm">
                                    <Library className="w-6 h-6" />
                                </div>
                                <h2 className="font-display text-2xl font-bold text-[#0A3225]">3. Research & Evidence Library</h2>
                            </div>
                            <p className="text-gray-600 mb-6 font-medium">A curated repository of scientific and programmatic evidence supporting fortification impact.</p>

                            <div className="space-y-6">
                                <div>
                                    <h4 className="text-sm uppercase tracking-wider font-bold text-orange mb-3">Includes:</h4>
                                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-gray-700">
                                        {[
                                            "Peer-reviewed research papers",
                                            "Impact evaluations and case studies",
                                            "Monitoring and evaluation frameworks",
                                            "Policy briefs and technical reports"
                                        ].map(item => (
                                            <li key={item} className="flex gap-2 items-start text-sm">
                                                <CheckCircle2 className="w-4 h-4 text-orange mt-0.5 shrink-0" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="p-6 bg-white rounded-2xl border border-gray-100">
                                    <h4 className="text-sm uppercase tracking-wider font-bold text-gray-400 mb-3">How it’s used:</h4>
                                    <ul className="space-y-2 text-sm text-gray-600">
                                        <li>• Program managers support funding and policy decisions</li>
                                        <li>• NGOs and governments reference evidence for scale-up</li>
                                        <li>• Donors assess impact credibility</li>
                                    </ul>
                                </div>

                                <div className="text-sm bg-orange text-white p-4 rounded-xl">
                                    <span className="font-bold uppercase tracking-tight mr-2">Benefit:</span>
                                    Grounds fortification programs in evidence, not assumptions.
                                </div>
                            </div>
                        </div>

                        {/* 4. Search, Filters & Smart Discovery */}
                        <div className="bg-gray-50 rounded-3xl p-10 border border-gray-100 shadow-sm transition-all hover:shadow-md">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-2 rounded-xl bg-white text-orange shadow-sm">
                                    <Search className="w-6 h-6" />
                                </div>
                                <h2 className="font-display text-2xl font-bold text-[#0A3225]">4. Search, Filters & Smart Discovery</h2>
                            </div>
                            <p className="text-gray-600 mb-6 font-medium">Designed for fast access in operational environments.</p>

                            <div className="space-y-6">
                                <div>
                                    <h4 className="text-sm uppercase tracking-wider font-bold text-orange mb-3">Capabilities:</h4>
                                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-gray-700">
                                        {[
                                            "Search by nutrient, commodity, or country",
                                            "Filter by guideline type (mandatory/voluntary)",
                                            "Version history and update timestamps",
                                            "Language support (multi-lingual)"
                                        ].map(item => (
                                            <li key={item} className="flex gap-2 items-start text-sm">
                                                <CheckCircle2 className="w-4 h-4 text-orange mt-0.5 shrink-0" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="text-sm bg-orange text-white p-4 rounded-xl">
                                    <span className="font-bold uppercase tracking-tight mr-2">Benefit:</span>
                                    Users find the right information in seconds, not hours.
                                </div>
                            </div>
                        </div>

                        {/* 5. Version Control & Updates */}
                        <div className="lg:col-span-2 bg-gray-50 rounded-3xl p-10 border border-gray-100 shadow-sm transition-all hover:shadow-md">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-2 rounded-xl bg-white text-orange shadow-sm">
                                    <History className="w-6 h-6" />
                                </div>
                                <h2 className="font-display text-2xl font-bold text-[#0A3225]">5. Version Control & Updates</h2>
                            </div>
                            <p className="text-gray-600 mb-6 font-medium">No more outdated PDFs or conflicting documents.</p>

                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <h4 className="text-sm uppercase tracking-wider font-bold text-orange mb-3">Features:</h4>
                                    <ul className="space-y-3 text-gray-700">
                                        {[
                                            "Clearly labeled guideline versions",
                                            "Archive of previous versions for audit reference",
                                            "Change logs highlighting what’s new",
                                            "Notifications when standards are updated"
                                        ].map(item => (
                                            <li key={item} className="flex gap-2 items-start text-sm italic">
                                                <CheckCircle2 className="w-4 h-4 text-orange mt-0.5 shrink-0" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="flex items-center justify-center">
                                    <div className="text-center p-8 bg-orange text-white rounded-3xl shadow-lg w-full">
                                        <span className="font-bold uppercase tracking-widest block mb-4 text-white/70 text-xs">Primary Value</span>
                                        <p className="text-3xl font-bold">Audit Defensibility</p>
                                        <p className="text-white/80 mt-2">& Regulatory Traceability</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Who Benefits Section */}
                    <div className="mb-24">
                        <h2 className="font-display text-3xl font-bold text-[#0A3225] text-center mb-12">Who Benefits From the Information Hub?</h2>
                        <div className="overflow-x-auto rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-[#0A3225] text-white">
                                        <th className="p-6 font-display font-bold">User Type</th>
                                        <th className="p-6 font-display font-bold">How They Use It</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white">
                                    {[
                                        { type: "Mill Operators & Managers", use: "Understand fortification requirements, align production, prepare for audits" },
                                        { type: "Inspectors", use: "Reference official standards during inspections and reviews" },
                                        { type: "Institutional Buyers", use: "Verify supplier eligibility and compliance requirements" },
                                        { type: "Program Managers", use: "Align programs with global and national standards" },
                                        { type: "Researchers & NGOs", use: "Access evidence and best practices" }
                                    ].map((row, i) => (
                                        <tr key={row.type} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                                            <td className="p-6 font-bold text-gray-900 border-b border-gray-100">{row.type}</td>
                                            <td className="p-6 text-gray-600 border-b border-gray-100">{row.use}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Why It Matters Section */}
                    <div className="p-12 lg:p-16 rounded-[3rem] bg-[#0A3225] text-white relative overflow-hidden text-center">
                        <div className="relative z-10 max-w-3xl mx-auto">
                            <h2 className="font-display text-3xl lg:text-4xl font-bold mb-6">Why It Matters</h2>
                            <p className="text-xl lg:text-2xl text-white/90 leading-relaxed font-light italic">
                                "Food fortification fails when guidance is fragmented, outdated, or inconsistently applied. The Information Hub ensures everyone from policy to production operates from a <strong>single source of truth</strong>."
                            </p>
                        </div>
                        {/* Decorative bubbles */}
                        <div className="absolute top-[-20%] left-[-10%] w-64 h-64 bg-white/5 rounded-full blur-3xl" />
                        <div className="absolute bottom-[-20%] right-[-10%] w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
                    </div>

                    <div className="mt-16 text-center">
                        <Link href="/#services">
                            <Button size="lg" className="bg-orange hover:bg-orange/90 text-white rounded-full px-12 h-14 text-lg font-bold shadow-lg shadow-orange/20">
                                Return to Main Page
                            </Button>
                        </Link>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
