import { Camera, Film, Palette } from "lucide-react"

export function About() {
  return (
    <section id="about" className="relative py-40 overflow-hidden">
      {/* Subtle aurora glow */}
      <div 
        className="aurora-drift absolute -right-[30%] top-0 w-[60%] h-[100%]"
        style={{
          background: "radial-gradient(ellipse at center, rgba(124, 58, 237, 0.15) 0%, transparent 60%)",
          filter: "blur(100px)",
        }}
      />

      <div className="max-w-7xl mx-auto px-8">
        <div className="grid lg:grid-cols-2 gap-24 items-center">
          {/* Image placeholder */}
          <div className="relative">
            <div className="aspect-[3/4] bg-[#0c0c10] border border-white/5 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-transparent to-fuchsia-500/5" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <Camera className="w-10 h-10 text-white/10 mx-auto mb-4" />
                  <p className="text-white/20 text-[10px] tracking-[0.2em] uppercase">Portrait</p>
                </div>
              </div>
            </div>
          </div>

          {/* Text content */}
          <div className="lg:pl-12">
            <p className="label-sm text-violet-400/80 mb-8">About</p>
            
            <h2 className="heading-display text-4xl md:text-5xl lg:text-6xl mb-12 text-white">
              HELLO, I&apos;M{" "}
              <span className="text-gradient">FILOMÉNA</span>
            </h2>
            
            <div className="space-y-6 body-light text-white/50">
              <p>
                A visual storyteller based in the heart of creativity. With over a decade of experience, 
                I transform ordinary moments into extraordinary memories through the art of light and composition.
              </p>
              <p>
                From intimate weddings to corporate events, fashion editorials to brand campaigns — 
                each project is an opportunity to create something truly unique and meaningful.
              </p>
            </div>

            {/* Services */}
            <div className="mt-20 flex gap-16">
              {[
                { icon: Camera, label: "Photography" },
                { icon: Film, label: "Videography" },
                { icon: Palette, label: "Digital Art" },
              ].map((service) => (
                <div key={service.label} className="group">
                  <service.icon className="w-5 h-5 text-white/20 mb-4 group-hover:text-violet-400/60 transition-colors duration-500" />
                  <p className="text-[10px] tracking-[0.15em] uppercase text-white/30 group-hover:text-white/50 transition-colors duration-500">
                    {service.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
