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
    accent: "violet",
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
    accent: "teal",
  },
]

export function DigitalCreative() {
  return (
    <section id="digital" className="relative py-40 overflow-hidden">
      {/* Light leak */}
      <div 
        className="aurora-light-leak absolute left-1/4 top-0 w-[600px] h-[600px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(157, 78, 221, 0.1) 0%, transparent 60%)",
          filter: "blur(120px)",
        }}
      />

      <div className="max-w-6xl mx-auto px-8">
        <div className="text-center mb-20">
          <p className="label-text text-[#9D4EDD] mb-6">Digital Creative</p>
          <h2 className="heading-editorial text-4xl md:text-5xl lg:text-6xl">
            Beyond the <span className="gradient-text">Lens</span>
          </h2>
          <p className="mt-8 body-text text-[#a1a1aa] max-w-2xl mx-auto">
            Comprehensive digital services to elevate your brand presence across all platforms.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {services.map((service) => (
            <div 
              key={service.category}
              className={`bg-[#111118] border ${
                service.accent === "violet" 
                  ? "border-[#9D4EDD]/10 hover:border-[#9D4EDD]/25" 
                  : "border-[#2EC4B6]/10 hover:border-[#2EC4B6]/25"
              } p-10 transition-all duration-500`}
            >
              {/* Icon */}
              <service.icon className={`w-6 h-6 mb-8 ${
                service.accent === "violet" ? "text-[#9D4EDD]/60" : "text-[#2EC4B6]/60"
              }`} />

              <h3 className="font-serif text-2xl font-light mb-8">{service.category}</h3>
              
              <ul className="space-y-4">
                {service.items.map((item) => (
                  <li key={item} className="flex items-center gap-4 body-text text-[#a1a1aa]">
                    <span className={`w-1 h-1 rounded-full ${
                      service.accent === "violet" ? "bg-[#9D4EDD]/50" : "bg-[#2EC4B6]/50"
                    }`} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Additional feature cards - minimal */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          {[
            { icon: Layers, label: "Web Design" },
            { icon: Sparkles, label: "Motion Graphics" },
            { icon: Palette, label: "UI/UX Design" },
            { icon: Share2, label: "Ad Campaigns" },
          ].map((feature) => (
            <div 
              key={feature.label}
              className="bg-[#111118] border border-[#9D4EDD]/8 p-6 text-center group hover:border-[#9D4EDD]/20 transition-all duration-500"
            >
              <feature.icon className="w-5 h-5 text-[#9D4EDD]/40 mx-auto mb-4 group-hover:text-[#9D4EDD]/70 transition-colors" />
              <p className="text-[13px] text-[#71717a] font-light tracking-wide">{feature.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
