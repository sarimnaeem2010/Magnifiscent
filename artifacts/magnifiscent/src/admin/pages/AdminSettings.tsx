import React, { useState, useRef } from "react";
import { useAdmin } from "../AdminContext";
import type { StoreSettings } from "../AdminContext";
import { Check, Eye, EyeOff, X, Download, Upload, Plus } from "lucide-react";
import {
  getPaymentSettings, savePaymentSettings, type PaymentSettings,
  getTickerMessages, saveTickerMessages,
  getExtendedSettings, saveExtendedSettings, type ExtendedSettings,
  getDiscountCodes, saveDiscountCodes, type DiscountCode,
} from "@/data/liveData";

const STORE_KEYS = [
  "admin_orders", "admin_products", "admin_deals", "admin_settings",
  "admin_hero_slides", "admin_gender_banners", "admin_notes_images",
  "admin_deal_images", "admin_instagram_reels", "admin_home_headings",
  "admin_payment_settings", "admin_ticker_messages",
  "admin_extended_settings", "admin_discount_codes",
  "admin_policy_pages",
  "admin_email_settings", "admin_email_templates", "admin_email_log",
];

function DataBackup() {
  const [importStatus, setImportStatus] = useState<"idle" | "ok" | "err">("idle");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const snapshot: Record<string, string | null> = {};
    STORE_KEYS.forEach((k) => { snapshot[k] = localStorage.getItem(k); });
    const blob = new Blob([JSON.stringify(snapshot, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `magnifiscent-data-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target?.result as string) as Record<string, string | null>;
        Object.entries(data).forEach(([k, v]) => {
          if (STORE_KEYS.includes(k)) {
            if (v === null) localStorage.removeItem(k);
            else localStorage.setItem(k, v);
          }
        });
        setImportStatus("ok");
        setTimeout(() => { window.location.reload(); }, 1200);
      } catch {
        setImportStatus("err");
        setTimeout(() => setImportStatus("idle"), 3000);
      }
    };
    reader.readAsText(file);
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
      <div className="pb-2 border-b border-gray-100">
        <h2 className="text-sm font-semibold text-gray-700">Data Backup & Restore</h2>
        <p className="text-xs text-gray-400 mt-0.5">
          Export all store data to a file, then import it on the live site to sync your settings, products, deals, and media.
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={handleExport}
          className="flex items-center justify-center gap-2 flex-1 px-4 py-3 text-sm font-bold text-white rounded-lg border-none cursor-pointer transition-colors"
          style={{ background: "#111827" }}
        >
          <Download size={15} />
          Export Data (Download)
        </button>
        <label
          className="flex items-center justify-center gap-2 flex-1 px-4 py-3 text-sm font-bold rounded-lg border-2 border-dashed cursor-pointer transition-colors"
          style={{
            color: importStatus === "ok" ? "#10b981" : importStatus === "err" ? "#ef4444" : "#374151",
            borderColor: importStatus === "ok" ? "#10b981" : importStatus === "err" ? "#ef4444" : "#d1d5db",
            background: importStatus === "ok" ? "#f0fdf4" : importStatus === "err" ? "#fef2f2" : "#f9fafb",
          }}
        >
          <Upload size={15} />
          {importStatus === "ok" ? "Imported! Reloading…" : importStatus === "err" ? "Invalid file" : "Import Data (Upload)"}
          <input ref={fileRef} type="file" accept=".json" className="hidden" onChange={handleImport} />
        </label>
      </div>
      <p className="text-xs text-gray-400 leading-relaxed">
        <strong>How to sync:</strong> Export on this (dev) site → open your live site's admin → go to Settings → Import the downloaded file.
      </p>
    </div>
  );
}

function Field({ label, value, onChange, type = "text", placeholder = "" }: {
  label: string; value: string | number; onChange: (v: string) => void;
  type?: string; placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">{label}</label>
      <input
        type={type}
        className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
        value={String(value)}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}

function Toggle({ enabled, onToggle, label, desc }: { enabled: boolean; onToggle: () => void; label: string; desc: string }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
      <div>
        <p className="text-sm font-semibold text-gray-800">{label}</p>
        <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
      </div>
      <button
        onClick={onToggle}
        className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors border-none cursor-pointer flex-shrink-0"
        style={{ background: enabled ? "#111827" : "#d1d5db" }}
      >
        <span
          className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow"
          style={{ transform: enabled ? "translateX(24px)" : "translateX(3px)" }}
        />
      </button>
    </div>
  );
}

export function AdminSettings() {
  const { settings, setSettings, logout } = useAdmin();
  const [form, setForm] = useState<StoreSettings>({ ...settings });
  const [saved, setSaved] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [confirmPw, setConfirmPw] = useState("");
  const [pwError, setPwError] = useState("");
  const [payment, setPayment] = useState<PaymentSettings>(() => getPaymentSettings());
  const [paymentSaved, setPaymentSaved] = useState(false);
  const [ticker, setTicker] = useState<string[]>(() => getTickerMessages());
  const [tickerSaved, setTickerSaved] = useState(false);
  const [ext, setExt] = useState<ExtendedSettings>(() => getExtendedSettings());
  const [extSaved, setExtSaved] = useState(false);
  const [discountCodes, setDiscountCodes] = useState<DiscountCode[]>(() => getDiscountCodes());
  const [dcSaved, setDcSaved] = useState(false);

  const update = (field: keyof StoreSettings) => (val: string) => {
    setForm((f) => ({ ...f, [field]: field === "freeShippingThreshold" ? parseFloat(val) || 0 : val }));
  };

  const updateExt = (field: keyof ExtendedSettings) => (val: string | boolean | number) => {
    setExt((e) => ({ ...e, [field]: val }));
  };

  const saveExt = () => {
    saveExtendedSettings(ext);
    setExtSaved(true);
    setTimeout(() => setExtSaved(false), 2500);
  };

  const addDiscountCode = () => {
    const newCode: DiscountCode = {
      id: Date.now().toString(),
      code: "",
      type: "percent",
      value: 10,
      active: true,
      expiry: "",
    };
    setDiscountCodes((prev) => [...prev, newCode]);
  };

  const updateDiscountCode = (id: string, field: keyof DiscountCode, val: string | boolean | number) => {
    setDiscountCodes((prev) =>
      prev.map((c) => (c.id === id ? { ...c, [field]: val } : c))
    );
  };

  const removeDiscountCode = (id: string) => {
    setDiscountCodes((prev) => prev.filter((c) => c.id !== id));
  };

  const saveDc = () => {
    saveDiscountCodes(discountCodes);
    setDcSaved(true);
    setTimeout(() => setDcSaved(false), 2500);
  };

  const handleSave = () => {
    if (form.adminPassword !== settings.adminPassword) {
      if (form.adminPassword !== confirmPw) {
        setPwError("Passwords do not match.");
        return;
      }
      if (form.adminPassword.length < 6) {
        setPwError("Password must be at least 6 characters.");
        return;
      }
    }
    setPwError("");
    setSettings(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const togglePayment = (key: keyof PaymentSettings) => {
    const next = { ...payment, [key]: !payment[key] };
    if (!next.cod && !next.card) return;
    setPayment(next);
    savePaymentSettings(next);
    setPaymentSaved(true);
    setTimeout(() => setPaymentSaved(false), 2000);
  };

  const updateTicker = (idx: number, val: string) => {
    setTicker((prev) => prev.map((m, i) => (i === idx ? val : m)));
  };

  const addTickerMsg = () => {
    if (ticker.length < 6) setTicker((prev) => [...prev, ""]);
  };

  const removeTickerMsg = (idx: number) => {
    if (ticker.length > 1) setTicker((prev) => prev.filter((_, i) => i !== idx));
  };

  const saveTicker = () => {
    const cleaned = ticker.map((m) => m.trim()).filter(Boolean);
    if (cleaned.length === 0) return;
    saveTickerMessages(cleaned);
    setTicker(cleaned);
    setTickerSaved(true);
    setTimeout(() => setTickerSaved(false), 2500);
  };

  const handleReset = () => {
    if (window.confirm("This will clear all admin data (orders, products, settings) and reset to defaults. Continue?")) {
      localStorage.removeItem("admin_orders");
      localStorage.removeItem("admin_products");
      localStorage.removeItem("admin_deals");
      localStorage.removeItem("admin_settings");
      logout();
      window.location.reload();
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      {/* Store Info */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
        <h2 className="text-sm font-semibold text-gray-700 pb-2 border-b border-gray-100">Store Information</h2>
        <Field label="Store Name" value={form.storeName} onChange={update("storeName")} />
        <Field label="Contact Email" value={form.email} onChange={update("email")} type="email" />
        <Field label="Phone Number" value={form.phone} onChange={update("phone")} type="tel" />
        <Field label="Currency Symbol" value={form.currency} onChange={update("currency")} placeholder="Rs." />
      </div>

      {/* Social Links */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
        <h2 className="text-sm font-semibold text-gray-700 pb-2 border-b border-gray-100">Social Links</h2>
        <Field label="Instagram URL" value={form.instagramUrl} onChange={update("instagramUrl")} placeholder="https://instagram.com/..." />
        <Field label="Twitter / X URL" value={form.twitterUrl} onChange={update("twitterUrl")} placeholder="https://twitter.com/..." />
        <Field label="Facebook URL" value={form.facebookUrl} onChange={update("facebookUrl")} placeholder="https://facebook.com/..." />
      </div>

      {/* Change Password */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
        <h2 className="text-sm font-semibold text-gray-700 pb-2 border-b border-gray-100">Admin Password</h2>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">New Password</label>
          <div className="relative">
            <input
              type={showPw ? "text" : "password"}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 pr-10"
              value={form.adminPassword}
              onChange={(e) => { setForm((f) => ({ ...f, adminPassword: e.target.value })); setPwError(""); }}
              placeholder="Enter new password"
            />
            <button
              type="button"
              onClick={() => setShowPw((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer text-gray-400"
            >
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>
        {form.adminPassword !== settings.adminPassword && (
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Confirm Password</label>
            <input
              type={showPw ? "text" : "password"}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
              value={confirmPw}
              onChange={(e) => { setConfirmPw(e.target.value); setPwError(""); }}
              placeholder="Confirm new password"
            />
          </div>
        )}
        {pwError && <p className="text-red-500 text-xs">{pwError}</p>}
      </div>

      {/* Payment Methods */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between pb-2 border-b border-gray-100 mb-1">
          <div>
            <h2 className="text-sm font-semibold text-gray-700">Payment Methods</h2>
            <p className="text-xs text-gray-400 mt-0.5">Enable or disable payment options at checkout. At least one must stay on.</p>
          </div>
          {paymentSaved && (
            <span className="text-xs font-bold text-green-600">✓ Saved</span>
          )}
        </div>
        <Toggle
          label="Cash on Delivery (COD)"
          desc="Customer pays when the order is delivered"
          enabled={payment.cod}
          onToggle={() => togglePayment("cod")}
        />
        <Toggle
          label="Card Payment"
          desc="Customer pays with credit / debit card at checkout"
          enabled={payment.card}
          onToggle={() => togglePayment("card")}
        />
      </div>

      {/* Announcement Ticker */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-gray-100">
          <div>
            <h2 className="text-sm font-semibold text-gray-700">Announcement Ticker</h2>
            <p className="text-xs text-gray-400 mt-0.5">The scrolling messages shown at the top of every page. Up to 6 messages.</p>
          </div>
          {tickerSaved && <span className="text-xs font-bold text-green-600">✓ Saved</span>}
        </div>
        <div className="space-y-2">
          {ticker.map((msg, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <span className="text-xs text-gray-400 w-4 flex-shrink-0">{idx + 1}.</span>
              <input
                type="text"
                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 uppercase"
                value={msg}
                onChange={(e) => updateTicker(idx, e.target.value.toUpperCase())}
                placeholder="E.G. FREE SHIPPING ON ORDERS ABOVE Rs. 100"
              />
              <button
                onClick={() => removeTickerMsg(idx)}
                disabled={ticker.length <= 1}
                className="p-1.5 text-gray-400 hover:text-red-500 bg-transparent border-none cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <X size={15} />
              </button>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between pt-1">
          <button
            onClick={addTickerMsg}
            disabled={ticker.length >= 6}
            className="text-xs font-semibold text-gray-500 hover:text-gray-900 bg-transparent border border-gray-200 rounded-lg px-3 py-1.5 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            + Add Message
          </button>
          <button
            onClick={saveTicker}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white rounded-lg border-none cursor-pointer transition-colors"
            style={{ background: tickerSaved ? "#10b981" : "#111827" }}
          >
            {tickerSaved ? <><Check size={13} /> Saved!</> : "Save Ticker"}
          </button>
        </div>
      </div>

      {/* ═══ SEO ═══ */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-gray-100">
          <div>
            <h2 className="text-sm font-semibold text-gray-700">SEO & Meta Tags</h2>
            <p className="text-xs text-gray-400 mt-0.5">Shown in Google search results and social media previews.</p>
          </div>
          {extSaved && <span className="text-xs font-bold text-green-600">✓ Saved</span>}
        </div>
        <Field label="Page Title" value={ext.seoTitle} onChange={(v) => updateExt("seoTitle")(v)} placeholder="MagnifiScent — Premium Eau de Parfum" />
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Meta Description</label>
          <textarea
            rows={3}
            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none"
            value={ext.seoDescription}
            onChange={(e) => updateExt("seoDescription")(e.target.value)}
            placeholder="Describe your store for search engines…"
          />
        </div>
        <Field label="OG / Social Share Image URL" value={ext.seoOgImage} onChange={(v) => updateExt("seoOgImage")(v)} placeholder="https://…" />
        <button onClick={saveExt} className="flex items-center gap-2 px-5 py-2 text-xs font-bold text-white rounded-lg border-none cursor-pointer transition-colors" style={{ background: extSaved ? "#10b981" : "#111827" }}>
          {extSaved ? <><Check size={13} />Saved!</> : "Save SEO Settings"}
        </button>
      </div>

      {/* ═══ Shipping ═══ */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-gray-100">
          <div>
            <h2 className="text-sm font-semibold text-gray-700">Shipping Settings</h2>
            <p className="text-xs text-gray-400 mt-0.5">Flat-rate shipping shown at checkout.</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Shipping Rate (Rs.)" value={ext.shippingRate} onChange={(v) => updateExt("shippingRate")(parseFloat(v) || 0)} type="number" placeholder="200" />
          <Field label="Free Shipping Threshold (Rs.)" value={form.freeShippingThreshold} onChange={update("freeShippingThreshold")} type="number" placeholder="2500" />
        </div>
        <Field label="Courier / Carrier Label" value={ext.shippingCarrier} onChange={(v) => updateExt("shippingCarrier")(v)} placeholder="TCS Courier" />
        <p className="text-xs text-gray-400">When order subtotal ≥ Free Shipping Threshold, shipping is free. Otherwise the flat Shipping Rate is charged.</p>
        <button onClick={() => { saveExt(); handleSave(); }} className="flex items-center gap-2 px-5 py-2 text-xs font-bold text-white rounded-lg border-none cursor-pointer transition-colors" style={{ background: extSaved ? "#10b981" : "#111827" }}>
          {extSaved ? <><Check size={13} />Saved!</> : "Save Shipping"}
        </button>
      </div>

      {/* ═══ Taxes ═══ */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
        <div className="pb-2 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-700">Tax Settings</h2>
          <p className="text-xs text-gray-400 mt-0.5">Apply a tax percentage to cart totals.</p>
        </div>
        <Field label="Tax Rate (%)" value={ext.taxRate} onChange={(v) => updateExt("taxRate")(parseFloat(v) || 0)} type="number" placeholder="0" />
        <Toggle
          label="Show Tax Line in Cart & Checkout"
          desc="Displays a separate tax line when tax rate > 0"
          enabled={ext.showTaxInCart}
          onToggle={() => updateExt("showTaxInCart")(!ext.showTaxInCart)}
        />
        <button onClick={saveExt} className="flex items-center gap-2 px-5 py-2 text-xs font-bold text-white rounded-lg border-none cursor-pointer transition-colors" style={{ background: extSaved ? "#10b981" : "#111827" }}>
          {extSaved ? <><Check size={13} />Saved!</> : "Save Tax Settings"}
        </button>
      </div>

      {/* ═══ Discount Codes ═══ */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-gray-100">
          <div>
            <h2 className="text-sm font-semibold text-gray-700">Discount Codes</h2>
            <p className="text-xs text-gray-400 mt-0.5">Customers enter these codes at checkout to get a discount.</p>
          </div>
          {dcSaved && <span className="text-xs font-bold text-green-600">✓ Saved</span>}
        </div>

        {discountCodes.length === 0 && (
          <p className="text-xs text-gray-400 py-2">No discount codes yet. Click "Add Code" to create one.</p>
        )}

        <div className="space-y-3">
          {discountCodes.map((dc) => (
            <div key={dc.id} className="border border-gray-100 rounded-lg p-4 space-y-3 bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Code</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm font-mono uppercase focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white"
                    value={dc.code}
                    onChange={(e) => updateDiscountCode(dc.id, "code", e.target.value.toUpperCase())}
                    placeholder="SAVE10"
                  />
                </div>
                <div className="w-28">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Type</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white"
                    value={dc.type}
                    onChange={(e) => updateDiscountCode(dc.id, "type", e.target.value)}
                  >
                    <option value="percent">% Off</option>
                    <option value="fixed">Rs. Off</option>
                  </select>
                </div>
                <div className="w-24">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Value</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white"
                    value={dc.value}
                    min={0}
                    onChange={(e) => updateDiscountCode(dc.id, "value", parseFloat(e.target.value) || 0)}
                  />
                </div>
                <button
                  onClick={() => removeDiscountCode(dc.id)}
                  className="mt-5 p-1.5 text-gray-400 hover:text-red-500 bg-transparent border-none cursor-pointer transition-colors"
                >
                  <X size={15} />
                </button>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Expiry Date (optional)</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white"
                    value={dc.expiry}
                    onChange={(e) => updateDiscountCode(dc.id, "expiry", e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-2 mt-4">
                  <button
                    onClick={() => updateDiscountCode(dc.id, "active", !dc.active)}
                    className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors border-none cursor-pointer flex-shrink-0"
                    style={{ background: dc.active ? "#111827" : "#d1d5db" }}
                  >
                    <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow" style={{ transform: dc.active ? "translateX(24px)" : "translateX(3px)" }} />
                  </button>
                  <span className="text-xs font-medium text-gray-600">{dc.active ? "Active" : "Inactive"}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3 pt-1">
          <button
            onClick={addDiscountCode}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-gray-600 border border-gray-200 rounded-lg hover:border-gray-400 bg-white cursor-pointer transition-colors"
          >
            <Plus size={13} /> Add Code
          </button>
          <button
            onClick={saveDc}
            className="flex items-center gap-2 px-5 py-2 text-xs font-bold text-white rounded-lg border-none cursor-pointer transition-colors"
            style={{ background: dcSaved ? "#10b981" : "#111827" }}
          >
            {dcSaved ? <><Check size={13} />Saved!</> : "Save Codes"}
          </button>
        </div>
      </div>

      {/* ═══ Analytics ═══ */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
        <div className="pb-2 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-700">Analytics & Tracking</h2>
          <p className="text-xs text-gray-400 mt-0.5">Script tags are injected into the page head when an ID is provided.</p>
        </div>
        <Field label="Google Analytics 4 Measurement ID" value={ext.ga4Id} onChange={(v) => updateExt("ga4Id")(v)} placeholder="G-XXXXXXXXXX" />
        <Field label="Facebook Pixel ID" value={ext.fbPixelId} onChange={(v) => updateExt("fbPixelId")(v)} placeholder="123456789012345" />
        <button onClick={saveExt} className="flex items-center gap-2 px-5 py-2 text-xs font-bold text-white rounded-lg border-none cursor-pointer transition-colors" style={{ background: extSaved ? "#10b981" : "#111827" }}>
          {extSaved ? <><Check size={13} />Saved!</> : "Save Analytics"}
        </button>
      </div>

      {/* ═══ Maintenance Mode ═══ */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
        <div className="pb-2 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-700">Maintenance Mode</h2>
          <p className="text-xs text-gray-400 mt-0.5">When on, visitors see a "coming back soon" page. The admin panel is always accessible.</p>
        </div>
        <Toggle
          label="Enable Maintenance Mode"
          desc="Storefront visitors see a maintenance message. /admin is unaffected."
          enabled={ext.maintenanceMode}
          onToggle={() => updateExt("maintenanceMode")(!ext.maintenanceMode)}
        />
        {ext.maintenanceMode && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <p className="text-xs font-bold text-amber-700">⚠ Maintenance mode is ON — your store is not visible to customers.</p>
          </div>
        )}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Custom Message</label>
          <textarea
            rows={3}
            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none"
            value={ext.maintenanceMessage}
            onChange={(e) => updateExt("maintenanceMessage")(e.target.value)}
            placeholder="We'll be back soon…"
          />
        </div>
        <button onClick={saveExt} className="flex items-center gap-2 px-5 py-2 text-xs font-bold text-white rounded-lg border-none cursor-pointer transition-colors" style={{ background: ext.maintenanceMode ? "#ef4444" : extSaved ? "#10b981" : "#111827" }}>
          {extSaved ? <><Check size={13} />Saved!</> : ext.maintenanceMode ? "Save (Store is DOWN)" : "Save Settings"}
        </button>
      </div>

      {/* Data Backup */}
      <DataBackup />

      {/* Actions */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={handleReset}
          className="px-4 py-2.5 text-sm font-semibold text-red-600 border border-red-200 rounded-lg hover:bg-red-50 bg-transparent cursor-pointer transition-colors"
        >
          Reset All Data
        </button>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-white rounded-lg border-none cursor-pointer transition-colors"
          style={{ background: saved ? "#10b981" : "#111827" }}
        >
          {saved ? <><Check size={16} /> Saved!</> : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
