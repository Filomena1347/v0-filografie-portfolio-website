import Link from "next/link";
import { Instagram, Mail, ArrowUp } from "lucide-react";

export function Footer() {
  return (
    <footer className="py-20 px-6 border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-16 mb-16">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="font-serif text-3xl text-white">
              Filografie
            </Link>
            <p className="mt-6 font-sans text-gray-400 max-w-md font-light leading-relaxed">
              Premium creative services for those who seek to capture life&apos;s most precious moments
              with artistry and intention.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-sans text-white text-sm font-medium mb-6">Services</h4>
            <ul className="space-y-4">
              {["Photography", "Videography", "Digital Creative", "Pricing"].map((link) => (
                <li key={link}>
                  <a
                    href={`#${link.toLowerCase().replace(" ", "-")}`}
                    className="font-sans text-gray-400 text-sm hover:text-white transition-colors duration-300"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-sans text-white text-sm font-medium mb-6">Connect</h4>
            <ul className="space-y-4">
              <li>
                <a
                  href="mailto:hello@filografie.com"
                  className="flex items-center gap-3 font-sans text-gray-400 text-sm hover:text-white transition-colors duration-300"
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
                  className="flex items-center gap-3 font-sans text-gray-400 text-sm hover:text-white transition-colors duration-300"
                >
                  <Instagram className="w-4 h-4" />
                  @filografie
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-white/10 mb-8" />

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="font-sans text-gray-500 text-sm">
            © {new Date().getFullYear()} Filografie. All rights reserved.
          </p>

          <div className="flex items-center gap-8 mt-6 md:mt-0">
            <a href="#" className="font-sans text-gray-500 text-sm hover:text-white transition-colors">
              Privacy
            </a>
            <a href="#" className="font-sans text-gray-500 text-sm hover:text-white transition-colors">
              Terms
            </a>
          </div>

          {/* Back to top */}
          <a
            href="#"
            className="hidden md:flex items-center gap-2 bg-white/5 hover:bg-white/10 px-5 py-3 rounded-full font-sans text-gray-400 text-sm transition-colors group"
          >
            Back to Top
            <ArrowUp className="w-4 h-4 group-hover:-translate-y-1 transition-transform" />
          </a>
        </div>
      </div>
    </footer>
  );
}
