"use client"

import { useState } from "react"

const categories = ["All", "Corporate Events", "Weddings", "Fashion"]

const galleryItems = [
  { category: "Corporate Events", title: "Annual Gala 2024" },
  { category: "Weddings", title: "Sarah & James" },
  { category: "Fashion", title: "Summer Collection" },
  { category: "Corporate Events", title: "Tech Summit" },
  { category: "Weddings", title: "Beach Ceremony" },
  { category: "Fashion", title: "Editorial Shoot" },
  { category: "Corporate Events", title: "Product Launch" },
  { category: "Weddings", title: "Garden Wedding" },
  { category: "Fashion", title: "Street Style" },
]

export function Photography() {
  const [activeCategory, setActiveCategory] = useState("All")

  const filteredItems = activeCategory === "All" 
    ? galleryItems 
    : galleryItems.filter(item => item.category === activeCategory)

  return (
    <section id="photography" className="relative py-40 overflow-hidden">
      {/* Aurora glow */}
      <div 
        className="aurora-glow absolute right-0 top-1/4 w-[50%] h-[60%]"
        style={{
          background: "radial-gradient(ellipse at center, rgba(219, 39, 119, 0.1) 0%, rgba(124, 58, 237, 0.08) 40%, transparent 70%)",
          filter: "blur(100px)",
        }}
      />

      <div className="max-w-7xl mx-auto px-8">
        <div className="text-center mb-24">
          <p className="label-sm text-violet-400/80 mb-8">Photography</p>
          <h2 className="heading-display text-4xl md:text-5xl lg:text-7xl text-white">
            CAPTURING <span className="text-gradient">LIFE</span>
          </h2>
        </div>

        {/* Filter tabs */}
        <div className="flex flex-wrap justify-center gap-12 mb-20">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`text-[11px] tracking-[0.15em] uppercase font-light transition-all duration-300 pb-2 ${
                activeCategory === category
                  ? "text-white border-b border-violet-500/50"
                  : "text-white/30 hover:text-white/60"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Gallery grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item, index) => (
            <div
              key={`${item.title}-${index}`}
              className="group relative card-dark overflow-hidden cursor-pointer aspect-[4/3]"
            >
              {/* Gradient placeholder */}
              <div 
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(${120 + index * 25}deg, 
                    rgba(124, 58, 237, ${0.05 + index * 0.01}) 0%, 
                    rgba(5, 5, 7, 0.98) 100%)`
                }}
              />
              
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-[#050507]/90 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-8">
                <div>
                  <p className="label-sm text-violet-400/80 mb-2">{item.category}</p>
                  <h3 className="heading-light text-xl text-white">{item.title}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
