import React, { useEffect, useState } from "react";
import { X, Plus, Minus, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useLocation } from "wouter";
import { getExtendedSettings, getStoreFrontSettings } from "@/data/liveData";

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQty, total, count } = useCart();
  const [, navigate] = useLocation();
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  const ext = getExtendedSettings();
  const store = getStoreFrontSettings();
  const cur = store.currency || "Rs.";
  const freeShippingThreshold = store.freeShippingThreshold ?? 100;
  const shippingRate = ext.shippingRate ?? 200;
  const taxRate = ext.taxRate ?? 0;
  const showTax = ext.showTaxInCart && taxRate > 0;

  const shipping = items.length === 0 ? 0 : total >= freeShippingThreshold ? 0 : shippingRate;
  const taxAmount = showTax && items.length > 0 ? total * (taxRate / 100) : 0;
  const cartTotal = total + shipping + taxAmount;

  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setVisible(true));
      });
    } else {
      setVisible(false);
      const t = setTimeout(() => setMounted(false), 350);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  if (!mounted) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-[100]"
        onClick={closeCart}
        style={{
          backdropFilter: "blur(2px)",
          opacity: visible ? 1 : 0,
          transition: "opacity 0.35s ease",
        }}
      />

      {/* Drawer */}
      <div
        className="fixed top-0 right-0 h-full bg-white z-[101] flex flex-col"
        style={{
          width: "min(400px, 100vw)",
          boxShadow: "-4px 0 30px rgba(0,0,0,0.15)",
          transform: visible ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <ShoppingBag size={18} className="text-gray-700" />
            <h2 className="font-bold text-base uppercase tracking-widest text-gray-900">
              Cart ({count})
            </h2>
          </div>
          <button
            onClick={closeCart}
            className="text-gray-400 hover:text-gray-900 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-4 text-gray-400">
              <ShoppingBag size={48} strokeWidth={1} />
              <p className="text-sm font-medium">Your cart is empty</p>
              <button
                onClick={() => { closeCart(); navigate("/products"); }}
                className="text-xs font-bold uppercase tracking-widest border-b border-gray-400 hover:border-black hover:text-black transition-colors pb-0.5"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-5">
              {items.map(({ product, qty }) => (
                <div key={product.id} className="flex gap-4">
                  <div className="w-20 h-24 flex-shrink-0 overflow-hidden bg-gray-50">
                    <img
                      src={product.img}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between gap-2">
                      <div>
                        <p className="text-xs text-gray-400 uppercase tracking-wide">{product.category}</p>
                        <h4 className="font-bold text-sm text-gray-900 mt-0.5">{product.name}</h4>
                        <p className="text-xs text-gray-500 mt-0.5">{product.size}</p>
                      </div>
                      <button
                        onClick={() => removeItem(product.id)}
                        className="text-gray-300 hover:text-gray-900 transition-colors flex-shrink-0"
                      >
                        <X size={14} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-gray-200">
                        <button
                          className="w-7 h-7 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors"
                          onClick={() => updateQty(product.id, qty - 1)}
                        >
                          <Minus size={12} />
                        </button>
                        <span className="w-8 text-center text-sm font-medium">{qty}</span>
                        <button
                          className="w-7 h-7 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors"
                          onClick={() => updateQty(product.id, qty + 1)}
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                      <p className="font-bold text-sm text-gray-900">
                        {cur} {(product.priceNum * qty).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-6 py-5 border-t border-gray-100 space-y-2.5">
            <div className="flex justify-between text-sm font-medium text-gray-700">
              <span>Subtotal</span>
              <span>{cur} {total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xs text-gray-400">
              <span>Shipping</span>
              <span>
                {shipping === 0
                  ? total >= freeShippingThreshold ? "Free" : "Free"
                  : `${cur} ${shipping.toFixed(2)}`}
              </span>
            </div>
            {total < freeShippingThreshold && shipping > 0 && (
              <p className="text-[11px] text-gray-400">
                Add {cur} {(freeShippingThreshold - total).toFixed(2)} more for free shipping
              </p>
            )}
            {showTax && taxAmount > 0 && (
              <div className="flex justify-between text-xs text-gray-500">
                <span>Tax ({taxRate}%)</span>
                <span>{cur} {taxAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-gray-900 pt-1.5 border-t border-gray-100">
              <span>Total</span>
              <span>{cur} {cartTotal.toFixed(2)}</span>
            </div>
            <button
              onClick={() => { closeCart(); navigate("/checkout"); }}
              className="w-full bg-black text-white font-bold uppercase tracking-widest text-xs py-4 hover:bg-gray-800 transition-colors mt-2"
            >
              Checkout — {cur} {cartTotal.toFixed(2)}
            </button>
            <button
              onClick={() => { closeCart(); navigate("/products"); }}
              className="w-full text-center text-xs font-semibold text-gray-500 hover:text-black transition-colors py-1 underline underline-offset-2"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
}
