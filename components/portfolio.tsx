"use client"

import { ArrowUpRight } from "lucide-react"

const portfolioItems = [
  { title: "Ethereal Moments", category: "Wedding", size: "large" },
  { title: "Brand Essence", category: "Corporate", size: "small" },
  { title: "Urban Flow", category: "Fashion", size: "small" },
  { title: "Golden Hour", category: "Portrait", size: "medium" },
  { title: "Event Magic", category: "Events", size: "medium" },
  { title: "Studio Stories", category: "Fashion", size: "large" },
]

export function Portfolio() {
  return (
    <section id="work" className="relative py-40 overflow-hidden">
      {/* Aurora glow */}
      <div 
        className="aurora-pulse absolute -left-[20%] top-1/3 w-[50%] h-[50%]"
        style={{
          background: "radial-gradient(ellipse at center, rgba(192, 38, 211, 0.12) 0%, transparent 60%)",
          filter: "blur(100px)",
        }}
      />

      <div className="max-w-7xl mx-auto px-8">
        <div className="text-center mb-24">
          <p className="label-sm text-violet-400/80 mb-8">Portfolio</p>
          <h2 className="heading-display text-4xl md:text-5xl lg:text-7xl text-white">
            SELECTED <span className="text-gradient">WORKS</span>
          </h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {portfolioItems.map((item, index) => (
            <div
              key={item.title}
              className={`group relative card-dark overflow-hidden cursor-pointer ${
                item.size === "large" ? "md:row-span-2" : ""
              }`}
            >
              <div 
                className={`${
                  item.size === "large" ? "aspect-[3/4]" : "aspect-square"
                } relative`}
              >
                {/* Gradient placeholder */}
                <div 
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(${135 + index * 30}deg, 
                      rgba(124, 58, 237, ${0.06 + index * 0.01}) 0%, 
                      rgba(192, 38, 211, ${0.03 + index * 0.01}) 50%,
                      rgba(5, 5, 7, 0.95) 100%)`
                  }}
                />
                
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-[#050507]/90 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                  <div className="text-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <p className="label-sm text-violet-400/80 mb-4">{item.category}</p>
                    <h3 className="heading-light text-2xl text-white">{item.title}</h3>
                    <ArrowUpRight className="w-5 h-5 mx-auto mt-6 text-white/40" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-20">
          <a 
            href="#"
            className="btn-pill inline-flex items-center gap-4 text-[11px] tracking-[0.2em] uppercase font-light text-white/60 hover:text-white"
          >
            View All Projects
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  )
}
