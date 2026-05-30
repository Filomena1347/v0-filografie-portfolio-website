import { Play, Film } from "lucide-react"

export function Video() {
  return (
    <section id="video" className="relative py-40 overflow-hidden bg-[#030305]">
      {/* Aurora glows */}
      <div 
        className="aurora-drift absolute -left-[15%] top-1/2 -translate-y-1/2 w-[40%] h-[60%]"
        style={{
          background: "radial-gradient(ellipse at center, rgba(124, 58, 237, 0.2) 0%, transparent 60%)",
          filter: "blur(100px)",
        }}
      />
      <div 
        className="aurora-pulse absolute -right-[10%] bottom-0 w-[30%] h-[50%]"
        style={{
          background: "radial-gradient(ellipse at center, rgba(192, 38, 211, 0.15) 0%, transparent 60%)",
          filter: "blur(80px)",
          animationDelay: "-5s",
        }}
      />

      <div className="max-w-7xl mx-auto px-8">
        <div className="text-center mb-24">
          <p className="label-sm text-violet-400/80 mb-8">Videography</p>
          <h2 className="heading-display text-4xl md:text-5xl lg:text-7xl text-white">
            STORIES IN <span className="text-gradient">MOTION</span>
          </h2>
        </div>

        {/* Main video showcase */}
        <div className="relative max-w-5xl mx-auto">
          <div className="aspect-video card-dark overflow-hidden group cursor-pointer">
            {/* Video thumbnail placeholder */}
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-fuchsia-500/5">
              <div className="absolute inset-0 flex items-center justify-center">
                {/* Play button */}
                <div className="w-24 h-24 rounded-full border border-white/10 flex items-center justify-center group-hover:border-white/30 group-hover:scale-110 transition-all duration-500">
                  <Play className="w-8 h-8 text-white/60 ml-1 group-hover:text-white transition-colors" />
                </div>
              </div>
            </div>
            
            {/* Video info */}
            <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-[#030305] to-transparent">
              <div className="flex items-center gap-3 text-white/40">
                <Film className="w-4 h-4" />
                <span className="text-[11px] tracking-[0.15em] uppercase font-light">Showreel 2024 — 3:42</span>
              </div>
            </div>
          </div>

          {/* Video thumbnails */}
          <div className="grid grid-cols-3 gap-4 mt-4">
            {[
              { title: "Wedding Films", duration: "2:30" },
              { title: "Event Highlights", duration: "1:45" },
              { title: "Brand Stories", duration: "4:12" },
            ].map((video, index) => (
              <div 
                key={video.title}
                className="card-dark overflow-hidden cursor-pointer group"
              >
                <div className="aspect-video relative">
                  <div 
                    className="absolute inset-0"
                    style={{
                      background: `linear-gradient(${135 + index * 45}deg, 
                        rgba(124, 58, 237, 0.08) 0%, 
                        rgba(5, 5, 7, 0.98) 100%)`
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center">
                      <Play className="w-4 h-4 text-white/60 ml-0.5" />
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-sm font-light text-white/80">{video.title}</p>
                  <p className="text-[10px] text-white/30 mt-1 tracking-[0.1em] uppercase">{video.duration}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
