"use client"

import { useState, useRef, useEffect } from "react"
import { Volume2, VolumeX, Play } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

import type { GalleryImage } from "@/lib/cloudinary"

const videoReels = [
  { id: 1, src: "https://res.cloudinary.com/duntvai9w/video/upload/v1/Frapp%C3%A9_Matcha_Maracuja_rc9ti6.mp4", title: "Matcha Frappé", category: "Food" },
  { id: 2, src: "https://res.cloudinary.com/duntvai9w/video/upload/v1780151832/merge_DD2D2C17-0A98-4350-9B96-9379B6570DB9_qvniqt.mp4", title: "Behind the Scenes", category: "BTS" },
  { id: 3, src: "https://res.cloudinary.com/duntvai9w/video/upload/v1780153470/How_to_get_to_the_Prague_Old_Town_Tower_50_cheaper_If_you_re_heading_to_Prague_save_this_Re_gcyqm2.mp4", title: "Prague Travel", category: "Travel" },
  { id: 4, src: "https://res.cloudinary.com/duntvai9w/video/upload/v1780151825/Starbucks_video_copy_jdqqld.mp4", title: "Starbucks Story", category: "Commercial" },
]

interface HeroProps {
  photos: GalleryImage[]
}

export function Hero({ photos }: HeroProps) {
  const { t } = useLanguage()
  const [activeVideo, setActiveVideo] = useState(0)
  const [isMuted, setIsMuted] = useState(true)
  const [isPlaying, setIsPlaying] = useState(true)
  const [hoveredImage, setHoveredImage] = useState<number | null>(null)
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  // Map GalleryImage to the shape used in JSX below
  const galleryImages = photos.map((p) => ({ src: p.url, alt: p.category ?? "Photography" }))

  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (video) {
        video.muted = isMuted
        if (index === activeVideo) {
          if (isPlaying) {
            video.play().catch(() => {})
          } else {
            video.pause()
          }
        } else {
          video.pause()
          video.currentTime = 0
        }
      }
    })
  }, [activeVideo, isMuted, isPlaying])

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current
      const scrollTop = container.scrollTop
      const itemHeight = container.clientHeight
      const newIndex = Math.round(scrollTop / itemHeight)
      if (newIndex !== activeVideo && newIndex >= 0 && newIndex < videoReels.length) {
        setActiveVideo(newIndex)
      }
    }
  }

  const toggleMute = () => setIsMuted(!isMuted)
  const togglePlay = () => setIsPlaying(!isPlaying)

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#0a0a14]">
      {/* Main content */}
      <div className="relative z-20 max-w-[1600px] mx-auto px-6 lg:px-12 pt-24 pb-12">
        {/* Header text - removed Filography label */}
        <div className="mb-10 lg:mb-14 pt-4">
          <h1 className="font-serif text-5xl md:text-7xl text-white leading-none mb-4">
            {t.hero.headingLine1}<br />
            <span className="text-indigo-400">{t.hero.headingLine2}</span>
          </h1>
          <p className="body-text text-white/50 text-sm max-w-lg">
            {t.hero.subtitle}
          </p>
        </div>

        {/* Two-part layout */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Left side - Dynamic Masonry Photo Gallery */}
          <div className="flex-1 lg:flex-[2] relative">
            {/* Masonry Grid - CSS columns, natural aspect ratios, zero gap */}
            <div className="columns-2 sm:columns-3 lg:columns-4 xl:columns-5 gap-0">
              {galleryImages.map((image, index) => (
                <div
                  key={index}
                  className="relative overflow-hidden group cursor-pointer bg-[#0a0a0f] break-inside-avoid"
                  onMouseEnter={() => setHoveredImage(index + 1)}
                  onMouseLeave={() => setHoveredImage(null)}
                >
                  <img
                    src={image.src}
                    alt={image.alt}
                    className={`w-full h-auto object-contain bg-[#0a0a0f] transition-all duration-700 ${hoveredImage === index + 1 ? 'scale-105 brightness-110' : 'scale-100'}`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              ))}
            </div>

            {/* View all button */}
            <div className="mt-3 flex justify-start">
              <button
                onClick={() => {
                  document.getElementById("photography")?.scrollIntoView({ behavior: "smooth" })
                }}
                className="text-sm text-white/50 hover:text-white transition-colors duration-200 flex items-center gap-1.5"
              >
                {t.hero.viewAllPhotos}
                <span aria-hidden="true">→</span>
              </button>
            </div>
          </div>

          {/* Right side - Vertical Video Reel (TikTok style) */}
          <div className="flex-1 lg:flex-[0.5] flex justify-center lg:justify-end mt-6 lg:mt-0">
            <div className="relative w-full max-w-[210px] lg:max-w-[260px]">
              <div className="relative bg-[#1a1a2e] rounded-[2.5rem] p-2 shadow-2xl">
                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-20 h-6 bg-black rounded-full z-30" />
                
                <div
                  ref={scrollContainerRef}
                  onScroll={handleScroll}
                  className="relative h-[430px] lg:h-[380px] overflow-y-scroll snap-y snap-mandatory rounded-[2rem] bg-black scrollbar-hide"
                  style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                  {videoReels.map((video, index) => (
                    <div key={video.id} className="h-full w-full snap-start snap-always relative flex-shrink-0">
                      <video
                        ref={(el) => { videoRefs.current[index] = el }}
                        src={video.src}
                        className="w-full h-full object-cover"
                        loop
                        muted={isMuted}
                        playsInline
                        autoPlay={index === 0}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 pointer-events-none" />
                      <div className="absolute bottom-6 left-4 right-4 z-20">
                        <span className="text-xs font-medium text-white/60 bg-white/10 px-2 py-1 rounded-full">
                          {video.category}
                        </span>
                        <h3 className="text-white font-medium text-sm mt-2">{video.title}</h3>
                      </div>
                      <div className="absolute top-12 left-4 z-20">
                        <span className="text-xs text-white/50">{index + 1}/{videoReels.length}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="absolute bottom-20 right-4 z-30 flex flex-col gap-3">
                  <button
                    onClick={toggleMute}
                    className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/60 transition-colors"
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={togglePlay}
                    className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/60 transition-colors"
                  >
                    {isPlaying ? (
                      <div className="flex gap-0.5">
                        <div className="w-1 h-3 bg-white rounded-full" />
                        <div className="w-1 h-3 bg-white rounded-full" />
                      </div>
                    ) : (
                      <Play className="w-4 h-4 fill-white" />
                    )}
                  </button>
                </div>

                <div className="absolute right-2 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-2">
                  {videoReels.map((_, index) => (
                    <div
                      key={index}
                      className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                        index === activeVideo ? "bg-white h-4" : "bg-white/30"
                      }`}
                    />
                  ))}
                </div>
              </div>
              <p className="text-center text-white/30 text-xs mt-3 label-text">{t.hero.scrollExplore}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom label - vertical */}
      <div className="absolute bottom-8 right-8 hidden lg:block">
        <p className="label-text text-white/30 tracking-wider" style={{ writingMode: "vertical-rl" }}>
          {t.hero.scrollExploreVertical}
        </p>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  )
}
