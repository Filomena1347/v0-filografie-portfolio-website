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
    <section id="pricing" className="relative py-40 overflow-hidden bg-[#030305]">
      {/* Aurora glows */}
      <div 
        className="aurora-pulse absolute right-1/4 top-1/4 w-[50%] h-[50%]"
        style={{
          background: "radial-gradient(ellipse at center, rgba(124, 58, 237, 0.12) 0%, transparent 60%)",
          filter: "blur(100px)",
        }}
      />
      <div 
        className="aurora-drift absolute left-1/4 bottom-1/4 w-[40%] h-[40%]"
        style={{
          background: "radial-gradient(ellipse at center, rgba(192, 38, 211, 0.08) 0%, transparent 60%)",
          filter: "blur(80px)",
          animationDelay: "-10s",
        }}
      />

      <div className="max-w-7xl mx-auto px-8">
        <div className="text-center mb-24">
          <p className="label-sm text-violet-400/80 mb-8">Pricing</p>
          <h2 className="heading-display text-4xl md:text-5xl lg:text-7xl text-white">
            INVESTMENT IN <span className="text-gradient">ART</span>
          </h2>
          <p className="mt-10 body-light text-white/40 max-w-2xl mx-auto">
            Transparent pricing for exceptional creative services. Custom packages available upon request.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {pricingPlans.map((plan) => (
            <div 
              key={plan.name}
              className={`relative card-dark p-10 ${
                plan.featured ? "md:-mt-8 md:mb-8" : ""
              }`}
              style={plan.featured ? { 
                borderColor: "rgba(139, 92, 246, 0.2)" 
              } : {}}
            >
              {plan.featured && (
                <div className="absolute -top-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />
              )}

              <div className="text-center mb-12">
                <h3 className="heading-light text-xl text-white mb-3">{plan.name}</h3>
                <p className="text-white/30 text-[12px] font-light tracking-wide">{plan.description}</p>
              </div>

              <div className="text-center mb-12">
                <span className="text-white/30 text-[11px] tracking-[0.1em] uppercase">from</span>
                <div className="flex items-baseline justify-center gap-1 mt-2">
                  <span className="text-violet-400/60 text-lg">€</span>
                  <span className="heading-display text-5xl text-gradient">{plan.price}</span>
                </div>
              </div>

              <ul className="space-y-4 mb-12">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-4 body-light text-white/40 text-[14px]">
                    <Check className="w-4 h-4 text-violet-400/40 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <button 
                className={`w-full py-4 text-[11px] tracking-[0.15em] uppercase font-light transition-all duration-300 ${
                  plan.featured
                    ? "bg-violet-600 text-white hover:bg-violet-500"
                    : "border border-white/10 text-white/60 hover:border-white/30 hover:text-white"
                }`}
              >
                Get Started
              </button>
            </div>
          ))}
        </div>

        <p className="text-center mt-16 text-white/20 text-[12px] font-light tracking-wide">
          All packages include consultation call. Travel fees may apply for locations outside the city.
        </p>
      </div>
    </section>
  )
}
