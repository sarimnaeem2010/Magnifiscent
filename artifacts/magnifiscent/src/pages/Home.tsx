import React, { useState, useEffect, useRef } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

import chicImg from "@assets/image_1774960377576.png";
import darkAngelImg from "@assets/image_1774960421561.png";
import risingSunImg from "@assets/image_1774960455085.png";
import sigmaImg from "@assets/image_1774960467602.png";
import questImg from "@assets/image_1774960352441.png";

/* ─── Product Data ─── */
const WOMEN_PRODUCTS = [
  {
    id: 1,
    name: "CHIC",
    img: chicImg,
    img2: chicImg,
    price: "$89.00",
    originalPrice: "$110.00",
    reviews: 42,
    category: "women",
    desc: "A warm floral fragrance with golden rose and soft jasmine notes, feminine and unforgettable.",
  },
  {
    id: 2,
    name: "Dark Angel",
    img: darkAngelImg,
    img2: darkAngelImg,
    price: "$109.00",
    originalPrice: "$135.00",
    reviews: 27,
    category: "women",
    desc: "Mysterious and exotic — black amber, oud and vanilla create an irresistible dark allure.",
  },
  {
    id: 3,
    name: "Rising Sun",
    img: risingSunImg,
    img2: risingSunImg,
    price: "$75.00",
    originalPrice: "$95.00",
    reviews: 18,
    category: "women",
    desc: "Fresh citrus and green notes that feel like the first light of a new day.",
  },
  {
    id: 4,
    name: "SIGMA",
    img: sigmaImg,
    img2: sigmaImg,
    price: "$95.00",
    originalPrice: "$120.00",
    reviews: 31,
    category: "women",
    desc: "Warm amber and spice in a bottle — a bold, long-lasting statement scent.",
  },
];

const MEN_PRODUCTS = [
  {
    id: 5,
    name: "QUEST",
    img: questImg,
    img2: questImg,
    price: "$89.00",
    originalPrice: "$115.00",
    reviews: 54,
    category: "men",
    desc: "Bold and adventurous — deep blue aquatics and mountain freshness for the modern explorer.",
  },
  {
    id: 6,
    name: "NOIR",
    img: "/noir-product.png",
    img2: "/noir-product.png",
    price: "$120.00",
    originalPrice: "$150.00",
    reviews: 19,
    category: "men",
    desc: "A dark, smoky leather fragrance with notes of oud and black pepper. Intense and masculine.",
  },
  {
    id: 7,
    name: "STORM",
    img: "/storm-product.png",
    img2: "/storm-product.png",
    price: "$85.00",
    originalPrice: "$105.00",
    reviews: 22,
    category: "men",
    desc: "Cool, energetic aquatic notes with a cedarwood base — the scent of raw power.",
  },
];

const ALL_PRODUCTS = [...WOMEN_PRODUCTS, ...MEN_PRODUCTS];
const BEST_SELLERS = [MEN_PRODUCTS[0], WOMEN_PRODUCTS[0], WOMEN_PRODUCTS[1], WOMEN_PRODUCTS[3]];
const NEW_ARRIVALS = [WOMEN_PRODUCTS[2], MEN_PRODUCTS[2], MEN_PRODUCTS[1], WOMEN_PRODUCTS[0]];

/* ─── Hero Slides ─── */
const HERO_SLIDES = [
  {
    bg: "/hero-bg.png",
    tagline: "NEW COLLECTION",
    title: "Discover Your\nSignature Scent",
    cta: "Shop Now",
  },
  {
    bg: "/men-split.png",
    tagline: "MEN'S COLLECTION",
    title: "Bold. Masculine.\nUnforgettable.",
    cta: "Shop Men",
  },
  {
    bg: "/women-split.png",
    tagline: "WOMEN'S COLLECTION",
    title: "Floral. Elegant.\nTimeless.",
    cta: "Shop Women",
  },
];

/* ─── Top Categories ─── */
const CATEGORIES = [
  { label: "MEN", count: "3", img: "/men-banner.png", href: "#men" },
  { label: "WOMEN", count: "4", img: "/women-banner.png", href: "#women" },
  { label: "FRESH", count: "2", img: "/storm-product.png", href: "#" },
  { label: "FLORAL", count: "3", img: "/women-split.png", href: "#" },
  { label: "WOODY", count: "2", img: "/noir-product.png", href: "#" },
  { label: "ORIENTAL", count: "3", img: "/story-bg.png", href: "#" },
];

/* ─── Notes ─── */
const NOTES = [
  { label: "FLORAL", count: "3", color: "#fce7f3", imgBg: "#f9a8d4" },
  { label: "FRESH", count: "2", color: "#e0f2fe", imgBg: "#7dd3fc" },
  { label: "WOODY", count: "2", color: "#fef3c7", imgBg: "#d97706" },
  { label: "MUSKY", count: "2", color: "#f3e8ff", imgBg: "#a855f7" },
  { label: "ORIENTAL", count: "3", color: "#fff7ed", imgBg: "#ea580c" },
  { label: "AQUATIC", count: "1", color: "#ecfeff", imgBg: "#06b6d4" },
];

/* ─── Reviews ─── */
const REVIEWS = [
  { name: "Sarah M.", rating: 5, product: "CHIC", text: "Absolutely stunning fragrance. I get compliments every time I wear it. The longevity is incredible — lasts all day without being overpowering." },
  { name: "James K.", rating: 5, product: "QUEST", text: "QUEST is now my go-to everyday scent. Bold but not overwhelming. The bottle looks amazing on my dresser too." },
  { name: "Layla H.", rating: 5, product: "Dark Angel", text: "Dark Angel is unlike anything I've tried before. It's mysterious and alluring — perfect for evening wear. Highly recommend." },
  { name: "Omar A.", rating: 4, product: "SIGMA", text: "SIGMA has great projection and longevity. A bold scent that lasts the whole day. Premium quality at a fair price." },
  { name: "Emma R.", rating: 5, product: "Rising Sun", text: "Rising Sun is my morning go-to. Fresh, clean, and uplifting. It makes me feel confident and ready for the day." },
];

/* ─── Components ─── */
function StarRating({ count }: { count: number }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={11} className={i < count ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"} />
      ))}
    </div>
  );
}

function ProductCard({ product, className = "" }: { product: typeof ALL_PRODUCTS[0]; className?: string }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={`product-card flex-shrink-0 w-[220px] md:w-[240px] cursor-pointer ${className}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image container */}
      <div className="relative overflow-hidden bg-gray-50" style={{ aspectRatio: "3/4" }}>
        <span className="sale-badge">SALE</span>
        <img
          src={product.img}
          alt={product.name}
          className="product-img-main w-full h-full object-cover"
          style={{ position: "absolute", inset: 0, opacity: hovered ? 0 : 1, transition: "opacity 0.4s ease" }}
        />
        <img
          src={product.img2}
          alt={product.name}
          className="w-full h-full object-cover"
          style={{ position: "absolute", inset: 0, opacity: hovered ? 1 : 0, transition: "opacity 0.4s ease", filter: "brightness(0.95) saturate(1.05)" }}
        />
        <button
          className="quickshop-btn"
          style={{ transform: hovered ? "translateY(0)" : "translateY(100%)", transition: "transform 0.3s ease" }}
          onClick={(e) => { e.stopPropagation(); }}
        >
          Quick Shop
        </button>
      </div>

      {/* Info */}
      <div className="pt-3 pb-2">
        <div className="flex items-center gap-1 mb-1">
          <StarRating count={5} />
          <span className="text-gray-400 text-xs ml-1">{product.reviews}</span>
        </div>
        <h3 className="font-semibold text-sm text-gray-900 hover:text-gray-600 transition-colors mb-1" style={{ letterSpacing: "0.02em" }}>
          {product.name}
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-gray-900">On sale from {product.price}</span>
          <span className="text-xs text-gray-400 line-through">{product.originalPrice}</span>
        </div>
      </div>
    </div>
  );
}

function SectionHeader({ title, viewAllHref = "#" }: { title: string; viewAllHref?: string }) {
  return (
    <div className="flex items-end justify-between mb-6">
      <h2 className="section-title">{title}</h2>
      <a href={viewAllHref} className="text-sm font-semibold text-gray-700 hover:text-black transition-colors underline underline-offset-2" style={{ letterSpacing: "0.05em" }}>
        View All
      </a>
    </div>
  );
}

/* ─── Main Page ─── */
export default function Home() {
  const [heroSlide, setHeroSlide] = useState(0);
  const [reviewSlide, setReviewSlide] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setHeroSlide((s) => (s + 1) % HERO_SLIDES.length), 5000);
    return () => clearInterval(t);
  }, []);

  const slide = HERO_SLIDES[heroSlide];

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Header />

      {/* ── Hero Slideshow ── */}
      <section className="relative w-full overflow-hidden" style={{ height: "clamp(400px, 60vw, 700px)" }}>
        {HERO_SLIDES.map((s, i) => (
          <div
            key={i}
            className="absolute inset-0 transition-opacity duration-700"
            style={{ opacity: i === heroSlide ? 1 : 0 }}
          >
            <img src={s.bg} alt={s.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40" />
          </div>
        ))}

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white z-10 px-4">
          <p className="text-xs font-bold uppercase tracking-[0.3em] mb-3 opacity-90">{slide.tagline}</p>
          <h1 className="font-bold mb-6 leading-tight" style={{ fontFamily: "Georgia, serif", fontSize: "clamp(2rem, 6vw, 4rem)", whiteSpace: "pre-line" }}>
            {slide.title}
          </h1>
          <a
            href="#best-seller"
            className="inline-block bg-white text-black font-bold uppercase tracking-widest text-xs px-8 py-3 hover:bg-gray-100 transition-colors"
            style={{ textDecoration: "none" }}
          >
            {slide.cta}
          </a>
        </div>

        {/* Slide dots */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {HERO_SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setHeroSlide(i)}
              className="rounded-full border-2 border-white transition-all"
              style={{
                width: i === heroSlide ? 24 : 8,
                height: 8,
                background: i === heroSlide ? "white" : "rgba(255,255,255,0.4)",
              }}
            />
          ))}
        </div>

        {/* Arrows */}
        <button
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/30 hover:bg-black/60 text-white rounded-full p-2 transition-colors"
          onClick={() => setHeroSlide((s) => (s - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)}
        >
          <ChevronLeft size={20} />
        </button>
        <button
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/30 hover:bg-black/60 text-white rounded-full p-2 transition-colors"
          onClick={() => setHeroSlide((s) => (s + 1) % HERO_SLIDES.length)}
        >
          <ChevronRight size={20} />
        </button>
      </section>

      {/* ── Top Categories ── */}
      <section className="py-10 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="section-title text-center">Top Categories</h2>
          <div className="scroll-x justify-center flex-wrap gap-y-6 md:flex-nowrap">
            {CATEGORIES.map((cat) => (
              <a key={cat.label} href={cat.href} className="category-tile" style={{ textDecoration: "none" }}>
                <img src={cat.img} alt={cat.label} className="cat-img" />
                <span className="cat-label">{cat.label}</span>
                <span className="cat-count">({cat.count})</span>
              </a>
            ))}
          </div>
          <div className="text-center mt-6">
            <a href="#" className="text-sm font-semibold uppercase tracking-widest text-gray-700 hover:text-black border-b-2 border-gray-700 hover:border-black pb-1 transition-colors" style={{ textDecoration: "none" }}>
              All Collections
            </a>
          </div>
        </div>
      </section>

      {/* ── Deals & Combo ── */}
      <section id="deals" className="py-10 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHeader title="Deals &amp; Combo" />
          <div className="scroll-x pb-4">
            {/* Combo Card: QUEST + CHIC */}
            <DealCard
              name="THE ICONIC DUO"
              img1={questImg}
              img2={chicImg}
              price="$149.00"
              originalPrice="$178.00"
              reviews={14}
              desc="Two signature fragrances paired together in one exclusive combo — one bold, one floral."
            />
            <DealCard
              name="FLORAL DREAM PACK"
              img1={chicImg}
              img2={sigmaImg}
              price="$159.00"
              originalPrice="$204.00"
              reviews={8}
              desc="CHIC and SIGMA — warm and feminine florals combined in a stunning gift set."
            />
            <DealCard
              name="DARK POWER DUO"
              img1={darkAngelImg}
              img2={"/noir-product.png"}
              price="$189.00"
              originalPrice="$229.00"
              reviews={11}
              desc="Dark Angel meets NOIR — an intense, mysterious pairing for bold souls."
            />
            <DealCard
              name="RISING STORM SET"
              img1={risingSunImg}
              img2={"/storm-product.png"}
              price="$139.00"
              originalPrice="$160.00"
              reviews={6}
              desc="Fresh meets aquatic — Rising Sun and STORM, the perfect daytime duo."
            />
          </div>
        </div>
      </section>

      {/* ── Shop By Gender ── */}
      <section className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <h2 className="section-title">Shop By Gender</h2>
        </div>
        <div className="flex flex-col md:flex-row" style={{ minHeight: 420 }}>
          <a href="#men" className="flex-1 relative group overflow-hidden block" style={{ textDecoration: "none", minHeight: 300 }}>
            <img
              src="/men-split.png"
              alt="Men's Collection"
              className="w-full h-full object-cover"
              style={{ minHeight: 300, transition: "transform 1.5s ease" }}
            />
            <div className="absolute inset-0 bg-black/35 group-hover:bg-black/20 transition-colors duration-500" />
            <div className="absolute inset-0 flex flex-col items-center justify-end pb-12 text-white text-center">
              <h3 className="font-bold text-4xl md:text-5xl uppercase tracking-widest mb-2" style={{ fontFamily: "Georgia, serif" }}>MEN</h3>
              <p className="text-sm text-white/80 mb-5">3 products</p>
              <span className="inline-block border border-white text-white text-xs font-bold uppercase tracking-widest px-6 py-2 group-hover:bg-white group-hover:text-black transition-all duration-300">
                Shop Now
              </span>
            </div>
          </a>
          <a href="#women" className="flex-1 relative group overflow-hidden block" style={{ textDecoration: "none", minHeight: 300 }}>
            <img
              src="/women-split.png"
              alt="Women's Collection"
              className="w-full h-full object-cover"
              style={{ minHeight: 300, transition: "transform 1.5s ease" }}
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-500" />
            <div className="absolute inset-0 flex flex-col items-center justify-end pb-12 text-white text-center">
              <h3 className="font-bold text-4xl md:text-5xl uppercase tracking-widest mb-2" style={{ fontFamily: "Georgia, serif" }}>WOMEN</h3>
              <p className="text-sm text-white/80 mb-5">4 products</p>
              <span className="inline-block border border-white text-white text-xs font-bold uppercase tracking-widest px-6 py-2 group-hover:bg-white group-hover:text-black transition-all duration-300">
                Shop Now
              </span>
            </div>
          </a>
        </div>
      </section>

      {/* ── Best Seller ── */}
      <section id="best-seller" className="py-10 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHeader title="Best Seller" />
          <div className="scroll-x">
            {BEST_SELLERS.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Women's Collection ── */}
      <section id="women" className="py-10 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHeader title="Women's Collection" />
          <div className="scroll-x">
            {WOMEN_PRODUCTS.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Men's Collection ── */}
      <section id="men" className="py-10 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHeader title="Men's Collection" />
          <div className="scroll-x">
            {MEN_PRODUCTS.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Shop By Notes ── */}
      <section className="py-10 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="section-title">Shop By Notes</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {NOTES.map((note) => (
              <a
                key={note.label}
                href="#"
                className="flex flex-col items-center gap-3 group"
                style={{ textDecoration: "none" }}
              >
                <div
                  className="w-full aspect-square rounded-lg flex items-center justify-center text-white font-bold text-2xl group-hover:scale-105 transition-transform duration-300"
                  style={{ background: `linear-gradient(135deg, ${note.imgBg}, ${note.color})` }}
                >
                  {note.label[0]}
                </div>
                <div className="text-center">
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-800">{note.label}</p>
                  <p className="text-xs text-gray-500">{note.count} products</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── New Arrivals ── */}
      <section className="py-10 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHeader title="New Arrivals" />
          <div className="scroll-x">
            {NEW_ARRIVALS.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Buyer's Reviews ── */}
      <section className="py-10 border-b border-gray-100 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="section-title text-center">Buyer's Reviews</h2>
          <div className="relative">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
              {REVIEWS.slice(reviewSlide, reviewSlide + 3).map((r, i) => (
                <div key={i} className="bg-white rounded p-6 shadow-sm">
                  <StarRating count={r.rating} />
                  <p className="text-gray-600 text-sm mt-3 mb-4 leading-relaxed italic">"{r.text}"</p>
                  <div>
                    <p className="font-bold text-sm text-gray-900">{r.name}</p>
                    <p className="text-xs text-gray-400">{r.product}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-center gap-2 mt-6">
              {Array.from({ length: Math.ceil(REVIEWS.length / 3) }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setReviewSlide(i * 3)}
                  className="rounded-full border-2 border-gray-400 transition-all"
                  style={{
                    width: 8,
                    height: 8,
                    background: reviewSlide === i * 3 ? "#1a1a1a" : "transparent",
                    borderColor: reviewSlide === i * 3 ? "#1a1a1a" : "#d1d5db",
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Why Choose MagnifiScent ── */}
      <section className="py-12 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="section-title text-center">Why Choose MagnifiScent?</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-6">
            {[
              { icon: "🚚", title: "Free Shipping", sub: "On orders above $100" },
              { icon: "⭐", title: "Thousands Happy Customers", sub: "Verified Reviews" },
              { icon: "🔄", title: "20 Day Easy Returns", sub: "Hassle-free policy" },
              { icon: "📞", title: "Dedicated Support", sub: "Human representative to assist you" },
            ].map((f) => (
              <div key={f.title} className="flex flex-col items-center text-center gap-3">
                <div className="text-4xl">{f.icon}</div>
                <h4 className="font-bold text-sm uppercase tracking-wide text-gray-900">{f.title}</h4>
                <p className="text-xs text-gray-500">{f.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

/* ─── Deal Card Component ─── */
function DealCard({
  name, img1, img2, price, originalPrice, reviews, desc,
}: {
  name: string; img1: string; img2: string; price: string; originalPrice: string; reviews: number; desc: string;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="product-card flex-shrink-0 w-[220px] md:w-[260px] cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative overflow-hidden bg-gray-50" style={{ aspectRatio: "3/4" }}>
        <span className="sale-badge">SALE</span>
        <img
          src={img1}
          alt={name}
          className="w-full h-full object-cover absolute inset-0"
          style={{ opacity: hovered ? 0 : 1, transition: "opacity 0.4s ease" }}
        />
        <img
          src={img2}
          alt={name}
          className="w-full h-full object-cover absolute inset-0"
          style={{ opacity: hovered ? 1 : 0, transition: "opacity 0.4s ease" }}
        />
        <button
          className="quickshop-btn"
          style={{ transform: hovered ? "translateY(0)" : "translateY(100%)", transition: "transform 0.3s ease" }}
        >
          Quick Shop
        </button>
      </div>
      <div className="pt-3 pb-2">
        <p className="text-gray-400 text-xs mb-1 italic">{desc.slice(0, 60)}...</p>
        <div className="flex items-center gap-1 mb-1">
          <StarRating count={5} />
          <span className="text-gray-400 text-xs ml-1">{reviews} reviews</span>
        </div>
        <h3 className="font-semibold text-sm text-gray-900 mb-1">{name}</h3>
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-gray-900">On sale from {price}</span>
          <span className="text-xs text-gray-400 line-through">{originalPrice}</span>
        </div>
      </div>
    </div>
  );
}
