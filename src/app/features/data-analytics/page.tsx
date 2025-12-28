"use client";

import { Navigation } from "@/components/landing/Navigation";
import { Footer } from "@/components/landing/Footer";
import { BarChart3, Users, TrendingUp, Download, Brain, CheckCircle2, X, PieChart, LineChart } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function DataAnalyticsPage() {
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
                                <BarChart3 className="w-10 h-10" strokeWidth={1.5} />
                            </div>
                            <h1 className="font-display text-4xl lg:text-6xl font-bold text-[#0A3225] leading-tight">
                                Turning Fortification Data into <br /> Actionable Insight
                            </h1>
                        </div>

                        <p className="text-xl text-gray-600 leading-relaxed font-medium max-w-3xl border-l-4 border-green-600 pl-8 mt-8">
                            The Data Analytics module transforms operational and compliance data into clear, decision-ready intelligence. It helps mills, regulators, and program leaders understand fortification performance, identify gaps, and measure progress toward public health goals.
                        </p>
                    </div>

                    {/* Features Grid */}
                    <div className="grid lg:grid-cols-2 gap-12 mb-24">
                        {/* 1. Interactive Fortification Dashboards */}
                        <div className="bg-gray-50 rounded-3xl p-10 border border-gray-100 shadow-sm transition-all hover:shadow-md">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-2 rounded-xl bg-white text-green-600 shadow-sm">
                                    <PieChart className="w-6 h-6" />
                                </div>
                                <h2 className="font-display text-2xl font-bold text-[#0A3225]">1. Interactive Fortification Dashboards</h2>
                            </div>
                            <p className="text-gray-600 mb-6 font-medium">Visualize fortification performance across time, products, and locations.</p>

                            <div className="space-y-6">
                                <div>
                                    <h4 className="text-sm uppercase tracking-wider font-bold text-green-600 mb-3">Key Views Include:</h4>
                                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-gray-700">
                                        {[
                                            "Nutrient levels vs targets",
                                            "QC trends by commodity",
                                            "Volume vs premix usage",
                                            "Compliance scores over time",
                                            "Alert frequency & root causes"
                                        ].map(item => (
                                            <li key={item} className="flex gap-2 items-start text-sm">
                                                <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="p-6 bg-white rounded-2xl border border-gray-100">
                                    <h4 className="text-sm uppercase tracking-wider font-bold text-gray-400 mb-3">Capabilities:</h4>
                                    <ul className="space-y-2 text-sm text-gray-600">
                                        <li>• Filter by date, mill, commodity, or region</li>
                                        <li>• Drill down from national to batch level</li>
                                        <li>• Tooltips with exact values and context</li>
                                    </ul>
                                </div>

                                <div className="text-sm bg-green-600 text-white p-4 rounded-xl">
                                    <span className="font-bold uppercase tracking-tight mr-2">Benefit:</span>
                                    Makes complex compliance data understandable at a glance.
                                </div>
                            </div>
                        </div>

                        {/* 2. Custom Dashboards by Role */}
                        <div className="bg-gray-50 rounded-3xl p-10 border border-gray-100 shadow-sm transition-all hover:shadow-md">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-2 rounded-xl bg-white text-orange shadow-sm">
                                    <Users className="w-6 h-6" />
                                </div>
                                <h2 className="font-display text-2xl font-bold text-[#0A3225]">2. Custom Dashboards by Role</h2>
                            </div>
                            <p className="text-gray-600 mb-6 font-medium">Different users see what matters most to them.</p>

                            <div className="space-y-6">
                                <div>
                                    <h4 className="text-sm uppercase tracking-wider font-bold text-orange mb-3">Examples:</h4>
                                    <ul className="space-y-3 text-gray-700">
                                        <li className="text-sm"><strong>Mill Operators:</strong> Daily QC performance, open alerts</li>
                                        <li className="text-sm"><strong>Mill Managers:</strong> Efficiency metrics, corrective actions</li>
                                        <li className="text-sm"><strong>Regulators:</strong> High-risk mills, regional rates</li>
                                        <li className="text-sm"><strong>Program Managers:</strong> Coverage trends, impact patterns</li>
                                    </ul>
                                </div>

                                <div className="p-6 bg-white rounded-2xl border border-gray-100">
                                    <h4 className="text-sm uppercase tracking-wider font-bold text-gray-400 mb-3">How it works:</h4>
                                    <ul className="space-y-2 text-sm text-gray-600">
                                        <li>• Role-based default dashboards</li>
                                        <li>• Drag-and-drop widgets</li>
                                        <li>• Save and share dashboard views</li>
                                    </ul>
                                </div>

                                <div className="text-sm bg-orange text-white p-4 rounded-xl">
                                    <span className="font-bold uppercase tracking-tight mr-2">Benefit:</span>
                                    Each stakeholder gets insights without information overload.
                                </div>
                            </div>
                        </div>

                        {/* 3. Fortification Trend & Impact Analysis */}
                        <div className="bg-gray-50 rounded-3xl p-10 border border-gray-100 shadow-sm transition-all hover:shadow-md">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-2 rounded-xl bg-white text-orange shadow-sm">
                                    <TrendingUp className="w-6 h-6" />
                                </div>
                                <h2 className="font-display text-2xl font-bold text-[#0A3225]">3. Fortification Trend & Impact Analysis</h2>
                            </div>
                            <p className="text-gray-600 mb-6 font-medium">Understand not just compliance, but progress and risk.</p>

                            <div className="space-y-6">
                                <div>
                                    <h4 className="text-sm uppercase tracking-wider font-bold text-orange mb-3">Analytics Include:</h4>
                                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-gray-700">
                                        {[
                                            "Longitudinal improvements",
                                            "Seasonal nutrient variation",
                                            "Recurring failure patterns",
                                            "Correlation metrics",
                                            "Coverage indicators"
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
                                    Supports evidence-based decisions and program optimization.
                                </div>
                            </div>
                        </div>

                        {/* 4. Data Export & Integration */}
                        <div className="bg-gray-50 rounded-3xl p-10 border border-gray-100 shadow-sm transition-all hover:shadow-md">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-2 rounded-xl bg-white text-orange shadow-sm">
                                    <Download className="w-6 h-6" />
                                </div>
                                <h2 className="font-display text-2xl font-bold text-[#0A3225]">4. Data Export & Integration</h2>
                            </div>
                            <p className="text-gray-600 mb-6 font-medium">Your data, usable beyond the platform.</p>

                            <div className="space-y-6">
                                <div>
                                    <h4 className="text-sm uppercase tracking-wider font-bold text-orange mb-3">Export Formats:</h4>
                                    <ul className="grid grid-cols-2 gap-2 text-gray-700 mb-4">
                                        {["Excel (Analytic)", "CSV (Science)", "PDF (Reporting)", "JSON (API Integration)"].map(item => (
                                            <li key={item} className="flex gap-2 items-start text-sm">
                                                <CheckCircle2 className="w-4 h-4 text-orange mt-0.5 shrink-0" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="p-6 bg-white rounded-2xl border border-gray-100">
                                    <h4 className="text-sm uppercase tracking-wider font-bold text-gray-400 mb-3">Use Cases:</h4>
                                    <p className="text-sm text-gray-600 leading-relaxed">
                                        Regulatory submissions, donor reporting, impact evaluation, and integration with national health or food systems.
                                    </p>
                                </div>

                                <div className="text-sm bg-orange text-white p-4 rounded-xl">
                                    <span className="font-bold uppercase tracking-tight mr-2">Benefit:</span>
                                    Ensures transparency, portability, and interoperability.
                                </div>
                            </div>
                        </div>

                        {/* 5. Early Warning & Predictive Signals */}
                        <div className="lg:col-span-2 bg-gray-50 rounded-3xl p-10 border border-gray-100 shadow-sm transition-all hover:shadow-md">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-2 rounded-xl bg-white text-green-600 shadow-sm">
                                    <Brain className="w-6 h-6" />
                                </div>
                                <h2 className="font-display text-2xl font-bold text-[#0A3225]">5. Early Warning & Predictive Signals (Advanced)</h2>
                            </div>
                            <p className="text-gray-600 mb-6 font-medium">Move from hindsight to foresight.</p>

                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <h4 className="text-sm uppercase tracking-wider font-bold text-green-600 mb-3">Capabilities:</h4>
                                    <ul className="space-y-3 text-gray-700">
                                        {[
                                            "Indicators for declining compliance",
                                            "Trend-based risk scoring for mills",
                                            "Forecasting potential non-compliance",
                                            "Scenario modeling (e.g. QC frequency drops)"
                                        ].map(item => (
                                            <li key={item} className="flex gap-2 items-start text-sm italic">
                                                <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="flex items-center justify-center">
                                    <div className="text-center p-8 bg-green-600 text-white rounded-3xl shadow-lg w-full">
                                        <span className="font-bold uppercase tracking-widest block mb-4 text-white/70 text-xs">Innovation</span>
                                        <p className="text-3xl font-bold">Predictive Risks</p>
                                        <p className="text-white/80 mt-2">& Lifecycle Modeling</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Who Benefits Section */}
                    <div className="mb-24">
                        <h2 className="font-display text-3xl font-bold text-[#0A3225] text-center mb-12">How Different Users Use Data Analytics</h2>
                        <div className="overflow-x-auto rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-[#0A3225] text-white">
                                        <th className="p-6 font-display font-bold">User Role</th>
                                        <th className="p-6 font-display font-bold">How They Benefit</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white">
                                    {[
                                        { type: "Mill Operators", use: "Track daily performance and address issues early" },
                                        { type: "Mill Managers", use: "Optimize operations and maintain compliance readiness" },
                                        { type: "Inspectors / Regulators", use: "Focus oversight on highest-risk areas" },
                                        { type: "Program Managers", use: "Measure program effectiveness and identify gaps" },
                                        { type: "Donors & Policymakers", use: "Access evidence of impact and accountability" }
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
                            <h2 className="font-display text-3xl lg:text-4xl font-bold mb-6">Why It Matters for Fortification</h2>
                            <p className="text-xl lg:text-2xl text-white/90 leading-relaxed font-light italic">
                                "Without analytics, data stays fragmented and trends go unnoticed. This module ensures <strong>decisions are evidence-based</strong> and programs improve continuously, making public health outcomes measurable."
                            </p>
                        </div>
                        {/* Decorative bubbles */}
                        <div className="absolute top-[-20%] left-[-10%] w-64 h-64 bg-green-500/10 rounded-full blur-3xl" />
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
