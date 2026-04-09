import React, { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Star } from "lucide-react";
import { api } from "@/lib/api";
import type { ApiDeal, ApiProduct } from "@/lib/api";
import { useCart } from "@/context/CartContext";

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={11} className={i < count ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"} />
      ))}
    </div>
  );
}

type LiveDeal = {
  id: string;
  name: string;
  img1: string;
  img2: string;
  price: number;
  originalPrice: number;
  savings: number;
  discount: number;
  contains: string[];
};

const PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='533' viewBox='0 0 400 533'%3E%3Crect width='400' height='533' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='14' fill='%239ca3af'%3ENo Image%3C/text%3E%3C/svg%3E";

function DealCard({ deal, liveProducts }: { deal: LiveDeal; liveProducts: ApiProduct[] }) {
  const { addItem } = useCart();
  const matchedProduct = liveProducts.find((p) =>
    deal.contains.some((c) => c.toLowerCase() === p.name.toLowerCase())
  );

  return (
    <div className="product-card cursor-pointer">
      <div className="relative overflow-hidden bg-gray-50" style={{ aspectRatio: "3/4" }}>
        {deal.discount > 0 && <span className="sale-badge">{deal.discount}% OFF</span>}
        <img src={deal.img1 || PLACEHOLDER} alt={deal.name} className="product-img-main w-full h-full object-cover" />
        <img src={deal.img2 || PLACEHOLDER} alt={deal.name} className="product-img-alt w-full h-full object-cover" />
        {matchedProduct && (
          <button
            className="quickshop-btn"
            onClick={(e) => { e.stopPropagation(); addItem(matchedProduct); }}
          >
            Quick Add
          </button>
        )}
      </div>
      <div className="pt-3 pb-2">
        {deal.savings > 0 && (
          <p className="text-xs text-green-600 font-bold mb-1">Save Rs. {deal.savings.toFixed(2)}</p>
        )}
        <div className="flex items-center gap-1 mb-1">
          <StarRating count={5} />
        </div>
        <h3 className="font-bold text-sm text-gray-900 mb-1">{deal.name}</h3>
        <div className="flex flex-wrap gap-1 mb-2">
          {deal.contains.map((c) => (
            <span key={c} className="text-[10px] border border-gray-200 px-2 py-0.5 text-gray-500 font-medium">{c}</span>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-gray-900">Rs. {deal.price.toFixed(2)}</span>
          {deal.originalPrice > deal.price && (
            <span className="text-xs text-gray-400 line-through">Rs. {deal.originalPrice.toFixed(2)}</span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Deals() {
  const [apiDeals, setApiDeals] = useState<ApiDeal[]>([]);
  const [dealImgs, setDealImgs] = useState<Record<string, { img1?: string; img2?: string }>>({});
  const [liveProducts, setLiveProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.deals.list(),
      api.content.dealImages.get(),
      api.products.list(),
    ])
      .then(([dealsRes, imgsRes, prodsRes]) => {
        if (dealsRes.success) setApiDeals(dealsRes.deals);
        if (imgsRes.success) setDealImgs(imgsRes.dealImages);
        if (prodsRes.success) setLiveProducts(prodsRes.products);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const activeDeals: LiveDeal[] = apiDeals.map((d) => {
    const imgs = dealImgs[d.id] || {};
    return {
      id: d.id,
      name: d.name,
      img1: imgs.img1 || "",
      img2: imgs.img2 || "",
      price: d.price,
      originalPrice: d.originalPrice,
      savings: d.originalPrice - d.price,
      discount: d.discount,
      contains: d.contains,
    };
  });

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Header />

      {/* Banner */}
      <div className="bg-gray-50 border-b border-gray-100 py-10">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Exclusive Savings</p>
          <h1 className="font-bold text-3xl md:text-4xl uppercase tracking-wide" style={{ fontFamily: "Georgia, serif" }}>
            Deals &amp; Combo
          </h1>
          <p className="text-gray-500 text-sm mt-3 max-w-md mx-auto">
            Save more when you bundle. Exclusive paired sets for every mood and occasion.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        {loading ? (
          <p className="text-center text-gray-400 py-20">Loading deals...</p>
        ) : activeDeals.length === 0 ? (
          <p className="text-center text-gray-400 py-20">No active deals at the moment. Check back soon!</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
            {activeDeals.map((d) => (
              <DealCard key={d.id} deal={d} liveProducts={liveProducts} />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
