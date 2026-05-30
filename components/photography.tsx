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
      {/* Light leak */}
      <div 
        className="aurora-breathe absolute right-0 top-1/3 w-[500px] h-[500px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(210, 100, 182, 0.1) 0%, transparent 60%)",
          filter: "blur(120px)",
        }}
      />

      <div className="max-w-6xl mx-auto px-8">
        <div className="text-center mb-20">
          <p className="label-text text-[#9D4EDD] mb-6">Photography</p>
          <h2 className="heading-editorial text-4xl md:text-5xl lg:text-6xl">
            Capturing <span className="gradient-text">Life</span>
          </h2>
        </div>

        {/* Filter tabs - minimal */}
        <div className="flex flex-wrap justify-center gap-8 mb-16">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`text-[13px] tracking-wide font-light transition-all duration-300 pb-2 ${
                activeCategory === category
                  ? "text-[#f5f5f7] border-b border-[#9D4EDD]"
                  : "text-[#71717a] hover:text-[#a1a1aa]"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Gallery grid - larger images */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item, index) => (
            <div
              key={`${item.title}-${index}`}
              className="group relative bg-[#111118] border border-[#2EC4B6]/8 overflow-hidden cursor-pointer aspect-[4/3] hover:border-[#2EC4B6]/25 transition-all duration-500"
            >
              {/* Gradient placeholder */}
              <div 
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(${120 + index * 25}deg, 
                    rgba(123, 47, 190, ${0.06 + index * 0.01}) 0%, 
                    rgba(46, 196, 182, ${0.04 + index * 0.02}) 100%)`
                }}
              />
              
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-[#0a0a0f]/85 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-8">
                <div>
                  <p className="label-text text-[#2EC4B6] mb-2">{item.category}</p>
                  <h3 className="font-serif text-xl font-light">{item.title}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
