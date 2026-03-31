import React, { useState, useRef, useEffect } from "react";
import { ShoppingBag, Search, Menu, X, ChevronDown } from "lucide-react";

const navLinks = [
  { label: "Best Seller", href: "#best-seller" },
  {
    label: "Men Collection",
    href: "#men",
    sub: ["Men's Perfumes", "Men's Collection"],
  },
  {
    label: "Women Collection",
    href: "#women",
    sub: ["Women's Perfumes", "Women's Collection"],
  },
  { label: "Deal & Combo", href: "#deals" },
];

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartCount] = useState(0);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <>
      {/* Announcement Ticker */}
      <div className="bg-[#1a1a1a] text-white overflow-hidden" style={{ height: 38 }}>
        <div className="ticker-track h-full flex items-center">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex items-center gap-0 whitespace-nowrap">
              <span className="text-xs font-semibold tracking-wider px-6">
                FREE SHIPPING ON ORDERS ABOVE $100
              </span>
              <span className="text-xs text-gray-400 px-2">•</span>
              <span className="text-xs font-semibold tracking-wider px-6">
                20 DAYS RETURN &amp; REFUND POLICY
              </span>
              <span className="text-xs text-gray-400 px-2">•</span>
              <span className="text-xs font-semibold tracking-wider px-6">
                100% AUTHENTIC FRAGRANCES
              </span>
              <span className="text-xs text-gray-400 px-2">•</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2 text-black no-underline">
            <svg width="22" height="18" viewBox="0 0 22 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11 2L13.5 7H8.5L11 2Z" fill="#1a1a1a"/>
              <path d="M1 16L3.5 6L7 11L11 1L15 11L18.5 6L21 16H1Z" stroke="#1a1a1a" strokeWidth="1.5" fill="none" strokeLinejoin="round"/>
            </svg>
            <span style={{ fontFamily: 'Georgia, serif', fontSize: 22, fontWeight: 700, letterSpacing: '0.08em', color: '#1a1a1a' }}>
              MagnifiScent
            </span>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1" ref={dropdownRef}>
            {navLinks.map((link) => (
              <div key={link.label} className="relative">
                <button
                  className="flex items-center gap-1 px-4 py-2 text-sm font-semibold text-gray-800 hover:text-black uppercase tracking-wide transition-colors"
                  onClick={() => setOpenDropdown(openDropdown === link.label ? null : link.label)}
                  onMouseEnter={() => link.sub && setOpenDropdown(link.label)}
                >
                  {link.label}
                  {link.sub && <ChevronDown size={14} />}
                </button>
                {link.sub && openDropdown === link.label && (
                  <div
                    className="absolute top-full left-0 bg-white border border-gray-200 shadow-lg min-w-[180px] z-50"
                    onMouseLeave={() => setOpenDropdown(null)}
                  >
                    {link.sub.map((s) => (
                      <a
                        key={s}
                        href={link.href}
                        className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-black"
                        style={{ textDecoration: "none" }}
                        onClick={() => setOpenDropdown(null)}
                      >
                        {s}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Icons */}
          <div className="flex items-center gap-4">
            <button className="text-gray-700 hover:text-black transition-colors hidden md:block">
              <Search size={20} />
            </button>
            <button className="relative text-gray-700 hover:text-black transition-colors">
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-black text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </button>
            <button
              className="md:hidden text-gray-700 hover:text-black"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-4 text-sm font-semibold uppercase tracking-wide border-b border-gray-100 text-gray-800 hover:bg-gray-50"
                style={{ textDecoration: "none" }}
              >
                {link.label}
              </a>
            ))}
          </div>
        )}
      </header>
    </>
  );
}
