"use client";

import { Navigation } from "@/components/landing/Navigation";
import { Footer } from "@/components/landing/Footer";
import { Award, FileSignature, Clock, QrCode, UserCheck, ShieldCheck, CheckCircle2, X } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CertificationRegistrationPage() {
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
                            <div className="p-3 rounded-2xl bg-orange-50 text-orange">
                                <Award className="w-10 h-10" strokeWidth={1.5} />
                            </div>
                            <h1 className="font-display text-4xl lg:text-6xl font-bold text-[#0A3225] leading-tight">
                                Making Fortification Certification Transparent, Efficient, and Trustworthy
                            </h1>
                        </div>

                        <p className="text-xl text-gray-600 leading-relaxed font-medium max-w-3xl border-l-4 border-orange pl-8 mt-8">
                            The Certification & Registration module digitizes the entire lifecycle of mill, product, and batch certification—reducing paperwork, improving traceability, and ensuring only compliant fortified foods reach the market.
                        </p>
                    </div>

                    {/* Features Grid */}
                    <div className="grid lg:grid-cols-2 gap-12 mb-24">
                        {/* 1. Digital Certification Applications */}
                        <div className="bg-gray-50 rounded-3xl p-10 border border-gray-100 shadow-sm transition-all hover:shadow-md">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-2 rounded-xl bg-white text-orange shadow-sm">
                                    <FileSignature className="w-6 h-6" />
                                </div>
                                <h2 className="font-display text-2xl font-bold text-[#0A3225]">1. Digital Certification Applications</h2>
                            </div>
                            <p className="text-gray-600 mb-6 font-medium">Replace manual, paper-based submissions with a guided digital process.</p>

                            <div className="space-y-6">
                                <div>
                                    <h4 className="text-sm uppercase tracking-wider font-bold text-orange mb-3">How it works:</h4>
                                    <ul className="grid grid-cols-1 gap-3 text-gray-700">
                                        {[
                                            "Mills submit certification applications online",
                                            "Smart forms adapt to commodity and standards",
                                            "Mandatory evidence (Audits, QC, Calibration) enforced",
                                            "Validation checks before submission"
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
                                    Faster, more accurate applications with fewer rejections.
                                </div>
                            </div>
                        </div>

                        {/* 2. Application & Status Tracking */}
                        <div className="bg-gray-50 rounded-3xl p-10 border border-gray-100 shadow-sm transition-all hover:shadow-md">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-2 rounded-xl bg-white text-orange shadow-sm">
                                    <Clock className="w-6 h-6" />
                                </div>
                                <h2 className="font-display text-2xl font-bold text-[#0A3225]">2. Application & Status Tracking</h2>
                            </div>
                            <p className="text-gray-600 mb-6 font-medium">Full visibility into where every application stands.</p>

                            <div className="space-y-6">
                                <div>
                                    <h4 className="text-sm uppercase tracking-wider font-bold text-orange mb-3">Status Stages & UX:</h4>
                                    <ul className="grid grid-cols-2 gap-2 text-gray-700">
                                        {["Draft", "Submitted", "Under Review", "Approved", "Revision Requested", "Rejected"].map(item => (
                                            <li key={item} className="flex gap-2 items-start text-sm">
                                                <CheckCircle2 className="w-4 h-4 text-orange mt-0.5 shrink-0" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="p-6 bg-white rounded-2xl border border-gray-100">
                                    <ul className="space-y-2 text-sm text-gray-600">
                                        <li>• Timeline view of each application</li>
                                        <li>• Clear inspector comments and action requests</li>
                                        <li>• Automatic notifications on status changes</li>
                                    </ul>
                                </div>

                                <div className="text-sm bg-orange text-white p-4 rounded-xl">
                                    <span className="font-bold uppercase tracking-tight mr-2">Benefit:</span>
                                    Eliminates uncertainty and follow-up bottlenecks.
                                </div>
                            </div>
                        </div>

                        {/* 3. Certificate Issuance & Management */}
                        <div className="bg-gray-50 rounded-3xl p-10 border border-gray-100 shadow-sm transition-all hover:shadow-md">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-2 rounded-xl bg-white text-green-600 shadow-sm">
                                    <QrCode className="w-6 h-6" />
                                </div>
                                <h2 className="font-display text-2xl font-bold text-[#0A3225]">3. Certificate Issuance & Management</h2>
                            </div>
                            <p className="text-gray-600 mb-6 font-medium">Secure, verifiable, and easy-to-manage certifications.</p>

                            <div className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="p-4 bg-white rounded-xl border border-gray-100">
                                        <h4 className="text-xs uppercase font-bold text-green-600 mb-2">Features:</h4>
                                        <ul className="text-xs space-y-1 text-gray-600">
                                            <li>• Digital issuing on approval</li>
                                            <li>• Unique ID and QR codes</li>
                                            <li>• Validity tracking</li>
                                        </ul>
                                    </div>
                                    <div className="p-4 bg-white rounded-xl border border-gray-100">
                                        <h4 className="text-xs uppercase font-bold text-green-600 mb-2">Management:</h4>
                                        <ul className="text-xs space-y-1 text-gray-600">
                                            <li>• Renewal reminders</li>
                                            <li>• Suspension tracking</li>
                                            <li>• Historical archive</li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="text-sm bg-green-600 text-white p-4 rounded-xl">
                                    <span className="font-bold uppercase tracking-tight mr-2">Benefit:</span>
                                    Prevents expired or fraudulent certifications from circulating.
                                </div>
                            </div>
                        </div>

                        {/* 4. Regulatory & Inspector Workflow */}
                        <div className="bg-gray-50 rounded-3xl p-10 border border-gray-100 shadow-sm transition-all hover:shadow-md">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-2 rounded-xl bg-white text-green-600 shadow-sm">
                                    <UserCheck className="w-6 h-6" />
                                </div>
                                <h2 className="font-display text-2xl font-bold text-[#0A3225]">4. Regulatory & Inspector Workflow</h2>
                            </div>
                            <p className="text-gray-600 mb-6 font-medium">Built to support regulators, not burden them.</p>

                            <div className="space-y-6">
                                <div className="p-6 bg-white rounded-2xl border border-gray-100">
                                    <h4 className="text-sm uppercase tracking-wider font-bold text-gray-400 mb-3">Inspector Capabilities:</h4>
                                    <ul className="space-y-2 text-sm text-gray-600">
                                        <li>• Review applications & verify evidence</li>
                                        <li>• Request clarifications or corrections</li>
                                        <li>• Digitally sign issued certificates</li>
                                        <li>• Automated risk flagging for applicants</li>
                                    </ul>
                                </div>

                                <div className="text-sm bg-green-600 text-white p-4 rounded-xl">
                                    <span className="font-bold uppercase tracking-tight mr-2">Benefit:</span>
                                    Consistent, defensible certification decisions.
                                </div>
                            </div>
                        </div>

                        {/* 5. Public & Institutional Verification */}
                        <div className="lg:col-span-2 bg-gray-50 rounded-3xl p-10 border border-gray-100 shadow-sm transition-all hover:shadow-md">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-2 rounded-xl bg-white text-orange shadow-sm">
                                    <ShieldCheck className="w-6 h-6" />
                                </div>
                                <h2 className="font-display text-2xl font-bold text-[#0A3225]">5. Public & Institutional Verification</h2>
                            </div>
                            <p className="text-gray-600 mb-6 font-medium">Enable trust across the fortification ecosystem.</p>

                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <h4 className="text-sm uppercase tracking-wider font-bold text-orange mb-3">Verification Options:</h4>
                                    <ul className="space-y-3 text-gray-700">
                                        {[
                                            "QR code scanning for validity confirmation",
                                            "Read-only public registry of certified mills",
                                            "Institutional buyer verification portal",
                                            "Transparent product compliance status"
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
                                        <span className="font-bold uppercase tracking-widest block mb-4 text-white/70 text-xs">Market Confidence</span>
                                        <p className="text-3xl font-bold">Public Trust</p>
                                        <p className="text-white/80 mt-2">& Buyer Verification</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Who Benefits Section */}
                    <div className="mb-24">
                        <h2 className="font-display text-3xl font-bold text-[#0A3225] text-center mb-12">How Different Users Use Certification & Registration</h2>
                        <div className="overflow-x-auto rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-[#0A3225] text-white">
                                        <th className="p-6 font-display font-bold">User Role</th>
                                        <th className="p-6 font-display font-bold">How They Use It</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white">
                                    {[
                                        { type: "Mill Operators", use: "Apply for certification and track approval progress" },
                                        { type: "Mill Managers", use: "Manage renewals and compliance readiness" },
                                        { type: "Inspectors", use: "Review applications and issue certificates" },
                                        { type: "Regulators", use: "Maintain authoritative certification records" },
                                        { type: "Institutional Buyers", use: "Verify certified suppliers" },
                                        { type: "Program Managers", use: "Monitor certification coverage and gaps" }
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
                            <h2 className="font-display text-3xl lg:text-4xl font-bold mb-6">Why This Matters for Fortification</h2>
                            <p className="text-xl lg:text-2xl text-white/90 leading-relaxed font-light italic">
                                "Without digital certification, trust erodes and records stay fragmented. This module ensures <strong>compliance is verifiable and transparent</strong>, enforcing accountability so fortification programs scale safely."
                            </p>
                        </div>
                        {/* Decorative bubbles */}
                        <div className="absolute top-[-20%] left-[-10%] w-64 h-64 bg-orange-500/10 rounded-full blur-3xl" />
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
