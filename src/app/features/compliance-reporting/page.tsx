"use client";

import { Navigation } from "@/components/landing/Navigation";
import { Footer } from "@/components/landing/Footer";
import { ClipboardCheck, Activity, FileCheck, ShieldAlert, Zap, RotateCcw, CheckCircle2, X } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ComplianceReportingPage() {
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
                                <ClipboardCheck className="w-10 h-10" strokeWidth={1.5} />
                            </div>
                            <h1 className="font-display text-4xl lg:text-6xl font-bold text-[#0A3225] leading-tight">
                                Turning Fortification Requirements into Verifiable Compliance
                            </h1>
                        </div>

                        <p className="text-xl text-gray-600 leading-relaxed font-medium max-w-3xl border-l-4 border-green-600 pl-8 mt-8">
                            The Compliance & Reporting module transforms food fortification from a paperwork-heavy obligation into a continuous, transparent, and auditable process. It enables real-time compliance monitoring, standardized reporting, and defensible audit trails across the fortification ecosystem.
                        </p>
                    </div>

                    {/* Features Grid */}
                    <div className="grid lg:grid-cols-2 gap-12 mb-24">
                        {/* 1. Real-Time Compliance Tracking */}
                        <div className="bg-gray-50 rounded-3xl p-10 border border-gray-100 shadow-sm transition-all hover:shadow-md">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-2 rounded-xl bg-white text-green-600 shadow-sm">
                                    <Activity className="w-6 h-6" />
                                </div>
                                <h2 className="font-display text-2xl font-bold text-[#0A3225]">1. Real-Time Compliance Tracking</h2>
                            </div>
                            <p className="text-gray-600 mb-6 font-medium">Monitor fortification performance as it happens — not months later.</p>

                            <div className="space-y-6">
                                <div>
                                    <h4 className="text-sm uppercase tracking-wider font-bold text-green-600 mb-3">Tracks:</h4>
                                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-gray-700">
                                        {[
                                            "Fortification levels by nutrient",
                                            "Batch-level production outcomes",
                                            "Equipment calibration status",
                                            "Premix usage vs volume",
                                            "Mandatory testing frequencies"
                                        ].map(item => (
                                            <li key={item} className="flex gap-2 items-start text-sm">
                                                <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="p-6 bg-white rounded-2xl border border-gray-100">
                                    <h4 className="text-sm uppercase tracking-wider font-bold text-gray-400 mb-3">How it works:</h4>
                                    <ul className="space-y-2 text-sm text-gray-600">
                                        <li>• Data flows automatically from logs and QC tests</li>
                                        <li>• Compliance status updates dynamically</li>
                                        <li>• Threshold breaches trigger alerts and flags</li>
                                    </ul>
                                </div>

                                <div className="text-sm bg-green-600 text-white p-4 rounded-xl">
                                    <span className="font-bold uppercase tracking-tight mr-2">Benefit:</span>
                                    Early detection of non-compliance before it becomes a regulatory failure.
                                </div>
                            </div>
                        </div>

                        {/* 2. Automated Regulatory Reporting */}
                        <div className="bg-gray-50 rounded-3xl p-10 border border-gray-100 shadow-sm transition-all hover:shadow-md">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-2 rounded-xl bg-white text-orange shadow-sm">
                                    <FileCheck className="w-6 h-6" />
                                </div>
                                <h2 className="font-display text-2xl font-bold text-[#0A3225]">2. Automated Regulatory Reporting</h2>
                            </div>
                            <p className="text-gray-600 mb-6 font-medium">Generate compliant, regulator-ready reports with one click.</p>

                            <div className="space-y-6">
                                <div>
                                    <h4 className="text-sm uppercase tracking-wider font-bold text-orange mb-3">Key Features:</h4>
                                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-gray-700">
                                        {[
                                            "Auto-aligned country templates",
                                            "PDF, Excel & Digital formats",
                                            "Inspector-readable formatting",
                                            "Pre-filled system data",
                                            "Secure digital submission"
                                        ].map(item => (
                                            <li key={item} className="flex gap-2 items-start text-sm">
                                                <CheckCircle2 className="w-4 h-4 text-orange mt-0.5 shrink-0" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="p-6 bg-white rounded-2xl border border-gray-100">
                                    <h4 className="text-sm uppercase tracking-wider font-bold text-gray-400 mb-3">Supported Reports:</h4>
                                    <ul className="space-y-2 text-sm text-gray-600">
                                        <li>• Monthly & quarterly compliance submissions</li>
                                        <li>• Batch fortification summaries & QC logs</li>
                                        <li>• Certification and renewal documentation</li>
                                    </ul>
                                </div>

                                <div className="text-sm bg-orange text-white p-4 rounded-xl">
                                    <span className="font-bold uppercase tracking-tight mr-2">Benefit:</span>
                                    Reduces reporting burden while improving accuracy and credibility.
                                </div>
                            </div>
                        </div>

                        {/* 3. Full Audit Trails & Traceability */}
                        <div className="bg-gray-50 rounded-3xl p-10 border border-gray-100 shadow-sm transition-all hover:shadow-md">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-2 rounded-xl bg-white text-green-600 shadow-sm">
                                    <ShieldAlert className="w-6 h-6" />
                                </div>
                                <h2 className="font-display text-2xl font-bold text-[#0A3225]">3. Full Audit Trails & Traceability</h2>
                            </div>
                            <p className="text-gray-600 mb-6 font-medium">Every compliance action is recorded, timestamped, and attributable.</p>

                            <div className="space-y-6">
                                <div>
                                    <h4 className="text-sm uppercase tracking-wider font-bold text-green-600 mb-3">Captured Automatically:</h4>
                                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-gray-700">
                                        {[
                                            "Who recorded/modified data",
                                            "When changes were made",
                                            "What values changed and why",
                                            "Supporting evidence & photos",
                                            "Inspector approvals"
                                        ].map(item => (
                                            <li key={item} className="flex gap-2 items-start text-sm">
                                                <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="text-sm bg-green-600 text-white p-4 rounded-xl">
                                    <span className="font-bold uppercase tracking-tight mr-2">Benefit:</span>
                                    Ensures defensible compliance during audits and investigations.
                                </div>
                            </div>
                        </div>

                        {/* 4. Non-Compliance Detection & Alerts */}
                        <div className="bg-gray-50 rounded-3xl p-10 border border-gray-100 shadow-sm transition-all hover:shadow-md">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-2 rounded-xl bg-white text-orange shadow-sm">
                                    <Zap className="w-6 h-6" />
                                </div>
                                <h2 className="font-display text-2xl font-bold text-[#0A3225]">4. Non-Compliance Detection & Alerts</h2>
                            </div>
                            <p className="text-gray-600 mb-6 font-medium">The system highlights issues before inspectors do.</p>

                            <div className="space-y-6">
                                <div>
                                    <h4 className="text-sm uppercase tracking-wider font-bold text-orange mb-3">Automatic Flags For:</h4>
                                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-gray-700">
                                        {[
                                            "Critical QC failures",
                                            "Missing or overdue tests",
                                            "Out-of-spec nutrient levels",
                                            "Expired certifications",
                                            "Non-compliance patterns"
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
                                    Shifts compliance from reactive enforcement to proactive prevention.
                                </div>
                            </div>
                        </div>

                        {/* 5. Corrective Action Management */}
                        <div className="lg:col-span-2 bg-gray-50 rounded-3xl p-10 border border-gray-100 shadow-sm transition-all hover:shadow-md">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-2 rounded-xl bg-white text-orange shadow-sm">
                                    <RotateCcw className="w-6 h-6" />
                                </div>
                                <h2 className="font-display text-2xl font-bold text-[#0A3225]">5. Corrective Action Management</h2>
                            </div>
                            <p className="text-gray-600 mb-6 font-medium">Compliance gaps are not just identified, they are managed.</p>

                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <h4 className="text-sm uppercase tracking-wider font-bold text-orange mb-3">Features:</h4>
                                    <ul className="space-y-3 text-gray-700">
                                        {[
                                            "Automatic creation of corrective actions",
                                            "Assignment to responsible personnel",
                                            "Due dates and resolution tracking",
                                            "Inspector review & approval workflow"
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
                                        <span className="font-bold uppercase tracking-widest block mb-4 text-white/70 text-xs">Closing the Loop</span>
                                        <p className="text-3xl font-bold">Verified Resolution</p>
                                        <p className="text-white/80 mt-2">& Continuous Protection</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Who Benefits Section */}
                    <div className="mb-24">
                        <h2 className="font-display text-3xl font-bold text-[#0A3225] text-center mb-12">How Different Users Interact With Compliance & Reporting</h2>
                        <div className="overflow-x-auto rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-[#0A3225] text-white">
                                        <th className="p-6 font-display font-bold">User Role</th>
                                        <th className="p-6 font-display font-bold">Key Interactions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white">
                                    {[
                                        { type: "Mill Operators", use: "Log production and QC data, respond to alerts, close corrective actions" },
                                        { type: "Mill Managers", use: "Monitor compliance dashboards, approve submissions, allocate resources" },
                                        { type: "Inspectors / Regulators", use: "Review reports, audit trails, approve or reject compliance" },
                                        { type: "Program Managers", use: "Analyze compliance trends across regions or commodities" },
                                        { type: "Institutional Buyers", use: "Verify supplier compliance status" }
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
                                "Food fortification programs fail when compliance is delayed, incomplete, or impossible to verify. This system ensures compliance is <strong>continuous, transparent, and trusted</strong>, protecting public health while reducing operational burden."
                            </p>
                        </div>
                        {/* Decorative elements */}
                        <div className="absolute top-[-20%] left-[-10%] w-64 h-64 bg-teal-500/10 rounded-full blur-3xl" />
                        <div className="absolute bottom-[-20%] right-[-10%] w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
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
