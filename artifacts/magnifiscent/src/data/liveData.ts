import { PRODUCTS } from "./products";
import type { Product } from "./products";

export type LiveProduct = Product & { stock: number; active: boolean };

/* ─── Media types ─── */
export type HeroSlide = { id: string; src: string; alt: string };
export type GenderBanners = { men: string; women: string };
export type NotesImages = Record<string, string>;
export type ProductCustomImages = Record<string, { img: string; img2: string }>;
export type DealCustomImages = Record<string, string>;

/* ─── Hero Slides ─── */
export function getHeroSlides(): HeroSlide[] {
  try {
    const s = localStorage.getItem("admin_hero_slides");
    if (s) return JSON.parse(s);
  } catch {}
  return [];
}
export function saveHeroSlides(slides: HeroSlide[]): void {
  localStorage.setItem("admin_hero_slides", JSON.stringify(slides));
}

/* ─── Gender Banners ─── */
export function getGenderBanners(): GenderBanners {
  try {
    const s = localStorage.getItem("admin_gender_banners");
    if (s) return JSON.parse(s);
  } catch {}
  return { men: "", women: "" };
}
export function saveGenderBanners(b: GenderBanners): void {
  localStorage.setItem("admin_gender_banners", JSON.stringify(b));
}

/* ─── Notes Images ─── */
export function getNotesImages(): NotesImages {
  try {
    const s = localStorage.getItem("admin_notes_images");
    if (s) return JSON.parse(s);
  } catch {}
  return {};
}
export function saveNotesImages(imgs: NotesImages): void {
  localStorage.setItem("admin_notes_images", JSON.stringify(imgs));
}

/* ─── Product Custom Images ─── */
export function getProductCustomImages(): ProductCustomImages {
  try {
    const s = localStorage.getItem("admin_product_images");
    if (s) return JSON.parse(s);
  } catch {}
  return {};
}
export function saveProductCustomImages(imgs: ProductCustomImages): void {
  localStorage.setItem("admin_product_images", JSON.stringify(imgs));
}

/* ─── Deal Custom Images ─── */
export function getDealCustomImages(): DealCustomImages {
  try {
    const s = localStorage.getItem("admin_deal_images");
    if (s) return JSON.parse(s);
  } catch {}
  return {};
}
export function saveDealCustomImages(imgs: DealCustomImages): void {
  localStorage.setItem("admin_deal_images", JSON.stringify(imgs));
}

export type AdminDealEntry = {
  id: string;
  name: string;
  contains: string[];
  price: number;
  originalPrice: number;
  active: boolean;
  discount: number;
};

export function getLiveProducts(): LiveProduct[] {
  const stored = localStorage.getItem("admin_products");
  if (stored) {
    try {
      const parsed: LiveProduct[] = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch {
    }
  }
  return PRODUCTS.map((p) => ({ ...p, stock: 20, active: true }));
}

export function getActiveProducts(): LiveProduct[] {
  return getLiveProducts().filter((p) => p.active);
}

export function getLiveProductBySlug(slug: string): LiveProduct | undefined {
  return getLiveProducts().find((p) => p.slug === slug);
}

export function getLiveRelated(product: LiveProduct): LiveProduct[] {
  return getLiveProducts()
    .filter((p) => p.id !== product.id && p.category === product.category && p.active)
    .slice(0, 4);
}

export function getAdminDeal(id: string): AdminDealEntry | null {
  const stored = localStorage.getItem("admin_deals");
  if (!stored) return null;
  try {
    const deals: AdminDealEntry[] = JSON.parse(stored);
    return deals.find((d) => d.id === id) ?? null;
  } catch {
    return null;
  }
}

export function getAdminDeals(): AdminDealEntry[] {
  const stored = localStorage.getItem("admin_deals");
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

export function useAdminDealMap(): Map<string, AdminDealEntry> {
  const deals = getAdminDeals();
  return new Map(deals.map((d) => [d.id, d]));
}
