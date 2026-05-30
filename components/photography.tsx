"use client";

import { useState, useEffect } from "react";
import { X, ArrowLeft, CalendarDays, Music, Heart, Briefcase, UtensilsCrossed, User } from "lucide-react";

// Main categories with their colors and gradient overlays
const mainCategories = [
  { 
    id: "events", 
    name: "Events", 
    color: "from-violet-600 to-indigo-700",
    hasSubcategories: true,
    description: "Concerts, Weddings, Corporate Events",
    icon: CalendarDays
  },
  { 
    id: "food", 
    name: "Food", 
    color: "from-[#FF6B5B] to-orange-600",
    hasSubcategories: false,
    description: "Food photography",
    icon: UtensilsCrossed
  },
  { 
    id: "portraits", 
    name: "Portraits", 
    color: "from-pink-500 to-rose-600",
    hasSubcategories: false,
    description: "Portrait sessions",
    icon: User
  },
];

// Events subcategories
const eventsSubcategories = [
  { 
    id: "concerts", 
    name: "Concerts", 
    color: "from-violet-500 to-purple-700",
    description: "Live music & performances",
    icon: Music
  },
  { 
    id: "weddings", 
    name: "Weddings", 
    color: "from-pink-400 to-rose-500",
    description: "Wedding photography",
    icon: Heart
  },
  { 
    id: "corporate", 
    name: "Corporate Events", 
    color: "from-indigo-500 to-blue-600",
    description: "Corporate events",
    icon: Briefcase
  },
];

// Placeholder photos for each category
const categoryPhotos: Record<string, { id: number; src: string; height: string }[]> = {
  "concerts": Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    src: `/placeholder.svg?height=${350 + Math.floor(Math.random() * 200)}&width=300`,
    height: ["h-56", "h-64", "h-72", "h-80", "h-60", "h-68"][i % 6],
  })),
  "weddings": Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    src: `/placeholder.svg?height=${350 + Math.floor(Math.random() * 200)}&width=300`,
    height: ["h-80", "h-64", "h-72", "h-56", "h-68", "h-76"][i % 6],
  })),
  "corporate": Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    src: `/placeholder.svg?height=${350 + Math.floor(Math.random() * 200)}&width=300`,
    height: ["h-64", "h-72", "h-56", "h-80", "h-60", "h-68"][i % 6],
  })),
  "food": Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    src: `/placeholder.svg?height=${350 + Math.floor(Math.random() * 200)}&width=300`,
    height: ["h-72", "h-56", "h-80", "h-64", "h-68", "h-60"][i % 6],
  })),
  "portraits": Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    src: `/placeholder.svg?height=${350 + Math.floor(Math.random() * 200)}&width=300`,
    height: ["h-80", "h-72", "h-64", "h-56", "h-76", "h-68"][i % 6],
  })),
};

export function Photography() {
  const [view, setView] = useState<"main" | "events-sub">("main");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedCategoryName, setSelectedCategoryName] = useState<string>("");

  const handleCategoryClick = (category: typeof mainCategories[0]) => {
    if (category.hasSubcategories) {
      setView("events-sub");
    } else {
      openGallery(category.id, category.name);
    }
  };

  const handleSubcategoryClick = (subcategory: typeof eventsSubcategories[0]) => {
    openGallery(subcategory.id, subcategory.name);
  };

  const openGallery = (categoryId: string, categoryName: string) => {
    setSelectedCategory(categoryId);
    setSelectedCategoryName(categoryName);
    setIsModalOpen(true);
  };

  const closeGallery = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      setSelectedCategory(null);
      setSelectedCategoryName("");
    }, 300);
  };

  const goBack = () => {
    setView("main");
  };

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeGallery();
    };
    if (isModalOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isModalOpen]);

  const selectedPhotos = selectedCategory ? categoryPhotos[selectedCategory] || [] : [];

  return (
    <>
      <section id="photography" className="py-32 px-6 relative overflow-hidden">
        {/* Subtle floating decorative elements */}
        <div className="absolute top-32 left-10 w-24 h-24 bg-gradient-to-br from-violet-500/20 to-indigo-600/20 rounded-full blur-2xl" />
        <div className="absolute bottom-20 right-20 w-32 h-32 bg-gradient-to-br from-pink-500/20 to-rose-600/20 rounded-full blur-2xl" />

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

          {/* Back button for subcategories view */}
          {view === "events-sub" && (
            <button
              onClick={goBack}
              className="flex items-center gap-2 text-white/70 hover:text-white mb-8 transition-colors duration-200"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-sans">Back to categories</span>
            </button>
          )}

          {/* Main categories grid */}
          {view === "main" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Eventy - Featured larger card */}
              <div
                className="md:col-span-1 group cursor-pointer"
                onClick={() => handleCategoryClick(mainCategories[0])}
              >
                <div className="aspect-[3/4] md:aspect-[3/4] rounded-3xl overflow-hidden relative transition-all duration-500 group-hover:scale-[1.02] group-hover:shadow-2xl group-hover:shadow-violet-500/20">
                  {/* Background placeholder image */}
                  <div className="absolute inset-0 bg-[#1a1a2e]">
                    <img
                      src="/placeholder.svg?height=600&width=400"
                      alt="Eventy"
                      className="w-full h-full object-cover opacity-60"
                    />
                  </div>
                  {/* Color gradient overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-t ${mainCategories[0].color} opacity-70 mix-blend-multiply`} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  {/* Centered icon */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <CalendarDays className="w-10 h-10 text-white stroke-[1.5]" />
                  </div>
                  
                  {/* Content */}
                  <div className="absolute inset-0 flex flex-col justify-end p-8">
                    <p className="text-white/60 text-sm font-sans mb-2">{mainCategories[0].description}</p>
                    <h3 className="font-serif text-4xl md:text-5xl text-white">{mainCategories[0].name}</h3>
                    {/* Hover arrow */}
                    <div className="flex items-center gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="text-white/80 text-sm font-sans">Explore</span>
                      <span className="text-white/80">→</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Jídlo and Portréty cards */}
              <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                {mainCategories.slice(1).map((category) => (
                  <div
                    key={category.id}
                    className="group cursor-pointer"
                    onClick={() => handleCategoryClick(category)}
                  >
                    <div className="aspect-[4/3] rounded-3xl overflow-hidden relative transition-all duration-500 group-hover:scale-[1.02] group-hover:shadow-2xl group-hover:shadow-pink-500/20">
                      {/* Background placeholder image */}
                      <div className="absolute inset-0 bg-[#1a1a2e]">
                        <img
                          src="/placeholder.svg?height=400&width=500"
                          alt={category.name}
                          className="w-full h-full object-cover opacity-60"
                        />
                      </div>
                      {/* Color gradient overlay */}
                      <div className={`absolute inset-0 bg-gradient-to-t ${category.color} opacity-70 mix-blend-multiply`} />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      
                      {/* Centered icon */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        {category.id === "food" && <UtensilsCrossed className="w-10 h-10 text-white stroke-[1.5]" />}
                        {category.id === "portraits" && <User className="w-10 h-10 text-white stroke-[1.5]" />}
                      </div>
                      
                      {/* Content */}
                      <div className="absolute inset-0 flex flex-col justify-end p-6">
                        <h3 className="font-serif text-3xl md:text-4xl text-white">{category.name}</h3>
                        {/* Hover arrow */}
                        <div className="flex items-center gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <span className="text-white/80 text-sm font-sans">Explore</span>
                          <span className="text-white/80">→</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Events subcategories grid */}
          {view === "events-sub" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {eventsSubcategories.map((subcategory) => (
                <div
                  key={subcategory.id}
                  className="group cursor-pointer"
                  onClick={() => handleSubcategoryClick(subcategory)}
                >
                  <div className="aspect-[4/3] rounded-3xl overflow-hidden relative transition-all duration-500 group-hover:scale-[1.02] group-hover:shadow-2xl">
                    {/* Background placeholder image */}
                    <div className="absolute inset-0 bg-[#1a1a2e]">
                      <img
                        src="/placeholder.svg?height=400&width=500"
                        alt={subcategory.name}
                        className="w-full h-full object-cover opacity-60"
                      />
                    </div>
                    {/* Color gradient overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-t ${subcategory.color} opacity-70 mix-blend-multiply`} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    
                    {/* Centered icon */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      {subcategory.id === "concerts" && <Music className="w-10 h-10 text-white stroke-[1.5]" />}
                      {subcategory.id === "weddings" && <Heart className="w-10 h-10 text-white stroke-[1.5]" />}
                      {subcategory.id === "corporate" && <Briefcase className="w-10 h-10 text-white stroke-[1.5]" />}
                    </div>
                    
                    {/* Content */}
                    <div className="absolute inset-0 flex flex-col justify-end p-6">
                      <p className="text-white/60 text-sm font-sans mb-1">{subcategory.description}</p>
                      <h3 className="font-serif text-3xl text-white">{subcategory.name}</h3>
                      {/* Hover arrow */}
                      <div className="flex items-center gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span className="text-white/80 text-sm font-sans">Explore</span>
                        <span className="text-white/80">→</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox Modal */}
      <div
        className={`fixed inset-0 z-50 transition-opacity duration-300 ${
          isModalOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-[#0a0a0f]/95"
          onClick={closeGallery}
        />

        {/* Modal content */}
        <div
          className={`relative h-full w-full overflow-y-auto transition-all duration-300 ${
            isModalOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          {/* Close button */}
          <button
            onClick={closeGallery}
            className="fixed top-6 right-6 z-50 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors duration-200"
          >
            <X className="w-6 h-6 text-white" />
          </button>

          {/* Category title */}
          <div className="pt-20 pb-8 px-6 text-center">
            <h3 className="font-serif text-4xl md:text-5xl text-white">
              {selectedCategoryName}
            </h3>
          </div>

          {/* Masonry grid - 3 columns, no gaps, sharp edges */}
          <div className="px-0 pb-12">
            <div className="columns-2 md:columns-3 gap-0">
              {selectedPhotos.map((photo, index) => (
                <div
                  key={photo.id}
                  className="break-inside-avoid"
                >
                  <div
                    className={`${photo.height} w-full overflow-hidden transition-all duration-300 hover:brightness-110`}
                    style={{
                      animation: isModalOpen ? `fadeInUp 0.4s ease-out ${index * 50}ms both` : "none",
                    }}
                  >
                    <img
                      src={photo.src}
                      alt={`${selectedCategoryName} photo ${photo.id}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
}
