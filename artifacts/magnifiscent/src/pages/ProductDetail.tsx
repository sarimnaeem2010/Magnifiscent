import React, { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Star, Minus, Plus, ChevronRight, Package, RotateCcw, Shield } from "lucide-react";
import { useParams, useLocation } from "wouter";
import { api } from "@/lib/api";
import type { ApiProduct } from "@/lib/api";
import { useCart } from "@/context/CartContext";
import { useSeoMeta } from "@/hooks/useSeoMeta";
import { useJsonLd } from "@/hooks/useJsonLd";
import { TrustBadges } from "@/components/TrustBadges";

function StarRating({ count, size = 14 }: { count: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={size} className={i < count ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"} />
      ))}
    </div>
  );
}

const PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='533' viewBox='0 0 400 533'%3E%3Crect width='400' height='533' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='14' fill='%239ca3af'%3ENo Image%3C/text%3E%3C/svg%3E";

const NOTE_OCCASIONS: { keywords: string[]; occasions: string[] }[] = [
  { keywords: ["floral", "rose", "jasmine", "lily", "peony", "violet"], occasions: ["Daily Wear", "Office", "Spring / Summer"] },
  { keywords: ["fresh", "citrus", "green", "herbal", "bergamot", "lemon"], occasions: ["Morning Wear", "Office", "Summer"] },
  { keywords: ["aquatic", "marine", "ocean", "water"], occasions: ["Summer", "Outdoor", "Beach"] },
  { keywords: ["oud", "agarwood"], occasions: ["Evening", "Wedding", "Winter"] },
  { keywords: ["oriental", "amber", "incense", "resin"], occasions: ["Evening", "Formal Occasions", "Winter"] },
  { keywords: ["woody", "cedar", "sandalwood", "vetiver", "patchouli"], occasions: ["Evening", "Casual", "Winter"] },
  { keywords: ["spicy", "pepper", "cardamom", "saffron", "cinnamon"], occasions: ["Evening", "Date Night", "Winter"] },
  { keywords: ["musky", "musk"], occasions: ["Date Night", "Casual Evening", "Weekend"] },
  { keywords: ["vanilla", "tonka", "gourmand", "caramel", "chocolate"], occasions: ["Date Night", "Cozy Evenings", "Casual"] },
];

function getPerfectFor(notes: string[]): string[] {
  const occasionSet = new Set<string>();
  const notesStr = notes.map((n) => n.toLowerCase()).join(" ");
  NOTE_OCCASIONS.forEach(({ keywords, occasions }) => {
    if (keywords.some((k) => notesStr.includes(k))) {
      occasions.forEach((o) => occasionSet.add(o));
    }
  });
  if (occasionSet.size === 0) {
    ["Daily Wear", "Evening", "Gift"].forEach((o) => occasionSet.add(o));
  }
  return Array.from(occasionSet).slice(0, 5);
}

function getWhyYoullLoveIt(product: ApiProduct): string {
  const notesStr = product.notes.map((n) => n.toLowerCase()).join(" ");
  const isOud = /oud|oriental|amber|spic|saffron|incense/.test(notesStr);
  const isFresh = /fresh|aquatic|citrus|green|marine|herbal/.test(notesStr);
  const isMusky = /musky|musk|vanilla|tonka|sandalwood/.test(notesStr);
  const cat = product.category;
  const size = product.size || "100ml";

  if (isOud) {
    return `A bold, long-lasting ${cat}'s Eau de Parfum built for evenings, weddings, and special occasions. ${product.name} (${size}) delivers strong projection and exceptional longevity — hours of presence that make a statement. Perfect for winters in Pakistan.`;
  }
  if (isFresh) {
    return `A fresh, uplifting ${cat}'s Eau de Parfum ideal for office wear, daily use, and warm Pakistani summers. ${product.name} offers excellent longevity with moderate projection — light enough for any setting yet memorable enough to leave a lasting impression.`;
  }
  if (isMusky) {
    return `A warm, sensual ${cat}'s fragrance with a captivating dry-down. ${product.name} (${size}) delivers intimate projection and lingering longevity — ideal for date nights, casual evenings, and cooler weather across Pakistan.`;
  }
  return `A versatile, long-lasting ${cat}'s Eau de Parfum with excellent projection and a memorable scent trail. ${product.name} (${size}) suits all-day wear and is crafted for the discerning fragrance lover in Pakistan.`;
}

function RelatedCard({ product }: { product: ApiProduct }) {
  const [hovered, setHovered] = useState(false);
  const [, navigate] = useLocation();
  const { addItem } = useCart();

  return (
    <div
      className="product-card cursor-pointer flex-shrink-0 w-[160px] sm:w-[200px]"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => navigate(`/products/${product.slug}`)}
    >
      <div className="relative overflow-hidden bg-gray-50" style={{ aspectRatio: "3/4" }}>
        <span className="sale-badge">SALE</span>
        <img src={product.img || PLACEHOLDER} alt={`${product.name} Eau de Parfum ${product.category === "men" ? "men's" : "women's"} fragrance — MagnifiScent Pakistan`} className="w-full h-full object-cover absolute inset-0"
          style={{ opacity: hovered ? 0 : 1, transition: "opacity 0.4s ease" }} />
        <img src={product.img2 || PLACEHOLDER} alt={`${product.name} Eau de Parfum ${product.category === "men" ? "men's" : "women's"} fragrance — MagnifiScent Pakistan`} className="w-full h-full object-cover absolute inset-0"
          style={{ opacity: hovered ? 1 : 0, transition: "opacity 0.4s ease" }} />
        <button
          className="quickshop-btn"
          style={{ transform: hovered ? "translateY(0)" : "translateY(100%)", transition: "transform 0.3s ease" }}
          onClick={(e) => { e.stopPropagation(); addItem(product); }}
        >
          Quick Add
        </button>
      </div>
      <div className="pt-2 pb-1">
        <div className="flex items-center gap-1 mb-1">
          <StarRating count={product.rating} size={11} />
          <span className="text-gray-400 text-xs">({product.reviews})</span>
        </div>
        <h4 className="font-semibold text-sm text-gray-900 mb-0.5">{product.name}</h4>
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-bold text-gray-900">{product.price}</span>
          <span className="text-xs text-gray-400 line-through">{product.originalPrice}</span>
        </div>
      </div>
    </div>
  );
}

export default function ProductDetail() {
  const params = useParams<{ slug: string }>();
  const [, navigate] = useLocation();
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [product, setProduct] = useState<ApiProduct | null>(null);
  const [allProducts, setAllProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);

  const seoTitle = product
    ? `${product.name} – Long-Lasting ${product.category === "men" ? "Men" : "Women"}'s Perfume | MagnifiScent`
    : "Perfume | MagnifiScent Pakistan";
  const seoDesc = product
    ? (() => {
        const topNotes = product.notes.slice(0, 3).join(", ");
        const raw = `Buy ${product.name} Eau de Parfum — a long-lasting ${product.category === "men" ? "men's" : "women's"} fragrance. Scent notes: ${topNotes}. ${product.price}. Cash on Delivery in Pakistan.`;
        return raw.length > 160 ? raw.slice(0, 157) + "…" : raw;
      })()
    : "Premium long-lasting Eau de Parfum by MagnifiScent Pakistan. Cash on Delivery.";

  useSeoMeta({
    title: seoTitle,
    description: seoDesc,
    ogImage: product?.img || "",
    ogType: "product",
    ogPriceAmount: product ? String(product.priceNum) : undefined,
    ogPriceCurrency: "PKR",
  });

  const siteUrl = window.location.origin;

  const productSchema = product
    ? {
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.name,
        description: product.desc,
        image: [product.img, product.img2].filter(Boolean),
        brand: { "@type": "Brand", name: "MagnifiScent" },
        sku: String(product.id),
        offers: {
          "@type": "Offer",
          priceCurrency: "PKR",
          price: product.priceNum,
          availability:
            product.stock > 0
              ? "https://schema.org/InStock"
              : "https://schema.org/OutOfStock",
          seller: { "@type": "Organization", name: "MagnifiScent" },
          url: `${siteUrl}/products/${product.slug}`,
        },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: product.rating,
          reviewCount: product.reviews,
          bestRating: 5,
          worstRating: 1,
        },
      }
    : null;

  const breadcrumbSchema = product
    ? {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
          { "@type": "ListItem", position: 2, name: "Products", item: `${siteUrl}/products` },
          { "@type": "ListItem", position: 3, name: product.name, item: `${siteUrl}/products/${product.slug}` },
        ],
      }
    : null;

  const faqSchema = product
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: `Is ${product.name} long lasting?`,
            acceptedAnswer: {
              "@type": "Answer",
              text: `Yes, ${product.name} by MagnifiScent is formulated for long-lasting wear. It is an Eau de Parfum with ${product.size}, designed to keep you smelling great all day.`,
            },
          },
          {
            "@type": "Question",
            name: `What does ${product.name} smell like?`,
            acceptedAnswer: {
              "@type": "Answer",
              text: `${product.name} features the following scent notes: ${product.notes.join(", ")}. ${product.desc}`,
            },
          },
          {
            "@type": "Question",
            name: "Is Cash on Delivery available for this perfume?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes, MagnifiScent offers Cash on Delivery (COD) across Pakistan. Simply place your order and pay when it arrives at your door.",
            },
          },
        ],
      }
    : null;

  useJsonLd("ld-product", productSchema);
  useJsonLd("ld-breadcrumb", breadcrumbSchema);
  useJsonLd("ld-faq", faqSchema);

  useEffect(() => {
    setLoading(true);
    api.products.get(params.slug).then((res) => {
      if (res.success) setProduct(res.product);
    }).catch(() => {
    }).finally(() => setLoading(false));

    api.products.list().then((res) => {
      if (res.success) setAllProducts(res.products);
    }).catch(() => {});
  }, [params.slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <p className="text-gray-400">Loading…</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h2>
          <button
            onClick={() => navigate("/products")}
            className="inline-block bg-black text-white font-bold uppercase tracking-widest text-xs px-8 py-3 hover:bg-gray-800 transition-colors border-none cursor-pointer"
          >
            Back to Products
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  const related = allProducts.filter((p) => p.id !== product.id && p.category === product.category).slice(0, 6);
  const discount = Math.round(((product.originalPriceNum - product.priceNum) / product.originalPriceNum) * 100);

  function handleAddToCart() {
    addItem(product!, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-4">
        <nav className="flex items-center gap-1 text-xs text-gray-400">
          <button onClick={() => navigate("/")} className="hover:text-black transition-colors bg-transparent border-none cursor-pointer text-gray-400">Home</button>
          <ChevronRight size={12} />
          <button onClick={() => navigate("/products")} className="hover:text-black transition-colors bg-transparent border-none cursor-pointer text-gray-400">Products</button>
          <ChevronRight size={12} />
          <span className="text-gray-900 font-medium">{product.name}</span>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
          <div className="relative">
            <div className="sticky top-28">
              <div className="relative overflow-hidden bg-gray-50" style={{ aspectRatio: "3/4" }}>
                <span className="sale-badge text-sm px-3 py-1">{discount}% OFF</span>
                <img
                  src={product.img || PLACEHOLDER}
                  alt={`${product.name} Eau de Parfum ${product.category === "men" ? "men's" : "women's"} fragrance — MagnifiScent Pakistan`}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-center text-xs text-gray-400 mt-3 italic">{product.size}</p>
            </div>
          </div>

          <div className="pt-2">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">{product.category}'s Perfume</p>

            <h1
              className="font-bold text-3xl md:text-4xl uppercase tracking-wide text-gray-900 mb-4"
              style={{ fontFamily: "Georgia, serif" }}
            >
              {product.name}
            </h1>

            <div className="flex items-center gap-2 mb-4">
              <StarRating count={product.rating} size={16} />
              <span className="text-sm text-gray-600 font-medium">{product.reviews} reviews</span>
            </div>

            {product.size && (
              <div className="mb-4">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-full uppercase tracking-wider">
                  {product.size} · Eau de Parfum
                </span>
              </div>
            )}

            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-100">
              <span className="text-2xl font-bold text-gray-900">{product.price}</span>
              <span className="text-base text-gray-400 line-through">{product.originalPrice}</span>
              <span className="bg-red-600 text-white text-xs font-bold px-2 py-0.5">{discount}% OFF</span>
            </div>

            <p className="text-gray-600 text-sm leading-relaxed mb-6">{product.desc}</p>

            {(() => {
              const occasions = getPerfectFor(product.notes);
              return occasions.length > 0 ? (
                <div className="mb-5">
                  <h3 className="font-bold text-xs uppercase tracking-widest text-gray-900 mb-3">Perfect For</h3>
                  <div className="flex flex-wrap gap-2">
                    {occasions.map((o) => (
                      <span key={o} className="text-xs font-semibold text-gray-700 bg-gray-100 border border-gray-200 px-3 py-1 rounded-full">
                        {o}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null;
            })()}

            <div className="mb-6 p-4 bg-gray-50 border-l-2 border-gray-900">
              <h3 className="font-bold text-xs uppercase tracking-widest text-gray-900 mb-2">Why You'll Love It</h3>
              <p className="text-xs text-gray-600 leading-relaxed">{getWhyYoullLoveIt(product)}</p>
            </div>

            <div className="mb-6">
              <h3 className="font-bold text-xs uppercase tracking-widest text-gray-900 mb-3">Scent Notes</h3>
              <div className="flex flex-wrap gap-2">
                {product.notes.map((note) => (
                  <span
                    key={note}
                    className="text-xs font-semibold uppercase tracking-wide border border-gray-200 px-3 py-1 text-gray-700 hover:border-gray-400 transition-colors"
                  >
                    {note}
                  </span>
                ))}
              </div>
            </div>

            {product.stock > 0 && product.stock <= 5 && (
              <div className="flex items-center gap-2 mb-4 px-3 py-2 bg-amber-50 border border-amber-200">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse flex-shrink-0" />
                <p className="text-xs font-bold text-amber-700 uppercase tracking-wide">
                  Only {product.stock} left!
                </p>
              </div>
            )}

            <div className="flex items-stretch gap-3 mb-6">
              <div className="flex items-center border border-gray-300" style={{ minWidth: 110 }}>
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="w-10 h-12 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors border-none bg-transparent cursor-pointer"
                >
                  <Minus size={14} />
                </button>
                <span className="flex-1 text-center text-sm font-bold text-gray-900">{qty}</span>
                <button
                  onClick={() => setQty((q) => q + 1)}
                  className="w-10 h-12 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors border-none bg-transparent cursor-pointer"
                >
                  <Plus size={14} />
                </button>
              </div>
              <button
                onClick={handleAddToCart}
                className="flex-1 h-12 font-bold uppercase tracking-widest text-xs transition-all duration-300 border-none cursor-pointer"
                style={{
                  background: added ? "#16a34a" : "#1a1a1a",
                  color: "white",
                }}
              >
                {added ? "✓ Added to Cart" : "Add to Cart"}
              </button>
            </div>

            <button
              onClick={() => { addItem(product!, qty); navigate("/checkout"); }}
              className="w-full h-12 font-bold uppercase tracking-widest text-xs border-2 border-black text-black hover:bg-black hover:text-white transition-all duration-200 bg-transparent cursor-pointer mb-6"
            >
              Buy Now
            </button>

            <TrustBadges className="mb-8" />

            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-100">
              {[
                { icon: Package, label: "Free shipping", sub: "On orders over Rs. 100" },
                { icon: RotateCcw, label: "Easy returns", sub: "20-day return policy" },
                { icon: Shield, label: "Authentic", sub: "100% genuine" },
              ].map(({ icon: Icon, label, sub }) => (
                <div key={label} className="flex flex-col items-center text-center gap-1">
                  <Icon size={18} className="text-gray-400" />
                  <p className="text-xs font-bold text-gray-700">{label}</p>
                  <p className="text-xs text-gray-400">{sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="py-10 border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="section-title">You May Also Like</h2>
            <div className="scroll-x pb-4">
              {related.map((p) => (
                <RelatedCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
