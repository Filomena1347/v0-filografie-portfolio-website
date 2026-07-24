"use client";

import { useState } from "react";
import { ArrowRight, Instagram, Mail, MapPin } from "lucide-react";

export function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    service: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <section id="contact" className="py-32 px-6 relative overflow-hidden">
      {/* Floating decorative elements */}
      <div className="absolute top-32 left-10 w-20 h-20 bg-pink-200 rounded-3xl rotate-12 opacity-50" />
      <div className="absolute bottom-20 right-20 w-14 h-14 bg-indigo-500 rounded-2xl -rotate-6 opacity-50" />
      <div className="absolute top-1/2 right-10 w-10 h-10 bg-amber-300 rounded-xl rotate-45 opacity-40" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <p className="text-indigo-400 font-sans text-sm tracking-wider uppercase mb-4">
            Contact
          </p>
          <h2 className="font-serif text-5xl md:text-7xl text-white leading-none">
            Let&apos;s create<br />
            <span className="text-indigo-400">together.</span>
          </h2>
          <p className="mt-8 font-sans text-gray-400 max-w-2xl mx-auto text-lg font-light">
            Ready to bring your vision to life? Get in touch and let&apos;s discuss your project.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Contact form */}
          <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-10 shadow-xl">
            <div className="space-y-6">
              <div>
                <label className="text-gray-500 font-sans text-sm block mb-2">Your Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-5 py-4 bg-gray-50 border-0 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="text-gray-500 font-sans text-sm block mb-2">Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-5 py-4 bg-gray-50 border-0 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label className="text-gray-500 font-sans text-sm block mb-2">Service Interest</label>
                <select
                  value={formData.service}
                  onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                  className="w-full px-5 py-4 bg-gray-50 border-0 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans appearance-none cursor-pointer"
                >
                  <option value="">Select a service</option>
                  <option value="photography">Photography</option>
                  <option value="video">Videography</option>
                  <option value="digital">Digital Creative</option>
                  <option value="package">Full Package</option>
                </select>
              </div>

              <div>
                <label className="text-gray-500 font-sans text-sm block mb-2">Your Message</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={4}
                  className="w-full px-5 py-4 bg-gray-50 border-0 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none font-sans"
                  placeholder="Tell me about your project..."
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-indigo-500 text-white rounded-full font-sans text-sm font-medium hover:bg-indigo-600 transition-all duration-300 flex items-center justify-center gap-3"
              >
                Send Message
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Contact info */}
          <div className="space-y-10 lg:pl-8">
            <div>
              <h3 className="font-serif text-3xl text-white mb-8">Get in Touch</h3>
              <div className="space-y-6">
                <a
                  href="mailto:hello@filografie.com"
                  className="flex items-center gap-5 group"
                >
                  <div className="w-14 h-14 bg-indigo-500 rounded-2xl flex items-center justify-center">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-gray-500 font-sans text-sm">Email</p>
                    <p className="text-white font-sans text-lg group-hover:text-indigo-400 transition-colors">
                      hello@filografie.com
                    </p>
                  </div>
                </a>

                <a
                  href="https://instagram.com/filografie"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-5 group"
                >
                  <div className="w-14 h-14 bg-[#FF6B5B] rounded-2xl flex items-center justify-center">
                    <Instagram className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-gray-500 font-sans text-sm">Instagram</p>
                    <p className="text-white font-sans text-lg group-hover:text-[#FF6B5B] transition-colors">
                      @filografie
                    </p>
                  </div>
                </a>

                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 bg-amber-400 rounded-2xl flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-gray-500 font-sans text-sm">Location</p>
                    <p className="text-white font-sans text-lg">Available Worldwide</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social links */}
            <div className="pt-8 border-t border-white/10">
              <h3 className="font-serif text-xl text-white mb-6">Follow the Journey</h3>
              <div className="flex gap-3">
                {[
                  { name: "Instagram", abbr: "IG", color: "bg-pink-200 text-gray-900" },
                  { name: "Pinterest", abbr: "PI", color: "bg-[#FF6B5B] text-white" },
                  { name: "Behance", abbr: "BE", color: "bg-indigo-500 text-white" },
                  { name: "LinkedIn", abbr: "LI", color: "bg-sky-400 text-white" },
                ].map((social) => (
                  <a
                    key={social.name}
                    href="#"
                    className={`${social.color} px-5 py-3 rounded-full font-sans text-sm font-medium hover:opacity-80 transition-opacity`}
                  >
                    {social.abbr}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
