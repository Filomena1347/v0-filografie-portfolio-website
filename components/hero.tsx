export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Aurora Background */}
      <div className="absolute inset-0 bg-[#0a0a0f]">
        {/* Violet blob */}
        <div 
          className="aurora-blob absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full opacity-40"
          style={{
            background: "radial-gradient(circle, #7B2FBE 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />
        {/* Purple blob */}
        <div 
          className="aurora-blob-slow absolute top-1/3 right-1/4 w-[500px] h-[500px] rounded-full opacity-50"
          style={{
            background: "radial-gradient(circle, #9D4EDD 0%, transparent 70%)",
            filter: "blur(100px)",
            animationDelay: "-5s",
          }}
        />
        {/* Teal blob */}
        <div 
          className="aurora-blob absolute bottom-1/4 left-1/3 w-[400px] h-[400px] rounded-full opacity-40"
          style={{
            background: "radial-gradient(circle, #2EC4B6 0%, transparent 70%)",
            filter: "blur(90px)",
            animationDelay: "-10s",
          }}
        />
        {/* Pink blob */}
        <div 
          className="aurora-blob-slow absolute bottom-1/3 right-1/3 w-[350px] h-[350px] rounded-full opacity-30"
          style={{
            background: "radial-gradient(circle, #D264B6 0%, transparent 70%)",
            filter: "blur(70px)",
            animationDelay: "-7s",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <h1 className="text-7xl md:text-9xl font-extralight tracking-wider mb-8 float-animation">
          <span className="gradient-text">Filografie</span>
        </h1>
        <p className="text-lg md:text-xl font-light text-[#a1a1aa] leading-relaxed max-w-2xl mx-auto">
          Where light meets story. Capturing moments that transcend time through 
          <span className="text-[#9D4EDD]"> photography</span>, 
          <span className="text-[#2EC4B6]"> video</span>, and 
          <span className="text-[#D264B6]"> digital artistry</span>.
        </p>
        
        <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
          <a 
            href="#work"
            className="px-8 py-4 glass-card rounded-full text-sm tracking-[0.15em] uppercase font-light glow-pulse hover:bg-white/10 transition-all"
          >
            View Work
          </a>
          <a 
            href="#contact"
            className="px-8 py-4 bg-gradient-to-r from-[#7B2FBE] to-[#9D4EDD] rounded-full text-sm tracking-[0.15em] uppercase font-light hover:opacity-90 transition-opacity"
          >
            Get in Touch
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border border-white/20 flex justify-center pt-2">
          <div className="w-1 h-2 bg-[#9D4EDD] rounded-full" />
        </div>
      </div>
    </section>
  )
}
