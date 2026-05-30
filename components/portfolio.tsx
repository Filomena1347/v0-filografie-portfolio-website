"use client";

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";

const portfolioItems = [
  {
    id: 1,
    title: "Brand Campaign",
    category: "Photography",
    color: "bg-indigo-500",
  },
  {
    id: 2,
    title: "Product Launch",
    category: "Video",
    color: "bg-[#FF6B5B]",
  },
  {
    id: 3,
    title: "Social Series",
    category: "Digital",
    color: "bg-sky-400",
  },
  {
    id: 4,
    title: "Editorial Shoot",
    category: "Photography",
    color: "bg-pink-200",
  },
  {
    id: 5,
    title: "Event Coverage",
    category: "Video",
    color: "bg-amber-400",
  },
  {
    id: 6,
    title: "Brand Identity",
    category: "Digital",
    color: "bg-violet-400",
  },
];

export function Portfolio() {
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  return (
    <section id="work" className="py-32 px-6 relative overflow-hidden">
      {/* Floating decorative elements */}
      <div className="absolute top-20 right-10 w-16 h-16 bg-pink-200 rounded-2xl rotate-12 opacity-60" />
      <div className="absolute bottom-40 left-20 w-12 h-12 bg-indigo-500 rounded-xl -rotate-6 opacity-60" />
      
      <div className="max-w-7xl mx-auto">
        <div className="mb-20">
          <p className="text-indigo-400 font-sans text-sm tracking-wider uppercase mb-4">
            Selected Work
          </p>
          <h2 className="font-serif text-5xl md:text-7xl text-white leading-none">
            Create visuals.<br />
            <span className="text-indigo-400">Tell stories.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {portfolioItems.map((item) => (
            <div
              key={item.id}
              className="group cursor-pointer"
              onMouseEnter={() => setHoveredId(item.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <div
                className={`aspect-[4/3] ${item.color} rounded-3xl overflow-hidden transition-all duration-500 ${
                  hoveredId === item.id ? "scale-[1.02]" : ""
                }`}
              >
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-white/30 text-6xl font-serif">
                    {item.id.toString().padStart(2, "0")}
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

        <div className="text-center mt-16">
          <a 
            href="#"
            className="inline-flex items-center gap-3 bg-indigo-500 hover:bg-indigo-600 text-white px-8 py-4 rounded-full font-sans text-sm transition-colors"
          >
            View All Projects
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
