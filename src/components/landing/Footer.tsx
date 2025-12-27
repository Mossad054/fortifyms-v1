import { Leaf, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Youtube } from "lucide-react";

const footerLinks = {
  resources: [
    { label: "Guidelines", href: "#" },
    { label: "Standards", href: "#" },
    { label: "Research", href: "#" },
    { label: "Publications", href: "#" },
  ],
  about: [
    { label: "Our Mission", href: "#" },
    { label: "Partners", href: "#" },
    { label: "News", href: "#" },
    { label: "Careers", href: "#" },
  ],
  support: [
    { label: "FAQ", href: "#" },
    { label: "Contact Us", href: "#" },
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
              <div className="w-10 h-10 rounded-lg bg-primary-foreground/10 flex items-center justify-center group-hover:bg-primary-foreground/20 transition-colors duration-300">
                <Leaf className="w-5 h-5 text-primary-foreground" />
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
              <a href="mailto:info@fortification.org" className="flex items-center gap-3 text-primary-foreground/70 hover:text-accent transition-colors duration-300 group">
                <Mail className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                info@fortification.org
              </a>
              <a href="tel:+1234567890" className="flex items-center gap-3 text-primary-foreground/70 hover:text-accent transition-colors duration-300 group">
                <Phone className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                +1 (234) 567-890
              </a>
              <div className="flex items-center gap-3 text-primary-foreground/70">
                <MapPin className="w-4 h-4" />
                Geneva, Switzerland
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
                    className="text-primary-foreground/70 hover:text-accent hover:translate-x-1 transition-all duration-300 inline-block"
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
              {footerLinks.about.map((link) => (
                <li key={link.label}>
                  <a 
                    href={link.href} 
                    className="text-primary-foreground/70 hover:text-accent hover:translate-x-1 transition-all duration-300 inline-block"
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
                    className="text-primary-foreground/70 hover:text-accent hover:translate-x-1 transition-all duration-300 inline-block"
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
            <p className="text-primary-foreground/60 text-sm">
              © {new Date().getFullYear()} Food Fortification Portal. All rights reserved.
            </p>
            
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
    </footer>
  );
};
