import React, { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ChevronRight, Shield, Lock, Truck, Tag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useLocation } from "wouter";
import { api } from "@/lib/api";
import type { ApiPaymentSettings, ApiExtendedSettings, ApiStoreSettings } from "@/lib/api";

const DEFAULT_STORE: ApiStoreSettings = {
  storeName: "MagnifiScent",
  email: "hello@magnifiscent.com",
  phone: "",
  currency: "Rs.",
  freeShippingThreshold: 2500,
  instagramUrl: "",
  twitterUrl: "",
  facebookUrl: "",
};
const DEFAULT_EXT: ApiExtendedSettings = {
  seoTitle: "",
  seoDescription: "",
  seoOgImage: "",
  shippingRate: 200,
  shippingCarrier: "",
  taxRate: 0,
  showTaxInCart: false,
  ga4Id: "",
  fbPixelId: "",
  maintenanceMode: false,
  maintenanceMessage: "",
};

export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const [, navigate] = useLocation();
  const [step, setStep] = useState<"form" | "success">("form");

  const [paymentSettings, setPaymentSettings] = useState<ApiPaymentSettings>({ cod: true, card: true });
  const [extSettings, setExtSettings] = useState<ApiExtendedSettings>(DEFAULT_EXT);
  const [storeSettings, setStoreSettings] = useState<ApiStoreSettings>(DEFAULT_STORE);
  const [settingsLoaded, setSettingsLoaded] = useState(false);

  useEffect(() => {
    api.settings.get().then((res) => {
      if (res.success) {
        if (res.settings.payment) setPaymentSettings(res.settings.payment);
        if (res.settings.extended) setExtSettings({ ...DEFAULT_EXT, ...res.settings.extended });
        if (res.settings.store) setStoreSettings({ ...DEFAULT_STORE, ...res.settings.store });
      }
    }).catch(() => {}).finally(() => setSettingsLoaded(true));
  }, []);

  const cur = storeSettings.currency || "Rs.";
  const availableMethods: ("card" | "cod")[] = [];
  if (paymentSettings.card) availableMethods.push("card");
  if (paymentSettings.cod) availableMethods.push("cod");

  const [payMethod, setPayMethod] = useState<"card" | "cod">("cod");

  useEffect(() => {
    if (availableMethods.length > 0 && !availableMethods.includes(payMethod)) {
      setPayMethod(availableMethods[0]);
    }
  }, [paymentSettings]);

  const shippingRate = extSettings.shippingRate ?? 200;
  const freeShippingThreshold = storeSettings.freeShippingThreshold ?? 2500;
  const taxRate = extSettings.taxRate ?? 0;
  const showTax = extSettings.showTaxInCart && taxRate > 0;

  const [discountInput, setDiscountInput] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [discountMsg, setDiscountMsg] = useState("");
  const [discountValid, setDiscountValid] = useState<boolean | null>(null);
  const [applyingDiscount, setApplyingDiscount] = useState(false);

  const shipping = total >= freeShippingThreshold ? 0 : shippingRate;
  const taxAmount = showTax ? (total - appliedDiscount) * (taxRate / 100) : 0;
  const orderTotal = total - appliedDiscount + shipping + taxAmount;

  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", phone: "",
    address: "", city: "", state: "", zip: "", country: "Pakistan",
    cardName: "", cardNumber: "", cardExpiry: "", cardCvv: "",
  });

  function handleInput(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleApplyDiscount() {
    if (!discountInput.trim()) return;
    setApplyingDiscount(true);
    try {
      const result = await api.discountCodes.apply(discountInput.trim(), total);
      setDiscountValid(result.valid);
      setDiscountMsg(result.message);
      setAppliedDiscount(result.valid ? result.discount : 0);
    } catch {
      setDiscountValid(false);
      setDiscountMsg("Could not verify discount code. Please try again.");
    } finally {
      setApplyingDiscount(false);
    }
  }

  function handleRemoveDiscount() {
    setAppliedDiscount(0);
    setDiscountMsg("");
    setDiscountValid(null);
    setDiscountInput("");
  }

  function fireOrderConfirmationEmail(orderId: string) {
    if (!form.email) return;
    api.sendEmail.orderConfirmation({
      orderId,
      customerEmail: form.email,
      customerName: `${form.firstName} ${form.lastName}`.trim(),
      orderTotal: `${cur} ${orderTotal.toFixed(2)}`,
      items: items.map((i) => ({ name: i.product.name, qty: i.qty, price: i.product.priceNum })),
      variables: { store_name: storeSettings.storeName || "MagnifiScent" },
    }).catch(() => {});
  }

  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError("");
    setSubmitting(true);
    const orderId = `MS-${Date.now().toString(36).toUpperCase()}`;
    const now = new Date().toISOString();

    try {
      const res = await api.orders.create({
        id: orderId,
        customer: {
          name: `${form.firstName} ${form.lastName}`.trim(),
          email: form.email,
          phone: form.phone,
          address: [form.address, form.city, form.state, form.zip, form.country].filter(Boolean).join(", "),
        },
        items: items.map((i) => ({
          productId: i.product.id,
          productName: i.product.name,
          qty: i.qty,
          price: i.product.priceNum,
        })),
        total: orderTotal,
        status: "Pending",
        date: now,
        paymentMethod: payMethod === "cod" ? "Cash on Delivery" : "Card",
      });
      if (!res.success) {
        setSubmitError("Failed to place your order. Please try again.");
        setSubmitting(false);
        return;
      }
    } catch {
      setSubmitError("Network error. Please check your connection and try again.");
      setSubmitting(false);
      return;
    }

    clearCart();
    fireOrderConfirmationEmail(orderId);
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
          {payMethod === "cod" && (
            <p className="text-gray-500 text-xs mb-2 font-medium">Payment will be collected upon delivery.</p>
          )}
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

            <div className="space-y-8">
              {/* Contact */}
              <div>
                <h2 className="font-bold text-sm uppercase tracking-widest text-gray-900 mb-5 pb-3 border-b border-gray-100">
                  Contact Information
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { field: "firstName", label: "First Name", placeholder: "Ali" },
                    { field: "lastName", label: "Last Name", placeholder: "Ahmed" },
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
                      placeholder="ali@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Phone</label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => handleInput("phone", e.target.value)}
                      className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-gray-400 transition-colors"
                      placeholder="+92 300 1234567"
                    />
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
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
                      placeholder="House 12, Street 4, Block A"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { field: "city", label: "City", placeholder: "Karachi" },
                      { field: "state", label: "Province", placeholder: "Sindh" },
                      { field: "zip", label: "Postal Code", placeholder: "74000" },
                      { field: "country", label: "Country", placeholder: "Pakistan" },
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
                  Payment Method
                </h2>

                {availableMethods.length > 1 && (
                  <div className="flex gap-0 mb-5 border border-gray-200 overflow-hidden">
                    {availableMethods.map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setPayMethod(m)}
                        className="flex-1 px-4 py-3 text-xs font-bold uppercase tracking-widest transition-colors border-none cursor-pointer"
                        style={{
                          background: payMethod === m ? "#111827" : "#fff",
                          color: payMethod === m ? "#fff" : "#6b7280",
                        }}
                      >
                        {m === "card" ? "💳  Card" : "🚚  Cash on Delivery"}
                      </button>
                    ))}
                  </div>
                )}

                {payMethod === "card" ? (
                  <>
                    <div className="bg-gray-50 border border-gray-100 p-4 mb-4 flex items-center gap-2">
                      <Lock size={14} className="text-gray-500" />
                      <p className="text-xs text-gray-500">Your payment information is secure and encrypted</p>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Name on Card *</label>
                        <input
                          type="text"
                          required={payMethod === "card"}
                          value={form.cardName}
                          onChange={(e) => handleInput("cardName", e.target.value)}
                          className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-gray-400 transition-colors"
                          placeholder="Ali Ahmed"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Card Number *</label>
                        <input
                          type="text"
                          required={payMethod === "card"}
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
                            required={payMethod === "card"}
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
                            required={payMethod === "card"}
                            maxLength={4}
                            value={form.cardCvv}
                            onChange={(e) => handleInput("cardCvv", e.target.value.replace(/\D/g, "").slice(0, 4))}
                            className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-gray-400 transition-colors"
                            placeholder="123"
                          />
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="bg-gray-50 border border-gray-100 p-5 flex items-start gap-3">
                    <Truck size={20} className="text-gray-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-bold text-gray-800">Pay when your order arrives</p>
                      <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                        No payment is required now. Our delivery agent will collect the full amount at your door when your order is delivered.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Discount Code */}
              <div>
                <h2 className="font-bold text-sm uppercase tracking-widest text-gray-900 mb-4 pb-3 border-b border-gray-100">
                  Discount Code
                </h2>
                {discountValid === true ? (
                  <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <Tag size={16} className="text-green-600 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-bold text-green-700">{discountInput.toUpperCase()}</p>
                      <p className="text-xs text-green-600">{discountMsg}</p>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveDiscount}
                      className="text-xs text-green-600 hover:text-green-800 underline bg-transparent border-none cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={discountInput}
                        onChange={(e) => setDiscountInput(e.target.value.toUpperCase())}
                        onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleApplyDiscount(); } }}
                        className="flex-1 border border-gray-200 px-4 py-3 text-sm font-mono uppercase focus:outline-none focus:border-gray-400 transition-colors"
                        placeholder="Enter discount code"
                      />
                      <button
                        type="button"
                        onClick={handleApplyDiscount}
                        disabled={applyingDiscount}
                        className="px-5 py-3 bg-black text-white text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors border-none cursor-pointer"
                      >
                        {applyingDiscount ? "…" : "Apply"}
                      </button>
                    </div>
                    {discountValid === false && (
                      <p className="text-xs text-red-500">{discountMsg}</p>
                    )}
                  </div>
                )}
              </div>

              {submitError && (
                <p className="text-red-600 text-sm font-medium text-center">{submitError}</p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-black text-white font-bold uppercase tracking-widest text-sm py-4 hover:bg-gray-800 transition-colors border-none cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting
                  ? "Placing Order..."
                  : payMethod === "cod"
                  ? `Place Order (COD) — ${cur} ${orderTotal.toFixed(2)}`
                  : `Pay Now — ${cur} ${orderTotal.toFixed(2)}`}
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
                        {cur} {(product.priceNum * qty).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="px-6 pb-6 pt-4 border-t border-gray-100 space-y-3">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Subtotal</span>
                    <span>{cur} {total.toFixed(2)}</span>
                  </div>
                  {appliedDiscount > 0 && (
                    <div className="flex justify-between text-sm text-green-600 font-medium">
                      <span>Discount ({discountInput.toUpperCase()})</span>
                      <span>− {cur} {appliedDiscount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Shipping</span>
                    <span className={shipping === 0 ? "text-green-600 font-medium" : ""}>
                      {shipping === 0 ? "Free" : `${cur} ${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  {shipping === 0 && (
                    <p className="text-xs text-green-600">🎉 You qualify for free shipping!</p>
                  )}
                  {showTax && taxAmount > 0 && (
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Tax ({taxRate}%)</span>
                      <span>{cur} {taxAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-gray-900 pt-3 border-t border-gray-100">
                    <span>Total</span>
                    <span>{cur} {orderTotal.toFixed(2)}</span>
                  </div>
                  {extSettings.shippingCarrier && shipping > 0 && (
                    <p className="text-xs text-gray-400">via {extSettings.shippingCarrier}</p>
                  )}
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
