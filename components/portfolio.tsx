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
    <section id="work" className="relative py-32 overflow-hidden">
      {/* Aurora accent */}
      <div 
        className="absolute -left-64 top-1/4 w-[400px] h-[400px] rounded-full opacity-20"
        style={{
          background: "radial-gradient(circle, #2EC4B6 0%, transparent 70%)",
          filter: "blur(100px)",
        }}
      />

      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-[#9D4EDD] text-xs tracking-[0.3em] uppercase mb-4">Portfolio</p>
          <h2 className="text-4xl md:text-5xl font-extralight">
            Selected <span className="gradient-text">Works</span>
          </h2>
        </div>

        {/* Masonry Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {portfolioItems.map((item, index) => (
            <div
              key={item.title}
              className={`group relative glass-card rounded-2xl overflow-hidden cursor-pointer ${
                item.size === "large" ? "md:row-span-2" : ""
              } ${item.size === "medium" ? "lg:col-span-1" : ""}`}
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
                      rgba(123, 47, 190, ${0.2 + index * 0.05}) 0%, 
                      rgba(46, 196, 182, ${0.1 + index * 0.03}) 50%, 
                      rgba(210, 100, 182, ${0.15 + index * 0.04}) 100%)`
                  }}
                />
                
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-[#0a0a0f]/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="text-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-xs tracking-[0.2em] text-[#9D4EDD] uppercase mb-2">{item.category}</p>
                    <h3 className="text-xl font-light">{item.title}</h3>
                    <ArrowUpRight className="w-5 h-5 mx-auto mt-4 text-[#2EC4B6]" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <a 
            href="#"
            className="inline-flex items-center gap-2 px-8 py-4 glass-card rounded-full text-sm tracking-[0.15em] uppercase font-light hover:bg-white/10 transition-all group"
          >
            View All Projects
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </a>
        </div>
      </div>
    </section>
  )
}
