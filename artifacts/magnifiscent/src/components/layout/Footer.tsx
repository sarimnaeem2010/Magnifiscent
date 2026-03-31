import React from "react";
import { Link } from "wouter";
import { Facebook, Instagram } from "lucide-react";
import { SiTiktok } from "react-icons/si";

export function Footer() {
  return (
    <footer className="bg-[#0a0f18] text-white pt-24 pb-12 border-t border-white/10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex flex-col items-start gap-2 mb-6">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#D4AF37"
                strokeWidth="1.5"
              >
                <path d="M2 20h20M4 20V9l4 4 4-8 4 8 4-4v11" />
              </svg>
              <span className="font-serif text-3xl tracking-widest">
                MagnifiScent
              </span>
            </Link>
            <p className="text-white/60 font-serif italic text-lg mb-8 max-w-sm">
              "Wear Your Story"
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-[#D4AF37] hover:border-[#D4AF37] hover:text-black transition-all">
                <Instagram size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-[#D4AF37] hover:border-[#D4AF37] hover:text-black transition-all">
                <Facebook size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-[#D4AF37] hover:border-[#D4AF37] hover:text-black transition-all">
                <SiTiktok size={18} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-serif text-xl mb-6 text-[#D4AF37]">Explore</h4>
            <ul className="flex flex-col gap-4 text-white/70">
              <li><a href="#collections" className="hover:text-white transition-colors">Collections</a></li>
              <li><a href="#men" className="hover:text-white transition-colors">Men's Fragrances</a></li>
              <li><a href="#women" className="hover:text-white transition-colors">Women's Fragrances</a></li>
              <li><a href="#about" className="hover:text-white transition-colors">About Us</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-xl mb-6 text-[#D4AF37]">Support</h4>
            <ul className="flex flex-col gap-4 text-white/70">
              <li><a href="#contact" className="hover:text-white transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Returns Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Shipping Info</a></li>
              <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 text-center md:text-left text-white/50 text-sm flex flex-col md:flex-row justify-between items-center gap-4">
          <p>&copy; 2024 MagnifiScent. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
