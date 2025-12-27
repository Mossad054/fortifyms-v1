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

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <Hero />
        <WhatIsFortification />
        <Features />
        <Statistics />
        <WhoWeServe />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
