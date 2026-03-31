import React, { useEffect, useState } from "react";
import { Link } from "wouter";
import { ShoppingBag, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <div className="bg-[#111] text-[#D4AF37] text-xs font-medium py-2 overflow-hidden whitespace-nowrap uppercase tracking-widest relative z-50">
        <div className="inline-block animate-[marquee_20s_linear_infinite]">
          FREE SHIPPING ON ORDERS ABOVE $100 &bull; 20 DAYS RETURN & REFUND POLICY &bull; 100% AUTHENTIC FRAGRANCES &bull; FREE SHIPPING ON ORDERS ABOVE $100 &bull;&nbsp;
        </div>
        <div className="inline-block animate-[marquee_20s_linear_infinite] absolute top-2">
          FREE SHIPPING ON ORDERS ABOVE $100 &bull; 20 DAYS RETURN & REFUND POLICY &bull; 100% AUTHENTIC FRAGRANCES &bull; FREE SHIPPING ON ORDERS ABOVE $100 &bull;&nbsp;
        </div>
      </div>

      <header
        className={`fixed w-full top-auto z-40 transition-all duration-300 ${
          isScrolled
            ? "bg-[#0a0f18]/90 backdrop-blur-md border-b border-white/10 py-4"
            : "bg-transparent py-6"
        }`}
      >
        <div className="container mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex flex-col items-center gap-1 group">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#D4AF37"
              strokeWidth="1.5"
              className="group-hover:scale-110 transition-transform duration-300"
            >
              <path d="M2 20h20M4 20V9l4 4 4-8 4 8 4-4v11" />
            </svg>
            <span className={`font-serif text-2xl tracking-widest ${isScrolled ? 'text-white' : 'text-white'}`}>
              MagnifiScent
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {["Home", "Men", "Women", "Collections", "About", "Contact"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className={`text-sm tracking-widest uppercase hover:text-[#D4AF37] transition-colors ${
                  isScrolled ? 'text-white/80' : 'text-white/90'
                }`}
              >
                {item}
              </a>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-6">
            <button className={`relative hover:text-[#D4AF37] transition-colors ${isScrolled ? 'text-white' : 'text-white'}`}>
              <ShoppingBag size={20} />
              <span className="absolute -top-2 -right-2 bg-[#D4AF37] text-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                0
              </span>
            </button>
            <button 
              className={`md:hidden ${isScrolled ? 'text-white' : 'text-white'}`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-30 bg-[#0a0f18] pt-32 px-6"
          >
            <nav className="flex flex-col gap-8 text-center">
              {["Home", "Men", "Women", "Collections", "About", "Contact"].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-2xl font-serif text-white hover:text-[#D4AF37] transition-colors"
                >
                  {item}
                </a>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-100%); }
        }
      `}</style>
    </>
  );
}
