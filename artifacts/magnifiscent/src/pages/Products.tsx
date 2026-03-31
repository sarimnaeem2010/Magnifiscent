import React, { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Star } from "lucide-react";
import { api } from "@/lib/api";
import type { ApiProduct } from "@/lib/api";
import { useCart } from "@/context/CartContext";
import { useLocation, useSearch } from "wouter";

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={11} className={i < count ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"} />
      ))}
    </div>
  );
}

function ProductCard({ product }: { product: ApiProduct }) {
  const [hovered, setHovered] = useState(false);
  const { addItem } = useCart();
  const [, navigate] = useLocation();

  return (
    <div
      className="product-card cursor-pointer"
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
        <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">{product.category}</p>
        <div className="flex items-center gap-1 mb-1">
          <StarRating count={product.rating} />
          <span className="text-gray-400 text-xs ml-1">({product.reviews})</span>
        </div>
        <h3 className="font-semibold text-sm text-gray-900 hover:text-gray-600 transition-colors mb-1">
          {product.name}
        </h3>
        <p className="text-xs text-gray-500 mb-2 leading-relaxed line-clamp-2">{product.desc}</p>
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-gray-900">{product.price}</span>
          <span className="text-xs text-gray-400 line-through">{product.originalPrice}</span>
        </div>
      </div>
    </div>
  );
}

export default function Products() {
  const search = useSearch();
  const params = new URLSearchParams(search);
  const initialGender = (params.get("gender") as "men" | "women" | null) || "all";
  const [filter, setFilter] = useState<"all" | "men" | "women">(initialGender as "all" | "men" | "women");
  const [, navigate] = useLocation();
  const [allProducts, setAllProducts] = useState<ApiProduct[]>([]);

  useEffect(() => {
    api.products.list().then((res) => {
      if (res.success) {
        setAllProducts(res.products);
      }
    }).catch(() => {});
  }, []);

  useEffect(() => {
    const p = new URLSearchParams(search);
    const g = p.get("gender");
    setFilter(g === "men" ? "men" : g === "women" ? "women" : "all");
  }, [search]);

  const filtered = filter === "all" ? allProducts : allProducts.filter((p) => p.category === filter);

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Header />

      <div className="bg-gray-50 border-b border-gray-100 py-10">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Our Collection</p>
          <h1 className="font-bold text-3xl md:text-4xl uppercase tracking-wide" style={{ fontFamily: "Georgia, serif" }}>
            All Products
          </h1>
          <p className="text-gray-500 text-sm mt-3 max-w-md mx-auto">
            Premium Eau de Parfum for Men and Women — crafted to leave a lasting impression.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div className="flex items-center border border-gray-200">
            {(["all", "men", "women"] as const).map((f, i) => (
              <button
                key={f}
                onClick={() => {
                  setFilter(f);
                  navigate(f === "all" ? "/products" : `/products?gender=${f}`);
                }}
                className="px-6 py-2.5 text-xs font-bold uppercase tracking-widest transition-colors"
                style={{
                  background: filter === f ? "#1a1a1a" : "white",
                  color: filter === f ? "white" : "#6b7280",
                  borderRight: i < 2 ? "1px solid #e5e7eb" : "none",
                }}
              >
                {f === "all" ? `All (${allProducts.length})` : `${f.charAt(0).toUpperCase() + f.slice(1)} (${allProducts.filter((p) => p.category === f).length})`}
              </button>
            ))}
          </div>
          <p className="text-sm text-gray-400">{filtered.length} products</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>

        <div className="text-center mt-10">
          <button
            onClick={() => {
              setFilter("all");
              navigate("/products");
            }}
            className="inline-block border border-black text-black font-bold uppercase tracking-widest text-xs px-10 py-3 hover:bg-black hover:text-white transition-colors bg-transparent cursor-pointer"
          >
            View All Products
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}
