"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

const categories = ["All", "Concert Collection", "Weddings", "Fashion"];

const galleryItems = [
  { category: "Concert Collection", title: "Annual Gala 2024", color: "bg-indigo-500" },
  { category: "Weddings", title: "Sarah & James", color: "bg-pink-200" },
  { category: "Fashion", title: "Summer Collection", color: "bg-[#FF6B5B]" },
  { category: "Concert Collection", title: "Tech Summit", color: "bg-sky-400" },
  { category: "Weddings", title: "Beach Ceremony", color: "bg-amber-300" },
  { category: "Fashion", title: "Editorial Shoot", color: "bg-violet-400" },
  { category: "Concert Collection", title: "Product Launch", color: "bg-emerald-400" },
  { category: "Weddings", title: "Garden Wedding", color: "bg-rose-300" },
  { category: "Fashion", title: "Street Style", color: "bg-orange-400" },
];

// Placeholder photos for each category
const categoryPhotos: Record<string, { id: number; src: string; height: string }[]> = {
  "Concert Collection": [
    { id: 1, src: "/placeholder.svg?height=400&width=300", height: "h-64" },
    { id: 2, src: "/placeholder.svg?height=500&width=300", height: "h-80" },
    { id: 3, src: "/placeholder.svg?height=350&width=300", height: "h-56" },
    { id: 4, src: "/placeholder.svg?height=450&width=300", height: "h-72" },
    { id: 5, src: "/placeholder.svg?height=400&width=300", height: "h-64" },
    { id: 6, src: "/placeholder.svg?height=380&width=300", height: "h-60" },
    { id: 7, src: "/placeholder.svg?height=500&width=300", height: "h-80" },
    { id: 8, src: "/placeholder.svg?height=420&width=300", height: "h-68" },
    { id: 9, src: "/placeholder.svg?height=360&width=300", height: "h-56" },
    { id: 10, src: "/placeholder.svg?height=480&width=300", height: "h-76" },
    { id: 11, src: "/placeholder.svg?height=400&width=300", height: "h-64" },
    { id: 12, src: "/placeholder.svg?height=440&width=300", height: "h-72" },
  ],
  "Weddings": [
    { id: 1, src: "/placeholder.svg?height=500&width=300", height: "h-80" },
    { id: 2, src: "/placeholder.svg?height=400&width=300", height: "h-64" },
    { id: 3, src: "/placeholder.svg?height=450&width=300", height: "h-72" },
    { id: 4, src: "/placeholder.svg?height=380&width=300", height: "h-60" },
    { id: 5, src: "/placeholder.svg?height=420&width=300", height: "h-68" },
    { id: 6, src: "/placeholder.svg?height=500&width=300", height: "h-80" },
    { id: 7, src: "/placeholder.svg?height=360&width=300", height: "h-56" },
    { id: 8, src: "/placeholder.svg?height=440&width=300", height: "h-72" },
    { id: 9, src: "/placeholder.svg?height=400&width=300", height: "h-64" },
    { id: 10, src: "/placeholder.svg?height=480&width=300", height: "h-76" },
  ],
  "Fashion": [
    { id: 1, src: "/placeholder.svg?height=450&width=300", height: "h-72" },
    { id: 2, src: "/placeholder.svg?height=380&width=300", height: "h-60" },
    { id: 3, src: "/placeholder.svg?height=500&width=300", height: "h-80" },
    { id: 4, src: "/placeholder.svg?height=400&width=300", height: "h-64" },
    { id: 5, src: "/placeholder.svg?height=420&width=300", height: "h-68" },
    { id: 6, src: "/placeholder.svg?height=360&width=300", height: "h-56" },
    { id: 7, src: "/placeholder.svg?height=480&width=300", height: "h-76" },
    { id: 8, src: "/placeholder.svg?height=440&width=300", height: "h-72" },
    { id: 9, src: "/placeholder.svg?height=400&width=300", height: "h-64" },
    { id: 10, src: "/placeholder.svg?height=500&width=300", height: "h-80" },
    { id: 11, src: "/placeholder.svg?height=380&width=300", height: "h-60" },
    { id: 12, src: "/placeholder.svg?height=450&width=300", height: "h-72" },
  ],
};

export function Photography() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredItems =
    activeCategory === "All"
      ? galleryItems
      : galleryItems.filter((item) => item.category === activeCategory);

  const openGallery = (category: string) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const closeGallery = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedCategory(null), 300);
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
                onClick={() => openGallery(item.category)}
              >
                <div
                  className={`aspect-[4/3] ${item.color} rounded-3xl overflow-hidden transition-all duration-500 group-hover:scale-[1.02] group-hover:shadow-2xl`}
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

      {/* Lightbox Modal */}
      <div
        className={`fixed inset-0 z-50 transition-opacity duration-300 ${
          isModalOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-[#0a0a0f]/95 backdrop-blur-sm"
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
              {selectedCategory}
            </h3>
          </div>

          {/* Masonry grid */}
          <div className="px-0 pb-12">
            <div className="columns-2 md:columns-3 gap-0">
              {selectedPhotos.map((photo, index) => (
                <div
                  key={photo.id}
                  className="break-inside-avoid"
                  style={{
                    animationDelay: `${index * 50}ms`,
                  }}
                >
                  <div
                    className={`${photo.height} w-full overflow-hidden transition-all duration-300 hover:brightness-110`}
                    style={{
                      animation: isModalOpen ? `fadeInUp 0.4s ease-out ${index * 50}ms both` : "none",
                    }}
                  >
                    <img
                      src={photo.src}
                      alt={`${selectedCategory} photo ${photo.id}`}
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
