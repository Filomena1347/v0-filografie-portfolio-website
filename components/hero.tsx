"use client"

import { useState, useRef, useEffect } from "react"
import { Volume2, VolumeX, Play } from "lucide-react"

const galleryImages = [
  { id: 1, src: "https://res.cloudinary.com/duntvai9w/image/upload/v1780147847/Snímek_obrazovky_2026-05-29_v_12.34.41_f4alzi.png", alt: "Portrait photography", category: "Portrait" },
  { id: 2, src: "/placeholder.svg?height=300&width=400", alt: "Event photography", category: "Events" },
  { id: 3, src: "/placeholder.svg?height=350&width=300", alt: "Fashion photography", category: "Fashion" },
  { id: 4, src: "/placeholder.svg?height=280&width=400", alt: "Product photography", category: "Product" },
  { id: 5, src: "/placeholder.svg?height=320&width=300", alt: "Wedding photography", category: "Wedding" },
  { id: 6, src: "/placeholder.svg?height=360&width=400", alt: "Corporate photography", category: "Corporate" },
]

const videoReels = [
  { id: 1, src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4", title: "Behind the Scenes", category: "BTS" },
  { id: 2, src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4", title: "Wedding Highlights", category: "Wedding" },
  { id: 3, src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4", title: "Fashion Week", category: "Fashion" },
  { id: 4, src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4", title: "Brand Story", category: "Commercial" },
]

export function Hero() {
  const [activeVideo, setActiveVideo] = useState(0)
  const [isMuted, setIsMuted] = useState(true)
  const [isPlaying, setIsPlaying] = useState(true)
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  // Handle video autoplay and muting
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

  // Handle scroll snap to detect active video
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

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#0a0a14]">
      {/* Floating decorative elements - keep existing style */}
      <div className="hidden lg:block absolute top-32 right-[15%] animate-float">
        <div className="file-badge accent-pink text-base px-4 py-2 rounded-lg shadow-lg">.psd</div>
      </div>
      
      <div className="hidden lg:block absolute top-48 left-[5%] animate-float-reverse">
        <div className="file-badge accent-blue text-base px-4 py-2 rounded-lg shadow-lg">.raw</div>
      </div>

      <div className="hidden lg:block absolute bottom-32 left-[3%] animate-float">
        <div className="file-badge accent-orange text-base px-4 py-2 rounded-lg shadow-lg">.mov</div>
      </div>

      {/* Main content */}
      <div className="relative z-20 max-w-[1600px] mx-auto px-6 lg:px-12 pt-28 pb-16">
        {/* Header text */}
        <div className="mb-12 lg:mb-16">
          <p className="label-text text-white/50 mb-4">Creative by Filomena</p>
          <h1 className="heading-editorial text-[clamp(2.5rem,6vw,5rem)] text-white mb-4">
            Capture light.<br />Tell stories.
          </h1>
          <p className="body-text text-white/50 text-base max-w-md">
            Premium photography, videography, and digital creative services.
          </p>
        </div>

        {/* Two-part layout */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Left side - Photo Gallery (Masonry) */}
          <div className="flex-1 lg:flex-[1.4]">
            <div className="columns-2 md:columns-3 gap-4 space-y-4">
              {galleryImages.map((image, index) => (
                <div
                  key={image.id}
                  className={`break-inside-avoid group relative overflow-hidden rounded-2xl cursor-pointer ${
                    index % 3 === 0 ? "aspect-[3/4]" : index % 3 === 1 ? "aspect-[4/3]" : "aspect-square"
                  }`}
                >
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105 group-hover:brightness-110"
                  />
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  {/* Category label */}
                  <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                    <span className="text-xs font-medium text-white/90 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full">
                      {image.category}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right side - Vertical Video Reel (TikTok style) */}
          <div className="flex-1 lg:flex-[0.6] flex justify-center lg:justify-end">
            {/* Phone frame */}
            <div className="relative w-full max-w-[280px]">
              {/* Phone outer frame */}
              <div className="relative bg-[#1a1a2e] rounded-[2.5rem] p-2 shadow-2xl">
                {/* Phone notch */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-20 h-6 bg-black rounded-full z-30" />
                
                {/* Video container with scroll snap */}
                <div
                  ref={scrollContainerRef}
                  onScroll={handleScroll}
                  className="relative h-[500px] md:h-[560px] overflow-y-scroll snap-y snap-mandatory rounded-[2rem] bg-black scrollbar-hide"
                  style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                  {videoReels.map((video, index) => (
                    <div
                      key={video.id}
                      className="h-full w-full snap-start snap-always relative flex-shrink-0"
                    >
                      <video
                        ref={(el) => { videoRefs.current[index] = el }}
                        src={video.src}
                        className="w-full h-full object-cover"
                        loop
                        muted={isMuted}
                        playsInline
                        autoPlay={index === 0}
                      />
                      
                      {/* Video overlay gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 pointer-events-none" />
                      
                      {/* Video info at bottom */}
                      <div className="absolute bottom-6 left-4 right-4 z-20">
                        <span className="text-xs font-medium text-white/60 bg-white/10 px-2 py-1 rounded-full">
                          {video.category}
                        </span>
                        <h3 className="text-white font-medium text-sm mt-2">{video.title}</h3>
                      </div>

                      {/* Video index indicator */}
                      <div className="absolute top-12 left-4 z-20">
                        <span className="text-xs text-white/50">{index + 1}/{videoReels.length}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Controls overlay */}
                <div className="absolute bottom-20 right-4 z-30 flex flex-col gap-3">
                  {/* Mute/Unmute button */}
                  <button
                    onClick={toggleMute}
                    className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/60 transition-colors"
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                  
                  {/* Play/Pause button */}
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

                {/* Progress dots */}
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

              {/* Scroll hint */}
              <p className="text-center text-white/30 text-xs mt-4 label-text">
                Scroll to explore reels
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom label - vertical */}
      <div className="absolute bottom-12 right-8 hidden lg:block">
        <p 
          className="label-text text-white/30 tracking-wider"
          style={{ writingMode: "vertical-rl" }}
        >
          Scroll to explore
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
