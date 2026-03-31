import React, { useState, useRef, useEffect } from "react";
import { ShoppingBag, Search, Menu, X, ChevronDown } from "lucide-react";
import { useLocation } from "wouter";
import { useCart } from "@/context/CartContext";
import { DEFAULT_TICKER_MESSAGES } from "@/data/liveData";
import { api } from "@/lib/api";
import logoImg from "@assets/whitelogo_1774978057429.png";

const navLinks = [
  { label: "Home", href: "/" },
  {
    label: "All Products",
    href: "/products",
    sub: [
      { label: "All", href: "/products" },
      { label: "Men", href: "/products?gender=men" },
      { label: "Women", href: "/products?gender=women" },
    ],
  },
  { label: "Deals & Combo", href: "/deals" },
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [tickerMessages, setTickerMessages] = useState<string[]>(DEFAULT_TICKER_MESSAGES);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { count, openCart } = useCart();
  const [location, navigate] = useLocation();

  useEffect(() => {
    api.content.tickerMessages.get().then((res) => {
      if (res.success && Array.isArray(res.messages) && res.messages.length > 0) {
        setTickerMessages(res.messages);
      }
    }).catch(() => {});
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleNav(href: string) {
    setMenuOpen(false);
    setOpenDropdown(null);
    navigate(href);
  }

  return (
    <>
      {/* Announcement Ticker */}
      <div className="bg-[#1a1a1a] text-white overflow-hidden" style={{ height: 38 }}>
        <div className="ticker-track h-full flex items-center">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex items-center gap-0 whitespace-nowrap">
              {tickerMessages.map((msg, j) => (
                <React.Fragment key={j}>
                  <span className="text-xs font-semibold tracking-wider px-6">{msg}</span>
                  <span className="text-xs text-gray-400 px-2">•</span>
                </React.Fragment>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <button
            onClick={() => handleNav("/")}
            className="flex items-center bg-transparent border-none cursor-pointer p-0"
          >
            <img
              src={logoImg}
              alt="MagnifiScent"
              style={{ height: 44, width: "auto", objectFit: "contain", filter: "invert(1)" }}
            />
          </button>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1" ref={dropdownRef}>
            {navLinks.map((link) => (
              <div key={link.label} className="relative">
                {link.sub ? (
                  <>
                    <button
                      className="flex items-center gap-1 px-4 py-2 text-sm font-semibold text-gray-800 hover:text-black uppercase tracking-wide transition-colors"
                      onMouseEnter={() => setOpenDropdown(link.label)}
                      onClick={() => { handleNav(link.href); }}
                    >
                      {link.label}
                      <ChevronDown size={14} />
                    </button>
                    {openDropdown === link.label && (
                      <div
                        className="absolute top-full left-0 bg-white border border-gray-200 shadow-lg min-w-[160px] z-50"
                        onMouseLeave={() => setOpenDropdown(null)}
                      >
                        {link.sub.map((s) => (
                          <button
                            key={s.label}
                            className="block w-full text-left px-5 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-black font-medium transition-colors"
                            onClick={() => handleNav(s.href)}
                          >
                            {s.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <button
                    className={`flex items-center gap-1 px-4 py-2 text-sm font-semibold uppercase tracking-wide transition-colors ${location === link.href ? "text-black border-b-2 border-black" : "text-gray-800 hover:text-black"}`}
                    onClick={() => handleNav(link.href)}
                  >
                    {link.label}
                  </button>
                )}
              </div>
            ))}
          </nav>

          {/* Icons */}
          <div className="flex items-center gap-4">
            <button className="text-gray-700 hover:text-black transition-colors hidden md:block">
              <Search size={20} />
            </button>
            <button
              className="relative text-gray-700 hover:text-black transition-colors"
              onClick={openCart}
              aria-label="Open cart"
            >
              <ShoppingBag size={20} />
              {count > 0 && (
                <span className="absolute -top-2 -right-2 bg-black text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {count}
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
              <div key={link.label}>
                <button
                  onClick={() => handleNav(link.href)}
                  className="block w-full text-left px-4 py-4 text-sm font-semibold uppercase tracking-wide border-b border-gray-100 text-gray-800 hover:bg-gray-50 transition-colors"
                >
                  {link.label}
                </button>
                {link.sub && (
                  <div className="bg-gray-50">
                    {link.sub.map((s) => (
                      <button
                        key={s.label}
                        onClick={() => handleNav(s.href)}
                        className="block w-full text-left px-8 py-3 text-sm text-gray-600 hover:text-black border-b border-gray-100 transition-colors"
                      >
                        — {s.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </header>
    </>
  );
}
