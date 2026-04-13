import React, { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useSeoMeta } from "@/hooks/useSeoMeta";
import { useJsonLd } from "@/hooks/useJsonLd";
import { api, type ApiProduct } from "@/lib/api";
import { CheckCircle, XCircle, Star } from "lucide-react";

const SITE_DOMAIN = "https://magnifiscent.com.pk";

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
          className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      ) : (
        <div className="w-full h-44 bg-stone-100 flex items-center justify-center">
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

const COMPARISON_ROWS = [
  {
    feature: "Fragrance Type",
    inspired: "Copy of designer scent",
    magnifiscent: "Original composition",
  },
  {
    feature: "Longevity",
    inspired: "2–4 hours",
    magnifiscent: "6–12 hours (EDP)",
  },
  {
    feature: "Ingredients",
    inspired: "Unknown / unregulated",
    magnifiscent: "High-quality aromatic materials",
  },
  {
    feature: "Batch consistency",
    inspired: "Varies widely",
    magnifiscent: "Consistent quality control",
  },
  {
    feature: "Safety",
    inspired: "No regulatory oversight",
    magnifiscent: "International-standard formulation",
  },
  {
    feature: "Cash on Delivery",
    inspired: "Often unavailable",
    magnifiscent: "Available across all Pakistan",
  },
  {
    feature: "Returns policy",
    inspired: "Typically none",
    magnifiscent: "20-day return policy",
  },
];

export function InspiredPerfumesPage() {
  const [, navigate] = useLocation();
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useSeoMeta({
    title: "Best Long-Lasting Perfumes Pakistan — MagnifiScent vs Inspired Alternatives",
    description:
      "Looking for Scents N Stories alternatives or inspired perfumes in Pakistan? Discover why MagnifiScent's original Eau de Parfum outlasts, outperforms, and outwears any inspired dupe — with Cash on Delivery.",
    ogType: "website",
  });

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_DOMAIN },
      {
        "@type": "ListItem",
        position: 2,
        name: "Best Perfumes Pakistan — Inspired vs Original",
        item: `${SITE_DOMAIN}/inspired-perfumes`,
      },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is the best alternative to Scents N Stories in Pakistan?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "MagnifiScent is widely considered the best alternative to Scents N Stories in Pakistan. Unlike inspired or copy fragrances, MagnifiScent offers original Eau de Parfum compositions with 6–12 hour longevity, Cash on Delivery, and a 20-day return policy. You get premium quality without paying for a designer label.",
        },
      },
      {
        "@type": "Question",
        name: "Are inspired perfumes safe to use in Pakistan?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Inspired perfumes sold in Pakistani markets often contain unregulated aromatic chemicals and lack quality oversight. They may cause skin irritation, allergic reactions, or simply smell nothing like the fragrance they claim to replicate. Authentic Eau de Parfum from reputable brands like MagnifiScent is always the safer choice.",
        },
      },
      {
        "@type": "Question",
        name: "What are the best long-lasting perfumes available in Pakistan?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The best long-lasting perfumes in Pakistan are Eau de Parfum (EDP) formulations with oud, amber, sandalwood, or musk base notes. MagnifiScent's full EDP collection delivers 6–12 hours of longevity and is available online with Cash on Delivery across all of Pakistan.",
        },
      },
    ],
  };

  useJsonLd("ld-inspired-breadcrumb", breadcrumbSchema);
  useJsonLd("ld-inspired-faq", faqSchema);

  useEffect(() => {
    api.products.list()
      .then((res) => {
        if (res.success && res.products) {
          setProducts(res.products);
        }
      })
      .catch(() => {})
      .finally(() => setLoadingProducts(false));
  }, []);

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-stone-900 via-gray-900 to-stone-800 text-white py-14 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-semibold px-4 py-1.5 rounded-full uppercase tracking-widest mb-5">
            The Smarter Choice
          </span>
          <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight" style={{ fontFamily: "Georgia, serif" }}>
            Best Long-Lasting Perfumes in Pakistan
          </h1>
          <p className="text-stone-300 text-base md:text-lg max-w-2xl mx-auto mb-6">
            Tired of inspired dupes that fade in an hour? Discover MagnifiScent — Pakistan's original Eau de Parfum brand with 6–12 hour longevity, Cash on Delivery, and 100% authentic fragrances.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mb-8 text-sm">
            {["Scents N Stories alternative", "inspired perfumes Pakistan", "best long lasting perfumes Pakistan", "original EDP COD"].map((kw) => (
              <span key={kw} className="bg-white/10 border border-white/20 rounded-full px-3 py-1 text-xs text-stone-300">
                {kw}
              </span>
            ))}
          </div>
          <button
            onClick={() => navigate("/products")}
            className="px-7 py-3 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-full text-sm transition-colors border-none cursor-pointer"
          >
            Shop Original Fragrances
          </button>
        </div>
      </section>

      {/* Intro copy */}
      <section className="max-w-3xl mx-auto px-4 py-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Why MagnifiScent Beats Every Inspired Perfume
        </h2>
        <p className="text-gray-600 text-sm leading-relaxed mb-4">
          The Pakistani fragrance market is flooded with "inspired by" and copy fragrances — products that try to replicate the scent of Dior Sauvage, Creed Aventus, Jo Malone, or Scents N Stories at a lower price point. But here's the truth that savvy shoppers already know: <strong>inspired fragrances are a false economy</strong>.
        </p>
        <p className="text-gray-600 text-sm leading-relaxed mb-4">
          They use inferior raw materials, achieve at best a 30-minute resemblance to the original, and often contain unregulated chemicals that can irritate sensitive skin. Worse, they're inconsistent from batch to batch — the bottle you buy today may smell completely different from the one you bought last month.
        </p>
        <p className="text-gray-600 text-sm leading-relaxed">
          <strong>MagnifiScent is not an inspired brand.</strong> Every fragrance in our collection is an original composition by our master perfumers. We don't copy anyone — we create. And because we sell directly, you get genuine Eau de Parfum quality at honest prices, with Cash on Delivery across Pakistan.
        </p>
      </section>

      {/* Comparison table */}
      <section className="bg-stone-50 border-y border-stone-100 py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">
            MagnifiScent vs Inspired Perfumes
          </h2>
          <p className="text-gray-500 text-sm text-center mb-8">
            An honest comparison — so you can make the right choice for your money and your skin.
          </p>
          <div className="overflow-x-auto rounded-xl border border-stone-200">
            <table className="w-full text-sm bg-white">
              <thead>
                <tr className="bg-stone-100">
                  <th className="text-left px-4 py-3 font-bold text-gray-700">Feature</th>
                  <th className="px-4 py-3 font-bold text-gray-500 text-center">Inspired / Dupes</th>
                  <th className="px-4 py-3 font-bold text-amber-700 text-center">MagnifiScent EDP</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON_ROWS.map((row, i) => (
                  <tr key={row.feature} className={i % 2 === 0 ? "bg-white" : "bg-stone-50/50"}>
                    <td className="px-4 py-3 font-medium text-gray-700">{row.feature}</td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1.5 text-red-600">
                        <XCircle size={14} className="flex-shrink-0" />
                        <span className="text-xs">{row.inspired}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1.5 text-emerald-700">
                        <CheckCircle size={14} className="flex-shrink-0" />
                        <span className="text-xs font-semibold">{row.magnifiscent}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Why MagnifiScent */}
      <section className="max-w-4xl mx-auto px-4 py-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Why Choose MagnifiScent?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: "Original Compositions",
              body: "Every MagnifiScent fragrance is an original creation by our master perfumers. No dupes, no copies — just genuine artistry in a bottle.",
            },
            {
              title: "6–12 Hour Longevity",
              body: "Our Eau de Parfum concentration ensures you smell extraordinary from morning to night — not just for the first 30 minutes.",
            },
            {
              title: "Cash on Delivery",
              body: "Order online, pay at your door. No advance payment, no risk. Available across all of Pakistan including Karachi, Lahore, and Islamabad.",
            },
          ].map((card) => (
            <div key={card.title} className="bg-amber-50 border border-amber-100 rounded-xl p-6">
              <h3 className="font-bold text-gray-900 mb-2 text-base">{card.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{card.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Product grid */}
      <section className="bg-stone-50 border-t border-stone-100 py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Shop Original Fragrances — Better Than Any Inspired Dupe
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            Explore MagnifiScent's full Eau de Parfum collection. Every fragrance ships with Cash on Delivery across Pakistan.
          </p>

          {loadingProducts ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white rounded-xl border border-stone-200 animate-pulse">
                  <div className="h-44 bg-stone-100 rounded-t-xl" />
                  <div className="p-4 space-y-2">
                    <div className="h-3 bg-stone-200 rounded w-1/3" />
                    <div className="h-4 bg-stone-200 rounded w-2/3" />
                    <div className="h-3 bg-stone-100 rounded w-1/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} onClick={() => navigate(`/products/${p.slug}`)} />
              ))}
            </div>
          )}

          <div className="text-center mt-8">
            <button
              onClick={() => navigate("/products")}
              className="px-6 py-2.5 bg-gray-900 text-white font-bold text-sm rounded-full hover:bg-gray-700 transition-colors cursor-pointer border-none"
            >
              View Full Collection →
            </button>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-4 py-10">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
        <div className="space-y-5">
          {[
            {
              q: "What is the best alternative to Scents N Stories in Pakistan?",
              a: "MagnifiScent is widely considered the best alternative to Scents N Stories in Pakistan. Unlike inspired or copy fragrances, MagnifiScent offers original Eau de Parfum compositions with 6–12 hour longevity, Cash on Delivery, and a 20-day return policy. You get premium quality without paying for a designer label.",
            },
            {
              q: "Are inspired perfumes safe to use in Pakistan?",
              a: "Inspired perfumes sold in Pakistani markets often contain unregulated aromatic chemicals and lack quality oversight. They may cause skin irritation, allergic reactions, or simply smell nothing like the fragrance they claim to replicate. Authentic Eau de Parfum from reputable brands like MagnifiScent is always the safer choice.",
            },
            {
              q: "What are the best long-lasting perfumes available in Pakistan?",
              a: "The best long-lasting perfumes in Pakistan are Eau de Parfum (EDP) formulations with oud, amber, sandalwood, or musk base notes. MagnifiScent's full EDP collection delivers 6–12 hours of longevity and is available online with Cash on Delivery across all of Pakistan.",
            },
          ].map(({ q, a }) => (
            <div key={q} className="border-b border-stone-200 pb-5">
              <h3 className="font-bold text-gray-900 text-sm mb-2">{q}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{a}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
