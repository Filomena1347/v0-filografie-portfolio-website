"use client"

import { useState, useRef, useEffect } from "react"
import { Volume2, VolumeX, Play } from "lucide-react"
import { useLanguage } from "@/context/language-context"

// Masonry gallery images with varying sizes
const galleryImages = [
  { id: 1, src: "https://res.cloudinary.com/duntvai9w/image/upload/v1780147847/Snímek_obrazovky_2026-05-29_v_12.34.41_f4alzi.png", alt: "Portrait photography", size: "tall" },
  { id: 2, src: "https://res.cloudinary.com/duntvai9w/image/upload/v1780147898/Snímek_obrazovky_2026-05-30_v_15.31.19_ob3aun.png", alt: "Lifestyle photography", size: "wide" },
  { id: 3, src: "https://res.cloudinary.com/duntvai9w/image/upload/v1780154203/Sni%CC%81mek_obrazovky_2026-05-30_v_17.16.18_xfoggt.png", alt: "Event photography", size: "medium" },
  { id: 4, src: "https://res.cloudinary.com/duntvai9w/image/upload/v1780154159/Sni%CC%81mek_obrazovky_2026-05-30_v_17.15.41_wfowzq.png", alt: "Food photography", size: "small" },
  { id: 5, src: "https://res.cloudinary.com/duntvai9w/image/upload/v1780147813/Sni%CC%81mek_obrazovky_2026-05-29_v_12.33.50_d3lite.png", alt: "Wedding photography", size: "tall" },
  { id: 6, src: "https://res.cloudinary.com/duntvai9w/image/upload/v1780154527/Sni%CC%81mek_obrazovky_2026-05-30_v_17.21.54_uhziv7.png", alt: "Product photography", size: "medium" },
  { id: 7, src: "https://res.cloudinary.com/duntvai9w/image/upload/v1780154249/Sni%CC%81mek_obrazovky_2026-05-30_v_17.17.06_smki1b.png", alt: "Fashion photography", size: "wide" },
  { id: 8, src: "https://res.cloudinary.com/duntvai9w/image/upload/v1780155677/Sni%CC%81mek_obrazovky_2026-05-30_v_17.41.00_symplk.png", alt: "Commercial photography", size: "small" },
]

const videoReels = [
  { id: 1, src: "https://res.cloudinary.com/duntvai9w/video/upload/v1/Frapp%C3%A9_Matcha_Maracuja_rc9ti6.mp4", title: "Matcha Frappé", category: "Food" },
  { id: 2, src: "https://res.cloudinary.com/duntvai9w/video/upload/v1780151832/merge_DD2D2C17-0A98-4350-9B96-9379B6570DB9_qvniqt.mp4", title: "Behind the Scenes", category: "BTS" },
  { id: 3, src: "https://res.cloudinary.com/duntvai9w/video/upload/v1780153470/How_to_get_to_the_Prague_Old_Town_Tower_50_cheaper_If_you_re_heading_to_Prague_save_this_Re_gcyqm2.mp4", title: "Prague Travel", category: "Travel" },
  { id: 4, src: "https://res.cloudinary.com/duntvai9w/video/upload/v1780151825/Starbucks_video_copy_jdqqld.mp4", title: "Starbucks Story", category: "Commercial" },
]

export function Hero() {
  const { t } = useLanguage()
  const [activeVideo, setActiveVideo] = useState(0)
  const [isMuted, setIsMuted] = useState(true)
  const [isPlaying, setIsPlaying] = useState(true)
  const [hoveredImage, setHoveredImage] = useState<number | null>(null)
  const [phoneVisible, setPhoneVisible] = useState(false)
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const timer = setTimeout(() => setPhoneVisible(true), 1500)
    return () => clearTimeout(timer)
  }, [])

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
        {/* Header text */}
        <div className="mb-10 lg:mb-14 pt-4">
          <h1 className="font-serif text-5xl md:text-7xl text-white leading-none mb-4">
            {t.hero_line1}<br />
            <span className="text-indigo-400">{t.hero_line2}</span>
          </h1>
          <p className="body-text text-white/50 text-sm max-w-lg">
            {t.hero_subtitle}
          </p>
        </div>

        {/* Gallery + Phone overlay */}
        <div className="relative">
          {/* Full-width masonry photo gallery — background layer, 5 columns, object-cover, zero gaps */}
          <div className="grid grid-cols-5 gap-0 h-[500px]">
            {/* Column 1 — top 65%, bottom 35% */}
            <div className="flex flex-col h-full">
              <div className="relative overflow-hidden animate-float-gallery-1" style={{ height: "65%" }} onMouseEnter={() => setHoveredImage(1)} onMouseLeave={() => setHoveredImage(null)}>
                <img src={galleryImages[0].src} alt={galleryImages[0].alt} className={`w-full h-full object-cover transition-all duration-700 ${hoveredImage === 1 ? 'brightness-110' : ''}`} />
              </div>
              <div className="relative overflow-hidden animate-float-gallery-2" style={{ height: "35%" }} onMouseEnter={() => setHoveredImage(4)} onMouseLeave={() => setHoveredImage(null)}>
                <img src={galleryImages[3].src} alt={galleryImages[3].alt} className={`w-full h-full object-cover transition-all duration-700 ${hoveredImage === 4 ? 'brightness-110' : ''}`} />
              </div>
            </div>
            {/* Column 2 — top 40%, bottom 60% */}
            <div className="flex flex-col h-full">
              <div className="relative overflow-hidden animate-float-gallery-3" style={{ height: "40%" }} onMouseEnter={() => setHoveredImage(2)} onMouseLeave={() => setHoveredImage(null)}>
                <img src={galleryImages[1].src} alt={galleryImages[1].alt} className={`w-full h-full object-cover transition-all duration-700 ${hoveredImage === 2 ? 'brightness-110' : ''}`} />
              </div>
              <div className="relative overflow-hidden animate-float-gallery-4" style={{ height: "60%" }} onMouseEnter={() => setHoveredImage(5)} onMouseLeave={() => setHoveredImage(null)}>
                <img src={galleryImages[4].src} alt={galleryImages[4].alt} className={`w-full h-full object-cover transition-all duration-700 ${hoveredImage === 5 ? 'brightness-110' : ''}`} />
              </div>
            </div>
            {/* Column 3 — full height single image */}
            <div className="flex flex-col h-full">
              <div className="relative overflow-hidden animate-float-gallery-5 h-full" onMouseEnter={() => setHoveredImage(3)} onMouseLeave={() => setHoveredImage(null)}>
                <img src={galleryImages[2].src} alt={galleryImages[2].alt} className={`w-full h-full object-cover transition-all duration-700 ${hoveredImage === 3 ? 'brightness-110' : ''}`} />
              </div>
            </div>
            {/* Column 4 — top 55%, bottom 45% */}
            <div className="flex flex-col h-full">
              <div className="relative overflow-hidden animate-float-gallery-6" style={{ height: "55%" }} onMouseEnter={() => setHoveredImage(6)} onMouseLeave={() => setHoveredImage(null)}>
                <img src={galleryImages[5].src} alt={galleryImages[5].alt} className={`w-full h-full object-cover transition-all duration-700 ${hoveredImage === 6 ? 'brightness-110' : ''}`} />
              </div>
              <div className="relative overflow-hidden animate-float-gallery-7" style={{ height: "45%" }} onMouseEnter={() => setHoveredImage(7)} onMouseLeave={() => setHoveredImage(null)}>
                <img src={galleryImages[6].src} alt={galleryImages[6].alt} className={`w-full h-full object-cover transition-all duration-700 ${hoveredImage === 7 ? 'brightness-110' : ''}`} />
              </div>
            </div>
            {/* Column 5 — top 30%, bottom 70% */}
            <div className="flex flex-col h-full">
              <div className="relative overflow-hidden animate-float-gallery-8" style={{ height: "30%" }} onMouseEnter={() => setHoveredImage(8)} onMouseLeave={() => setHoveredImage(null)}>
                <img src={galleryImages[7].src} alt={galleryImages[7].alt} className={`w-full h-full object-cover transition-all duration-700 ${hoveredImage === 8 ? 'brightness-110' : ''}`} />
              </div>
              <div className="relative overflow-hidden animate-float-gallery-1" style={{ height: "70%" }} onMouseEnter={() => setHoveredImage(1)} onMouseLeave={() => setHoveredImage(null)}>
                <img src={galleryImages[0].src} alt={galleryImages[0].alt} className={`w-full h-full object-cover transition-all duration-700`} />
              </div>
            </div>
          </div>

          {/* Phone centered on top — fade + scale entrance after 1.5s */}
          <div
            className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none"
            style={{
              opacity: phoneVisible ? 1 : 0,
              transform: phoneVisible ? 'scale(1)' : 'scale(0.9)',
              transition: 'opacity 0.6s ease-out, transform 0.6s ease-out',
            }}
          >
            <div className="relative w-full max-w-[240px] pointer-events-auto">
              <div className="relative bg-[#1a1a2e] rounded-[2.5rem] p-2 shadow-2xl ring-1 ring-white/10">
                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-20 h-6 bg-black rounded-full z-30" />

                <div
                  ref={scrollContainerRef}
                  onScroll={handleScroll}
                  className="relative h-[400px] overflow-y-scroll snap-y snap-mandatory rounded-[2rem] bg-black scrollbar-hide"
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
              <p className="text-center text-white/30 text-xs mt-3 label-text">{t.hero_scroll_reels}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom label - vertical */}
      <div className="absolute bottom-8 right-8 hidden lg:block">
        <p className="label-text text-white/30 tracking-wider" style={{ writingMode: "vertical-rl" }}>
          {t.hero_scroll}
        </p>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        @keyframes floatGallery1 {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
        @keyframes floatGallery2 {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(5px); }
        }
        @keyframes floatGallery3 {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-4px); }
        }
        @keyframes floatGallery4 {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(6px); }
        }
        @keyframes floatGallery5 {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }
        @keyframes floatGallery6 {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(4px); }
        }
        @keyframes floatGallery7 {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-3px); }
        }
        @keyframes floatGallery8 {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(5px); }
        }
        .animate-float-gallery-1 { animation: floatGallery1 5s ease-in-out infinite; }
        .animate-float-gallery-2 { animation: floatGallery2 6s ease-in-out infinite 0.5s; }
        .animate-float-gallery-3 { animation: floatGallery3 5.5s ease-in-out infinite 0.3s; }
        .animate-float-gallery-4 { animation: floatGallery4 6.5s ease-in-out infinite 0.8s; }
        .animate-float-gallery-5 { animation: floatGallery5 5s ease-in-out infinite 0.2s; }
        .animate-float-gallery-6 { animation: floatGallery6 6s ease-in-out infinite 0.6s; }
        .animate-float-gallery-7 { animation: floatGallery7 5.5s ease-in-out infinite 0.4s; }
        .animate-float-gallery-8 { animation: floatGallery8 6s ease-in-out infinite 0.7s; }
      `}</style>
    </section>
  )
}
