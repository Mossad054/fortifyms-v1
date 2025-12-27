import { Globe, Package, Users, TrendingUp } from "lucide-react";
import { LandingDashboardButton } from "./DashboardButton";

const stats = [
  {
    icon: Globe,
    value: "140+",
    label: "Countries Participating",
    description: "Active fortification programs worldwide",
    accentColor: "text-sky-400",
  },
  {
    icon: Package,
    value: "50K+",
    label: "Products Certified",
    description: "Fortified products meeting standards",
    accentColor: "text-amber-400",
  },
  {
    icon: Users,
    value: "2.5B",
    label: "Lives Impacted",
    description: "People benefiting from fortification",
    accentColor: "text-rose-400",
  },
  {
    icon: TrendingUp,
    value: "30%",
    label: "Deficiency Reduction",
    description: "Average improvement in nutrient intake",
    accentColor: "text-emerald-400",
  },
];

export const Statistics = () => {
  return (
    <section id="statistics" className="py-24 bg-primary text-white relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary to-[#0A3225]" />
      <div className="absolute inset-0 bg-[url('https://grain-url-pattern')] opacity-5" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="inline-block text-accent font-semibold text-sm uppercase tracking-wider mb-4 opacity-0 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            Global Impact
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-hero-foreground mb-6 opacity-0 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            Making a Measurable Difference
          </h2>
          <p className="text-lg text-hero-muted opacity-0 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
            Our collaborative efforts with governments, manufacturers, and health organizations
            are creating lasting change in public health outcomes worldwide.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="group relative p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 hover:bg-white/10"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Illumination Glow */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              <div className={`w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500 relative z-10`}>
                <stat.icon className={`w-8 h-8 ${stat.accentColor}`} />
              </div>
              <p className="font-display text-4xl lg:text-5xl font-bold text-white mb-2 relative z-10">
                {stat.value}
              </p>
              <p className="font-medium text-lg text-white mb-2 relative z-10">
                {stat.label}
              </p>
              <p className="text-sm text-white/60 leading-relaxed relative z-10">
                {stat.description}
              </p>
            </div>
          ))}
        </div>

        <div className="flex justify-start animate-fade-in-up" style={{ animationDelay: "0.6s" }}>
          <LandingDashboardButton />
        </div>
      </div>
    </section>
  );
};