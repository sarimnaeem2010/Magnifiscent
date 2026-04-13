import React from "react";
import { Link } from "wouter";
import { Instagram, Facebook } from "lucide-react";
import logoImg from "@assets/whitelogo_1774978057429.png";

export function Footer() {
  return (
    <footer className="bg-[#1a1a1a] text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="mb-4">
              <img
                src={logoImg}
                alt="MagnifiScent"
                style={{ height: 44, width: "auto", objectFit: "contain" }}
              />
            </div>
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
              Premium Eau de Parfum — crafted for those who wear their story.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-9 h-9 rounded-full border border-gray-600 flex items-center justify-center hover:border-white hover:bg-white hover:text-black transition-all">
                <Instagram size={16} />
              </a>
              <a href="#" className="w-9 h-9 rounded-full border border-gray-600 flex items-center justify-center hover:border-white hover:bg-white hover:text-black transition-all">
                <Facebook size={16} />
              </a>
              <a href="#" className="w-9 h-9 rounded-full border border-gray-600 flex items-center justify-center hover:border-white hover:bg-white hover:text-black transition-all text-xs font-bold">
                TK
              </a>
            </div>
          </div>

          {/* Collections */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest mb-5 text-gray-300">Collections</h4>
            <ul className="space-y-3">
              {["Men's Perfumes", "Women's Perfumes", "Best Sellers", "New Arrivals", "Deal & Combo"].map((l) => (
                <li key={l}>
                  <a href="#" className="text-gray-400 text-sm hover:text-white transition-colors" style={{ textDecoration: "none" }}>{l}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest mb-5 text-gray-300">Information</h4>
            <ul className="space-y-3">
              <li><Link href="/blog" className="text-gray-400 text-sm hover:text-white transition-colors" style={{ textDecoration: "none" }}>Blog & Guides</Link></li>
              <li><Link href="/about" className="text-gray-400 text-sm hover:text-white transition-colors" style={{ textDecoration: "none" }}>About Us</Link></li>
              <li><Link href="/contact" className="text-gray-400 text-sm hover:text-white transition-colors" style={{ textDecoration: "none" }}>Contact Us</Link></li>
              <li><Link href="/returns" className="text-gray-400 text-sm hover:text-white transition-colors" style={{ textDecoration: "none" }}>Returns Policy</Link></li>
              <li><Link href="/shipping" className="text-gray-400 text-sm hover:text-white transition-colors" style={{ textDecoration: "none" }}>Shipping Info</Link></li>
              <li><Link href="/privacy" className="text-gray-400 text-sm hover:text-white transition-colors" style={{ textDecoration: "none" }}>Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-gray-400 text-sm hover:text-white transition-colors" style={{ textDecoration: "none" }}>Terms of Service</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest mb-5 text-gray-300">Newsletter</h4>
            <p className="text-gray-400 text-sm mb-4">Subscribe for exclusive offers and new launches.</p>
            <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-2">
              <input
                type="email"
                placeholder="Your email address"
                className="bg-transparent border border-gray-600 text-white placeholder-gray-500 px-3 py-2 text-sm focus:outline-none focus:border-white transition-colors"
              />
              <button type="submit" className="bg-white text-black text-sm font-bold uppercase tracking-widest py-2 hover:bg-gray-200 transition-colors">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-6 flex flex-col md:flex-row justify-between items-center gap-3 text-gray-500 text-xs">
          <p>&copy; {new Date().getFullYear()} MagnifiScent. All rights reserved.</p>
          <p>Eau de Parfum • 100ml • 3.4 Fl.oz</p>
        </div>
      </div>
    </footer>
  );
}
