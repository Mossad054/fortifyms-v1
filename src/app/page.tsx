import Link from "next/link";
import "@fontsource/outfit/400.css";
import "@fontsource/outfit/500.css";
import "@fontsource/outfit/600.css";
import "@fontsource/outfit/700.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";

import { Navigation } from "@/components/landing/Navigation";
import { Hero } from "@/components/landing/Hero";
import { WhatIsFortification } from "@/components/landing/WhatIsFortification";
import { Features } from "@/components/landing/Features";
import { Statistics } from "@/components/landing/Statistics";
import { WhoWeServe } from "@/components/landing/WhoWeServe";
import { Footer } from "@/components/landing/Footer";
import { ScrollToTop } from "@/components/landing/ScrollToTop";

// We import the fonts globally in the layout usually, but for now we rely on the project fonts.
// If needed, we can import font classes.

export default function LandingPage() {
    return (
        <div className="landing-page min-h-screen bg-background text-foreground font-sans">
            <Navigation />
            <main>
                <Hero />
                <WhatIsFortification />
                <Features />
                <Statistics />
                <WhoWeServe />
            </main>
            <Footer />
            <ScrollToTop />
        </div>
    );
}
