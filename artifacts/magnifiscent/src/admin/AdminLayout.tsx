import React, { useState } from "react";
import { useLocation } from "wouter";
import { useAdmin } from "./AdminContext";
import { api } from "@/lib/api";
import {
  LayoutDashboard, Package, ShoppingBag, Users, Warehouse,
  Tag, Settings, LogOut, Menu, Crown, Image, Instagram, FileText, Mail,
  Globe, CheckCircle, Loader2, ArrowUpDown,
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/admin" },
  { label: "Products", icon: Package, path: "/admin/products" },
  { label: "Orders", icon: ShoppingBag, path: "/admin/orders" },
  { label: "Customers", icon: Users, path: "/admin/customers" },
  { label: "Inventory", icon: Warehouse, path: "/admin/inventory" },
  { label: "Deals", icon: Tag, path: "/admin/deals" },
  { label: "Media", icon: Image, path: "/admin/media" },
  { label: "Instagram", icon: Instagram, path: "/admin/instagram" },
  { label: "Pages", icon: FileText, path: "/admin/pages" },
  { label: "Email", icon: Mail, path: "/admin/email" },
  { label: "Export / Import", icon: ArrowUpDown, path: "/admin/export" },
  { label: "Settings", icon: Settings, path: "/admin/settings" },
];

type PublishState = "idle" | "publishing" | "live" | "error";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [location, navigate] = useLocation();
  const { logout, settings } = useAdmin();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [publishState, setPublishState] = useState<PublishState>("idle");

  const handleLogout = () => {
    logout();
    navigate("/admin");
  };

  const handlePublish = async () => {
    if (publishState === "publishing") return;
    setPublishState("publishing");
    try {
      await api.admin.publish();
      setPublishState("live");
      setTimeout(() => setPublishState("idle"), 3000);
    } catch {
      setPublishState("error");
      setTimeout(() => setPublishState("idle"), 3000);
    }
  };

  const isActive = (path: string) => {
    if (path === "/admin") return location === "/admin";
    return location.startsWith(path);
  };

  const SidebarContent = () => (
    <>
      <div className="flex items-center gap-2 px-6 py-5 border-b border-gray-700">
        <Crown size={20} className="text-amber-400" />
        <span className="font-bold text-white text-lg tracking-wide">{settings.storeName}</span>
        <span className="ml-auto text-xs text-gray-400 font-medium uppercase tracking-wider">Admin</span>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {NAV_ITEMS.map(({ label, icon: Icon, path }) => (
          <button
            key={path}
            onClick={() => { navigate(path); setSidebarOpen(false); }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left"
            style={{
              background: isActive(path) ? "rgba(255,255,255,0.1)" : "transparent",
              color: isActive(path) ? "#fff" : "rgba(255,255,255,0.6)",
            }}
          >
            <Icon size={18} />
            {label}
          </button>
        ))}
      </nav>
      <div className="px-3 pb-4">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
          style={{ color: "rgba(255,255,255,0.5)" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#ef4444")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.5)")}
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Desktop sidebar */}
      <aside
        className="hidden md:flex flex-col w-56 flex-shrink-0"
        style={{ background: "#111827" }}
      >
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setSidebarOpen(false)} />
          <aside
            className="absolute left-0 top-0 h-full w-56 flex flex-col"
            style={{ background: "#111827" }}
          >
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Top header */}
        <header className="flex items-center gap-4 px-4 md:px-6 py-4 bg-white border-b border-gray-200 flex-shrink-0">
          <button
            className="md:hidden p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={20} />
          </button>
          <h1 className="font-semibold text-gray-800 text-base">
            {NAV_ITEMS.find((n) => isActive(n.path))?.label ?? "Admin"}
          </h1>
          <div className="ml-auto flex items-center gap-3">
            <button
              onClick={() => window.open("/", "_blank")}
              className="text-xs font-medium text-gray-500 hover:text-gray-900 underline underline-offset-2 bg-transparent border-none cursor-pointer hidden sm:block"
            >
              View Store
            </button>

            {/* Publish button */}
            <button
              onClick={handlePublish}
              disabled={publishState === "publishing"}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-md border-none cursor-pointer transition-all"
              style={{
                background:
                  publishState === "live" ? "#16a34a"
                  : publishState === "error" ? "#dc2626"
                  : publishState === "publishing" ? "#d97706"
                  : "#f59e0b",
                color: "#fff",
                opacity: publishState === "publishing" ? 0.8 : 1,
                cursor: publishState === "publishing" ? "not-allowed" : "pointer",
              }}
            >
              {publishState === "publishing" && <Loader2 size={13} className="animate-spin" />}
              {publishState === "live" && <CheckCircle size={13} />}
              {(publishState === "idle" || publishState === "error") && <Globe size={13} />}
              {publishState === "publishing" ? "Publishing..." : publishState === "live" ? "Live!" : publishState === "error" ? "Failed" : "Publish"}
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-xs font-medium text-red-500 hover:text-red-700 bg-transparent border-none cursor-pointer"
            >
              <LogOut size={14} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
