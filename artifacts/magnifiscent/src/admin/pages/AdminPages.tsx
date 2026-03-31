import React, { useState } from "react";
import { FileText, Save, RotateCcw } from "lucide-react";
import {
  getPolicyPages,
  savePolicyPages,
  DEFAULT_POLICY_PAGES,
} from "@/data/liveData";
import type { PolicyPages } from "@/data/liveData";

type PageKey = keyof PolicyPages;

const PAGE_TABS: { key: PageKey; label: string; icon: string }[] = [
  { key: "returns", label: "Returns Policy", icon: "↩" },
  { key: "shipping", label: "Shipping Info", icon: "🚚" },
  { key: "privacy", label: "Privacy Policy", icon: "🔒" },
  { key: "terms", label: "Terms of Service", icon: "📋" },
];

export function AdminPages() {
  const [activeTab, setActiveTab] = useState<PageKey>("returns");
  const [pages, setPages] = useState<PolicyPages>(() => getPolicyPages());
  const [saved, setSaved] = useState<PageKey | null>(null);

  function handleChange(key: PageKey, field: "title" | "content", value: string) {
    setPages((prev) => ({
      ...prev,
      [key]: { ...prev[key], [field]: value },
    }));
  }

  function handleSave(key: PageKey) {
    savePolicyPages(pages);
    setSaved(key);
    setTimeout(() => setSaved(null), 2000);
  }

  function handleReset(key: PageKey) {
    if (!window.confirm(`Reset "${PAGE_TABS.find((t) => t.key === key)?.label}" to default content? This cannot be undone.`)) return;
    const reset: PolicyPages = {
      ...pages,
      [key]: { ...DEFAULT_POLICY_PAGES[key] },
    };
    setPages(reset);
    savePolicyPages(reset);
    setSaved(key);
    setTimeout(() => setSaved(null), 2000);
  }

  const currentPage = pages[activeTab];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <FileText size={22} className="text-gray-700" />
        <div>
          <h2 className="text-lg font-bold text-gray-900">Policy Pages</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Edit the content of your storefront policy and information pages. Changes are saved immediately.
          </p>
        </div>
      </div>

      {/* Tab bar */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="flex border-b border-gray-200 overflow-x-auto">
          {PAGE_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className="flex items-center gap-2 px-5 py-3.5 text-sm font-medium whitespace-nowrap transition-colors border-b-2 -mb-px"
              style={{
                borderBottomColor: activeTab === tab.key ? "#111827" : "transparent",
                color: activeTab === tab.key ? "#111827" : "#6b7280",
                background: "transparent",
              }}
            >
              <span className="text-base leading-none">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Editor */}
        <div className="p-6 space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
              Page Title
            </label>
            <input
              type="text"
              value={currentPage.title}
              onChange={(e) => handleChange(activeTab, "title", e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-gray-400 transition-colors"
              placeholder="Page title as shown in the header"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-500">
                Page Content
              </label>
              <span className="text-xs text-gray-400">
                Plain text — blank lines create paragraph breaks
              </span>
            </div>
            <textarea
              value={currentPage.content}
              onChange={(e) => handleChange(activeTab, "content", e.target.value)}
              rows={22}
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-gray-400 transition-colors resize-y leading-relaxed font-mono"
              placeholder="Write the page content here…"
              style={{ fontFamily: "ui-monospace, monospace", fontSize: "13px" }}
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-1">
            <button
              onClick={() => handleSave(activeTab)}
              className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-gray-700 transition-colors border-none cursor-pointer"
            >
              <Save size={14} />
              {saved === activeTab ? "Saved!" : "Save Changes"}
            </button>
            <button
              onClick={() => handleReset(activeTab)}
              className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 text-gray-500 text-xs font-medium rounded-lg hover:border-gray-400 hover:text-gray-700 transition-colors bg-white cursor-pointer"
            >
              <RotateCcw size={13} />
              Reset to Default
            </button>
            <a
              href={`/${activeTab === "returns" ? "returns" : activeTab === "shipping" ? "shipping" : activeTab === "privacy" ? "privacy" : "terms"}`}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto text-xs text-gray-400 hover:text-gray-700 underline underline-offset-2 transition-colors"
            >
              View live page ↗
            </a>
          </div>

          {saved === activeTab && (
            <div className="flex items-center gap-2 text-emerald-600 text-xs font-medium">
              <span>✓</span>
              Changes saved and live on your storefront
            </div>
          )}
        </div>
      </div>

      {/* Info card */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">
        <h4 className="text-xs font-bold uppercase tracking-widest text-blue-700 mb-2">How it works</h4>
        <ul className="text-xs text-blue-600 space-y-1.5 leading-relaxed">
          <li>• Changes you save here update the live storefront pages instantly</li>
          <li>• Use blank lines to separate paragraphs and ALL CAPS lines for section headings</li>
          <li>• Use "Reset to Default" to restore the original MagnifiScent template for any page</li>
          <li>• These pages are linked from the footer of your store</li>
        </ul>
      </div>
    </div>
  );
}
