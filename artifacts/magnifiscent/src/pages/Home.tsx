import React, { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Star, Instagram } from "lucide-react";
import { PRODUCTS } from "@/data/products";
import { getActiveProducts } from "@/data/liveData";
import heroBannerImg from "@assets/sasas_1774966788321.png";
import womenBannerImg from "@assets/Gemini_Generated_Image_91h42l91h42l91h4.png";
import menBannerImg from "@assets/Gemini_Generated_Image_gthzqdgthzqdgthz.png";
import type { Product } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { useLocation } from "wouter";
import {
  getHeroSlides, getGenderBanners, getNotesImages, getInstagramReels, getHomeHeadings,
  getDealCustomImages,
  type HeroSlide,
} from "@/data/liveData";

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
    id: "iconic-duo",
    name: "THE ICONIC DUO",
    img1: PRODUCTS[4].img,
    img2: PRODUCTS[0].img,
    price: "Rs. 149.00",
    originalPrice: "Rs. 178.00",
    reviews: 14,
    desc: "Two signature fragrances paired in one exclusive combo — one bold, one floral.",
  },
  {
    id: "floral-dream",
    name: "FLORAL DREAM PACK",
    img1: PRODUCTS[0].img,
    img2: PRODUCTS[3].img,
    price: "Rs. 159.00",
    originalPrice: "Rs. 204.00",
    reviews: 8,
    desc: "CHIC and SIGMA — warm and feminine florals combined in a stunning gift set.",
  },
  {
    id: "dark-allure",
    name: "DARK ALLURE DUO",
    img1: PRODUCTS[1].img,
    img2: PRODUCTS[5].img,
    price: "Rs. 189.00",
    originalPrice: "Rs. 224.00",
    reviews: 11,
    desc: "Dark Angel meets Allure — deeply mysterious and seductive, for the bold woman.",
  },
  {
    id: "fresh-bloom",
    name: "FRESH BLOOM DUO",
    img1: PRODUCTS[2].img,
    img2: PRODUCTS[0].img,
    price: "Rs. 139.00",
    originalPrice: "Rs. 164.00",
    reviews: 6,
    desc: "Rising Sun and CHIC — fresh citrus meets warm floral. The perfect daytime duo.",
  },
];

/* ─── Instagram Posts ─── */
const INSTAGRAM_POSTS = [
  { img: PRODUCTS[0].img, likes: 241, tag: "#CHIC", label: "NEW LAUNCH" },
  { img: PRODUCTS[4].img, likes: 387, tag: "#QUEST", label: "LONG LASTING" },
  { img: PRODUCTS[1].img, likes: 192, tag: "#DarkAngel", label: "DARK ANGEL" },
  { img: PRODUCTS[5].img, likes: 518, tag: "#Allure", label: "ALLURE" },
  { img: PRODUCTS[2].img, likes: 164, tag: "#RisingSun", label: "RISING SUN" },
  { img: PRODUCTS[3].img, likes: 203, tag: "#SIGMA", label: "SIGMA" },
  { img: PRODUCTS[0].img, likes: 391, tag: "#CHIC", label: "BEST SELLER" },
  { img: PRODUCTS[4].img, likes: 276, tag: "#QUEST", label: "FOR HIM" },
];

/* ─── Hero Slider ─── */
function HeroBanner() {
  const [slides] = useState<HeroSlide[]>(() => getHeroSlides().filter((s) => s.src));
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const id = setInterval(() => setActiveIdx((i) => (i + 1) % slides.length), 4000);
    return () => clearInterval(id);
  }, [slides.length]);

  if (slides.length === 0) {
    return (
      <section className="w-full">
        <img src={heroBannerImg} alt="Discover your best Perfume" className="w-full block" />
      </section>
    );
  }

  return (
    <section className="w-full relative overflow-hidden">
      {slides.map((slide, i) => (
        <img
          key={slide.id}
          src={slide.src}
          alt={slide.alt || "Hero Banner"}
          className="w-full block absolute inset-0"
          style={{
            opacity: i === activeIdx ? 1 : 0,
            transition: "opacity 0.8s ease",
            position: i === 0 ? "relative" : "absolute",
            top: 0, left: 0,
          }}
        />
      ))}
      {slides.length > 1 && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5 z-10">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIdx(i)}
              className="rounded-full transition-all border-none cursor-pointer"
              style={{
                width: i === activeIdx ? 20 : 8,
                height: 8,
                background: i === activeIdx ? "white" : "rgba(255,255,255,0.5)",
              }}
            />
          ))}
        </div>
      )}
    </section>
  );
}

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
      className="cursor-pointer"
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
          style={{ opacity: hovered ? 1 : 0, transition: "opacity 0.4s ease" }}
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
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">
          {product.category.toUpperCase()}
        </p>
        <div className="flex items-center gap-1 mb-1">
          <StarRating count={product.rating} />
          <span className="text-gray-400 text-xs ml-1">({product.reviews})</span>
        </div>
        <h3 className="font-bold text-sm text-gray-900 mb-1">{product.name}</h3>
        <p className="text-xs text-gray-500 leading-snug mb-2 line-clamp-2">{product.desc}</p>
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
  const [, navigate] = useLocation();

  return (
    <div
      className="cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => navigate("/deals")}
    >
      <div className="relative overflow-hidden rounded-xl bg-gray-900" style={{ aspectRatio: "1/1" }}>
        <img src={img1} alt={name} className="w-full h-full object-cover absolute inset-0"
          style={{ opacity: hovered ? 0 : 1, transition: "opacity 0.4s ease" }} />
        <img src={img2} alt={name} className="w-full h-full object-cover absolute inset-0"
          style={{ opacity: hovered ? 1 : 0, transition: "opacity 0.4s ease" }} />
      </div>
      <div className="pt-2.5 pb-2">
        <div className="flex items-center gap-1 mb-1">
          <StarRating count={5} />
          <span className="text-gray-400 text-xs ml-1">({reviews})</span>
        </div>
        <h3 className="font-bold text-sm text-gray-900 mb-0.5">{name}</h3>
        <p className="text-xs text-gray-500 leading-snug mb-1.5 line-clamp-1">{desc}</p>
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-gray-900">{price}</span>
          <span className="text-xs text-gray-400 line-through">{originalPrice}</span>
        </div>
      </div>
    </div>
  );
}

/* ─── helpers ─── */
function extractReelShortcode(url: string): string | null {
  if (!url) return null;
  const m = url.match(/instagram\.com\/(?:[^/?#]+\/)?(?:reels?|p)\/([A-Za-z0-9_-]+)/);
  return m ? m[1] : null;
}

/* ─── Reel Lightbox Modal ─── */
function ReelModal({ shortcode, onClose }: { shortcode: string; onClose: () => void }) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") onClose(); }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.85)" }}
      onClick={onClose}
    >
      <div
        className="relative rounded-2xl overflow-hidden shadow-2xl"
        style={{ width: 400, maxWidth: "95vw", height: 710, maxHeight: "92vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 flex items-center justify-center rounded-full border-none cursor-pointer"
          style={{ width: 32, height: 32, background: "rgba(0,0,0,0.6)", color: "#fff" }}
          aria-label="Close"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M1 1L13 13M13 1L1 13" stroke="white" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
        <iframe
          src={`https://www.instagram.com/reel/${shortcode}/embed/`}
          width="400"
          height="710"
          style={{ border: "none", display: "block", width: "100%", height: "100%" }}
          allowFullScreen
          title="Instagram Reel"
        />
      </div>
    </div>
  );
}

/* ─── Main Page ─── */
export default function Home() {
  const [productFilter, setProductFilter] = useState<"all" | "men" | "women">("all");
  const [activeReel, setActiveReel] = useState<string | null>(null);
  const [, navigate] = useLocation();
  const genderBanners = getGenderBanners();
  const notesImgs = getNotesImages();
  const headings = getHomeHeadings();
  const dealImgs = getDealCustomImages();
  const instaPosts = (() => {
    const reels = getInstagramReels();
    if (reels.length > 0) return reels.map((r) => ({ img: r.img || PRODUCTS[0].img, likes: r.likes, tag: r.label, label: r.label, url: r.url }));
    return INSTAGRAM_POSTS.map((p) => ({ ...p, url: "https://instagram.com" }));
  })();

  const [liveProducts] = useState(() => getActiveProducts());
  const filteredProducts = productFilter === "all"
    ? liveProducts
    : liveProducts.filter((p) => p.category === productFilter);

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Header />

      {/* ── Hero Banner / Slider ── */}
      <HeroBanner />

      {/* ── Deals & Combo ── */}
      <section id="deals" className="py-10 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-end justify-between mb-6">
            <div>
              <h2 className="section-title mb-1">{headings.deals}</h2>
              <p className="text-sm text-gray-400">{headings.dealsSubtitle}</p>
            </div>
            <button onClick={() => navigate("/deals")} className="text-sm font-semibold text-gray-700 hover:text-black underline underline-offset-2 bg-transparent border-none cursor-pointer">
              View All
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {DEALS.map((d) => {
                const custom = dealImgs[d.id];
                return (
                  <DealCard
                    key={d.id}
                    {...d}
                    img1={custom?.img1 || d.img1}
                    img2={custom?.img2 || d.img2}
                  />
                );
              })}
          </div>
        </div>
      </section>

      {/* ── Shop By Gender ── */}
      <section className="py-10 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-6">
            <h2 className="section-title mb-1">{headings.shopByGender}</h2>
            <p className="text-sm text-gray-400">{headings.shopByGenderSubtitle}</p>
          </div>
          <div className="flex flex-col md:flex-row gap-4">
            <button
              onClick={() => navigate("/products?gender=men")}
              className="flex-1 group cursor-pointer border-none bg-transparent p-0 text-left"
            >
              <div className="overflow-hidden" style={{ height: 300 }}>
                <img
                  src={genderBanners.men || menBannerImg}
                  alt="Men's Collection"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="text-center mt-3">
                <p className="font-bold text-base uppercase tracking-widest text-gray-900">MEN</p>
                <p className="text-sm text-gray-400 mt-0.5">1 product</p>
              </div>
            </button>
            <button
              onClick={() => navigate("/products?gender=women")}
              className="flex-1 group cursor-pointer border-none bg-transparent p-0 text-left"
            >
              <div className="overflow-hidden" style={{ height: 300 }}>
                <img
                  src={genderBanners.women || womenBannerImg}
                  alt="Women's Collection"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="text-center mt-3">
                <p className="font-bold text-base uppercase tracking-widest text-gray-900">WOMEN</p>
                <p className="text-sm text-gray-400 mt-0.5">5 products</p>
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* ── All Products ── */}
      <section id="all-products" className="py-10 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
            <div>
              <h2 className="section-title mb-1">{headings.allProducts}</h2>
              <p className="text-sm text-gray-400">{headings.allProductsSubtitle}</p>
            </div>
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
          <div className="mb-6">
            <h2 className="section-title mb-1">{headings.shopByNotes}</h2>
            <p className="text-sm text-gray-400">{headings.shopByNotesSubtitle}</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {NOTES.map((note) => {
              const customImg = notesImgs[note.label];
              return (
                <button
                  key={note.label}
                  onClick={() => navigate("/products")}
                  className="flex flex-col items-center gap-3 group bg-transparent border-none cursor-pointer"
                >
                  <div
                    className="w-full aspect-square rounded-lg overflow-hidden group-hover:scale-105 transition-transform duration-300"
                    style={!customImg ? { background: `linear-gradient(135deg, ${note.imgBg}, ${note.color})` } : {}}
                  >
                    {customImg ? (
                      <img src={customImg} alt={note.label} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white font-bold text-2xl">
                        {note.label[0]}
                      </div>
                    )}
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-800">{note.label}</p>
                    <p className="text-xs text-gray-500">{note.count} products</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Instagram Posts ── */}
      {activeReel && (
        <ReelModal shortcode={activeReel} onClose={() => setActiveReel(null)} />
      )}
      <section className="py-10 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-6">
            <h2 className="section-title mb-1">{headings.instagramTitle}</h2>
            <p className="text-sm text-gray-400 italic">{headings.instagramSubtitle}</p>
          </div>
          <div
            className="scroll-x flex gap-3 overflow-x-auto pb-3"
            style={{ scrollSnapType: "x mandatory" }}
          >
            {instaPosts.map((post, i) => {
              const shortcode = extractReelShortcode(post.url);
              const handleClick = () => {
                if (shortcode) {
                  setActiveReel(shortcode);
                } else {
                  window.open(post.url || "https://instagram.com", "_blank", "noopener,noreferrer");
                }
              };
              return (
                <button
                  key={i}
                  onClick={handleClick}
                  className="relative group flex-shrink-0 overflow-hidden rounded-xl bg-gray-900 p-0 border-none cursor-pointer"
                  style={{ width: 160, height: 260, scrollSnapAlign: "start" }}
                >
                  <img
                    src={post.img}
                    alt={post.label}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.1) 45%, rgba(0,0,0,0.55) 100%)" }}
                  />
                  <div className="absolute top-0 left-0 right-0 px-3 pt-3 pointer-events-none">
                    <p
                      className="text-white leading-tight uppercase"
                      style={{ fontSize: 18, fontWeight: 900, fontFamily: "Impact, Arial Black, sans-serif", letterSpacing: 0.5, lineHeight: 1.1, textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}
                    >
                      {post.label}
                    </p>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div
                      className="flex items-center justify-center rounded-full transition-transform group-hover:scale-110"
                      style={{ width: 44, height: 44, background: "rgba(255,255,255,0.22)", backdropFilter: "blur(4px)", border: "2px solid rgba(255,255,255,0.55)" }}
                    >
                      <svg width="16" height="18" viewBox="0 0 16 18" fill="none">
                        <path d="M2 1.5L14 9L2 16.5V1.5Z" fill="white" />
                      </svg>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
          <div className="text-center mt-5">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-700 hover:text-black transition-colors border border-gray-200 px-6 py-2.5 rounded-full hover:border-gray-400"
              style={{ textDecoration: "none" }}
            >
              <Instagram size={14} />
              Follow @magnifiscent
            </a>
          </div>
        </div>
      </section>

      {/* ── Buyer's Reviews ── */}
      <section className="py-10 border-b border-gray-100 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-4">
            <h2 className="section-title mb-1">{headings.reviews}</h2>
            <p className="text-sm text-gray-400">{headings.reviewsSubtitle}</p>
          </div>
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
          <div className="text-center mb-6">
            <h2 className="section-title mb-1">{headings.whyChoose}</h2>
            <p className="text-sm text-gray-400">{headings.whyChooseSubtitle}</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-6">
            {[
              { icon: "🚚", title: "Free Shipping", sub: "On orders above Rs. 100" },
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
