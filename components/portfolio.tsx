"use client";

import { useState } from "react";
import { ArrowUpRight, Camera, Video, LayoutGrid } from "lucide-react";

const portfolioItems = [
  {
    id: 1,
    title: "Brand Campaign",
    category: "Photography",
    description: "Visual storytelling",
    color: "from-indigo-500 to-indigo-700",
  },
  {
    id: 2,
    title: "Product Launch",
    category: "Video",
    description: "Motion & cinema",
    color: "from-[#FF6B5B] to-orange-600",
  },
  {
    id: 3,
    title: "Social Series",
    category: "Digital",
    description: "Social media content",
    color: "from-sky-400 to-cyan-600",
  },
  {
    id: 4,
    title: "Editorial Shoot",
    category: "Photography",
    description: "Visual storytelling",
    color: "from-pink-400 to-rose-500",
  },
  {
    id: 5,
    title: "Event Coverage",
    category: "Video",
    description: "Motion & cinema",
    color: "from-amber-400 to-orange-500",
  },
  {
    id: 6,
    title: "Brand Identity",
    category: "Digital",
    description: "Social media content",
    color: "from-violet-500 to-purple-600",
  },
];

// Helper function to get icon based on category
const getCategoryIcon = (category: string) => {
  switch (category) {
    case "Photography":
      return <Camera className="w-6 h-6 text-white/60 stroke-[1]" />;
    case "Video":
      return <Video className="w-6 h-6 text-white/60 stroke-[1]" />;
    case "Digital":
      return <LayoutGrid className="w-6 h-6 text-white/60 stroke-[1]" />;
    default:
      return null;
  }
};

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
                className={`aspect-[4/3] bg-gradient-to-br ${item.color} rounded-3xl overflow-hidden relative transition-all duration-500 ${
                  hoveredId === item.id ? "scale-[1.02]" : ""
                }`}
              >
                {/* Darker overlay for text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                
                {/* Top right icon */}
                <div className="absolute top-5 right-5">
                  {getCategoryIcon(item.category)}
                </div>
                
                {/* Explore label on hover */}
                <div className={`absolute top-5 left-6 flex items-center gap-2 text-white/80 text-sm font-sans transition-all duration-300 ${
                  hoveredId === item.id ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
                }`}>
                  Explore <ArrowUpRight className="w-4 h-4" />
                </div>
                
                {/* Content at bottom */}
                <div className="absolute inset-0 flex flex-col justify-end p-6">
                  <p className="text-white/60 text-sm font-sans mb-1">{item.description}</p>
                  <h3 className="font-serif text-3xl text-white">{item.title}</h3>
                </div>
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
