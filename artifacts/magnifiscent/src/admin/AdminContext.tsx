import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { PRODUCTS } from "@/data/products";
import type { Product } from "@/data/products";

export type OrderStatus = "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";

export type OrderItem = {
  productId: number;
  productName: string;
  qty: number;
  price: number;
};

export type Order = {
  id: string;
  customer: { name: string; email: string; phone: string; address: string };
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  date: string;
  paymentMethod: string;
};

export type AdminProduct = Product & { stock: number; active: boolean };

export type DealAdmin = {
  id: string;
  name: string;
  contains: string[];
  price: number;
  originalPrice: number;
  active: boolean;
  discount: number;
};

export type StoreSettings = {
  storeName: string;
  email: string;
  phone: string;
  currency: string;
  freeShippingThreshold: number;
  instagramUrl: string;
  twitterUrl: string;
  facebookUrl: string;
  adminPassword: string;
};

type AdminContextType = {
  isAuthenticated: boolean;
  login: (password: string) => boolean;
  logout: () => void;
  products: AdminProduct[];
  setProducts: React.Dispatch<React.SetStateAction<AdminProduct[]>>;
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  deals: DealAdmin[];
  setDeals: React.Dispatch<React.SetStateAction<DealAdmin[]>>;
  settings: StoreSettings;
  setSettings: React.Dispatch<React.SetStateAction<StoreSettings>>;
};

const AdminContext = createContext<AdminContextType | null>(null);

const DEFAULT_PASSWORD = "admin123";

const DEFAULT_SETTINGS: StoreSettings = {
  storeName: "MagnifiScent",
  email: "hello@magnifiscent.com",
  phone: "+1 (800) 555-0199",
  currency: "Rs.",
  freeShippingThreshold: 100,
  instagramUrl: "https://instagram.com/magnifiscent",
  twitterUrl: "https://twitter.com/magnifiscent",
  facebookUrl: "https://facebook.com/magnifiscent",
  adminPassword: DEFAULT_PASSWORD,
};

const DEFAULT_DEALS: DealAdmin[] = [
  { id: "iconic-duo", name: "The Iconic Duo", contains: ["QUEST", "CHIC"], price: 149, originalPrice: 178, active: true, discount: 16 },
  { id: "floral-dream", name: "Floral Dream Pack", contains: ["CHIC", "SIGMA"], price: 159, originalPrice: 204, active: true, discount: 22 },
  { id: "dark-allure", name: "Dark Allure Duo", contains: ["Dark Angel", "Allure"], price: 189, originalPrice: 224, active: true, discount: 16 },
  { id: "fresh-bloom", name: "Fresh Bloom Duo", contains: ["Rising Sun", "CHIC"], price: 139, originalPrice: 164, active: true, discount: 15 },
  { id: "womens-trio", name: "Women's Signature Trio", contains: ["CHIC", "Dark Angel", "SIGMA"], price: 259, originalPrice: 333, active: true, discount: 22 },
  { id: "floral-trio", name: "Floral Trio", contains: ["CHIC", "SIGMA", "Rising Sun"], price: 239, originalPrice: 289, active: true, discount: 17 },
];

function generateMockOrders(): Order[] {
  const names = [
    "Sarah Mitchell", "James Kowalski", "Layla Hassan", "Omar Akhtar",
    "Emma Richardson", "Khalid Bensaid", "Priya Nair", "Lucas Fernandez",
    "Fatima Al-Rashid", "Noah Thompson", "Amina Diallo", "Carlos Rivera",
  ];
  const emails = names.map((n) => n.toLowerCase().replace(" ", ".") + "@email.com");
  const statuses: OrderStatus[] = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];
  const products = [
    { productId: 1, productName: "CHIC", price: 89 },
    { productId: 2, productName: "Dark Angel", price: 109 },
    { productId: 3, productName: "Rising Sun", price: 75 },
    { productId: 4, productName: "SIGMA", price: 95 },
    { productId: 5, productName: "QUEST", price: 89 },
    { productId: 6, productName: "Allure", price: 99 },
  ];
  const methods = ["Credit Card", "PayPal", "Apple Pay", "Debit Card"];

  const orders: Order[] = [];
  const now = new Date();

  for (let i = 0; i < 18; i++) {
    const name = names[i % names.length];
    const email = emails[i % emails.length];
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const numItems = Math.floor(Math.random() * 3) + 1;
    const items: OrderItem[] = [];
    const usedProducts = new Set<number>();
    for (let j = 0; j < numItems; j++) {
      let prod = products[Math.floor(Math.random() * products.length)];
      let attempts = 0;
      while (usedProducts.has(prod.productId) && attempts < 10) {
        prod = products[Math.floor(Math.random() * products.length)];
        attempts++;
      }
      usedProducts.add(prod.productId);
      items.push({ ...prod, qty: Math.floor(Math.random() * 2) + 1 });
    }
    const total = items.reduce((sum, it) => sum + it.price * it.qty, 0);
    orders.push({
      id: `MS-${1000 + i}`,
      customer: {
        name,
        email,
        phone: `+1 (${Math.floor(Math.random() * 900) + 100}) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
        address: `${Math.floor(Math.random() * 999) + 1} Main St, City, State ${10000 + i}`,
      },
      items,
      total,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      date: date.toISOString().split("T")[0],
      paymentMethod: methods[i % methods.length],
    });
  }
  return orders.sort((a, b) => b.date.localeCompare(a.date));
}

function initProducts(): AdminProduct[] {
  const stored = localStorage.getItem("admin_products");
  if (stored) return JSON.parse(stored);
  const initial = PRODUCTS.map((p) => ({ ...p, stock: Math.floor(Math.random() * 40) + 10, active: true }));
  localStorage.setItem("admin_products", JSON.stringify(initial));
  return initial;
}

function initOrders(): Order[] {
  const stored = localStorage.getItem("admin_orders");
  if (stored) return JSON.parse(stored);
  const orders = generateMockOrders();
  localStorage.setItem("admin_orders", JSON.stringify(orders));
  return orders;
}

function initDeals(): DealAdmin[] {
  const stored = localStorage.getItem("admin_deals");
  if (stored) return JSON.parse(stored);
  localStorage.setItem("admin_deals", JSON.stringify(DEFAULT_DEALS));
  return DEFAULT_DEALS;
}

function initSettings(): StoreSettings {
  const stored = localStorage.getItem("admin_settings");
  if (stored) {
    const parsed: StoreSettings = JSON.parse(stored);
    if (parsed.currency === "$" || parsed.currency === "Rs" || !parsed.currency) {
      parsed.currency = "Rs.";
      localStorage.setItem("admin_settings", JSON.stringify(parsed));
    }
    return parsed;
  }
  localStorage.setItem("admin_settings", JSON.stringify(DEFAULT_SETTINGS));
  return DEFAULT_SETTINGS;
}

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem("admin_auth") === "true";
  });
  const [products, setProducts] = useState<AdminProduct[]>(initProducts);
  const [orders, setOrders] = useState<Order[]>(initOrders);
  const [deals, setDeals] = useState<DealAdmin[]>(initDeals);
  const [settings, setSettings] = useState<StoreSettings>(initSettings);

  useEffect(() => { localStorage.setItem("admin_products", JSON.stringify(products)); }, [products]);
  useEffect(() => { localStorage.setItem("admin_orders", JSON.stringify(orders)); }, [orders]);
  useEffect(() => { localStorage.setItem("admin_deals", JSON.stringify(deals)); }, [deals]);
  useEffect(() => { localStorage.setItem("admin_settings", JSON.stringify(settings)); }, [settings]);

  const login = useCallback((password: string): boolean => {
    const storedSettings = localStorage.getItem("admin_settings");
    const pw = storedSettings ? JSON.parse(storedSettings).adminPassword : DEFAULT_PASSWORD;
    if (password === pw) {
      sessionStorage.setItem("admin_auth", "true");
      setIsAuthenticated(true);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem("admin_auth");
    setIsAuthenticated(false);
  }, []);

  return (
    <AdminContext.Provider value={{ isAuthenticated, login, logout, products, setProducts, orders, setOrders, deals, setDeals, settings, setSettings }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin must be used inside AdminProvider");
  return ctx;
}
