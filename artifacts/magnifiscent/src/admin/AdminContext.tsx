import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { api, setToken, clearToken, hasToken } from "@/lib/api";
import type { ApiProduct, ApiOrder, ApiDeal, ApiStoreSettings } from "@/lib/api";

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

export type AdminProduct = ApiProduct;

export type DealAdmin = ApiDeal;

export type StoreSettings = ApiStoreSettings;

type AdminContextType = {
  isAuthenticated: boolean;
  login: (password: string) => Promise<boolean>;
  logout: () => void;
  products: AdminProduct[];
  setProducts: (updater: AdminProduct[] | ((prev: AdminProduct[]) => AdminProduct[])) => void;
  orders: Order[];
  setOrders: (updater: Order[] | ((prev: Order[]) => Order[])) => void;
  deals: DealAdmin[];
  setDeals: (updater: DealAdmin[] | ((prev: DealAdmin[]) => DealAdmin[])) => void;
  settings: StoreSettings;
  setSettings: (s: StoreSettings) => void;
  loading: boolean;
  refreshOrders: () => Promise<void>;
};

const AdminContext = createContext<AdminContextType | null>(null);

const DEFAULT_SETTINGS: StoreSettings = {
  storeName: "MagnifiScent",
  email: "hello@magnifiscent.com",
  phone: "+1 (800) 555-0199",
  currency: "Rs.",
  freeShippingThreshold: 100,
  instagramUrl: "https://instagram.com/magnifiscent",
  twitterUrl: "https://twitter.com/magnifiscent",
  facebookUrl: "https://facebook.com/magnifiscent",
  adminPassword: "admin123",
};

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(hasToken);
  const [products, setProductsState] = useState<AdminProduct[]>([]);
  const [orders, setOrdersState] = useState<Order[]>([]);
  const [deals, setDealsState] = useState<DealAdmin[]>([]);
  const [settings, setSettingsState] = useState<StoreSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(false);

  const loadAdminData = useCallback(async () => {
    if (!hasToken()) return;
    setLoading(true);
    try {
      const [productsRes, ordersRes, dealsRes, settingsRes] = await Promise.allSettled([
        api.products.list(),
        api.orders.list(),
        api.deals.list(),
        api.settings.get(),
      ]);

      if (productsRes.status === "fulfilled" && productsRes.value.success) {
        const allProductsRes = await api.products.listAll().catch(() => productsRes.value);
        setProductsState(allProductsRes.products ?? productsRes.value.products);
      }

      if (ordersRes.status === "fulfilled" && ordersRes.value.success) {
        setOrdersState(ordersRes.value.orders as Order[]);
      }

      if (dealsRes.status === "fulfilled" && dealsRes.value.success) {
        setDealsState(dealsRes.value.deals);
      }

      if (settingsRes.status === "fulfilled" && settingsRes.value.success) {
        const s = settingsRes.value.settings;
        if (s.store) {
          setSettingsState((prev) => ({ ...prev, ...s.store }));
        }
      }
    } catch {
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadAdminData();
    }
  }, [isAuthenticated, loadAdminData]);

  const login = useCallback(async (password: string): Promise<boolean> => {
    try {
      const res = await api.admin.login(password);
      if (res.success && res.token) {
        setToken(res.token);
        setIsAuthenticated(true);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    clearToken();
    setIsAuthenticated(false);
    setProductsState([]);
    setOrdersState([]);
    setDealsState([]);
    setSettingsState(DEFAULT_SETTINGS);
  }, []);

  const refreshOrders = useCallback(async () => {
    try {
      const res = await api.orders.list();
      if (res.success) setOrdersState(res.orders as Order[]);
    } catch {}
  }, []);

  const setProducts = useCallback(
    (updater: AdminProduct[] | ((prev: AdminProduct[]) => AdminProduct[])) => {
      setProductsState((prev) => {
        const next = typeof updater === "function" ? updater(prev) : updater;
        next.forEach((p) => {
          api.products.patch(p.id, {
            name: p.name,
            priceNum: p.priceNum,
            price: p.price,
            originalPriceNum: p.originalPriceNum,
            originalPrice: p.originalPrice,
            stock: p.stock,
            active: p.active,
            desc: p.desc,
            notes: p.notes,
            img: p.img,
            img2: p.img2,
          }).catch(() => {});
        });
        return next;
      });
    },
    []
  );

  const setOrders = useCallback(
    (updater: Order[] | ((prev: Order[]) => Order[])) => {
      setOrdersState((prev) => {
        const next = typeof updater === "function" ? updater(prev) : updater;
        const changed = next.filter((n) => {
          const old = prev.find((o) => o.id === n.id);
          return old && old.status !== n.status;
        });
        changed.forEach((o) => {
          api.orders.updateStatus(o.id, o.status).catch(() => {});
        });
        return next;
      });
    },
    []
  );

  const setDeals = useCallback(
    (updater: DealAdmin[] | ((prev: DealAdmin[]) => DealAdmin[])) => {
      setDealsState((prev) => {
        const next = typeof updater === "function" ? updater(prev) : updater;
        next.forEach((deal) => {
          const old = prev.find((d) => d.id === deal.id);
          if (!old) return;
          const changed =
            old.price !== deal.price ||
            old.originalPrice !== deal.originalPrice ||
            old.discount !== deal.discount ||
            old.active !== deal.active;
          if (changed) {
            api.deals.patch(deal.id, {
              price: deal.price,
              originalPrice: deal.originalPrice,
              discount: deal.discount,
              active: deal.active,
            }).catch(() => {});
          }
        });
        return next;
      });
    },
    []
  );

  const setSettings = useCallback((s: StoreSettings) => {
    setSettingsState(s);
    api.settings.put({ store: s }).catch(() => {});
  }, []);

  return (
    <AdminContext.Provider value={{
      isAuthenticated,
      login,
      logout,
      products,
      setProducts,
      orders,
      setOrders,
      deals,
      setDeals,
      settings,
      setSettings,
      loading,
      refreshOrders,
    }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin must be used inside AdminProvider");
  return ctx;
}
