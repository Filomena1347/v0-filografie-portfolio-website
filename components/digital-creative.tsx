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
  },
]

export function DigitalCreative() {
  return (
    <section id="digital" className="relative py-40 overflow-hidden">
      {/* Aurora glow */}
      <div 
        className="aurora-glow absolute left-1/4 -top-[20%] w-[60%] h-[60%]"
        style={{
          background: "radial-gradient(ellipse at center, rgba(124, 58, 237, 0.12) 0%, transparent 60%)",
          filter: "blur(120px)",
        }}
      />

      <div className="max-w-7xl mx-auto px-8">
        <div className="text-center mb-24">
          <p className="label-sm text-violet-400/80 mb-8">Digital Creative</p>
          <h2 className="heading-display text-4xl md:text-5xl lg:text-7xl text-white">
            BEYOND THE <span className="text-gradient">LENS</span>
          </h2>
          <p className="mt-10 body-light text-white/40 max-w-2xl mx-auto">
            Comprehensive digital services to elevate your brand presence across all platforms.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {services.map((service, idx) => (
            <div 
              key={service.category}
              className="card-dark p-12"
            >
              <service.icon className="w-6 h-6 mb-10 text-violet-400/40" />

              <h3 className="heading-light text-2xl text-white mb-10">{service.category}</h3>
              
              <ul className="space-y-5">
                {service.items.map((item) => (
                  <li key={item} className="flex items-center gap-4 body-light text-white/40">
                    <span className="w-1 h-1 rounded-full bg-violet-500/30" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          {[
            { icon: Layers, label: "Web Design" },
            { icon: Sparkles, label: "Motion Graphics" },
            { icon: Palette, label: "UI/UX Design" },
            { icon: Share2, label: "Ad Campaigns" },
          ].map((feature) => (
            <div 
              key={feature.label}
              className="card-dark p-8 text-center group"
            >
              <feature.icon className="w-5 h-5 text-white/15 mx-auto mb-5 group-hover:text-violet-400/50 transition-colors duration-500" />
              <p className="text-[11px] text-white/30 font-light tracking-[0.1em] uppercase">{feature.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
