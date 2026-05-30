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
      {/* Light leak */}
      <div 
        className="aurora-light-leak absolute -left-64 top-1/4 w-[400px] h-[400px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(46, 196, 182, 0.12) 0%, transparent 60%)",
          filter: "blur(100px)",
        }}
      />

      <div className="max-w-6xl mx-auto px-8">
        <div className="text-center mb-20">
          <p className="label-text text-[#9D4EDD] mb-6">Portfolio</p>
          <h2 className="heading-editorial text-4xl md:text-5xl lg:text-6xl">
            Selected <span className="gradient-text">Works</span>
          </h2>
        </div>

        {/* Grid - asymmetric masonry */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {portfolioItems.map((item, index) => (
            <div
              key={item.title}
              className={`group relative bg-[#111118] border border-[#9D4EDD]/8 overflow-hidden cursor-pointer hover:border-[#9D4EDD]/20 transition-all duration-500 ${
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
                      rgba(123, 47, 190, ${0.08 + index * 0.02}) 0%, 
                      rgba(46, 196, 182, ${0.04 + index * 0.01}) 100%)`
                  }}
                />
                
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-[#0a0a0f]/80 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                  <div className="text-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <p className="label-text text-[#2EC4B6] mb-3">{item.category}</p>
                    <h3 className="font-serif text-2xl font-light">{item.title}</h3>
                    <ArrowUpRight className="w-5 h-5 mx-auto mt-5 text-[#9D4EDD]" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <a 
            href="#"
            className="inline-flex items-center gap-3 px-8 py-4 border border-[#9D4EDD]/15 rounded-sm text-[13px] tracking-widest uppercase font-light hover:border-[#9D4EDD]/40 transition-all duration-300 group"
          >
            View All Projects
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </a>
        </div>
      </div>
    </section>
  )
}
