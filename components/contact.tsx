"use client"

import { useState } from "react"
import { Send, Instagram, Mail, MapPin } from "lucide-react"

export function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    service: "",
    message: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log(formData)
  }

  return (
    <section id="contact" className="relative py-32 overflow-hidden">
      {/* Aurora background blob */}
      <div 
        className="aurora-blob-slow absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-20"
        style={{
          background: "radial-gradient(ellipse, #7B2FBE 0%, #9D4EDD 30%, #2EC4B6 60%, transparent 80%)",
          filter: "blur(120px)",
        }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <p className="text-[#9D4EDD] text-xs tracking-[0.3em] uppercase mb-4">Contact</p>
          <h2 className="text-4xl md:text-5xl font-extralight">
            Let&apos;s Create <span className="gradient-text">Together</span>
          </h2>
          <p className="mt-6 text-[#a1a1aa] font-light max-w-2xl mx-auto leading-relaxed">
            Ready to bring your vision to life? Get in touch and let&apos;s discuss your project.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Contact form */}
          <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-8">
            <div className="space-y-6">
              <div>
                <label className="block text-xs tracking-wider text-[#a1a1aa] mb-2">Your Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-[#71717a] focus:outline-none focus:border-[#9D4EDD]/50 transition-colors"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-xs tracking-wider text-[#a1a1aa] mb-2">Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-[#71717a] focus:outline-none focus:border-[#9D4EDD]/50 transition-colors"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label className="block text-xs tracking-wider text-[#a1a1aa] mb-2">Service Interest</label>
                <select
                  value={formData.service}
                  onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#9D4EDD]/50 transition-colors appearance-none cursor-pointer"
                >
                  <option value="" className="bg-[#0a0a0f]">Select a service</option>
                  <option value="photography" className="bg-[#0a0a0f]">Photography</option>
                  <option value="video" className="bg-[#0a0a0f]">Videography</option>
                  <option value="digital" className="bg-[#0a0a0f]">Digital Creative</option>
                  <option value="package" className="bg-[#0a0a0f]">Full Package</option>
                </select>
              </div>

              <div>
                <label className="block text-xs tracking-wider text-[#a1a1aa] mb-2">Your Message</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-[#71717a] focus:outline-none focus:border-[#9D4EDD]/50 transition-colors resize-none"
                  placeholder="Tell me about your project..."
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-[#7B2FBE] to-[#9D4EDD] rounded-full text-sm tracking-[0.15em] uppercase font-light hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                Send Message
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Contact info */}
          <div className="space-y-8">
            <div className="glass-card rounded-2xl p-8">
              <h3 className="text-xl font-light mb-6">Get in Touch</h3>
              <div className="space-y-6">
                <a 
                  href="mailto:hello@filografie.com" 
                  className="flex items-center gap-4 text-[#a1a1aa] hover:text-[#9D4EDD] transition-colors group"
                >
                  <div className="w-12 h-12 glass-card rounded-xl flex items-center justify-center group-hover:border-[#9D4EDD]/50 transition-colors">
                    <Mail className="w-5 h-5 text-[#9D4EDD]" />
                  </div>
                  <div>
                    <p className="text-xs tracking-wider text-[#71717a] mb-1">Email</p>
                    <p className="font-light">hello@filografie.com</p>
                  </div>
                </a>

                <a 
                  href="https://instagram.com/filografie" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 text-[#a1a1aa] hover:text-[#9D4EDD] transition-colors group"
                >
                  <div className="w-12 h-12 glass-card rounded-xl flex items-center justify-center group-hover:border-[#9D4EDD]/50 transition-colors">
                    <Instagram className="w-5 h-5 text-[#9D4EDD]" />
                  </div>
                  <div>
                    <p className="text-xs tracking-wider text-[#71717a] mb-1">Instagram</p>
                    <p className="font-light">@filografie</p>
                  </div>
                </a>

                <div className="flex items-center gap-4 text-[#a1a1aa]">
                  <div className="w-12 h-12 glass-card rounded-xl flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-[#9D4EDD]" />
                  </div>
                  <div>
                    <p className="text-xs tracking-wider text-[#71717a] mb-1">Location</p>
                    <p className="font-light">Available Worldwide</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social links */}
            <div className="glass-card rounded-2xl p-8">
              <h3 className="text-xl font-light mb-6">Follow the Journey</h3>
              <div className="flex gap-4">
                {["Instagram", "Pinterest", "Behance", "LinkedIn"].map((social) => (
                  <a
                    key={social}
                    href="#"
                    className="flex-1 py-3 glass-card rounded-lg text-center text-xs tracking-wider text-[#a1a1aa] hover:text-[#9D4EDD] hover:border-[#9D4EDD]/30 transition-all"
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
