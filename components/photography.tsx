"use client";

import { useState, useEffect } from "react";
import { X, ArrowLeft, CalendarDays, Music, Heart, Briefcase, UtensilsCrossed, User } from "lucide-react";
import { useLanguage } from "@/context/language-context";

// Placeholder photos for each category
const categoryPhotos: Record<string, { id: number; src: string; height: string }[]> = {
  "concerts": Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    src: `/placeholder.svg?height=${350 + (i * 17) % 200}&width=300`,
    height: ["h-56", "h-64", "h-72", "h-80", "h-60", "h-68"][i % 6],
  })),
  "weddings": Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    src: `/placeholder.svg?height=${350 + (i * 23) % 200}&width=300`,
    height: ["h-80", "h-64", "h-72", "h-56", "h-68", "h-76"][i % 6],
  })),
  "corporate": Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    src: `/placeholder.svg?height=${350 + (i * 19) % 200}&width=300`,
    height: ["h-64", "h-72", "h-56", "h-80", "h-60", "h-68"][i % 6],
  })),
  "food": Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    src: `/placeholder.svg?height=${350 + (i * 31) % 200}&width=300`,
    height: ["h-72", "h-56", "h-80", "h-64", "h-68", "h-60"][i % 6],
  })),
  "portraits": Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    src: `/placeholder.svg?height=${350 + (i * 13) % 200}&width=300`,
    height: ["h-80", "h-72", "h-64", "h-56", "h-76", "h-68"][i % 6],
  })),
};

export function Photography() {
  const { t } = useLanguage();
  const [view, setView] = useState<"main" | "events-sub">("main");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedCategoryName, setSelectedCategoryName] = useState<string>("");

  const mainCategories = [
    {
      id: "events",
      name: t.photo_events,
      color: "from-violet-600 to-indigo-700",
      hasSubcategories: true,
      description: t.photo_events_desc,
      icon: CalendarDays,
    },
    {
      id: "food",
      name: t.photo_food,
      color: "from-[#FF6B5B] to-orange-600",
      hasSubcategories: false,
      description: t.photo_food_desc,
      icon: UtensilsCrossed,
    },
    {
      id: "portraits",
      name: t.photo_portraits,
      color: "from-pink-500 to-rose-600",
      hasSubcategories: false,
      description: t.photo_portraits_desc,
      icon: User,
    },
  ];

  const eventsSubcategories = [
    {
      id: "concerts",
      name: t.photo_concerts,
      color: "from-violet-500 to-purple-700",
      description: t.photo_concerts_desc,
      icon: Music,
    },
    {
      id: "weddings",
      name: t.photo_weddings,
      color: "from-pink-400 to-rose-500",
      description: t.photo_weddings_desc,
      icon: Heart,
    },
    {
      id: "corporate",
      name: t.photo_corporate,
      color: "from-indigo-500 to-blue-600",
      description: t.photo_corporate_desc,
      icon: Briefcase,
    },
  ];

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

  const goBack = () => setView("main");

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
        <div className="absolute top-32 left-10 w-24 h-24 bg-gradient-to-br from-violet-500/20 to-indigo-600/20 rounded-full blur-2xl" />
        <div className="absolute bottom-20 right-20 w-32 h-32 bg-gradient-to-br from-pink-500/20 to-rose-600/20 rounded-full blur-2xl" />

        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-indigo-400 font-sans text-sm tracking-wider uppercase mb-4">
              {t.photo_label}
            </p>
            <h2 className="font-serif text-5xl md:text-7xl text-white leading-none">
              {t.photo_line1}<br />
              <span className="text-[#FF6B5B]">{t.photo_line2}</span>
            </h2>
          </div>

          {/* Back button */}
          {view === "events-sub" && (
            <button
              onClick={goBack}
              className="flex items-center gap-2 text-white/70 hover:text-white mb-8 transition-colors duration-200"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-sans">{t.photo_back}</span>
            </button>
          )}

          {/* Main categories grid */}
          {view === "main" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Events — featured large card */}
              <div
                className="md:col-span-1 group cursor-pointer"
                onClick={() => handleCategoryClick(mainCategories[0])}
              >
                <div className="aspect-[3/4] rounded-3xl overflow-hidden relative transition-all duration-500 group-hover:scale-[1.02] group-hover:shadow-2xl group-hover:shadow-violet-500/20">
                  <div className="absolute inset-0 bg-[#1a1a2e]">
                    <img src="/placeholder.svg?height=600&width=400" alt={mainCategories[0].name} className="w-full h-full object-cover opacity-60" />
                  </div>
                  <div className={`absolute inset-0 bg-gradient-to-t ${mainCategories[0].color} opacity-70 mix-blend-multiply`} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute top-6 right-6">
                    <CalendarDays className="w-6 h-6 text-white/60 stroke-[1]" />
                  </div>
                  <div className="absolute inset-0 flex flex-col justify-end p-8">
                    <p className="text-white/60 text-sm font-sans mb-2">{mainCategories[0].description}</p>
                    <h3 className="font-serif text-4xl md:text-5xl text-white">{mainCategories[0].name}</h3>
                    <div className="flex items-center gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="text-white/80 text-sm font-sans">{t.photo_explore}</span>
                      <span className="text-white/80">→</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Food & Portraits */}
              <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                {mainCategories.slice(1).map((category) => (
                  <div key={category.id} className="group cursor-pointer" onClick={() => handleCategoryClick(category)}>
                    <div className="aspect-[4/3] rounded-3xl overflow-hidden relative transition-all duration-500 group-hover:scale-[1.02] group-hover:shadow-2xl group-hover:shadow-pink-500/20">
                      <div className="absolute inset-0 bg-[#1a1a2e]">
                        <img src="/placeholder.svg?height=400&width=500" alt={category.name} className="w-full h-full object-cover opacity-60" />
                      </div>
                      <div className={`absolute inset-0 bg-gradient-to-t ${category.color} opacity-70 mix-blend-multiply`} />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <div className="absolute top-5 right-5">
                        {category.id === "food" && <UtensilsCrossed className="w-6 h-6 text-white/60 stroke-[1]" />}
                        {category.id === "portraits" && <User className="w-6 h-6 text-white/60 stroke-[1]" />}
                      </div>
                      <div className="absolute inset-0 flex flex-col justify-end p-6">
                        <h3 className="font-serif text-3xl md:text-4xl text-white">{category.name}</h3>
                        <div className="flex items-center gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <span className="text-white/80 text-sm font-sans">{t.photo_explore}</span>
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
                <div key={subcategory.id} className="group cursor-pointer" onClick={() => handleSubcategoryClick(subcategory)}>
                  <div className="aspect-[4/3] rounded-3xl overflow-hidden relative transition-all duration-500 group-hover:scale-[1.02] group-hover:shadow-2xl">
                    <div className="absolute inset-0 bg-[#1a1a2e]">
                      <img src="/placeholder.svg?height=400&width=500" alt={subcategory.name} className="w-full h-full object-cover opacity-60" />
                    </div>
                    <div className={`absolute inset-0 bg-gradient-to-t ${subcategory.color} opacity-70 mix-blend-multiply`} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute top-5 right-5">
                      {subcategory.id === "concerts" && <Music className="w-6 h-6 text-white/60 stroke-[1]" />}
                      {subcategory.id === "weddings" && <Heart className="w-6 h-6 text-white/60 stroke-[1]" />}
                      {subcategory.id === "corporate" && <Briefcase className="w-6 h-6 text-white/60 stroke-[1]" />}
                    </div>
                    <div className="absolute inset-0 flex flex-col justify-end p-6">
                      <p className="text-white/60 text-sm font-sans mb-1">{subcategory.description}</p>
                      <h3 className="font-serif text-3xl text-white">{subcategory.name}</h3>
                      <div className="flex items-center gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span className="text-white/80 text-sm font-sans">{t.photo_explore}</span>
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
      <div className={`fixed inset-0 z-50 transition-opacity duration-300 ${isModalOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
        <div className="absolute inset-0 bg-[#0a0a0f]/95" onClick={closeGallery} />
        <div className={`relative h-full w-full overflow-y-auto transition-all duration-300 ${isModalOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
          <button
            onClick={closeGallery}
            className="fixed top-6 right-6 z-50 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors duration-200"
          >
            <X className="w-6 h-6 text-white" />
          </button>
          <div className="pt-20 pb-8 px-6 text-center">
            <h3 className="font-serif text-4xl md:text-5xl text-white">{selectedCategoryName}</h3>
          </div>
          <div className="px-0 pb-12">
            <div className="columns-2 md:columns-3 gap-0">
              {selectedPhotos.map((photo, index) => (
                <div key={photo.id} className="break-inside-avoid">
                  <div
                    className={`${photo.height} w-full overflow-hidden transition-all duration-300 hover:brightness-110`}
                    style={{ animation: isModalOpen ? `fadeInUp 0.4s ease-out ${index * 50}ms both` : "none" }}
                  >
                    <img src={photo.src} alt={`${selectedCategoryName} photo ${photo.id}`} className="w-full h-full object-cover" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}
