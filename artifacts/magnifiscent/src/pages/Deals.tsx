import React, { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Star } from "lucide-react";
import { PRODUCTS } from "@/data/products";
import { useAdminDealMap } from "@/data/liveData";
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

const BASE_DEALS = [
  {
    id: "iconic-duo",
    name: "THE ICONIC DUO",
    img1: PRODUCTS[4].img,
    img2: PRODUCTS[0].img,
    price: 149,
    originalPrice: 178,
    reviews: 14,
    desc: "QUEST and CHIC — two signature fragrances paired together in one exclusive combo. One bold, one floral.",
    contains: [PRODUCTS[4].name, PRODUCTS[0].name],
    representativeProduct: PRODUCTS[4],
  },
  {
    id: "floral-dream",
    name: "FLORAL DREAM PACK",
    img1: PRODUCTS[0].img,
    img2: PRODUCTS[3].img,
    price: 159,
    originalPrice: 204,
    reviews: 8,
    desc: "CHIC and SIGMA — warm and feminine florals combined in a stunning gift set. Perfect for gifting.",
    contains: [PRODUCTS[0].name, PRODUCTS[3].name],
    representativeProduct: PRODUCTS[0],
  },
  {
    id: "dark-allure",
    name: "DARK ALLURE DUO",
    img1: PRODUCTS[1].img,
    img2: PRODUCTS[5].img,
    price: 189,
    originalPrice: 224,
    reviews: 11,
    desc: "Dark Angel meets Allure — two deeply mysterious and seductive fragrances for the bold woman who commands attention.",
    contains: [PRODUCTS[1].name, PRODUCTS[5].name],
    representativeProduct: PRODUCTS[1],
  },
  {
    id: "fresh-bloom",
    name: "FRESH BLOOM DUO",
    img1: PRODUCTS[2].img,
    img2: PRODUCTS[0].img,
    price: 139,
    originalPrice: 164,
    reviews: 6,
    desc: "Rising Sun and CHIC — a fresh citrus meets warm floral pairing. The perfect daytime duo for any occasion.",
    contains: [PRODUCTS[2].name, PRODUCTS[0].name],
    representativeProduct: PRODUCTS[2],
  },
  {
    id: "womens-trio",
    name: "WOMEN'S SIGNATURE TRIO",
    img1: PRODUCTS[0].img,
    img2: PRODUCTS[1].img,
    price: 259,
    originalPrice: 333,
    reviews: 19,
    desc: "The ultimate women's collection — CHIC, Dark Angel, and SIGMA in one spectacular package. Own every mood.",
    contains: [PRODUCTS[0].name, PRODUCTS[1].name, PRODUCTS[3].name],
    representativeProduct: PRODUCTS[0],
  },
  {
    id: "floral-trio",
    name: "FLORAL TRIO",
    img1: PRODUCTS[0].img,
    img2: PRODUCTS[3].img,
    price: 239,
    originalPrice: 289,
    reviews: 22,
    desc: "Three floral masterpieces — CHIC, SIGMA, and Rising Sun — for the woman who embraces every mood.",
    contains: [PRODUCTS[0].name, PRODUCTS[3].name, PRODUCTS[2].name],
    representativeProduct: PRODUCTS[0],
  },
];

type DealWithPrice = typeof BASE_DEALS[0] & { savings: number };

function DealCard({ deal }: { deal: DealWithPrice }) {
  const [hovered, setHovered] = useState(false);
  const { addItem } = useCart();
  const discount = Math.round(((deal.originalPrice - deal.price) / deal.originalPrice) * 100);

  return (
    <div
      className="product-card cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative overflow-hidden bg-gray-50" style={{ aspectRatio: "3/4" }}>
        <span className="sale-badge">{discount}% OFF</span>
        <img src={deal.img1} alt={deal.name} className="w-full h-full object-cover absolute inset-0"
          style={{ opacity: hovered ? 0 : 1, transition: "opacity 0.4s ease" }} />
        <img src={deal.img2} alt={deal.name} className="w-full h-full object-cover absolute inset-0"
          style={{ opacity: hovered ? 1 : 0, transition: "opacity 0.4s ease" }} />
        <button
          className="quickshop-btn"
          style={{ transform: hovered ? "translateY(0)" : "translateY(100%)", transition: "transform 0.3s ease" }}
          onClick={(e) => {
            e.stopPropagation();
            addItem(deal.representativeProduct);
          }}
        >
          Quick Add
        </button>
      </div>
      <div className="pt-3 pb-2">
        <p className="text-xs text-green-600 font-bold mb-1">Save ${deal.savings.toFixed(2)}</p>
        <div className="flex items-center gap-1 mb-1">
          <StarRating count={5} />
          <span className="text-gray-400 text-xs ml-1">({deal.reviews})</span>
        </div>
        <h3 className="font-bold text-sm text-gray-900 mb-1">{deal.name}</h3>
        <p className="text-xs text-gray-500 mb-2 leading-snug line-clamp-2">{deal.desc}</p>
        <div className="flex flex-wrap gap-1 mb-2">
          {deal.contains.map((c) => (
            <span key={c} className="text-[10px] border border-gray-200 px-2 py-0.5 text-gray-500 font-medium">{c}</span>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-gray-900">${deal.price.toFixed(2)}</span>
          <span className="text-xs text-gray-400 line-through">${deal.originalPrice.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}

export default function Deals() {
  const adminDealMap = useAdminDealMap();

  const activeDeals: DealWithPrice[] = BASE_DEALS
    .filter((d) => {
      const admin = adminDealMap.get(d.id);
      return admin ? admin.active : true;
    })
    .map((d) => {
      const admin = adminDealMap.get(d.id);
      const price = admin ? admin.price : d.price;
      const originalPrice = admin ? admin.originalPrice : d.originalPrice;
      return { ...d, price, originalPrice, savings: originalPrice - price };
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
        {activeDeals.length === 0 ? (
          <p className="text-center text-gray-400 py-20">No active deals at the moment. Check back soon!</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
            {activeDeals.map((d) => (
              <DealCard key={d.id} deal={d} />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
