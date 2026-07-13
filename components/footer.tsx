"use client";

import Link from "next/link";
import { Instagram, Mail, ArrowUp } from "lucide-react";
import { useLanguage } from "@/context/language-context";

export function Footer() {
  const { t } = useLanguage();

  const serviceLinks = [
    { label: t.footer_photography, href: "#photography" },
    { label: t.footer_videography, href: "#video" },
    { label: t.footer_digital, href: "#digital" },
    { label: t.footer_pricing, href: "#pricing" },
  ];

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
              {t.footer_tagline}
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-sans text-white text-sm font-medium mb-6">{t.footer_services}</h4>
            <ul className="space-y-4">
              {serviceLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="font-sans text-gray-400 text-sm hover:text-white transition-colors duration-300"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-sans text-white text-sm font-medium mb-6">{t.footer_connect}</h4>
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

        <div className="h-px bg-white/10 mb-8" />

        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="font-sans text-gray-500 text-sm">
            © {new Date().getFullYear()} Filografie. {t.footer_copyright}
          </p>
          <div className="flex items-center gap-8 mt-6 md:mt-0">
            <a href="#" className="font-sans text-gray-500 text-sm hover:text-white transition-colors">
              {t.footer_privacy}
            </a>
            <a href="#" className="font-sans text-gray-500 text-sm hover:text-white transition-colors">
              {t.footer_terms}
            </a>
          </div>
          <a
            href="#"
            className="hidden md:flex items-center gap-2 bg-white/5 hover:bg-white/10 px-5 py-3 rounded-full font-sans text-gray-400 text-sm transition-colors group"
          >
            {t.footer_back_top}
            <ArrowUp className="w-4 h-4 group-hover:-translate-y-1 transition-transform" />
          </a>
        </div>
      </div>
    </footer>
  );
}
