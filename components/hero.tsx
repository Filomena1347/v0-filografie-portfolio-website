export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Atmospheric Aurora Light Leaks */}
      <div className="absolute inset-0 bg-[#0a0a0f]">
        {/* Violet light leak - top left */}
        <div 
          className="aurora-light-leak absolute -top-32 -left-32 w-[700px] h-[700px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(123, 47, 190, 0.25) 0%, transparent 60%)",
            filter: "blur(100px)",
          }}
        />
        {/* Teal light leak - bottom right */}
        <div 
          className="aurora-breathe absolute -bottom-48 -right-48 w-[600px] h-[600px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(46, 196, 182, 0.2) 0%, transparent 60%)",
            filter: "blur(120px)",
            animationDelay: "-8s",
          }}
        />
        {/* Subtle pink accent - center */}
        <div 
          className="aurora-light-leak absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(210, 100, 182, 0.08) 0%, transparent 50%)",
            filter: "blur(80px)",
            animationDelay: "-12s",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-8 max-w-5xl mx-auto">
        <p className="label-text text-[#9D4EDD] mb-8 tracking-[0.3em]">
          Visual Storytelling
        </p>
        
        <h1 className="heading-editorial text-6xl md:text-8xl lg:text-9xl mb-10 float-gentle">
          <span className="gradient-text">Filografie</span>
        </h1>
        
        <p className="body-text text-lg md:text-xl text-[#a1a1aa] max-w-2xl mx-auto mb-16">
          Where light meets story. Capturing moments that transcend time through 
          photography, motion, and digital artistry.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-5 justify-center">
          <a 
            href="#work"
            className="px-10 py-4 bg-[#111118] border border-[#9D4EDD]/20 rounded-sm text-[13px] tracking-widest uppercase font-light hover:border-[#9D4EDD]/50 transition-all duration-300"
          >
            View Work
          </a>
          <a 
            href="#contact"
            className="px-10 py-4 bg-[#9D4EDD] text-white rounded-sm text-[13px] tracking-widest uppercase font-light hover:bg-[#8B3FCB] transition-all duration-300"
          >
            Get in Touch
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2">
        <div className="w-px h-16 bg-gradient-to-b from-transparent via-[#9D4EDD]/50 to-transparent" />
      </div>
    </section>
  )
}
