import React, { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Star, Minus, Plus, ChevronRight, Package, RotateCcw, Shield } from "lucide-react";
import { useParams, useLocation } from "wouter";
import { api } from "@/lib/api";
import type { ApiProduct } from "@/lib/api";
import { useCart } from "@/context/CartContext";
import { PRODUCTS } from "@/data/products";

function StarRating({ count, size = 14 }: { count: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={size} className={i < count ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"} />
      ))}
    </div>
  );
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
        <img src={product.img} alt={product.name} className="w-full h-full object-cover absolute inset-0"
          style={{ opacity: hovered ? 0 : 1, transition: "opacity 0.4s ease" }} />
        <img src={product.img2} alt={product.name} className="w-full h-full object-cover absolute inset-0"
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

  useEffect(() => {
    setLoading(true);
    api.products.get(params.slug).then((res) => {
      if (res.success) setProduct(res.product);
      else {
        const fallback = PRODUCTS.find((p) => p.slug === params.slug);
        if (fallback) setProduct({ ...fallback, stock: 100, active: true });
      }
    }).catch(() => {
      const fallback = PRODUCTS.find((p) => p.slug === params.slug);
      if (fallback) setProduct({ ...fallback, stock: 100, active: true });
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
                  src={product.img}
                  alt={product.name}
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

            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-100">
              <span className="text-2xl font-bold text-gray-900">{product.price}</span>
              <span className="text-base text-gray-400 line-through">{product.originalPrice}</span>
              <span className="bg-red-600 text-white text-xs font-bold px-2 py-0.5">{discount}% OFF</span>
            </div>

            <p className="text-gray-600 text-sm leading-relaxed mb-6">{product.desc}</p>

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
              className="w-full h-12 font-bold uppercase tracking-widest text-xs border-2 border-black text-black hover:bg-black hover:text-white transition-all duration-200 bg-transparent cursor-pointer mb-8"
            >
              Buy Now
            </button>

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
