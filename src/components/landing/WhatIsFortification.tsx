import { Pill, Droplets, Flame, Heart, Wheat, Apple } from "lucide-react";
import grainsCombined from "@/assets/grains-combined.jpg";

const nutrients = [
  { icon: Pill, name: "Iron", description: "Prevents anemia and cognitive impairment", color: "text-orange-500", borderColor: "hover:border-orange-500" },
  { icon: Droplets, name: "Vitamin A", description: "Supports vision and immune function", color: "text-yellow-500", borderColor: "hover:border-yellow-500" },
  { icon: Flame, name: "Iodine", description: "Essential for thyroid function", color: "text-indigo-900", borderColor: "hover:border-indigo-900" },
  { icon: Heart, name: "Folic Acid", description: "Critical for fetal development", color: "text-rose-500", borderColor: "hover:border-rose-500" },
  { icon: Wheat, name: "Vitamin D", description: "Promotes bone health", color: "text-amber-500", borderColor: "hover:border-amber-500" },
  { icon: Apple, name: "Zinc", description: "Boosts immune system response", color: "text-emerald-700", borderColor: "hover:border-emerald-700" },
];

export const WhatIsFortification = () => {
  return (
    <section id="resources" className="py-24 bg-white relative">
      <div className="container mx-auto px-4 lg:px-8">

        {/* Intro Section - Matching Screenshot */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          {/* Text Content */}
          <div className="max-w-xl">
            <span className="inline-block text-amber-500 font-bold text-sm uppercase tracking-wider mb-4">
              Understanding Fortification
            </span>
            <h2 className="font-display text-4xl lg:text-5xl font-bold text-[#0A3225] mb-6">
              What is Food <br /> Fortification?
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Food fortification is the practice of adding essential vitamins and
              minerals to commonly consumed foods to improve their nutritional
              value. This proven public health strategy helps prevent
              micronutrient deficiencies that affect billions of people worldwide.
            </p>
          </div>

          {/* Image Content */}
          <div>
            <div className="rounded-2xl overflow-hidden shadow-lg">
              <img
                src={grainsCombined.src}
                alt="Rice, wheat, and maize grains"
                className="w-full h-auto object-cover"
              />
            </div>
            <p className="text-center text-sm text-gray-400 mt-3 font-medium">
              Rice, Wheat & Maize - Key fortification vehicles
            </p>
          </div>
        </div>

        <div className="mb-10">
          <h3 className="font-display font-bold text-2xl text-[#0A3225]">Types of Fortificants</h3>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {nutrients.map((nutrient, index) => (
            <div
              key={nutrient.name}
              className={`group p-8 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 cursor-default ${nutrient.borderColor} hover:border-opacity-50`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex flex-col items-start gap-4">
                <div className="p-0">
                  <nutrient.icon className={`w-8 h-8 ${nutrient.color}`} strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className={`font-display font-semibold text-lg text-gray-900 mb-2`}>
                    {nutrient.name}
                  </h3>
                  <p className="text-gray-500 text-[15px] leading-relaxed">
                    {nutrient.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};