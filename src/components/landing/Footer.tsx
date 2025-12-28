"use client";

import { Leaf, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Youtube, X, Briefcase, Award, Code } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const footerLinks = {
  resources: [
    { label: "Guidelines", href: "#", isComingSoon: true },
    { label: "Standards", href: "#", isComingSoon: true },
    { label: "Research", href: "#", isComingSoon: true },
    { label: "Publications", href: "#", isComingSoon: true },
  ],
  about: [
    { label: "Our Mission", href: "#" },
    { label: "Partners", href: "#", isComingSoon: true },
    { label: "News", href: "#", isComingSoon: true },
    { label: "Careers", href: "#", isComingSoon: true },
  ],
  support: [
    { label: "FAQ", href: "/faq" },
    { label: "Contact Us", href: "/contact" },
    { label: "Help Center", href: "#" },
    { label: "Feedback", href: "#" },
  ],
};

const socialLinks = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Youtube, href: "#", label: "YouTube" },
];

export const Footer = () => {
  const [isFounderModalOpen, setIsFounderModalOpen] = useState(false);

  const handleComingSoon = (e: React.MouseEvent) => {
    e.preventDefault();
    alert("Coming soon");
  };

  return (
    <footer id="contact" className="bg-primary text-primary-foreground relative overflow-hidden">
      {/* Large watermark text like FortifyEdu */}
      <div className="absolute bottom-0 left-0 right-0 overflow-hidden pointer-events-none select-none">
        <p className="font-display font-bold text-[15vw] leading-none text-primary-foreground/5 whitespace-nowrap">
          Fortify
        </p>
      </div>

      <div className="container mx-auto px-4 lg:px-8 py-16 relative z-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <a href="/" className="flex items-center gap-2 mb-6 group">
              <div className="w-10 h-10 rounded-lg overflow-hidden bg-primary-foreground/10 flex items-center justify-center group-hover:bg-primary-foreground/20 transition-colors duration-300">
                <img src="/icon.JPG" alt="Fortify Logo" className="w-full h-full object-cover" />
              </div>
              <span className="font-display font-semibold text-lg group-hover:text-accent transition-colors duration-300">
                Food Fortification Portal
              </span>
            </a>
            <p className="text-primary-foreground/80 mb-6 max-w-sm leading-relaxed">
              Strengthening public health through comprehensive food fortification
              resources, standards, and collaborative tools.
            </p>
            <div className="space-y-3">
              <a href="mailto:michaelndungu054@gmail.com" className="flex items-center gap-3 text-primary-foreground/70 hover:text-accent transition-colors duration-300 group">
                <Mail className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                michaelndungu054@gmail.com
              </a>
              <a href="tel:+254710878839" className="flex items-center gap-3 text-primary-foreground/70 hover:text-accent transition-colors duration-300 group">
                <Phone className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                +254 710 878 839
              </a>
              <div className="flex items-center gap-3 text-primary-foreground/70">
                <MapPin className="w-4 h-4" />
                Nairobi, Kenya
              </div>
            </div>
          </div>

          {/* Resources Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Resources</h4>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    onClick={link.isComingSoon ? handleComingSoon : undefined}
                    className="text-primary-foreground/70 hover:text-accent hover:translate-x-1 transition-all duration-300 inline-block text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* About Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4">About</h4>
            <ul className="space-y-3">
              {footerLinks.about.map((link: any) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    onClick={link.isComingSoon ? handleComingSoon : undefined}
                    className="text-primary-foreground/70 hover:text-accent hover:translate-x-1 transition-all duration-300 inline-block text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Support</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-primary-foreground/70 hover:text-accent hover:translate-x-1 transition-all duration-300 inline-block text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-primary-foreground/20 mt-12 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-col items-center md:items-start gap-2">
              <p className="text-primary-foreground/60 text-sm">
                © {new Date().getFullYear()} Food Fortification Portal. All rights reserved.
              </p>
              <p className="text-primary-foreground/40 text-[11px] tracking-wider uppercase font-medium">
                Built by <button
                  onMouseEnter={() => setIsFounderModalOpen(true)}
                  onClick={() => setIsFounderModalOpen(true)}
                  className="text-orange hover:text-orange/80 transition-all duration-300 hover:scale-105 active:scale-95 border-b border-orange/20 hover:border-orange font-semibold"
                >
                  Michael Ndungu
                </button>
              </p>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-accent hover:scale-110 hover:rotate-6 transition-all duration-300"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>

            {/* Legal Links */}
            <div className="flex items-center gap-6 text-sm">
              <a href="#" className="text-primary-foreground/60 hover:text-accent transition-colors duration-300">
                Privacy Policy
              </a>
              <a href="#" className="text-primary-foreground/60 hover:text-accent transition-colors duration-300">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Founder Profile Modal */}
      <Dialog open={isFounderModalOpen} onOpenChange={setIsFounderModalOpen}>
        <DialogContent className="sm:max-w-[500px] border-none bg-white p-0 overflow-hidden shadow-2xl">
          <div className="relative">
            {/* Header/Banner Area */}
            <div className="h-32 bg-gradient-to-r from-primary via-primary/90 to-[hsl(165,72%,15%)]" />

            {/* Profile Image / Initials */}
            <div className="absolute top-16 left-8">
              <div className="w-24 h-24 rounded-2xl bg-white p-1 shadow-lg ring-4 ring-white/10">
                <div className="w-full h-full rounded-xl bg-orange flex items-center justify-center text-white text-3xl font-black italic">
                  MN
                </div>
              </div>
            </div>

            <div className="pt-12 pb-8 px-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-primary tracking-tight">Michael Ndungu</h2>
                  <p className="text-orange font-semibold text-sm flex items-center gap-1.5 mt-1">
                    <Briefcase className="w-3.5 h-3.5" />
                    Food Technologist & Software Engineer
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-100">
                  <p className="text-zinc-600 leading-relaxed text-sm">
                    Michael Ndungu is a seasoned <span className="text-primary font-medium">Food Technologist</span> and <span className="text-primary font-medium">Software Engineer</span> with over seven years of professional experience at the intersection of industry and innovation.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                      <Award className="w-3 h-3 text-orange" /> Expertise
                    </h4>
                    <ul className="space-y-2">
                      {['FMCG Operations', 'Industrial Milling', 'Fortification Programs'].map((item) => (
                        <li key={item} className="text-xs text-zinc-600 flex items-center gap-2">
                          <div className="w-1 h-1 rounded-full bg-orange" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                      <Code className="w-3 h-3 text-orange" /> Technology
                    </h4>
                    <ul className="space-y-2">
                      {['System Architecture', 'Process Automation', 'Digital Compliance'].map((item) => (
                        <li key={item} className="text-xs text-zinc-600 flex items-center gap-2">
                          <div className="w-1 h-1 rounded-full bg-orange" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-4 border-t border-zinc-100 flex justify-between items-center text-[10px] text-zinc-400 font-medium italic">
                  <span>Advancing Global Food Security Through Engineering</span>
                  <div className="flex gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span>Available for Consultation</span>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsFounderModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </footer>
  );
};
