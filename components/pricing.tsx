"use client";

import { Check } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";

const planVisuals = [
  { color: "bg-pink-200", featured: false },
  { color: "bg-indigo-500", featured: true },
  { color: "bg-[#FF6B5B]", featured: false },
];

export function Pricing() {
  const { t } = useLanguage();
  const pricingPlans = t.pricing.plans.map((plan, i) => ({
    ...plan,
    price: ["299", "599", "999"][i],
    ...planVisuals[i],
  }));

  return (
    <section id="pricing" className="py-32 px-6 relative overflow-hidden">
      {/* Floating decorative elements */}
      <div className="absolute top-20 left-10 w-16 h-16 bg-amber-300 rounded-2xl rotate-12 opacity-50" />
      <div className="absolute bottom-40 right-16 w-20 h-20 bg-indigo-500 rounded-3xl -rotate-6 opacity-40" />

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <p className="text-indigo-400 font-sans text-sm tracking-wider uppercase mb-4">
            {t.pricing.eyebrow}
          </p>
          <h2 className="font-serif text-5xl md:text-7xl text-white leading-none">
            {t.pricing.headingLine1}<br />
            <span className="text-indigo-400">{t.pricing.headingLine2}</span>
          </h2>
          <p className="mt-8 font-sans text-gray-400 max-w-2xl mx-auto text-lg font-light">
            {t.pricing.description}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {pricingPlans.map((plan) => (
            <div
              key={plan.name}
              className={`relative bg-white rounded-3xl overflow-hidden shadow-xl ${
                plan.featured ? "md:-mt-6 md:mb-6" : ""
              }`}
            >
              {/* Color header */}
              <div className={`${plan.color} h-2`} />

              <div className="p-10">
                <div className="text-center mb-8">
                  <h3 className="font-serif text-2xl text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-500 font-sans text-sm">{plan.description}</p>
                </div>

                <div className="text-center mb-10">
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-gray-400 font-sans text-lg">€</span>
                    <span className="font-serif text-6xl text-gray-900">{plan.price}</span>
                  </div>
                  <p className="text-gray-400 font-sans text-sm mt-2">{t.pricing.startingFrom}</p>
                </div>

                <ul className="space-y-4 mb-10">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3 font-sans text-gray-600 text-sm">
                      <div className={`w-5 h-5 ${plan.featured ? "bg-indigo-500" : "bg-gray-200"} rounded-full flex items-center justify-center flex-shrink-0`}>
                        <Check className={`w-3 h-3 ${plan.featured ? "text-white" : "text-gray-500"}`} />
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>

                <button
                  className={`w-full py-4 rounded-full font-sans text-sm font-medium transition-all duration-300 ${
                    plan.featured
                      ? "bg-indigo-500 text-white hover:bg-indigo-600"
                      : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                  }`}
                >
                  {t.pricing.getStarted}
                </button>
              </div>
            </div>
          ))}
        </div>

        <p className="text-center mt-12 text-gray-500 font-sans text-sm">
          {t.pricing.footnote}
        </p>
      </div>
    </section>
  );
}
