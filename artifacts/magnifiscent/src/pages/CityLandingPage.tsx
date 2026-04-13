import React, { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useSeoMeta } from "@/hooks/useSeoMeta";
import { useJsonLd } from "@/hooks/useJsonLd";
import { api, type ApiProduct } from "@/lib/api";
import { MapPin, Clock, Truck, ShieldCheck, CreditCard, Star } from "lucide-react";

const SITE_DOMAIN = "https://magnifiscent.com.pk";

export type CityConfig = {
  city: string;
  slug: string;
  h1: string;
  tagline: string;
  deliveryEstimate: string;
  seoTitle: string;
  seoDescription: string;
  keywords: string[];
  localCopy: string[];
};

export const CITY_CONFIGS: Record<string, CityConfig> = {
  karachi: {
    city: "Karachi",
    slug: "karachi",
    h1: "Buy Perfumes Online in Karachi — Cash on Delivery",
    tagline: "Premium Eau de Parfum delivered to your doorstep across Karachi — DHA, Clifton, Gulshan, PECHS, North Nazimabad, and beyond.",
    deliveryEstimate: "2–3 business days to Karachi",
    seoTitle: "Buy Perfumes Online in Karachi — Cash on Delivery | MagnifiScent",
    seoDescription: "Shop premium long-lasting Eau de Parfum in Karachi with Cash on Delivery. Free delivery on qualifying orders. Authentic fragrances for men and women — MagnifiScent.",
    keywords: ["perfumes in Karachi", "buy perfume Karachi", "Karachi perfume shop online", "best perfume Karachi COD"],
    localCopy: [
      "Karachi is Pakistan's fashion and lifestyle capital, and its residents set the fragrance trends for the rest of the country. Whether you're shopping from DHA Phase VIII, Gulshan-e-Iqbal, or PECHS, MagnifiScent delivers premium Eau de Parfum directly to your door — no need to visit Liberty or Zamzama.",
      "The coastal climate of Karachi makes fresh, aquatic, and citrus fragrances particularly popular for daytime wear. For evenings in Clifton or Defence, our rich oriental and oud-based Eau de Parfum collections are an effortless choice.",
      "All orders to Karachi come with Cash on Delivery (COD). Pay when you receive your parcel — no advance payment, no risk. Standard delivery to Karachi takes 2–3 business days through our trusted courier partners.",
    ],
  },
  lahore: {
    city: "Lahore",
    slug: "lahore",
    h1: "Buy Perfumes Online in Lahore — Cash on Delivery",
    tagline: "Premium Eau de Parfum delivered to your doorstep across Lahore — Gulberg, DHA, Johar Town, Model Town, Bahria Town, and beyond.",
    deliveryEstimate: "2–3 business days to Lahore",
    seoTitle: "Buy Perfumes Online in Lahore — Cash on Delivery | MagnifiScent",
    seoDescription: "Shop premium long-lasting Eau de Parfum in Lahore with Cash on Delivery. Free delivery on qualifying orders. Authentic fragrances for men and women — MagnifiScent.",
    keywords: ["perfumes in Lahore", "buy perfume Lahore", "Lahore perfume shop online", "best perfume Lahore COD"],
    localCopy: [
      "Lahore is Pakistan's cultural heart — a city that appreciates beauty, craftsmanship, and elegance in equal measure. From the boutiques of Gulberg to the wedding halls of DHA, fragrance is an essential part of Lahori identity. MagnifiScent brings premium Eau de Parfum to your doorstep, anywhere in Lahore.",
      "Lahore's warm continental climate calls for rich, lingering fragrances — oud, amber, and woody orientals perform beautifully in the city's famous summer heat and cool winters. Our collection is curated to perform across all seasons.",
      "All orders to Lahore are delivered with Cash on Delivery. Pay only when your parcel arrives — completely risk-free. Standard delivery takes 2–3 business days through our reliable nationwide courier network.",
    ],
  },
  islamabad: {
    city: "Islamabad",
    slug: "islamabad",
    h1: "Buy Perfumes Online in Islamabad — Cash on Delivery",
    tagline: "Premium Eau de Parfum delivered to your doorstep across Islamabad & Rawalpindi — F-sectors, G-sectors, DHA, Bahria Town, and beyond.",
    deliveryEstimate: "2–3 business days to Islamabad",
    seoTitle: "Buy Perfumes Online in Islamabad — Cash on Delivery | MagnifiScent",
    seoDescription: "Shop premium long-lasting Eau de Parfum in Islamabad with Cash on Delivery. Free delivery on qualifying orders. Authentic fragrances for men and women — MagnifiScent.",
    keywords: ["perfumes in Islamabad", "buy perfume Islamabad", "Islamabad perfume shop online", "best perfume Islamabad COD"],
    localCopy: [
      "Islamabad is Pakistan's most cosmopolitan city — a modern capital with a discerning, educated population that values quality and authenticity. From F-7 and F-10 to DHA Phase II and Bahria Town, MagnifiScent delivers premium Eau de Parfum directly to your address in Islamabad and Rawalpindi.",
      "The cooler climate of Islamabad-Rawalpindi makes it perfect territory for richer, woodier fragrances. Sandalwood, cedar, and soft oriental compositions thrive in the hill-city air. Our collection is designed to complement the refined lifestyle of the twin cities.",
      "Every order to Islamabad comes with Cash on Delivery — no advance payment required. We believe trust is earned, and COD is our commitment to you. Expect your parcel within 2–3 business days of placing your order.",
    ],
  },
};

function ProductCard({ product, onClick }: { product: ApiProduct; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className="bg-white border border-stone-200 rounded-xl overflow-hidden cursor-pointer hover:shadow-lg hover:border-amber-300 transition-all group"
    >
      {product.img ? (
        <img
          src={product.img}
          alt={`${product.name} Eau de Parfum ${product.category === "men" ? "men's" : "women's"} fragrance — MagnifiScent Pakistan`}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      ) : (
        <div className="w-full h-48 bg-stone-100 flex items-center justify-center">
          <span className="text-3xl">🌸</span>
        </div>
      )}
      <div className="p-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-amber-600 mb-1 capitalize">
          {product.category}
        </p>
        <h3 className="font-bold text-gray-900 text-sm mb-1 line-clamp-2">{product.name}</h3>
        <div className="flex items-center gap-1 mb-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={10}
              className={i < Math.round(product.rating) ? "text-amber-400 fill-amber-400" : "text-stone-300 fill-stone-300"}
            />
          ))}
          <span className="text-xs text-gray-400 ml-1">({product.reviews})</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="font-bold text-gray-900 text-sm">{product.price}</span>
          {product.originalPrice && product.originalPrice !== product.price && (
            <span className="text-xs text-gray-400 line-through">{product.originalPrice}</span>
          )}
        </div>
      </div>
    </div>
  );
}

export function CityLandingPage({ config }: { config: CityConfig }) {
  const [, navigate] = useLocation();
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useSeoMeta({
    title: config.seoTitle,
    description: config.seoDescription,
    ogType: "website",
  });

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_DOMAIN },
      { "@type": "ListItem", position: 2, name: `Perfumes in ${config.city}`, item: `${SITE_DOMAIN}/${config.slug}` },
    ],
  };

  useJsonLd("ld-city-breadcrumb", breadcrumbSchema);

  useEffect(() => {
    api.products.list()
      .then((res) => {
        if (res.success && res.products) {
          const sorted = [...res.products]
            .sort((a, b) => (b.rating * b.reviews) - (a.rating * a.reviews))
            .slice(0, 6);
          setProducts(sorted);
        }
      })
      .catch(() => {})
      .finally(() => setLoadingProducts(false));
  }, []);

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-stone-900 via-stone-800 to-amber-900 text-white py-14 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-400/30 rounded-full px-4 py-1.5 text-amber-300 text-xs font-semibold mb-5 uppercase tracking-widest">
            <MapPin size={12} />
            {config.city}, Pakistan
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight" style={{ fontFamily: "Georgia, serif" }}>
            {config.h1}
          </h1>
          <p className="text-stone-300 text-base md:text-lg max-w-2xl mx-auto mb-8">
            {config.tagline}
          </p>
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 text-sm">
              <Truck size={14} className="text-amber-400" />
              <span>{config.deliveryEstimate}</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 text-sm">
              <CreditCard size={14} className="text-amber-400" />
              <span>Cash on Delivery</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 text-sm">
              <ShieldCheck size={14} className="text-amber-400" />
              <span>100% Authentic EDP</span>
            </div>
          </div>
          <button
            onClick={() => navigate("/products")}
            className="px-7 py-3 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-full text-sm transition-colors border-none cursor-pointer"
          >
            Shop All Fragrances
          </button>
        </div>
      </section>

      {/* Trust strip */}
      <section className="bg-amber-50 border-b border-amber-100 py-4 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { icon: Truck, label: `Delivery to ${config.city}`, sub: config.deliveryEstimate },
            { icon: CreditCard, label: "Cash on Delivery", sub: "Pay at your door" },
            { icon: ShieldCheck, label: "100% Authentic", sub: "Genuine Eau de Parfum" },
            { icon: Clock, label: "Easy Returns", sub: "20-day return policy" },
          ].map(({ icon: Icon, label, sub }) => (
            <div key={label} className="flex items-center gap-3">
              <Icon size={18} className="text-amber-600 flex-shrink-0" />
              <div>
                <p className="text-xs font-bold text-gray-800">{label}</p>
                <p className="text-[11px] text-gray-500">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured products */}
      <section className="max-w-4xl mx-auto px-4 py-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Popular Fragrances — Delivered to {config.city}
        </h2>
        <p className="text-gray-500 text-sm mb-6">
          Our most-loved Eau de Parfum collections, shipped directly to {config.city} with Cash on Delivery.
        </p>

        {loadingProducts ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-xl border border-stone-200 animate-pulse">
                <div className="h-48 bg-stone-100 rounded-t-xl" />
                <div className="p-4 space-y-2">
                  <div className="h-3 bg-stone-200 rounded w-1/3" />
                  <div className="h-4 bg-stone-200 rounded w-2/3" />
                  <div className="h-3 bg-stone-100 rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} onClick={() => navigate(`/products/${p.slug}`)} />
            ))}
          </div>
        )}

        <div className="text-center mt-8">
          <button
            onClick={() => navigate("/products")}
            className="px-6 py-2.5 border-2 border-gray-900 text-gray-900 font-bold text-sm rounded-full hover:bg-gray-900 hover:text-white transition-colors cursor-pointer bg-transparent"
          >
            View All Fragrances →
          </button>
        </div>
      </section>

      {/* Local SEO content */}
      <section className="bg-stone-50 border-t border-stone-100 py-10 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Premium Perfumes Delivered Across {config.city}
          </h2>
          <div className="space-y-4">
            {config.localCopy.map((para, i) => (
              <p key={i} className="text-gray-600 text-sm leading-relaxed">{para}</p>
            ))}
          </div>

          {/* Keyword tags */}
          <div className="flex flex-wrap gap-2 mt-6">
            {config.keywords.map((kw) => (
              <span key={kw} className="text-xs bg-white border border-stone-200 text-gray-600 px-3 py-1 rounded-full">
                {kw}
              </span>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              onClick={() => navigate("/products?gender=men")}
              className="px-4 py-2 bg-gray-900 text-white text-xs font-semibold rounded-full hover:bg-gray-700 transition-colors border-none cursor-pointer"
            >
              Men's Fragrances →
            </button>
            <button
              onClick={() => navigate("/products?gender=women")}
              className="px-4 py-2 bg-amber-600 text-white text-xs font-semibold rounded-full hover:bg-amber-700 transition-colors border-none cursor-pointer"
            >
              Women's Fragrances →
            </button>
            <button
              onClick={() => navigate("/deals")}
              className="px-4 py-2 border border-gray-300 text-gray-700 text-xs font-semibold rounded-full hover:bg-gray-50 transition-colors bg-transparent cursor-pointer"
            >
              Combo Deals →
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
