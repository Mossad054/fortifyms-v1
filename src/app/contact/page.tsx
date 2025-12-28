"use client";

import { useState } from "react";
import { Navigation } from "@/components/landing/Navigation";
import { Footer } from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, MapPin, Send, CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("loading");
        setErrorMessage("");

        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Something went wrong");
            }

            setStatus("success");
            setFormData({ name: "", email: "", subject: "", message: "" });
        } catch (error: any) {
            console.error(error);
            setStatus("error");
            setErrorMessage(error.message);
        }
    };

    return (
        <div className="min-h-screen bg-white">
            <Navigation />

            <main className="pt-24 pb-20">
                <div className="container mx-auto px-4 md:px-8">
                    {/* Back to Home */}
                    <div className="mb-12">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 text-orange font-bold hover:gap-3 transition-all group"
                        >
                            <ArrowRight className="w-4 h-4 rotate-180" />
                            Return to Home Page
                        </Link>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-16 items-start">
                        {/* Info Column */}
                        <div className="space-y-8">
                            <div>
                                <h1 className="font-display text-4xl lg:text-6xl font-bold text-[#0A3225] mb-6">
                                    Get in <span className="text-orange">Touch</span>
                                </h1>
                                <p className="text-xl text-gray-600 leading-relaxed font-medium">
                                    Have questions about the Food Fortification Portal? Our team is here to help
                                    you navigate the platform and strengthen your fortification programs.
                                </p>
                            </div>

                            <div className="grid gap-6">
                                <div className="flex items-center gap-6 p-6 rounded-2xl bg-gray-50 border border-gray-100 group hover:border-orange/20 transition-all duration-300 shadow-sm hover:shadow-md">
                                    <div className="w-14 h-14 rounded-xl bg-orange/10 flex items-center justify-center text-orange group-hover:scale-110 transition-transform duration-300">
                                        <Mail className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-[#0A3225]">Email Us</h3>
                                        <p className="text-gray-600 font-medium tracking-tight">michaelndungu054@gmail.com</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6 p-6 rounded-2xl bg-gray-50 border border-gray-100 group hover:border-orange/20 transition-all duration-300 shadow-sm hover:shadow-md">
                                    <div className="w-14 h-14 rounded-xl bg-green-600/10 flex items-center justify-center text-green-600 group-hover:scale-110 transition-transform duration-300">
                                        <Phone className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-[#0A3225]">Call Us</h3>
                                        <p className="text-gray-600 font-medium tracking-tight">+254 710 878 839</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6 p-6 rounded-2xl bg-gray-50 border border-gray-100 group hover:border-orange/20 transition-all duration-300 shadow-sm hover:shadow-md">
                                    <div className="w-14 h-14 rounded-xl bg-orange/10 flex items-center justify-center text-orange group-hover:scale-110 transition-transform duration-300">
                                        <MapPin className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-[#0A3225]">Our Location</h3>
                                        <p className="text-gray-600 font-medium tracking-tight">Nairobi, Kenya</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Form Column */}
                        <div className="relative">
                            <Card className="border-0 shadow-2xl relative z-10 rounded-3xl overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-600 to-orange"></div>
                                <CardHeader className="pt-10 pb-6 px-8">
                                    <CardTitle className="text-3xl font-display font-bold text-[#0A3225]">Send us a Message</CardTitle>
                                    <CardDescription className="text-lg font-medium">We'll get back to you as soon as possible.</CardDescription>
                                </CardHeader>
                                <CardContent className="px-8 pb-10">
                                    {status === "success" ? (
                                        <div className="text-center py-12 animate-in fade-in zoom-in duration-500">
                                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                                <CheckCircle2 className="w-12 h-12 text-green-600" />
                                            </div>
                                            <h3 className="text-2xl font-bold text-[#0A3225] mb-2">Message Received!</h3>
                                            <p className="text-gray-600 mb-8 font-medium">Thank you for reaching out. A member of our team will contact you shortly.</p>
                                            <Button
                                                onClick={() => setStatus("idle")}
                                                className="bg-orange hover:bg-orange/90 text-white font-bold"
                                            >
                                                Send Another Message
                                            </Button>
                                        </div>
                                    ) : (
                                        <form onSubmit={handleSubmit} className="space-y-5">
                                            <div className="grid md:grid-cols-2 gap-5">
                                                <div className="space-y-2">
                                                    <label className="text-sm font-bold text-[#0A3225]">Your Name</label>
                                                    <Input
                                                        placeholder="Full Name"
                                                        className="h-12 bg-gray-50 border-gray-100 focus:border-orange focus:ring-orange/20 rounded-xl"
                                                        value={formData.name}
                                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                        required
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-sm font-bold text-[#0A3225]">Email Address</label>
                                                    <Input
                                                        type="email"
                                                        placeholder="email@example.com"
                                                        className="h-12 bg-gray-50 border-gray-100 focus:border-orange focus:ring-orange/20 rounded-xl"
                                                        value={formData.email}
                                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-bold text-[#0A3225]">Subject</label>
                                                <Input
                                                    placeholder="How can we help?"
                                                    className="h-12 bg-gray-50 border-gray-100 focus:border-orange focus:ring-orange/20 rounded-xl"
                                                    value={formData.subject}
                                                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-bold text-[#0A3225]">Your Message</label>
                                                <Textarea
                                                    placeholder="Type your message here..."
                                                    className="min-h-[150px] bg-gray-50 border-gray-100 focus:border-orange focus:ring-orange/20 rounded-xl p-4"
                                                    value={formData.message}
                                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                                    required
                                                />
                                            </div>

                                            {status === "error" && (
                                                <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-bold border border-red-100">
                                                    {errorMessage}
                                                </div>
                                            )}

                                            <Button
                                                type="submit"
                                                disabled={status === "loading"}
                                                className="w-full h-14 bg-[#0A3225] hover:bg-orange text-white font-bold text-lg rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group"
                                            >
                                                {status === "loading" ? "Sending..." : (
                                                    <>
                                                        Send Message
                                                        <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                                    </>
                                                )}
                                            </Button>
                                        </form>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Accent elements */}
                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-orange/10 rounded-full blur-3xl -z-10"></div>
                            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-green-600/10 rounded-full blur-3xl -z-10"></div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
