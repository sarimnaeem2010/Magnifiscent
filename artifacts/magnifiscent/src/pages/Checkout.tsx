import React, { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ChevronRight, Shield, Lock } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useLocation } from "wouter";

export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const [, navigate] = useLocation();
  const [step, setStep] = useState<"form" | "success">("form");

  const shipping = total >= 100 ? 0 : 9.99;
  const orderTotal = total + shipping;

  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", phone: "",
    address: "", city: "", state: "", zip: "", country: "United States",
    cardName: "", cardNumber: "", cardExpiry: "", cardCvv: "",
  });

  function handleInput(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    clearCart();
    setStep("success");
  }

  if (step === "success") {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-lg mx-auto px-4 py-20 text-center">
          <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-green-600 text-3xl font-bold">✓</span>
          </div>
          <h2 className="font-bold text-2xl uppercase tracking-wide mb-3" style={{ fontFamily: "Georgia, serif" }}>
            Order Confirmed!
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed mb-2">
            Thank you for your order. A confirmation email has been sent to {form.email}.
          </p>
          <p className="text-gray-400 text-xs mb-8">
            Your order will be processed and dispatched within 1-2 business days.
          </p>
          <button
            onClick={() => navigate("/")}
            className="inline-block bg-black text-white font-bold uppercase tracking-widest text-xs px-10 py-3 hover:bg-gray-800 transition-colors border-none cursor-pointer"
          >
            Continue Shopping
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-lg mx-auto px-4 py-20 text-center">
          <h2 className="font-bold text-2xl uppercase tracking-wide mb-4">Your cart is empty</h2>
          <button
            onClick={() => navigate("/products")}
            className="inline-block bg-black text-white font-bold uppercase tracking-widest text-xs px-10 py-3 hover:bg-gray-800 transition-colors border-none cursor-pointer"
          >
            Shop Products
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Header />

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <nav className="flex items-center gap-1 text-xs text-gray-400">
          <button onClick={() => navigate("/")} className="hover:text-black bg-transparent border-none cursor-pointer text-gray-400">Home</button>
          <ChevronRight size={12} />
          <button onClick={() => navigate("/products")} className="hover:text-black bg-transparent border-none cursor-pointer text-gray-400">Products</button>
          <ChevronRight size={12} />
          <span className="text-gray-900 font-medium">Checkout</span>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-16">
        <h1 className="font-bold text-2xl uppercase tracking-wide mb-8" style={{ fontFamily: "Georgia, serif" }}>Checkout</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-10">

            {/* Left: Form */}
            <div className="space-y-8">
              {/* Contact */}
              <div>
                <h2 className="font-bold text-sm uppercase tracking-widest text-gray-900 mb-5 pb-3 border-b border-gray-100">
                  Contact Information
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { field: "firstName", label: "First Name", placeholder: "John" },
                    { field: "lastName", label: "Last Name", placeholder: "Smith" },
                  ].map(({ field, label, placeholder }) => (
                    <div key={field}>
                      <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">{label} *</label>
                      <input
                        type="text"
                        required
                        value={(form as Record<string, string>)[field]}
                        onChange={(e) => handleInput(field, e.target.value)}
                        className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-gray-400 transition-colors"
                        placeholder={placeholder}
                      />
                    </div>
                  ))}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Email *</label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => handleInput("email", e.target.value)}
                      className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-gray-400 transition-colors"
                      placeholder="john@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Phone</label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => handleInput("phone", e.target.value)}
                      className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-gray-400 transition-colors"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                </div>
              </div>

              {/* Shipping */}
              <div>
                <h2 className="font-bold text-sm uppercase tracking-widest text-gray-900 mb-5 pb-3 border-b border-gray-100">
                  Shipping Address
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Street Address *</label>
                    <input
                      type="text"
                      required
                      value={form.address}
                      onChange={(e) => handleInput("address", e.target.value)}
                      className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-gray-400 transition-colors"
                      placeholder="123 Main Street, Apt 4"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { field: "city", label: "City", placeholder: "New York" },
                      { field: "state", label: "State", placeholder: "NY" },
                      { field: "zip", label: "ZIP Code", placeholder: "10001" },
                      { field: "country", label: "Country", placeholder: "United States" },
                    ].map(({ field, label, placeholder }) => (
                      <div key={field}>
                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">{label} *</label>
                        <input
                          type="text"
                          required
                          value={(form as Record<string, string>)[field]}
                          onChange={(e) => handleInput(field, e.target.value)}
                          className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-gray-400 transition-colors"
                          placeholder={placeholder}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Payment */}
              <div>
                <h2 className="font-bold text-sm uppercase tracking-widest text-gray-900 mb-5 pb-3 border-b border-gray-100">
                  Payment Details
                </h2>
                <div className="bg-gray-50 border border-gray-100 p-4 mb-4 flex items-center gap-2">
                  <Lock size={14} className="text-gray-500" />
                  <p className="text-xs text-gray-500">Your payment information is secure and encrypted</p>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Name on Card *</label>
                    <input
                      type="text"
                      required
                      value={form.cardName}
                      onChange={(e) => handleInput("cardName", e.target.value)}
                      className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-gray-400 transition-colors"
                      placeholder="John Smith"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Card Number *</label>
                    <input
                      type="text"
                      required
                      maxLength={19}
                      value={form.cardNumber}
                      onChange={(e) => {
                        const v = e.target.value.replace(/\D/g, "").slice(0, 16);
                        handleInput("cardNumber", v.replace(/(.{4})/g, "$1 ").trim());
                      }}
                      className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-gray-400 transition-colors font-mono"
                      placeholder="1234 5678 9012 3456"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Expiry *</label>
                      <input
                        type="text"
                        required
                        value={form.cardExpiry}
                        onChange={(e) => {
                          let v = e.target.value.replace(/\D/g, "").slice(0, 4);
                          if (v.length > 2) v = v.slice(0, 2) + "/" + v.slice(2);
                          handleInput("cardExpiry", v);
                        }}
                        className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-gray-400 transition-colors"
                        placeholder="MM/YY"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">CVV *</label>
                      <input
                        type="text"
                        required
                        maxLength={4}
                        value={form.cardCvv}
                        onChange={(e) => handleInput("cardCvv", e.target.value.replace(/\D/g, "").slice(0, 4))}
                        className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-gray-400 transition-colors"
                        placeholder="123"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-black text-white font-bold uppercase tracking-widest text-sm py-4 hover:bg-gray-800 transition-colors border-none cursor-pointer"
              >
                Place Order — ${orderTotal.toFixed(2)}
              </button>

              <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                <Shield size={13} />
                <span>SSL secured — 256-bit encryption</span>
              </div>
            </div>

            {/* Right: Order Summary */}
            <div>
              <div className="border border-gray-200 sticky top-28">
                <div className="px-6 py-5 border-b border-gray-100">
                  <h2 className="font-bold text-sm uppercase tracking-widest text-gray-900">
                    Order Summary ({items.length} {items.length === 1 ? "item" : "items"})
                  </h2>
                </div>
                <div className="px-6 py-5 space-y-4 max-h-80 overflow-y-auto">
                  {items.map(({ product, qty }) => (
                    <div key={product.id} className="flex gap-3">
                      <div className="w-16 h-20 flex-shrink-0 bg-gray-50 overflow-hidden relative">
                        <span className="absolute top-0.5 right-0.5 bg-black text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold z-10">
                          {qty}
                        </span>
                        <img src={product.img} alt={product.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-xs text-gray-900">{product.name}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{product.size}</p>
                        <p className="text-xs text-gray-400">{product.category}</p>
                      </div>
                      <p className="font-bold text-xs text-gray-900 flex-shrink-0">
                        ${(product.priceNum * qty).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="px-6 pb-6 pt-4 border-t border-gray-100 space-y-3">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Subtotal</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Shipping</span>
                    <span className={shipping === 0 ? "text-green-600 font-medium" : ""}>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  {shipping === 0 && (
                    <p className="text-xs text-green-600">🎉 You qualify for free shipping!</p>
                  )}
                  <div className="flex justify-between font-bold text-gray-900 pt-3 border-t border-gray-100">
                    <span>Total</span>
                    <span>${orderTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>

      <Footer />
    </div>
  );
}
