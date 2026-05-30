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
    console.log(formData)
  }

  return (
    <section id="contact" className="relative py-40 overflow-hidden">
      {/* Light leak - centered atmospheric */}
      <div 
        className="aurora-breathe absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full"
        style={{
          background: "radial-gradient(ellipse, rgba(123, 47, 190, 0.08) 0%, rgba(46, 196, 182, 0.04) 50%, transparent 70%)",
          filter: "blur(120px)",
        }}
      />

      <div className="max-w-6xl mx-auto px-8 relative z-10">
        <div className="text-center mb-20">
          <p className="label-text text-[#9D4EDD] mb-6">Contact</p>
          <h2 className="heading-editorial text-4xl md:text-5xl lg:text-6xl">
            Let&apos;s Create <span className="gradient-text">Together</span>
          </h2>
          <p className="mt-8 body-text text-[#a1a1aa] max-w-2xl mx-auto">
            Ready to bring your vision to life? Get in touch and let&apos;s discuss your project.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Contact form - clean */}
          <form onSubmit={handleSubmit} className="bg-[#111118] border border-[#9D4EDD]/10 p-10">
            <div className="space-y-8">
              <div>
                <label className="label-text text-[#a1a1aa] block mb-3">Your Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-0 py-3 bg-transparent border-0 border-b border-[#9D4EDD]/15 text-white placeholder-[#71717a] focus:outline-none focus:border-[#9D4EDD]/40 transition-colors body-text"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="label-text text-[#a1a1aa] block mb-3">Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-0 py-3 bg-transparent border-0 border-b border-[#9D4EDD]/15 text-white placeholder-[#71717a] focus:outline-none focus:border-[#9D4EDD]/40 transition-colors body-text"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label className="label-text text-[#a1a1aa] block mb-3">Service Interest</label>
                <select
                  value={formData.service}
                  onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                  className="w-full px-0 py-3 bg-transparent border-0 border-b border-[#9D4EDD]/15 text-white focus:outline-none focus:border-[#9D4EDD]/40 transition-colors body-text appearance-none cursor-pointer"
                >
                  <option value="" className="bg-[#111118]">Select a service</option>
                  <option value="photography" className="bg-[#111118]">Photography</option>
                  <option value="video" className="bg-[#111118]">Videography</option>
                  <option value="digital" className="bg-[#111118]">Digital Creative</option>
                  <option value="package" className="bg-[#111118]">Full Package</option>
                </select>
              </div>

              <div>
                <label className="label-text text-[#a1a1aa] block mb-3">Your Message</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={4}
                  className="w-full px-0 py-3 bg-transparent border-0 border-b border-[#9D4EDD]/15 text-white placeholder-[#71717a] focus:outline-none focus:border-[#9D4EDD]/40 transition-colors resize-none body-text"
                  placeholder="Tell me about your project..."
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-[#9D4EDD] text-white text-[13px] tracking-widest uppercase font-light hover:bg-[#8B3FCB] transition-all duration-300 flex items-center justify-center gap-3 mt-4"
              >
                Send Message
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Contact info */}
          <div className="space-y-8 lg:pl-8">
            <div>
              <h3 className="font-serif text-2xl font-light mb-8">Get in Touch</h3>
              <div className="space-y-6">
                <a 
                  href="mailto:hello@filografie.com" 
                  className="flex items-center gap-5 text-[#a1a1aa] hover:text-[#9D4EDD] transition-colors group"
                >
                  <Mail className="w-5 h-5 text-[#9D4EDD]/50 group-hover:text-[#9D4EDD] transition-colors" />
                  <div>
                    <p className="label-text text-[#71717a] mb-1">Email</p>
                    <p className="body-text">hello@filografie.com</p>
                  </div>
                </a>

                <a 
                  href="https://instagram.com/filografie" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-5 text-[#a1a1aa] hover:text-[#9D4EDD] transition-colors group"
                >
                  <Instagram className="w-5 h-5 text-[#9D4EDD]/50 group-hover:text-[#9D4EDD] transition-colors" />
                  <div>
                    <p className="label-text text-[#71717a] mb-1">Instagram</p>
                    <p className="body-text">@filografie</p>
                  </div>
                </a>

                <div className="flex items-center gap-5 text-[#a1a1aa]">
                  <MapPin className="w-5 h-5 text-[#9D4EDD]/50" />
                  <div>
                    <p className="label-text text-[#71717a] mb-1">Location</p>
                    <p className="body-text">Available Worldwide</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social links - minimal */}
            <div className="pt-8 border-t border-[#9D4EDD]/10">
              <h3 className="font-serif text-xl font-light mb-6">Follow the Journey</h3>
              <div className="flex gap-4">
                {["Instagram", "Pinterest", "Behance", "LinkedIn"].map((social) => (
                  <a
                    key={social}
                    href="#"
                    className="px-5 py-3 border border-[#9D4EDD]/10 text-[12px] tracking-widest text-[#71717a] hover:text-[#9D4EDD] hover:border-[#9D4EDD]/30 transition-all duration-300"
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
