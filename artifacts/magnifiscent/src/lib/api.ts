const API_BASE = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? "/api";

function getToken(): string {
  return sessionStorage.getItem("admin_api_token") ?? "";
}

export function setToken(token: string): void {
  sessionStorage.setItem("admin_api_token", token);
}

export function clearToken(): void {
  sessionStorage.removeItem("admin_api_token");
}

export function hasToken(): boolean {
  return Boolean(sessionStorage.getItem("admin_api_token"));
}

async function request<T = unknown>(
  path: string,
  options: RequestInit = {},
  auth = false
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> ?? {}),
  };
  if (auth) {
    const token = getToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }
  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.error ?? `HTTP ${res.status}`);
  }
  return data as T;
}

function get<T>(path: string, auth = false) {
  return request<T>(path, { method: "GET" }, auth);
}

function post<T>(path: string, body: unknown, auth = false) {
  return request<T>(path, { method: "POST", body: JSON.stringify(body) }, auth);
}

function put<T>(path: string, body: unknown, auth = false) {
  return request<T>(path, { method: "PUT", body: JSON.stringify(body) }, auth);
}

function patch<T>(path: string, body: unknown, auth = false) {
  return request<T>(path, { method: "PATCH", body: JSON.stringify(body) }, auth);
}

function del<T>(path: string, auth = false) {
  return request<T>(path, { method: "DELETE" }, auth);
}

export type ApiProduct = {
  id: number;
  slug: string;
  name: string;
  category: "men" | "women";
  price: string;
  priceNum: number;
  originalPrice: string;
  originalPriceNum: number;
  desc: string;
  notes: string[];
  size: string;
  stock: number;
  active: boolean;
  img: string;
  img2: string;
  rating: number;
  reviews: number;
};

export type ApiOrder = {
  id: string;
  customer: { name: string; email: string; phone: string; address: string };
  total: number;
  status: string;
  date: string;
  paymentMethod: string;
  items?: Array<{ productId: number; productName: string; qty: number; price: number }>;
};

export type ApiDeal = {
  id: string;
  name: string;
  contains: string[];
  price: number;
  originalPrice: number;
  discount: number;
  active: boolean;
};

export type ApiStoreSettings = {
  storeName: string;
  email: string;
  phone: string;
  currency: string;
  freeShippingThreshold: number;
  instagramUrl: string;
  twitterUrl: string;
  facebookUrl: string;
};

export type ApiExtendedSettings = {
  seoTitle: string;
  seoDescription: string;
  seoOgImage: string;
  shippingRate: number;
  shippingCarrier: string;
  taxRate: number;
  showTaxInCart: boolean;
  ga4Id: string;
  fbPixelId: string;
  maintenanceMode: boolean;
  maintenanceMessage: string;
};

export type ApiPaymentSettings = { cod: boolean; card: boolean };

export type ApiBlogPost = {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  published: boolean;
  createdAt: string;
};

export type ApiDiscountCode = {
  id: string;
  code: string;
  type: "percent" | "fixed";
  value: number;
  minOrder: number;
  maxUses: number;
  usedCount: number;
  active: boolean;
  expiry: string;
};

export const api = {
  admin: {
    login: (password: string) =>
      post<{ success: boolean; token: string }>("/admin/login", { password }),
    changePassword: (currentPassword: string, newPassword: string) =>
      post<{ success: boolean }>("/admin/change-password", { currentPassword, newPassword }, true),
    publish: () =>
      post<{ success: boolean; publishedAt: string }>("/admin/publish", {}, true),
  },

  products: {
    list: () => get<{ success: boolean; products: ApiProduct[] }>("/products"),
    listAll: () => get<{ success: boolean; products: ApiProduct[] }>("/products?all=true", true),
    get: (slug: string) => get<{ success: boolean; product: ApiProduct }>(`/products/${slug}`),
    create: (data: Partial<ApiProduct>) =>
      post<{ success: boolean; product: ApiProduct }>("/products", data, true),
    patch: (id: number, data: Partial<ApiProduct>) =>
      patch<{ success: boolean; product: ApiProduct }>(`/products/${id}`, data, true),
    delete: (id: number) =>
      del<{ success: boolean }>(`/products/${id}`, true),
  },

  orders: {
    list: () => get<{ success: boolean; orders: ApiOrder[] }>("/orders", true),
    create: (order: Omit<ApiOrder, "items"> & { items: Array<{ productId: number; productName: string; qty: number; price: number }> }) =>
      post<{ success: boolean; orderId: string }>("/orders", order),
    updateStatus: (id: string, status: string) =>
      patch<{ success: boolean; order: ApiOrder }>(`/orders/${id}/status`, { status }, true),
  },

  deals: {
    list: () => get<{ success: boolean; deals: ApiDeal[] }>("/deals"),
    listAll: () => get<{ success: boolean; deals: ApiDeal[] }>("/deals?all=true", true),
    create: (data: ApiDeal) =>
      post<{ success: boolean; deal: ApiDeal }>("/deals", data, true),
    patch: (id: string, data: Partial<ApiDeal>) =>
      patch<{ success: boolean; deal: ApiDeal }>(`/deals/${id}`, data, true),
    delete: (id: string) =>
      del<{ success: boolean }>(`/deals/${id}`, true),
  },

  settings: {
    get: () =>
      get<{ success: boolean; settings: { store: ApiStoreSettings | null; extended: ApiExtendedSettings | null; payment: ApiPaymentSettings | null } }>("/settings", true),
    put: (data: { store?: Partial<ApiStoreSettings>; extended?: Partial<ApiExtendedSettings>; payment?: ApiPaymentSettings }) =>
      put<{ success: boolean }>("/settings", data, true),
  },

  discountCodes: {
    list: () => get<{ success: boolean; codes: ApiDiscountCode[] }>("/discount-codes", true),
    create: (code: ApiDiscountCode) =>
      post<{ success: boolean; discount: ApiDiscountCode }>("/discount-codes", code, true),
    patch: (id: string, data: Partial<ApiDiscountCode>) =>
      patch<{ success: boolean; discount: ApiDiscountCode }>(`/discount-codes/${id}`, data, true),
    delete: (id: string) =>
      del<{ success: boolean }>(`/discount-codes/${id}`, true),
    apply: (code: string, subtotal: number) =>
      post<{ valid: boolean; discount: number; message: string }>("/discount-codes/apply", { code, subtotal }),
  },

  content: {
    heroSlides: {
      get: () => get<{ success: boolean; slides: Array<{ id: string; src: string; alt: string; position: number }> }>("/hero-slides"),
      put: (slides: Array<{ id: string; src: string; alt?: string }>) =>
        put<{ success: boolean }>("/hero-slides", { slides }, true),
    },
    genderBanners: {
      get: () => get<{ success: boolean; banners: { men: string; women: string } }>("/gender-banners"),
      put: (men: string, women: string) =>
        put<{ success: boolean }>("/gender-banners", { men, women }, true),
    },
    notesImages: {
      get: () => get<{ success: boolean; notesImages: Record<string, string> }>("/notes-images"),
      put: (notesImages: Record<string, string>) =>
        put<{ success: boolean }>("/notes-images", { notesImages }, true),
    },
    dealImages: {
      get: () => get<{ success: boolean; dealImages: Record<string, { img1: string; img2: string }> }>("/deal-images"),
      put: (dealImages: Record<string, { img1?: string; img2?: string }>) =>
        put<{ success: boolean }>("/deal-images", { dealImages }, true),
    },
    productImages: {
      get: () => get<{ success: boolean; productImages: Record<string, { img: string; img2: string }> }>("/product-images"),
      put: (productImages: Record<string, { img: string; img2: string }>) =>
        put<{ success: boolean }>("/product-images", { productImages }, true),
    },
    tickerMessages: {
      get: () => get<{ success: boolean; messages: string[] }>("/ticker-messages"),
      put: (messages: string[]) =>
        put<{ success: boolean }>("/ticker-messages", { messages }, true),
    },
    instagramReels: {
      get: () => get<{ success: boolean; reels: Array<{ id: string; url: string; img: string; label: string; likes: number; position: number }> }>("/instagram-reels"),
      put: (reels: Array<{ id: string; url: string; img: string; label: string; likes: number }>) =>
        put<{ success: boolean }>("/instagram-reels", { reels }, true),
    },
    homeHeadings: {
      get: () => get<{ success: boolean; headings: Record<string, string> | null }>("/home-headings"),
      put: (headings: Record<string, string>) =>
        put<{ success: boolean }>("/home-headings", { headings }, true),
    },
    policyPages: {
      get: () => get<{ success: boolean; pages: Array<{ key: string; title: string; content: string }> }>("/policy-pages"),
      getOne: (key: string) => get<{ success: boolean; page: { key: string; title: string; content: string } }>(`/policy-pages/${key}`),
      put: (pages: Record<string, { title: string; content: string }>) =>
        put<{ success: boolean }>("/policy-pages", { pages }, true),
    },
  },

  emailConfig: {
    get: () => get<{ success: boolean; config: unknown }>("/email-config", true),
    put: (config: unknown) =>
      put<{ success: boolean }>("/email-config", config, true),
  },

  sendEmail: {
    test: (customerEmail: string) =>
      post<{ success: boolean; messageId?: string; error?: string }>("/send-email", { type: "test", customerEmail }),
    orderConfirmation: (payload: {
      orderId: string;
      customerEmail: string;
      customerName: string;
      orderTotal: string;
      items: Array<{ name: string; qty: number; price: number }>;
      variables?: Record<string, string>;
    }) =>
      post<{ success: boolean }>("/send-email", { type: "order_confirmation", ...payload }),
  },

  blog: {
    list: () =>
      get<{ success: boolean; posts: ApiBlogPost[] }>("/blog"),
    get: (slug: string) =>
      get<{ success: boolean; post: ApiBlogPost }>(`/blog/${slug}`),
  },

  adminBlog: {
    list: () =>
      get<{ success: boolean; posts: ApiBlogPost[] }>("/admin/blog", true),
    create: (data: Partial<ApiBlogPost>) =>
      post<{ success: boolean; post: ApiBlogPost }>("/admin/blog", data, true),
    update: (id: number, data: Partial<ApiBlogPost>) =>
      put<{ success: boolean; post: ApiBlogPost }>(`/admin/blog/${id}`, data, true),
    delete: (id: number) =>
      del<{ success: boolean }>(`/admin/blog/${id}`, true),
  },
};
