"use client";

import { useState } from "react";
import { ArrowUpRight, Camera, Video, PenTool, Instagram } from "lucide-react";

const portfolioItems = [
  {
    id: 1,
    title: "Photography",
    description: "Visual storytelling",
    color: "from-indigo-500 to-indigo-700",
    href: "#photography",
    icon: Camera,
    rotation: "-rotate-2",
  },
  {
    id: 2,
    title: "Social Media Content",
    description: "Content creation & strategy",
    color: "from-[#FF6B5B] to-orange-600",
    href: "#digital",
    icon: Instagram,
    rotation: "rotate-1",
  },
  {
    id: 3,
    title: "Video & Reels",
    description: "Motion & cinema",
    color: "from-sky-400 to-cyan-600",
    href: "#video",
    icon: Video,
    rotation: "rotate-2",
  },
  {
    id: 4,
    title: "Graphic Design",
    description: "Brand & visual identity",
    color: "from-violet-500 to-purple-600",
    href: "#graphic-design",
    icon: PenTool,
    rotation: "-rotate-1",
  },
];

// Helper function to get icon based on item
const getItemIcon = (item: typeof portfolioItems[0]) => {
  const IconComponent = item.icon;
  return <IconComponent className="w-6 h-6 text-white/60 stroke-[1]" />;
};

export function Portfolio() {
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  const handleCardClick = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

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
            I Create visuals.<br />
            <span className="text-indigo-400">Tell stories.</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-4">
          {portfolioItems.map((item) => (
            <div
              key={item.id}
              className={`group cursor-pointer ${item.rotation} transition-transform duration-300 hover:rotate-0`}
              onMouseEnter={() => setHoveredId(item.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => handleCardClick(item.href)}
            >
              <div
                className={`h-[140px] bg-gradient-to-br ${item.color} rounded-2xl overflow-hidden relative transition-all duration-300 shadow-lg ${
                  hoveredId === item.id ? "scale-[1.05] shadow-xl" : ""
                }`}
              >
                {/* Darker overlay for text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                
                {/* Top right icon */}
                <div className="absolute top-3 right-3">
                  {getItemIcon(item)}
                </div>
                
                {/* Arrow on hover */}
                <div className={`absolute top-3 left-4 transition-all duration-300 ${
                  hoveredId === item.id ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"
                }`}>
                  <ArrowUpRight className="w-4 h-4 text-white/80" />
                </div>
                
                {/* Content at bottom */}
                <div className="absolute inset-0 flex flex-col justify-end p-4">
                  <h3 className="font-serif text-lg text-white leading-tight">{item.title}</h3>
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
