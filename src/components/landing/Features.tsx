import { BookOpen, ClipboardCheck, BarChart3, Award, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import millingPlant from "@/assets/milling-plant.jpg";

const features = [
  {
    icon: BookOpen,
    title: "Information Hub",
    description: "Access comprehensive guidelines, standards, and best practices for food fortification programs worldwide.",
    highlights: ["WHO Guidelines", "Regional Standards", "Research Library"],
    accentColor: "text-sky-500",
  },
  {
    icon: ClipboardCheck,
    title: "Compliance & Reporting",
    description: "Track and manage fortification requirements with our streamlined compliance monitoring system.",
    highlights: ["Real-time Tracking", "Automated Reports", "Audit Trails"],
    accentColor: "text-teal-600",
  },
  {
    icon: BarChart3,
    title: "Data Analytics",
    description: "Gain insights from comprehensive dashboards showing fortification trends and impact metrics.",
    highlights: ["Interactive Charts", "Custom Dashboards", "Export Options"],
    accentColor: "text-green-600", // Changed from purple to green as requested
  },
  {
    icon: Award,
    title: "Certification & Registration",
    description: "Streamlined process for product certification and registration to meet fortification standards.",
    highlights: ["Digital Applications", "Status Tracking", "Certificate Management"],
    accentColor: "text-orange-500",
  },
];

export const Features = () => {
  return (
    <section id="services" className="py-24 bg-background relative overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <span className="inline-block text-sky-500 font-bold text-sm uppercase tracking-wider mb-4 opacity-0 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            Our Services
          </span>
          <h2 className="font-display text-4xl lg:text-5xl font-bold text-[#0A3225] mb-6 opacity-0 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            Everything You Need for <br /> Fortification Success
          </h2>
          <p className="text-lg text-gray-600 font-medium opacity-0 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
            Comprehensive tools and resources to support your food fortification initiatives
            from planning to implementation and monitoring.
          </p>
        </div>

        {/* Featured Image Banner - Milling Plant */}
        <div className="relative mb-16 rounded-3xl overflow-hidden opacity-0 animate-fade-in-up shadow-xl mx-auto" style={{ animationDelay: "0.35s" }}>
          <img
            src={millingPlant.src}
            alt="Modern milling production plant with industrial equipment"
            className="w-full h-80 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A3225]/90 via-[#0A3225]/40 to-transparent flex items-center">
            <div className="p-8 lg:p-12 max-w-xl">
              <h3 className="font-display text-2xl lg:text-3xl font-bold text-white mb-3 shadow-sm">Modern Milling Production</h3>
              <p className="text-white/90 text-base lg:text-lg leading-relaxed shadow-sm font-medium">
                Supporting food manufacturers with cutting-edge compliance and tracking tools to ensure quality and safety standards.
              </p>
            </div>
          </div>
        </div>

        {/* Clean, Vertical Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group bg-white rounded-2xl p-8 border border-gray-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-start h-full"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="mb-4 flex items-center gap-4 w-full">
                <feature.icon className={`w-8 h-8 ${feature.accentColor} flex-shrink-0`} strokeWidth={1.5} />
                <h3 className="font-display font-bold text-lg text-[#0A3225]">
                  {feature.title}
                </h3>
              </div>

              <p className="text-gray-500 text-sm leading-relaxed mb-6 flex-grow font-medium">
                {feature.description}
              </p>

              <ul className="space-y-3 w-full mt-auto mb-6">
                {feature.highlights.map((highlight, i) => (
                  <li
                    key={highlight}
                    className="flex items-start gap-3 text-sm text-gray-600 font-medium"
                  >
                    <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${feature.accentColor.replace('text-', 'bg-')}`} />
                    <span className="leading-tight">{highlight}</span>
                  </li>
                ))}
              </ul>

              <div className="w-full mt-2 pt-4 border-t border-gray-100/50">
                <div className="flex items-center text-sm font-bold text-sky-500 group-hover:gap-2 transition-all cursor-pointer">
                  Learn more
                  <ArrowRight className="w-4 h-4 ml-1" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};