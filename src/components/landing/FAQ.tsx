"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

const faqs = [
    {
        question: "What is this Food Fortification Portal?",
        answer: "The portal is a digital platform designed to manage standards, compliance, quality assurance, and stakeholder coordination for food fortification programs. It connects mills, manufacturers, inspectors, nutritionists, and other partners to ensure fortified foods reach those who need them."
    },
    {
        question: "Who can use the portal?",
        answer: "The portal serves multiple stakeholders, including mill operators, food manufacturers, quality inspectors, program managers, nutrition experts, and NGOs involved in fortification initiatives."
    },
    {
        question: "How does the portal help mills and manufacturers?",
        answer: "Mills and manufacturers can track compliance with fortification standards, manage certifications, monitor production quality, and submit reports digitally. It streamlines processes that were traditionally manual and paper-based."
    },
    {
        question: "How do inspectors and quality controllers use the portal?",
        answer: "Inspectors can monitor production in real-time, access quality checklists, submit audit reports, and validate compliance against fortification standards, ensuring product safety and efficacy."
    },
    {
        question: "Can I access guidance and standards on the portal?",
        answer: "Yes, the portal hosts an Information Hub with global guidelines, regional standards, and research resources to support evidence-based fortification practices."
    },
    {
        question: "How does the portal support data and analytics?",
        answer: "Stakeholders can view interactive dashboards, track trends, measure impact metrics, and generate reports. This helps identify gaps, monitor progress, and optimize fortification programs."
    },
    {
        question: "Is certification and registration handled through the portal?",
        answer: "Yes, the portal provides digital applications for product certification and registration, status tracking, and certificate management, making it easier to meet fortification requirements."
    },
    {
        question: "How does the portal improve nutrition outcomes?",
        answer: "By connecting stakeholders, ensuring compliance, and providing actionable insights, the portal helps deliver fortified foods consistently and effectively to communities, enhancing micronutrient intake."
    },
    {
        question: "Is training or support available?",
        answer: "Yes, the portal offers resources, guides, and support materials for all users, ensuring proper use of the platform and adoption of fortification best practices."
    },
    {
        question: "How do I get started?",
        answer: "Users can register through the portal, complete their profile, and gain access to relevant modules based on their role. Once registered, stakeholders can begin managing fortification workflows immediately."
    }
];

export const FAQ = () => {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    const toggleAccordion = (index: number) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <section id="faq" className="py-24 bg-white overflow-hidden">
            <div className="container mx-auto px-4 lg:px-8">
                <div className="max-w-3xl mx-auto text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange/10 text-orange text-sm font-bold uppercase tracking-wider mb-6">
                        <HelpCircle className="w-4 h-4" />
                        Support Center
                    </div>
                    <h2 className="font-display text-4xl lg:text-5xl font-bold text-[#0A3225] mb-6">
                        Frequently Asked Questions
                    </h2>
                    <p className="text-lg text-gray-600 font-medium">
                        Find answers to common questions about the Food Fortification Portal
                        and how it supports the global fortification ecosystem.
                    </p>
                </div>

                <div className="max-w-4xl mx-auto space-y-4">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className={`group rounded-2xl border transition-all duration-300 ${activeIndex === index
                                ? "bg-white border-orange shadow-lg"
                                : "bg-white border-gray-100 hover:border-orange/30 shadow-sm"
                                }`}
                        >
                            <button
                                onClick={() => toggleAccordion(index)}
                                className="w-full px-6 py-5 flex items-center justify-between gap-4 text-left"
                            >
                                <span className={`font-display font-bold text-lg transition-colors duration-300 ${activeIndex === index ? "text-orange" : "text-[#0A3225]"
                                    }`}>
                                    {faq.question}
                                </span>
                                <ChevronDown
                                    className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 ${activeIndex === index ? "rotate-180 text-orange" : "text-gray-400"
                                        }`}
                                />
                            </button>

                            <div
                                className={`overflow-hidden transition-all duration-300 ease-in-out ${activeIndex === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                                    }`}
                            >
                                <div className="px-6 pb-6 text-gray-600 leading-relaxed font-medium">
                                    {faq.answer}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
