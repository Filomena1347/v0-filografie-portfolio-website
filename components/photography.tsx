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
    <section id="photography" className="relative py-32 overflow-hidden">
      {/* Aurora accents */}
      <div 
        className="absolute right-0 top-1/3 w-[500px] h-[500px] rounded-full opacity-15"
        style={{
          background: "radial-gradient(circle, #D264B6 0%, transparent 70%)",
          filter: "blur(120px)",
        }}
      />

      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-[#9D4EDD] text-xs tracking-[0.3em] uppercase mb-4">Photography</p>
          <h2 className="text-4xl md:text-5xl font-extralight">
            Capturing <span className="gradient-text">Life</span>
          </h2>
        </div>

        {/* Filter tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-3 rounded-full text-xs tracking-[0.15em] uppercase font-light transition-all ${
                activeCategory === category
                  ? "bg-gradient-to-r from-[#7B2FBE] to-[#9D4EDD] text-white"
                  : "glass-card text-[#a1a1aa] hover:text-white"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Gallery grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item, index) => (
            <div
              key={`${item.title}-${index}`}
              className="group relative glass-card rounded-2xl overflow-hidden cursor-pointer aspect-[4/3]"
            >
              {/* Gradient placeholder */}
              <div 
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(${120 + index * 25}deg, 
                    rgba(123, 47, 190, ${0.15 + index * 0.03}) 0%, 
                    rgba(157, 78, 221, ${0.2 + index * 0.02}) 50%, 
                    rgba(46, 196, 182, ${0.1 + index * 0.04}) 100%)`
                }}
              />
              
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-[#0a0a0f]/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                <div>
                  <p className="text-xs tracking-[0.2em] text-[#2EC4B6] uppercase mb-1">{item.category}</p>
                  <h3 className="text-lg font-light">{item.title}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
