import Link from "next/link"
import { Instagram, Mail, ArrowUp } from "lucide-react"

export function Footer() {
  return (
    <footer className="relative py-16 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="text-2xl font-light tracking-wider gradient-text">
              Filografie
            </Link>
            <p className="mt-4 text-[#71717a] font-light leading-relaxed max-w-md">
              Premium creative services for those who seek to capture life&apos;s most precious moments 
              with artistry and intention.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-xs tracking-[0.2em] text-[#a1a1aa] uppercase mb-4">Services</h4>
            <ul className="space-y-3">
              {["Photography", "Videography", "Digital Creative", "Pricing"].map((link) => (
                <li key={link}>
                  <a 
                    href={`#${link.toLowerCase().replace(" ", "-")}`}
                    className="text-[#71717a] text-sm font-light hover:text-[#9D4EDD] transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs tracking-[0.2em] text-[#a1a1aa] uppercase mb-4">Connect</h4>
            <ul className="space-y-3">
              <li>
                <a 
                  href="mailto:hello@filografie.com"
                  className="flex items-center gap-2 text-[#71717a] text-sm font-light hover:text-[#9D4EDD] transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  hello@filografie.com
                </a>
              </li>
              <li>
                <a 
                  href="https://instagram.com/filografie"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-[#71717a] text-sm font-light hover:text-[#9D4EDD] transition-colors"
                >
                  <Instagram className="w-4 h-4" />
                  @filografie
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/5">
          <p className="text-[#71717a] text-xs font-light">
            © {new Date().getFullYear()} Filografie. All rights reserved.
          </p>
          
          <div className="flex items-center gap-6 mt-4 md:mt-0">
            <a href="#" className="text-[#71717a] text-xs font-light hover:text-[#9D4EDD] transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-[#71717a] text-xs font-light hover:text-[#9D4EDD] transition-colors">
              Terms of Service
            </a>
          </div>

          {/* Back to top */}
          <a 
            href="#"
            className="hidden md:flex items-center gap-2 text-[#71717a] text-xs font-light hover:text-[#9D4EDD] transition-colors group"
          >
            Back to Top
            <ArrowUp className="w-4 h-4 group-hover:-translate-y-1 transition-transform" />
          </a>
        </div>
      </div>
    </footer>
  )
}
