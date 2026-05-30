import { Palette, Share2, Layers, Sparkles } from "lucide-react"

const services = [
  {
    category: "Graphic Design",
    icon: Palette,
    items: [
      "Brand Identity Design",
      "Logo Creation",
      "Marketing Materials",
      "Print Design",
      "Packaging Design",
    ],
    gradient: "from-[#7B2FBE] to-[#9D4EDD]",
  },
  {
    category: "Social Media Management",
    icon: Share2,
    items: [
      "Content Strategy",
      "Visual Content Creation",
      "Post Scheduling",
      "Community Management",
      "Analytics & Reporting",
    ],
    gradient: "from-[#2EC4B6] to-[#9D4EDD]",
  },
]

export function DigitalCreative() {
  return (
    <section id="digital" className="relative py-32 overflow-hidden">
      {/* Aurora accents */}
      <div 
        className="absolute left-1/4 top-0 w-[600px] h-[600px] rounded-full opacity-15"
        style={{
          background: "radial-gradient(circle, #9D4EDD 0%, transparent 70%)",
          filter: "blur(120px)",
        }}
      />

      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-[#9D4EDD] text-xs tracking-[0.3em] uppercase mb-4">Digital Creative</p>
          <h2 className="text-4xl md:text-5xl font-extralight">
            Beyond the <span className="gradient-text">Lens</span>
          </h2>
          <p className="mt-6 text-[#a1a1aa] font-light max-w-2xl mx-auto leading-relaxed">
            Comprehensive digital services to elevate your brand presence across all platforms.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {services.map((service) => (
            <div 
              key={service.category}
              className="glass-card rounded-2xl p-8 group hover:border-[#9D4EDD]/30 transition-all duration-300"
            >
              {/* Icon */}
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${service.gradient} p-0.5 mb-6`}>
                <div className="w-full h-full bg-[#0a0a0f] rounded-[10px] flex items-center justify-center">
                  <service.icon className="w-6 h-6 text-[#9D4EDD]" />
                </div>
              </div>

              <h3 className="text-2xl font-light mb-6">{service.category}</h3>
              
              <ul className="space-y-4">
                {service.items.map((item) => (
                  <li key={item} className="flex items-center gap-3 text-[#a1a1aa] font-light">
                    <Sparkles className="w-4 h-4 text-[#2EC4B6]" />
                    {item}
                  </li>
                ))}
              </ul>

              {/* Decorative corner */}
              <div className="absolute bottom-0 right-0 w-32 h-32 opacity-0 group-hover:opacity-100 transition-opacity">
                <div 
                  className="absolute inset-0"
                  style={{
                    background: `radial-gradient(circle at bottom right, ${
                      service.category === "Graphic Design" ? "#9D4EDD" : "#2EC4B6"
                    }20 0%, transparent 70%)`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Additional feature cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          {[
            { icon: Layers, label: "Web Design" },
            { icon: Sparkles, label: "Motion Graphics" },
            { icon: Palette, label: "UI/UX Design" },
            { icon: Share2, label: "Ad Campaigns" },
          ].map((feature) => (
            <div 
              key={feature.label}
              className="glass-card rounded-xl p-6 text-center group hover:border-[#9D4EDD]/30 transition-all"
            >
              <feature.icon className="w-8 h-8 text-[#9D4EDD] mx-auto mb-3 group-hover:scale-110 transition-transform" />
              <p className="text-sm text-[#a1a1aa] font-light">{feature.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
