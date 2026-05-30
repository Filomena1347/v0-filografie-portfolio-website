import Link from "next/link"
import { Instagram, Mail, ArrowUp } from "lucide-react"

export function Footer() {
  return (
    <footer className="relative py-24 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid md:grid-cols-4 gap-20 mb-20">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="font-serif text-xl tracking-[0.1em] text-white font-medium">
              FILOGRAFIE
            </Link>
            <p className="mt-8 body-light text-white/30 max-w-md">
              Premium creative services for those who seek to capture life&apos;s most precious moments 
              with artistry and intention.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="label-sm text-white/40 mb-8">Services</h4>
            <ul className="space-y-5">
              {["Photography", "Videography", "Digital Creative", "Pricing"].map((link) => (
                <li key={link}>
                  <a 
                    href={`#${link.toLowerCase().replace(" ", "-")}`}
                    className="text-white/30 text-[13px] font-light hover:text-white transition-colors duration-300"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="label-sm text-white/40 mb-8">Connect</h4>
            <ul className="space-y-5">
              <li>
                <a 
                  href="mailto:hello@filografie.com"
                  className="flex items-center gap-3 text-white/30 text-[13px] font-light hover:text-white transition-colors duration-300"
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
                  className="flex items-center gap-3 text-white/30 text-[13px] font-light hover:text-white transition-colors duration-300"
                >
                  <Instagram className="w-4 h-4" />
                  @filografie
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-10" />

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-white/20 text-[11px] font-light tracking-[0.1em] uppercase">
            © {new Date().getFullYear()} Filografie. All rights reserved.
          </p>
          
          <div className="flex items-center gap-10 mt-6 md:mt-0">
            <a href="#" className="text-white/20 text-[11px] font-light tracking-[0.1em] uppercase hover:text-white transition-colors">
              Privacy
            </a>
            <a href="#" className="text-white/20 text-[11px] font-light tracking-[0.1em] uppercase hover:text-white transition-colors">
              Terms
            </a>
          </div>

          {/* Back to top */}
          <a 
            href="#"
            className="hidden md:flex items-center gap-2 text-white/20 text-[11px] font-light tracking-[0.1em] uppercase hover:text-white transition-colors group"
          >
            Back to Top
            <ArrowUp className="w-4 h-4 group-hover:-translate-y-1 transition-transform" />
          </a>
        </div>
      </div>
    </footer>
  )
}
