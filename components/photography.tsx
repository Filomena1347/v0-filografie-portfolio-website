"use client";

import { useRef } from "react";
import { Loader2, Lock } from "lucide-react";
import { SortableGallery } from "./sortable-gallery";
import { useAdmin } from "@/contexts/admin-context";
import { useLanguage } from "@/contexts/language-context";
import type { GalleryImage } from "@/lib/cloudinary";

const PREVIEW_COUNT = 8;

interface PhotographyProps {
  photos: GalleryImage[];
  onPhotosChange: (images: GalleryImage[]) => void;
  isExpanded: boolean;
  onExpandChange: (expanded: boolean) => void;
}

export function Photography({ photos, onPhotosChange, isExpanded, onExpandChange }: PhotographyProps) {
  const { isAdmin, openLoginModal } = useAdmin();
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);

  const displayedPhotos = isExpanded ? photos : photos.slice(0, PREVIEW_COUNT);
  const hasMore = photos.length > PREVIEW_COUNT;

  return (
    <section id="photography" ref={sectionRef} className="py-32 px-6 relative overflow-hidden">
      {/* Subtle background accents */}
      <div className="absolute top-32 left-10 w-24 h-24 bg-gradient-to-br from-violet-500/20 to-indigo-600/20 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute bottom-20 right-20 w-32 h-32 bg-gradient-to-br from-pink-500/20 to-rose-600/20 rounded-full blur-2xl pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-indigo-400 font-sans text-sm tracking-wider uppercase mb-4">
            {t.photography.eyebrow}
          </p>
          <h2 className="font-serif text-5xl md:text-7xl text-white leading-none">
            {t.photography.headingLine1}<br />
            <span className="text-[#FF6B5B]">{t.photography.headingLine2}</span>
          </h2>
        </div>

        {/* Gallery */}
        {photos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <SortableGallery
              images={[]}
              category="photography"
              onImagesChange={onPhotosChange}
              isModalOpen={true}
            />
            <p className="text-white/60 font-sans mb-2">{t.photography.noImages}</p>
            {!isAdmin ? (
              <button
                onClick={openLoginModal}
                className="mt-4 flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 rounded-xl text-white font-medium transition-colors duration-200 font-sans"
              >
                <Lock className="w-4 h-4" />
                <span>{t.photography.loginToUpload}</span>
              </button>
            ) : (
              <p className="text-white/40 font-sans text-sm">{t.photography.useUploadButton}</p>
            )}
          </div>
        ) : (
          <>
            <div key={isExpanded ? "expanded" : "collapsed"} className="animate-gallery-expand">
              <SortableGallery
                images={displayedPhotos}
                category="photography"
                onImagesChange={onPhotosChange}
                isModalOpen={true}
              />
            </div>

            {/* Expand / collapse button */}
            {hasMore && (
              <div className="flex justify-center mt-10">
                <button
                  onClick={() => onExpandChange(!isExpanded)}
                  className="group relative flex items-center gap-2 px-8 py-3 bg-[#0a0a0f] border border-violet-500/50 rounded-full text-white transition-all duration-300 font-sans text-sm shadow-[0_0_20px_rgba(139,92,246,0.25)] hover:shadow-[0_0_35px_rgba(139,92,246,0.55)] hover:border-violet-400 hover:scale-105"
                >
                  {isExpanded ? (
                    <>
                      {t.photography.closeGallery}
                      <span aria-hidden="true">↑</span>
                    </>
                  ) : (
                    <>
                      {t.photography.viewAllPhotos} ({photos.length})
                      <span aria-hidden="true">→</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
