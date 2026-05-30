"use client";

import { useState } from "react";

const categories = ["All", "Corporate Events", "Weddings", "Fashion"];

const galleryItems = [
  { category: "Corporate Events", title: "Annual Gala 2024", color: "bg-indigo-500" },
  { category: "Weddings", title: "Sarah & James", color: "bg-pink-200" },
  { category: "Fashion", title: "Summer Collection", color: "bg-[#FF6B5B]" },
  { category: "Corporate Events", title: "Tech Summit", color: "bg-sky-400" },
  { category: "Weddings", title: "Beach Ceremony", color: "bg-amber-300" },
  { category: "Fashion", title: "Editorial Shoot", color: "bg-violet-400" },
  { category: "Corporate Events", title: "Product Launch", color: "bg-emerald-400" },
  { category: "Weddings", title: "Garden Wedding", color: "bg-rose-300" },
  { category: "Fashion", title: "Street Style", color: "bg-orange-400" },
];

export function Photography() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredItems =
    activeCategory === "All"
      ? galleryItems
      : galleryItems.filter((item) => item.category === activeCategory);

  return (
    <section id="photography" className="py-32 px-6 relative overflow-hidden">
      {/* Floating decorative elements */}
      <div className="absolute top-32 left-10 w-20 h-20 bg-pink-200 rounded-3xl -rotate-12 opacity-50" />
      <div className="absolute bottom-20 right-20 w-14 h-14 bg-[#FF6B5B] rounded-2xl rotate-6 opacity-50" />

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-indigo-400 font-sans text-sm tracking-wider uppercase mb-4">
            Photography
          </p>
          <h2 className="font-serif text-5xl md:text-7xl text-white leading-none">
            Capture life.<br />
            <span className="text-[#FF6B5B]">Keep forever.</span>
          </h2>
        </div>

        {/* Filter tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-16">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-3 rounded-full font-sans text-sm transition-all duration-300 ${
                activeCategory === category
                  ? "bg-indigo-500 text-white"
                  : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
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
              className="group cursor-pointer"
            >
              <div
                className={`aspect-[4/3] ${item.color} rounded-3xl overflow-hidden transition-all duration-500 group-hover:scale-[1.02]`}
              >
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-white/30 text-5xl font-serif">
                    {(index + 1).toString().padStart(2, "0")}
                  </span>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-gray-400 text-sm font-sans">{item.category}</p>
                <h3 className="text-white font-serif text-xl mt-1">{item.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
