import React, { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Star, Instagram } from "lucide-react";
import { PRODUCTS } from "@/data/products";
import heroBannerImg from "@assets/sasas_1774966788321.png";
import type { Product } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { useLocation } from "wouter";

/* ─── Top Categories ─── */
const CATEGORIES = [
  { label: "MEN", count: "1", img: "/men-banner.png", href: "/products?gender=men" },
  { label: "WOMEN", count: "5", img: "/women-banner.png", href: "/products?gender=women" },
  { label: "FRESH", count: "2", img: "/men-banner.png", href: "/products" },
  { label: "FLORAL", count: "3", img: "/women-split.png", href: "/products" },
  { label: "WOODY", count: "2", img: "/men-split.png", href: "/products" },
  { label: "ORIENTAL", count: "3", img: "/story-bg.png", href: "/products" },
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
  { name: "Khalid B.", rating: 5, product: "Allure", text: "Allure is the most captivating fragrance I've gifted my wife. The red rose and amber base is outstanding. Compliments every single time." },
];

/* ─── Deals ─── */
const DEALS = [
  {
    name: "THE ICONIC DUO",
    img1: PRODUCTS[4].img,
    img2: PRODUCTS[0].img,
    price: "$149.00",
    originalPrice: "$178.00",
    reviews: 14,
    desc: "Two signature fragrances paired in one exclusive combo — one bold, one floral.",
  },
  {
    name: "FLORAL DREAM PACK",
    img1: PRODUCTS[0].img,
    img2: PRODUCTS[3].img,
    price: "$159.00",
    originalPrice: "$204.00",
    reviews: 8,
    desc: "CHIC and SIGMA — warm and feminine florals combined in a stunning gift set.",
  },
  {
    name: "DARK ALLURE DUO",
    img1: PRODUCTS[1].img,
    img2: PRODUCTS[5].img,
    price: "$189.00",
    originalPrice: "$224.00",
    reviews: 11,
    desc: "Dark Angel meets Allure — deeply mysterious and seductive, for the bold woman.",
  },
  {
    name: "FRESH BLOOM DUO",
    img1: PRODUCTS[2].img,
    img2: PRODUCTS[0].img,
    price: "$139.00",
    originalPrice: "$164.00",
    reviews: 6,
    desc: "Rising Sun and CHIC — fresh citrus meets warm floral. The perfect daytime duo.",
  },
];

/* ─── Instagram Posts ─── */
const INSTAGRAM_POSTS = [
  { img: PRODUCTS[0].img, likes: 241, tag: "#CHIC" },
  { img: PRODUCTS[4].img, likes: 387, tag: "#QUEST" },
  { img: PRODUCTS[1].img, likes: 192, tag: "#DarkAngel" },
  { img: PRODUCTS[5].img, likes: 518, tag: "#Allure" },
  { img: PRODUCTS[2].img, likes: 164, tag: "#RisingSun" },
  { img: "/women-split.png", likes: 293, tag: "#MagnifiScent" },
];

/* ─── Reusable Components ─── */
function StarRating({ count }: { count: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={11} className={i < count ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"} />
      ))}
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  const [hovered, setHovered] = useState(false);
  const { addItem } = useCart();
  const [, navigate] = useLocation();

  return (
    <div
      className="product-card flex-shrink-0 w-[200px] md:w-[230px] cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => navigate(`/products/${product.slug}`)}
    >
      <div className="relative overflow-hidden bg-gray-50" style={{ aspectRatio: "3/4" }}>
        <span className="sale-badge">SALE</span>
        <img
          src={product.img}
          alt={product.name}
          className="w-full h-full object-cover absolute inset-0"
          style={{ opacity: hovered ? 0 : 1, transition: "opacity 0.4s ease" }}
        />
        <img
          src={product.img2}
          alt={product.name}
          className="w-full h-full object-cover absolute inset-0"
          style={{ opacity: hovered ? 1 : 0, transition: "opacity 0.4s ease", filter: "brightness(0.95) saturate(1.05)" }}
        />
        <button
          className="quickshop-btn"
          style={{ transform: hovered ? "translateY(0)" : "translateY(100%)", transition: "transform 0.3s ease" }}
          onClick={(e) => { e.stopPropagation(); addItem(product); }}
        >
          Quick Add
        </button>
      </div>
      <div className="pt-3 pb-2">
        <div className="flex items-center gap-1 mb-1">
          <StarRating count={product.rating} />
          <span className="text-gray-400 text-xs ml-1">({product.reviews})</span>
        </div>
        <h3 className="font-semibold text-sm text-gray-900 hover:text-gray-600 transition-colors mb-1">
          {product.name}
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-gray-900">{product.price}</span>
          <span className="text-xs text-gray-400 line-through">{product.originalPrice}</span>
        </div>
      </div>
    </div>
  );
}

function DealCard({ name, img1, img2, price, originalPrice, reviews, desc }: typeof DEALS[0]) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="product-card flex-shrink-0 w-[200px] md:w-[240px] cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative overflow-hidden bg-gray-50" style={{ aspectRatio: "3/4" }}>
        <span className="sale-badge">SALE</span>
        <img src={img1} alt={name} className="w-full h-full object-cover absolute inset-0"
          style={{ opacity: hovered ? 0 : 1, transition: "opacity 0.4s ease" }} />
        <img src={img2} alt={name} className="w-full h-full object-cover absolute inset-0"
          style={{ opacity: hovered ? 1 : 0, transition: "opacity 0.4s ease" }} />
        <button
          className="quickshop-btn"
          style={{ transform: hovered ? "translateY(0)" : "translateY(100%)", transition: "transform 0.3s ease" }}
          onClick={(e) => e.stopPropagation()}
        >
          Quick Shop
        </button>
      </div>
      <div className="pt-3 pb-2">
        <p className="text-gray-400 text-xs mb-1 italic leading-snug">{desc.slice(0, 55)}…</p>
        <div className="flex items-center gap-1 mb-1">
          <StarRating count={5} />
          <span className="text-gray-400 text-xs ml-1">({reviews})</span>
        </div>
        <h3 className="font-semibold text-sm text-gray-900 mb-1">{name}</h3>
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-gray-900">{price}</span>
          <span className="text-xs text-gray-400 line-through">{originalPrice}</span>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Page ─── */
export default function Home() {
  const [productFilter, setProductFilter] = useState<"all" | "men" | "women">("all");
  const [, navigate] = useLocation();

  const filteredProducts = productFilter === "all"
    ? PRODUCTS
    : PRODUCTS.filter((p) => p.category === productFilter);

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Header />

      {/* ── Hero Banner ── */}
      <section className="w-full">
        <img
          src={heroBannerImg}
          alt="Discover your best Perfume"
          className="w-full block"
          style={{ maxHeight: "600px", objectFit: "cover", objectPosition: "center" }}
        />
      </section>

      {/* ── Top Categories ── */}
      <section className="py-10 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="section-title text-center">Top Categories</h2>
          <div className="flex justify-center flex-wrap gap-6 md:gap-10">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.label}
                onClick={() => navigate(cat.href)}
                className="category-tile border-none bg-transparent"
              >
                <img src={cat.img} alt={cat.label} className="cat-img" />
                <span className="cat-label">{cat.label}</span>
                <span className="cat-count">({cat.count})</span>
              </button>
            ))}
          </div>
          <div className="text-center mt-6">
            <button
              onClick={() => navigate("/products")}
              className="text-sm font-semibold uppercase tracking-widest text-gray-700 hover:text-black border-b-2 border-gray-700 hover:border-black pb-1 transition-colors bg-transparent border-t-0 border-l-0 border-r-0 cursor-pointer"
            >
              All Collections
            </button>
          </div>
        </div>
      </section>

      {/* ── Deals & Combo ── */}
      <section id="deals" className="py-10 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-end justify-between mb-6">
            <h2 className="section-title mb-0">Deals &amp; Combo</h2>
            <button onClick={() => navigate("/deals")} className="text-sm font-semibold text-gray-700 hover:text-black underline underline-offset-2 bg-transparent border-none cursor-pointer">
              View All
            </button>
          </div>
          <div className="scroll-x pb-2">
            {DEALS.map((d) => <DealCard key={d.name} {...d} />)}
          </div>
          <div className="text-center mt-8">
            <button
              onClick={() => navigate("/products")}
              className="inline-block border border-black text-black font-bold uppercase tracking-widest text-xs px-10 py-3 hover:bg-black hover:text-white transition-colors bg-transparent cursor-pointer"
            >
              View All Products
            </button>
          </div>
        </div>
      </section>

      {/* ── Shop By Gender ── */}
      <section className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h2 className="section-title">Shop By Gender</h2>
        </div>
        <div className="flex flex-col md:flex-row" style={{ minHeight: 294 }}>
          <button
            onClick={() => navigate("/products?gender=men")}
            className="flex-1 relative group overflow-hidden cursor-pointer border-none bg-transparent p-0 text-left"
            style={{ minHeight: 210 }}
          >
            <img src="/men-split.png" alt="Men's Collection" className="w-full h-full object-cover" style={{ minHeight: 210 }} />
            <div className="absolute inset-0 bg-black/35 group-hover:bg-black/20 transition-colors duration-500" />
            <div className="absolute inset-0 flex flex-col items-center justify-end pb-8 text-white text-center">
              <h3 className="font-bold text-4xl md:text-5xl uppercase tracking-widest mb-2" style={{ fontFamily: "Georgia, serif" }}>MEN</h3>
              <p className="text-sm text-white/80 mb-5">1 product</p>
              <span className="inline-block border border-white text-white text-xs font-bold uppercase tracking-widest px-6 py-2 group-hover:bg-white group-hover:text-black transition-all duration-300">
                Shop Now
              </span>
            </div>
          </button>
          <button
            onClick={() => navigate("/products?gender=women")}
            className="flex-1 relative group overflow-hidden cursor-pointer border-none bg-transparent p-0 text-left"
            style={{ minHeight: 210 }}
          >
            <img src="/women-split.png" alt="Women's Collection" className="w-full h-full object-cover" style={{ minHeight: 210 }} />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-500" />
            <div className="absolute inset-0 flex flex-col items-center justify-end pb-8 text-white text-center">
              <h3 className="font-bold text-4xl md:text-5xl uppercase tracking-widest mb-2" style={{ fontFamily: "Georgia, serif" }}>WOMEN</h3>
              <p className="text-sm text-white/80 mb-5">5 products</p>
              <span className="inline-block border border-white text-white text-xs font-bold uppercase tracking-widest px-6 py-2 group-hover:bg-white group-hover:text-black transition-all duration-300">
                Shop Now
              </span>
            </div>
          </button>
        </div>
      </section>

      {/* ── All Products ── */}
      <section id="all-products" className="py-10 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h2 className="section-title mb-0">All Products</h2>
            {/* Filter tabs */}
            <div className="flex items-center border border-gray-200">
              {(["all", "men", "women"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setProductFilter(f)}
                  className="px-5 py-2 text-xs font-bold uppercase tracking-widest transition-colors"
                  style={{
                    background: productFilter === f ? "#1a1a1a" : "white",
                    color: productFilter === f ? "white" : "#6b7280",
                    borderRight: f !== "women" ? "1px solid #e5e7eb" : "none",
                  }}
                >
                  {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
            {filteredProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
          <div className="text-center mt-8">
            <button
              onClick={() => navigate("/products")}
              className="inline-block border border-black text-black font-bold uppercase tracking-widest text-xs px-10 py-3 hover:bg-black hover:text-white transition-colors bg-transparent cursor-pointer"
            >
              View All Products
            </button>
          </div>
        </div>
      </section>

      {/* ── Shop By Notes ── */}
      <section className="py-10 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="section-title">Shop By Notes</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {NOTES.map((note) => (
              <button
                key={note.label}
                onClick={() => navigate("/products")}
                className="flex flex-col items-center gap-3 group bg-transparent border-none cursor-pointer"
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
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Instagram Posts ── */}
      <section className="py-10 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Instagram size={20} className="text-gray-600" />
              <h2 className="section-title mb-0">Follow Us on Instagram</h2>
            </div>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-500 hover:text-black transition-colors"
              style={{ textDecoration: "none" }}
            >
              @magnifiscent
            </a>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
            {INSTAGRAM_POSTS.map((post, i) => (
              <a
                key={i}
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="relative group aspect-square overflow-hidden block bg-gray-100"
              >
                <img
                  src={post.img}
                  alt={post.tag}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex flex-col items-center justify-center">
                  <Instagram size={20} className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 mb-1" />
                  <span className="text-white text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    ♥ {post.likes}
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── Buyer's Reviews ── */}
      <section className="py-10 border-b border-gray-100 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="section-title text-center">Buyer's Reviews</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
            {REVIEWS.slice(0, 3).map((r, i) => (
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
        </div>
      </section>

      {/* ── Why Choose ── */}
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
