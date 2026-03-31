import React, { useState } from "react";
import { useAdmin } from "../AdminContext";
import type { StoreSettings } from "../AdminContext";
import { Check, Eye, EyeOff, X } from "lucide-react";
import { getPaymentSettings, savePaymentSettings, type PaymentSettings, getTickerMessages, saveTickerMessages } from "@/data/liveData";

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

  const update = (field: keyof StoreSettings) => (val: string) => {
    setForm((f) => ({ ...f, [field]: field === "freeShippingThreshold" ? parseFloat(val) || 0 : val }));
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
        <Field label="Currency Symbol" value={form.currency} onChange={update("currency")} placeholder="$" />
        <Field label="Free Shipping Threshold ($)" value={form.freeShippingThreshold} onChange={update("freeShippingThreshold")} type="number" />
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
                placeholder="E.G. FREE SHIPPING ON ORDERS ABOVE $100"
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
