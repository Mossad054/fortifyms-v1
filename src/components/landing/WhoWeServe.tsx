import { Factory, Building2, HeartHandshake, Users, ArrowRight } from "lucide-react";
import foodFlour from "@/assets/food-flour.jpg";
import { LandingDashboardButton } from "./DashboardButton";

const audiences = [
  {
    icon: Factory,
    title: "Food Manufacturers",
    description: "Access guidelines, standards, and certification processes.",
    list: ["Product certification", "Quality standards", "Technical guidance"],
    accentColor: "text-orange",
  },
  {
    icon: Building2,
    title: "Government & Regulators",
    description: "Tools for policy development and compliance monitoring.",
    list: ["Policy frameworks", "Compliance monitoring", "Impact assessment"],
    accentColor: "text-green-600",
  },
  {
    icon: HeartHandshake,
    title: "NGOs & Health Organizations",
    description: "Resources to support advocacy and implementation.",
    list: ["Research access", "Program support", "Collaboration tools"],
    accentColor: "text-orange",
  },
  {
    icon: Users,
    title: "General Public",
    description: "Learn about the importance of food fortification.",
    list: ["Educational content", "Health information", "Product lookup"],
    accentColor: "text-green-600",
  },
];

export const WhoWeServe = () => {
  return (
    <section id="partners" className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8">

        {/* Top Section: Image & Text */}
        <div className="grid lg:grid-cols-2 gap-16 items-start mb-20">
          {/* Text Column */}
          <div className="max-w-xl order-2 lg:order-1">
            <span className="inline-block text-[#FF7D4D] font-bold text-sm uppercase tracking-wider mb-4">
              Our Stakeholders
            </span>
            <h2 className="font-display text-4xl lg:text-5xl font-bold text-[#0A3225] mb-6">
              Who We Serve
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed mb-8 font-medium">
              Our platform is designed to support all stakeholders in the food
              fortification ecosystem, from policy makers to consumers.
            </p>
          </div>

          {/* Image Column */}
          <div className="relative animate-scale-in order-1 lg:order-2">
            <div className="relative rounded-[2rem] overflow-hidden shadow-2xl max-w-md mx-auto lg:mx-0">
              <img
                src={foodFlour.src}
                alt="Artisanal bread representing fortified products"
                className="w-full h-auto object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
            {/* Badge */}
            <div className="absolute bottom-8 right-0 lg:-right-8 bg-[#FF7D4D] text-white px-6 py-4 rounded-xl shadow-xl animate-fade-in-up" style={{ animationDelay: "0.5s" }}>
              <p className="font-bold text-xl mb-0">50K+</p>
              <p className="text-sm font-medium opacity-90">Products Certified</p>
            </div>
          </div>
        </div>

        {/* Bottom Section: Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {audiences.map((audience, index) => (
            <div
              key={audience.title}
              className="group p-8 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-default flex flex-col items-start h-full"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="mb-4 flex items-center gap-4 w-full">
                <audience.icon className={`w-8 h-8 ${audience.accentColor} flex-shrink-0`} strokeWidth={1.5} />
                <h3 className="font-display font-bold text-lg text-[#0A3225]">
                  {audience.title}
                </h3>
              </div>

              <p className="text-gray-500 text-sm leading-relaxed mb-6 flex-grow font-medium">
                {audience.description}
              </p>

              <ul className="space-y-3 w-full mt-auto">
                {audience.list?.map((item, i) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-sm text-gray-600 font-medium"
                  >
                    <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${audience.accentColor.replace('text-', 'bg-')}`} />
                    <span className="leading-tight">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex justify-start mt-8">
          <LandingDashboardButton className="bg-[#0A3225] hover:bg-[#0A3225]/90 text-white shadow-xl hover:shadow-[#0A3225]/20" />
        </div>
      </div>
    </section>
  );
};
