import Link from "next/link"
import { Instagram, Mail, ArrowUp } from "lucide-react"

export function Footer() {
  return (
    <footer className="relative py-20 border-t border-[#9D4EDD]/8">
      <div className="max-w-6xl mx-auto px-8">
        <div className="grid md:grid-cols-4 gap-16 mb-16">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="font-serif text-2xl tracking-wide text-[#f5f5f7]">
              Filografie
            </Link>
            <p className="mt-6 body-text text-[#71717a] max-w-md">
              Premium creative services for those who seek to capture life&apos;s most precious moments 
              with artistry and intention.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="label-text text-[#a1a1aa] mb-6">Services</h4>
            <ul className="space-y-4">
              {["Photography", "Videography", "Digital Creative", "Pricing"].map((link) => (
                <li key={link}>
                  <a 
                    href={`#${link.toLowerCase().replace(" ", "-")}`}
                    className="text-[#71717a] text-[14px] font-light hover:text-[#9D4EDD] transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="label-text text-[#a1a1aa] mb-6">Connect</h4>
            <ul className="space-y-4">
              <li>
                <a 
                  href="mailto:hello@filografie.com"
                  className="flex items-center gap-3 text-[#71717a] text-[14px] font-light hover:text-[#9D4EDD] transition-colors"
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
                  className="flex items-center gap-3 text-[#71717a] text-[14px] font-light hover:text-[#9D4EDD] transition-colors"
                >
                  <Instagram className="w-4 h-4" />
                  @filografie
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider line */}
        <div className="gradient-line mb-8" />

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-[#71717a] text-[13px] font-light tracking-wide">
            © {new Date().getFullYear()} Filografie. All rights reserved.
          </p>
          
          <div className="flex items-center gap-8 mt-6 md:mt-0">
            <a href="#" className="text-[#71717a] text-[13px] font-light hover:text-[#9D4EDD] transition-colors">
              Privacy
            </a>
            <a href="#" className="text-[#71717a] text-[13px] font-light hover:text-[#9D4EDD] transition-colors">
              Terms
            </a>
          </div>

          {/* Back to top */}
          <a 
            href="#"
            className="hidden md:flex items-center gap-2 text-[#71717a] text-[13px] font-light hover:text-[#9D4EDD] transition-colors group"
          >
            Back to Top
            <ArrowUp className="w-4 h-4 group-hover:-translate-y-1 transition-transform" />
          </a>
        </div>
      </div>
    </footer>
  )
}
