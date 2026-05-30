import { ArrowRight } from "lucide-react"

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Deep black background */}
      <div className="absolute inset-0 bg-[#050507]" />
      
      {/* Aurora gradient blob - top right like reference */}
      <div 
        className="aurora-glow absolute -top-[20%] -right-[10%] w-[70%] h-[80%]"
        style={{
          background: "radial-gradient(ellipse at center, rgba(124, 58, 237, 0.5) 0%, rgba(192, 38, 211, 0.3) 30%, rgba(219, 39, 119, 0.15) 50%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />
      
      {/* Secondary glow - subtle bottom accent */}
      <div 
        className="aurora-pulse absolute -bottom-[30%] -left-[20%] w-[60%] h-[60%]"
        style={{
          background: "radial-gradient(ellipse at center, rgba(76, 29, 149, 0.25) 0%, transparent 60%)",
          filter: "blur(100px)",
          animationDelay: "-7s",
        }}
      />

      {/* Content */}
      <div className="relative z-10 text-center px-8 max-w-6xl mx-auto">
        {/* Small label */}
        <p className="label-sm text-white/40 mb-12 tracking-[0.25em]">
          Visual Storytelling
        </p>
        
        {/* Main heading - bold, editorial, uppercase like reference */}
        <h1 className="heading-display text-[clamp(3rem,12vw,10rem)] mb-12 text-white">
          FILOGRAFIE
        </h1>
        
        {/* Tagline */}
        <p className="body-light text-white/50 text-lg md:text-xl max-w-xl mx-auto mb-16">
          Where light meets story. Capturing moments that transcend time through 
          photography, motion, and digital artistry.
        </p>
        
        {/* CTA Button - pill style like reference */}
        <a 
          href="#work"
          className="btn-pill inline-flex items-center gap-4 text-[11px] tracking-[0.2em] uppercase font-light text-white/80 hover:text-white"
        >
          View the Work
          <ArrowRight className="w-4 h-4" />
        </a>
      </div>

      {/* Bottom label - rotated like reference */}
      <div className="absolute bottom-12 right-12 hidden lg:block">
        <p 
          className="label-sm text-white/30 tracking-[0.2em]"
          style={{ writingMode: "vertical-rl" }}
        >
          Creative by Filoména
        </p>
      </div>

      {/* Scroll line */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2">
        <div className="w-px h-20 bg-gradient-to-b from-transparent via-white/20 to-transparent" />
      </div>
    </section>
  )
}
