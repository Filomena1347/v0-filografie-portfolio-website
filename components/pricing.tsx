import { Check, Sparkles } from "lucide-react"

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
    <section id="pricing" className="relative py-32 overflow-hidden bg-[#07070a]">
      {/* Aurora accents */}
      <div 
        className="absolute right-1/4 top-1/4 w-[500px] h-[500px] rounded-full opacity-15"
        style={{
          background: "radial-gradient(circle, #7B2FBE 0%, transparent 70%)",
          filter: "blur(100px)",
        }}
      />
      <div 
        className="absolute left-1/4 bottom-1/4 w-[400px] h-[400px] rounded-full opacity-10"
        style={{
          background: "radial-gradient(circle, #2EC4B6 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />

      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-[#9D4EDD] text-xs tracking-[0.3em] uppercase mb-4">Pricing</p>
          <h2 className="text-4xl md:text-5xl font-extralight">
            Investment in <span className="gradient-text">Art</span>
          </h2>
          <p className="mt-6 text-[#a1a1aa] font-light max-w-2xl mx-auto leading-relaxed">
            Transparent pricing for exceptional creative services. Custom packages available upon request.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {pricingPlans.map((plan) => (
            <div 
              key={plan.name}
              className={`relative glass-card rounded-2xl p-8 ${
                plan.featured 
                  ? "border-[#9D4EDD]/50 scale-105 md:-mt-4 md:mb-4" 
                  : ""
              }`}
            >
              {plan.featured && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="flex items-center gap-1 px-4 py-1.5 bg-gradient-to-r from-[#7B2FBE] to-[#9D4EDD] rounded-full text-xs tracking-wider">
                    <Sparkles className="w-3 h-3" />
                    MOST POPULAR
                  </div>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-xl font-light mb-2">{plan.name}</h3>
                <p className="text-[#71717a] text-sm font-light">{plan.description}</p>
              </div>

              <div className="text-center mb-8">
                <span className="text-[#71717a] text-sm">from</span>
                <div className="flex items-baseline justify-center gap-1 mt-1">
                  <span className="text-[#9D4EDD] text-lg">€</span>
                  <span className="text-5xl font-extralight gradient-text">{plan.price}</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-[#a1a1aa] text-sm font-light">
                    <Check className="w-4 h-4 text-[#2EC4B6] shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <button 
                className={`w-full py-4 rounded-full text-sm tracking-[0.15em] uppercase font-light transition-all ${
                  plan.featured
                    ? "bg-gradient-to-r from-[#7B2FBE] to-[#9D4EDD] hover:opacity-90"
                    : "glass-card hover:bg-white/10"
                }`}
              >
                Get Started
              </button>
            </div>
          ))}
        </div>

        <p className="text-center mt-12 text-[#71717a] text-sm font-light">
          All packages include consultation call. Travel fees may apply for locations outside the city.
        </p>
      </div>
    </section>
  )
}
