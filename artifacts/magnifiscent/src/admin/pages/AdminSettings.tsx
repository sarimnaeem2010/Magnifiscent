import React, { useState } from "react";
import { useAdmin } from "../AdminContext";
import type { StoreSettings } from "../AdminContext";
import { Check, Eye, EyeOff } from "lucide-react";

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

export function AdminSettings() {
  const { settings, setSettings, logout } = useAdmin();
  const [form, setForm] = useState<StoreSettings>({ ...settings });
  const [saved, setSaved] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [confirmPw, setConfirmPw] = useState("");
  const [pwError, setPwError] = useState("");

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
