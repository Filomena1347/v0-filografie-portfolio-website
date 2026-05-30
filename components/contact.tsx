"use client"

import { useState } from "react"
import { ArrowRight, Instagram, Mail, MapPin } from "lucide-react"

export function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    service: "",
    message: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log(formData)
  }

  return (
    <section id="contact" className="relative py-40 overflow-hidden">
      {/* Aurora glow - centered */}
      <div 
        className="aurora-pulse absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%]"
        style={{
          background: "radial-gradient(ellipse at center, rgba(124, 58, 237, 0.08) 0%, rgba(192, 38, 211, 0.04) 40%, transparent 70%)",
          filter: "blur(120px)",
        }}
      />

      <div className="max-w-7xl mx-auto px-8 relative z-10">
        <div className="text-center mb-24">
          <p className="label-sm text-violet-400/80 mb-8">Contact</p>
          <h2 className="heading-display text-4xl md:text-5xl lg:text-7xl text-white">
            LET&apos;S CREATE <span className="text-gradient">TOGETHER</span>
          </h2>
          <p className="mt-10 body-light text-white/40 max-w-2xl mx-auto">
            Ready to bring your vision to life? Get in touch and let&apos;s discuss your project.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-20 items-start">
          {/* Contact form */}
          <form onSubmit={handleSubmit} className="card-dark p-12">
            <div className="space-y-10">
              <div>
                <label className="label-sm text-white/40 block mb-4">Your Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-0 py-4 bg-transparent border-0 border-b border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-violet-500/30 transition-colors body-light"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="label-sm text-white/40 block mb-4">Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-0 py-4 bg-transparent border-0 border-b border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-violet-500/30 transition-colors body-light"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label className="label-sm text-white/40 block mb-4">Service Interest</label>
                <select
                  value={formData.service}
                  onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                  className="w-full px-0 py-4 bg-transparent border-0 border-b border-white/10 text-white focus:outline-none focus:border-violet-500/30 transition-colors body-light appearance-none cursor-pointer"
                >
                  <option value="" className="bg-[#0c0c10]">Select a service</option>
                  <option value="photography" className="bg-[#0c0c10]">Photography</option>
                  <option value="video" className="bg-[#0c0c10]">Videography</option>
                  <option value="digital" className="bg-[#0c0c10]">Digital Creative</option>
                  <option value="package" className="bg-[#0c0c10]">Full Package</option>
                </select>
              </div>

              <div>
                <label className="label-sm text-white/40 block mb-4">Your Message</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={4}
                  className="w-full px-0 py-4 bg-transparent border-0 border-b border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-violet-500/30 transition-colors resize-none body-light"
                  placeholder="Tell me about your project..."
                />
              </div>

              <button
                type="submit"
                className="w-full py-5 bg-violet-600 text-white text-[11px] tracking-[0.2em] uppercase font-light hover:bg-violet-500 transition-all duration-300 flex items-center justify-center gap-3 mt-4"
              >
                Send Message
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Contact info */}
          <div className="space-y-12 lg:pl-12">
            <div>
              <h3 className="heading-light text-2xl text-white mb-10">Get in Touch</h3>
              <div className="space-y-8">
                <a 
                  href="mailto:hello@filografie.com" 
                  className="flex items-center gap-6 text-white/40 hover:text-white transition-colors group"
                >
                  <Mail className="w-5 h-5 text-violet-400/40 group-hover:text-violet-400 transition-colors" />
                  <div>
                    <p className="label-sm text-white/20 mb-1">Email</p>
                    <p className="body-light">hello@filografie.com</p>
                  </div>
                </a>

                <a 
                  href="https://instagram.com/filografie" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-6 text-white/40 hover:text-white transition-colors group"
                >
                  <Instagram className="w-5 h-5 text-violet-400/40 group-hover:text-violet-400 transition-colors" />
                  <div>
                    <p className="label-sm text-white/20 mb-1">Instagram</p>
                    <p className="body-light">@filografie</p>
                  </div>
                </a>

                <div className="flex items-center gap-6 text-white/40">
                  <MapPin className="w-5 h-5 text-violet-400/40" />
                  <div>
                    <p className="label-sm text-white/20 mb-1">Location</p>
                    <p className="body-light">Available Worldwide</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social links */}
            <div className="pt-10 border-t border-white/5">
              <h3 className="heading-light text-xl text-white mb-8">Follow the Journey</h3>
              <div className="flex gap-3">
                {["Instagram", "Pinterest", "Behance", "LinkedIn"].map((social) => (
                  <a
                    key={social}
                    href="#"
                    className="px-5 py-3 border border-white/5 text-[10px] tracking-[0.15em] uppercase text-white/30 hover:text-white hover:border-white/20 transition-all duration-300"
                  >
                    {social.slice(0, 2).toUpperCase()}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
