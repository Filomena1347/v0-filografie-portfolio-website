import { Check } from "lucide-react"

const pricingPlans = [
  {
    name: "Essential",
    price: "299",
    description: "Perfect for personal projects and small events",
    features: [
      "2-hour photo session",
      "30 edited photos",
      "Digital delivery",
      "1 location",
      "Basic retouching",
    ],
    featured: false,
  },
  {
    name: "Professional",
    price: "599",
    description: "Ideal for weddings and corporate events",
    features: [
      "Full day coverage",
      "100+ edited photos",
      "Video highlights (3 min)",
      "Multiple locations",
      "Advanced retouching",
      "Online gallery",
      "Print-ready files",
    ],
    featured: true,
  },
  {
    name: "Premium",
    price: "999",
    description: "Complete creative package for brands",
    features: [
      "Multi-day coverage",
      "200+ edited photos",
      "Full video production",
      "Drone footage",
      "Social media package",
      "Brand consultation",
      "Rush delivery option",
      "Lifetime gallery access",
    ],
    featured: false,
  },
]

export function Pricing() {
  return (
    <section id="pricing" className="relative py-40 overflow-hidden bg-[#07070a]">
      {/* Light leaks */}
      <div 
        className="aurora-breathe absolute right-1/4 top-1/4 w-[500px] h-[500px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(123, 47, 190, 0.1) 0%, transparent 60%)",
          filter: "blur(100px)",
        }}
      />
      <div 
        className="aurora-light-leak absolute left-1/4 bottom-1/4 w-[400px] h-[400px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(46, 196, 182, 0.08) 0%, transparent 60%)",
          filter: "blur(80px)",
        }}
      />

      <div className="max-w-6xl mx-auto px-8">
        <div className="text-center mb-20">
          <p className="label-text text-[#9D4EDD] mb-6">Pricing</p>
          <h2 className="heading-editorial text-4xl md:text-5xl lg:text-6xl">
            Investment in <span className="gradient-text">Art</span>
          </h2>
          <p className="mt-8 body-text text-[#a1a1aa] max-w-2xl mx-auto">
            Transparent pricing for exceptional creative services. Custom packages available upon request.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {pricingPlans.map((plan) => (
            <div 
              key={plan.name}
              className={`relative bg-[#111118] border p-10 transition-all duration-500 ${
                plan.featured 
                  ? "border-[#9D4EDD]/30 md:-mt-6 md:mb-6" 
                  : "border-[#9D4EDD]/8 hover:border-[#9D4EDD]/20"
              }`}
            >
              {plan.featured && (
                <div className="absolute -top-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#9D4EDD] to-transparent" />
              )}

              <div className="text-center mb-10">
                <h3 className="font-serif text-xl font-light mb-3">{plan.name}</h3>
                <p className="text-[#71717a] text-[13px] font-light">{plan.description}</p>
              </div>

              <div className="text-center mb-10">
                <span className="text-[#71717a] text-[13px]">from</span>
                <div className="flex items-baseline justify-center gap-1 mt-2">
                  <span className="text-[#9D4EDD] text-lg">€</span>
                  <span className="heading-editorial text-5xl gradient-text">{plan.price}</span>
                </div>
              </div>

              <ul className="space-y-4 mb-10">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-4 body-text text-[#a1a1aa] text-[14px]">
                    <Check className="w-4 h-4 text-[#2EC4B6]/60 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <button 
                className={`w-full py-4 text-[13px] tracking-widest uppercase font-light transition-all duration-300 ${
                  plan.featured
                    ? "bg-[#9D4EDD] text-white hover:bg-[#8B3FCB]"
                    : "border border-[#9D4EDD]/20 hover:border-[#9D4EDD]/50"
                }`}
              >
                Get Started
              </button>
            </div>
          ))}
        </div>

        <p className="text-center mt-12 text-[#71717a] text-[13px] font-light tracking-wide">
          All packages include consultation call. Travel fees may apply for locations outside the city.
        </p>
      </div>
    </section>
  )
}
