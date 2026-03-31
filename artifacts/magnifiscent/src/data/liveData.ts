import { PRODUCTS } from "./products";
import type { Product } from "./products";

export type LiveProduct = Product & { stock: number; active: boolean };

/* ─── Media types ─── */
export type HeroSlide = { id: string; src: string; alt: string };
export type GenderBanners = { men: string; women: string };
export type NotesImages = Record<string, string>;
export type ProductCustomImages = Record<string, { img: string; img2: string }>;
export type DealCustomImages = Record<string, { img1?: string; img2?: string }>;

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

/* ─── Announcement Ticker ─── */
export const DEFAULT_TICKER_MESSAGES = [
  "FREE SHIPPING ON ORDERS ABOVE Rs. 100",
  "20 DAYS RETURN & REFUND POLICY",
  "100% AUTHENTIC FRAGRANCES",
];
export function getTickerMessages(): string[] {
  try {
    const s = localStorage.getItem("admin_ticker_messages");
    if (s) {
      const parsed = JSON.parse(s);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return [...DEFAULT_TICKER_MESSAGES];
}
export function saveTickerMessages(msgs: string[]): void {
  localStorage.setItem("admin_ticker_messages", JSON.stringify(msgs));
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

/* ─── Instagram Reels ─── */
export type InstagramReel = {
  id: string;
  url: string;
  img: string;
  label: string;
  likes: number;
};
export function getInstagramReels(): InstagramReel[] {
  try {
    const s = localStorage.getItem("admin_instagram_reels");
    if (s) return JSON.parse(s);
  } catch {}
  return [];
}
export function saveInstagramReels(reels: InstagramReel[]): void {
  localStorage.setItem("admin_instagram_reels", JSON.stringify(reels));
}

/* ─── Home Headings ─── */
export type HomeHeadings = {
  deals: string;
  dealsSubtitle: string;
  shopByGender: string;
  shopByGenderSubtitle: string;
  allProducts: string;
  allProductsSubtitle: string;
  shopByNotes: string;
  shopByNotesSubtitle: string;
  instagramTitle: string;
  instagramSubtitle: string;
  reviews: string;
  reviewsSubtitle: string;
  whyChoose: string;
  whyChooseSubtitle: string;
};
export const DEFAULT_HOME_HEADINGS: HomeHeadings = {
  deals: "Deals & Combo",
  dealsSubtitle: "Save more with our exclusive fragrance bundles",
  shopByGender: "Shop By Gender",
  shopByGenderSubtitle: "Curated collections crafted for him and for her",
  allProducts: "All Products",
  allProductsSubtitle: "Every scent in our signature collection",
  shopByNotes: "Shop By Notes",
  shopByNotesSubtitle: "Find your perfect fragrance by scent family",
  instagramTitle: "Scent That Spreads",
  instagramSubtitle: "Everyone's favourite MagnifiScent Fragrances",
  reviews: "Buyer's Reviews",
  reviewsSubtitle: "Real experiences from our fragrance community",
  whyChoose: "Why Choose MagnifiScent?",
  whyChooseSubtitle: "Authenticity, longevity, and luxury — without compromise",
};
export function getHomeHeadings(): HomeHeadings {
  try {
    const s = localStorage.getItem("admin_home_headings");
    if (s) return { ...DEFAULT_HOME_HEADINGS, ...JSON.parse(s) };
  } catch {}
  return { ...DEFAULT_HOME_HEADINGS };
}
export function saveHomeHeadings(h: HomeHeadings): void {
  localStorage.setItem("admin_home_headings", JSON.stringify(h));
}

/* ─── Payment Settings ─── */
export type PaymentSettings = { cod: boolean; card: boolean };
export function getPaymentSettings(): PaymentSettings {
  try {
    const s = localStorage.getItem("admin_payment_settings");
    if (s) return JSON.parse(s);
  } catch {}
  return { cod: true, card: true };
}
export function savePaymentSettings(s: PaymentSettings): void {
  localStorage.setItem("admin_payment_settings", JSON.stringify(s));
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

/* ─── Policy Pages ─── */
export type PolicyPage = {
  title: string;
  content: string;
};

export type PolicyPages = {
  returns: PolicyPage;
  shipping: PolicyPage;
  privacy: PolicyPage;
  terms: PolicyPage;
};

export const DEFAULT_POLICY_PAGES: PolicyPages = {
  returns: {
    title: "Returns Policy",
    content: `We want you to be completely satisfied with your MagnifiScent purchase. If you are not happy with your order, we accept returns within 20 days of the delivery date.

ELIGIBILITY FOR RETURNS

To be eligible for a return, your item must be:
- Unused and in the same condition that you received it
- In the original packaging, sealed and unopened
- Accompanied by the original receipt or proof of purchase

NON-RETURNABLE ITEMS

The following items cannot be returned:
- Opened or used perfume bottles
- Gift cards
- Sale or clearance items

HOW TO INITIATE A RETURN

1. Contact our customer support team at returns@magnifiscent.com or call us within 20 days of receiving your order
2. Provide your order number and reason for return
3. Our team will issue a Return Merchandise Authorisation (RMA) number
4. Ship the item back to us using a tracked courier service
5. Once we receive and inspect the item, we will process your refund within 5–7 business days

REFUND PROCESS

Approved refunds will be processed to the original payment method. Shipping charges are non-refundable unless the return is due to our error or a defective product.

EXCHANGES

We are happy to exchange an item for a different fragrance of equal value. Please contact us to arrange an exchange.

For any questions regarding our returns policy, please contact us at hello@magnifiscent.com.`,
  },
  shipping: {
    title: "Shipping Info",
    content: `MagnifiScent delivers across Pakistan using trusted courier partners. Here is everything you need to know about our shipping process.

DELIVERY PARTNERS

We ship via TCS Couriers and Leopard Courier — two of Pakistan's most reliable delivery networks.

DELIVERY TIMEFRAMES

- Major cities (Karachi, Lahore, Islamabad, Rawalpindi, Peshawar, Quetta): 2–3 business days
- Other cities and towns: 3–5 business days
- Remote areas: 5–7 business days

Please note that these are estimated delivery times. Delays may occur during public holidays or due to unforeseen circumstances.

SHIPPING CHARGES

- Standard shipping: Rs. 200 flat rate
- Free shipping on all orders above Rs. 2,500
- Shipping charges are calculated and displayed at checkout before payment

CASH ON DELIVERY (COD)

We offer Cash on Delivery across Pakistan. No advance payment is required — pay when your order arrives.

ORDER TRACKING

Once your order is dispatched, you will receive a tracking number via SMS and email (if email notifications are enabled). Use this number to track your parcel on the courier's website.

ORDER PROCESSING TIME

Orders are processed within 1–2 business days after placement. Orders placed on weekends or public holidays will be processed on the next business day.

INTERNATIONAL SHIPPING

At this time, we only ship within Pakistan. International shipping is not available.

If you have any questions about your shipment, please contact us at hello@magnifiscent.com or call us directly.`,
  },
  privacy: {
    title: "Privacy Policy",
    content: `MagnifiScent ("we", "us", or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your personal information when you visit our website or place an order.

INFORMATION WE COLLECT

When you make a purchase or register on our site, we may collect:
- Personal identification information: name, email address, phone number, billing and shipping address
- Payment information: we do not store full card details; payments are processed securely
- Order history and preferences
- Device and browsing data: IP address, browser type, pages visited (via cookies and analytics tools)

HOW WE USE YOUR INFORMATION

We use the information we collect to:
- Process and fulfil your orders
- Send order confirmations, shipping updates, and delivery notifications
- Respond to your enquiries and provide customer support
- Improve our website and product offerings
- Send promotional emails and offers (only if you have opted in)
- Comply with legal obligations

DATA SHARING

We do not sell, trade, or rent your personal information to third parties. We may share your data with:
- Courier and logistics partners solely for the purpose of delivering your order
- Payment processors for transaction processing
- Analytics providers to help us understand website usage (data is anonymised)

DATA SECURITY

We implement appropriate technical and organisational measures to protect your personal data against unauthorised access, alteration, disclosure, or destruction.

YOUR RIGHTS

You have the right to:
- Access the personal data we hold about you
- Request correction of inaccurate data
- Request deletion of your personal data
- Opt out of marketing communications at any time by clicking "unsubscribe" in any email

COOKIES

We use cookies to improve your browsing experience. You can disable cookies in your browser settings, though this may affect some functionality of our website.

CONTACT US

If you have any questions about this Privacy Policy or wish to exercise your rights, please contact us at:
Email: privacy@magnifiscent.com

This policy was last updated in 2025.`,
  },
  terms: {
    title: "Terms of Service",
    content: `Please read these Terms of Service carefully before using the MagnifiScent website or placing an order. By accessing our website, you agree to be bound by these terms.

ACCEPTANCE OF TERMS

By using this website, placing an order, or creating an account, you confirm that you are at least 18 years of age and agree to these Terms of Service in full.

PRODUCTS AND PRICING

- All prices are listed in Pakistani Rupees (Rs.) and are inclusive of applicable taxes unless stated otherwise
- We reserve the right to change product prices at any time without prior notice
- Product images are for illustrative purposes and may vary slightly from the actual product
- We make every effort to accurately describe our products, but we do not warrant that descriptions are complete, reliable, or error-free

ORDER ACCEPTANCE

Placing an order constitutes an offer to purchase. We reserve the right to accept or decline any order. An order is only confirmed once you receive a confirmation email or SMS from us. We may cancel orders if:
- A product is out of stock
- There is an error in the price or product description
- Payment cannot be verified

PAYMENT

We accept Cash on Delivery (COD) and card payments. Payment must be made in full before or upon delivery. We reserve the right to cancel orders where payment is not successfully received.

INTELLECTUAL PROPERTY

All content on this website — including text, images, logos, and product descriptions — is the property of MagnifiScent and is protected by copyright law. You may not reproduce, distribute, or use any content without our express written permission.

LIMITATION OF LIABILITY

To the maximum extent permitted by law, MagnifiScent shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of our website or products. Our total liability shall not exceed the amount paid for the order in question.

GOVERNING LAW

These Terms of Service are governed by the laws of Pakistan. Any disputes shall be subject to the exclusive jurisdiction of the courts of Pakistan.

CHANGES TO TERMS

We reserve the right to update these Terms of Service at any time. Changes will be posted on this page with an updated date. Continued use of the website constitutes acceptance of the revised terms.

CONTACT

For any queries regarding these terms, please contact us at hello@magnifiscent.com.

Last updated: 2025`,
  },
};

export function getPolicyPages(): PolicyPages {
  try {
    const s = localStorage.getItem("admin_policy_pages");
    if (s) {
      const parsed = JSON.parse(s);
      return {
        returns: { ...DEFAULT_POLICY_PAGES.returns, ...parsed.returns },
        shipping: { ...DEFAULT_POLICY_PAGES.shipping, ...parsed.shipping },
        privacy: { ...DEFAULT_POLICY_PAGES.privacy, ...parsed.privacy },
        terms: { ...DEFAULT_POLICY_PAGES.terms, ...parsed.terms },
      };
    }
  } catch {}
  return { ...DEFAULT_POLICY_PAGES };
}

export function savePolicyPages(pages: PolicyPages): void {
  localStorage.setItem("admin_policy_pages", JSON.stringify(pages));
}

/* ─── Extended Store Settings ─── */
export type ExtendedSettings = {
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

export const DEFAULT_EXTENDED_SETTINGS: ExtendedSettings = {
  seoTitle: "MagnifiScent — Premium Eau de Parfum",
  seoDescription: "Discover MagnifiScent's collection of premium Eau de Parfum fragrances for men and women. Authentic, long-lasting luxury perfumes.",
  seoOgImage: "",
  shippingRate: 200,
  shippingCarrier: "TCS Courier",
  taxRate: 0,
  showTaxInCart: false,
  ga4Id: "",
  fbPixelId: "",
  maintenanceMode: false,
  maintenanceMessage: "We're making some updates to bring you a better experience. We'll be back very soon!",
};

export function getExtendedSettings(): ExtendedSettings {
  try {
    const s = localStorage.getItem("admin_extended_settings");
    if (s) return { ...DEFAULT_EXTENDED_SETTINGS, ...JSON.parse(s) };
  } catch {}
  return { ...DEFAULT_EXTENDED_SETTINGS };
}

export function saveExtendedSettings(s: ExtendedSettings): void {
  localStorage.setItem("admin_extended_settings", JSON.stringify(s));
}

/* ─── Discount Codes ─── */
export type DiscountCode = {
  id: string;
  code: string;
  type: "percent" | "fixed";
  value: number;
  active: boolean;
  expiry: string;
};

export function getDiscountCodes(): DiscountCode[] {
  try {
    const s = localStorage.getItem("admin_discount_codes");
    if (s) return JSON.parse(s);
  } catch {}
  return [];
}

export function saveDiscountCodes(codes: DiscountCode[]): void {
  localStorage.setItem("admin_discount_codes", JSON.stringify(codes));
}

export function applyDiscountCode(
  code: string,
  subtotal: number
): { valid: boolean; discount: number; message: string; codeObj?: DiscountCode } {
  const codes = getDiscountCodes();
  const found = codes.find(
    (c) => c.code.toUpperCase() === code.toUpperCase().trim() && c.active
  );
  if (!found) return { valid: false, discount: 0, message: "Invalid or inactive discount code." };
  if (found.expiry) {
    const expiry = new Date(found.expiry);
    expiry.setHours(23, 59, 59);
    if (expiry < new Date()) {
      return { valid: false, discount: 0, message: "This discount code has expired." };
    }
  }
  const discount =
    found.type === "percent"
      ? Math.min(subtotal * (found.value / 100), subtotal)
      : Math.min(found.value, subtotal);
  return {
    valid: true,
    discount,
    message:
      found.type === "percent"
        ? `${found.value}% discount applied!`
        : `Rs. ${found.value.toFixed(0)} discount applied!`,
    codeObj: found,
  };
}

/* ─── Email Settings ─── */
export type EmailSettings = {
  host: string;
  port: number;
  secure: boolean;
  username: string;
  password: string;
  fromName: string;
  fromEmail: string;
  replyTo: string;
  apiUrl: string;
};

export const DEFAULT_EMAIL_SETTINGS: EmailSettings = {
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  username: "",
  password: "",
  fromName: "MagnifiScent",
  fromEmail: "hello@magnifiscent.com",
  replyTo: "hello@magnifiscent.com",
  apiUrl: "",
};

export type EmailTemplateKey = "order_confirmation" | "contact_reply" | "shipping_update";

export type EmailTemplate = {
  subject: string;
  body: string;
};

export type EmailTemplates = Record<EmailTemplateKey, EmailTemplate>;

const DEFAULT_EMAIL_TEMPLATES: EmailTemplates = {
  order_confirmation: {
    subject: "Your MagnifiScent Order is Confirmed! 🎉",
    body: `<h2>Thank you for your order!</h2>
<p>Dear {{firstName}},</p>
<p>We've received your order and it's being processed. Here are your order details:</p>
<table>
  <tr><td><strong>Order ID:</strong></td><td>{{orderId}}</td></tr>
  <tr><td><strong>Total:</strong></td><td>{{total}}</td></tr>
  <tr><td><strong>Payment:</strong></td><td>{{paymentMethod}}</td></tr>
  <tr><td><strong>Shipping to:</strong></td><td>{{address}}</td></tr>
</table>
<p>Your order will be dispatched within 1-2 business days via {{carrier}}.</p>
<p>Thank you for choosing MagnifiScent!</p>
<p><em>— The MagnifiScent Team</em></p>`,
  },
  contact_reply: {
    subject: "We received your message — MagnifiScent",
    body: `<h2>Thank you for reaching out!</h2>
<p>Dear {{firstName}},</p>
<p>We've received your message and will get back to you within 24-48 hours.</p>
<p>In the meantime, you can browse our collection at <a href="https://magnifiscent.com">magnifiscent.com</a>.</p>
<p><em>— The MagnifiScent Team</em></p>`,
  },
  shipping_update: {
    subject: "Your MagnifiScent order has been shipped! 📦",
    body: `<h2>Your order is on its way!</h2>
<p>Dear {{firstName}},</p>
<p>Great news — your order <strong>{{orderId}}</strong> has been shipped via {{carrier}}.</p>
<p><strong>Tracking Number:</strong> {{trackingNumber}}</p>
<p>Estimated delivery: 3-5 business days.</p>
<p><em>— The MagnifiScent Team</em></p>`,
  },
};

export function getEmailSettings(): EmailSettings {
  try {
    const s = localStorage.getItem("admin_email_settings");
    if (s) return { ...DEFAULT_EMAIL_SETTINGS, ...JSON.parse(s) };
  } catch {}
  return { ...DEFAULT_EMAIL_SETTINGS };
}

export function saveEmailSettings(s: EmailSettings): void {
  localStorage.setItem("admin_email_settings", JSON.stringify(s));
}

export function getEmailTemplates(): EmailTemplates {
  try {
    const s = localStorage.getItem("admin_email_templates");
    if (s) return { ...DEFAULT_EMAIL_TEMPLATES, ...JSON.parse(s) };
  } catch {}
  return { ...DEFAULT_EMAIL_TEMPLATES };
}

export function saveEmailTemplates(t: EmailTemplates): void {
  localStorage.setItem("admin_email_templates", JSON.stringify(t));
}

export type EmailLogEntry = {
  id: string;
  to: string;
  subject: string;
  status: "sent" | "failed" | "pending";
  date: string;
  message: string;
};

export function getEmailLog(): EmailLogEntry[] {
  try {
    const s = localStorage.getItem("admin_email_log");
    if (s) return JSON.parse(s);
  } catch {}
  return [];
}

export function addEmailLog(entry: Omit<EmailLogEntry, "id">): void {
  const log = getEmailLog();
  log.unshift({ ...entry, id: Date.now().toString() });
  localStorage.setItem("admin_email_log", JSON.stringify(log.slice(0, 50)));
}

/* ─── Store Settings (read-only helper for storefront) ─── */
export function getStoreFrontSettings(): { freeShippingThreshold: number; currency: string; storeName: string } {
  try {
    const s = localStorage.getItem("admin_settings");
    if (s) {
      const p = JSON.parse(s);
      return {
        freeShippingThreshold: p.freeShippingThreshold ?? 100,
        currency: p.currency ?? "Rs.",
        storeName: p.storeName ?? "MagnifiScent",
      };
    }
  } catch {}
  return { freeShippingThreshold: 100, currency: "Rs.", storeName: "MagnifiScent" };
}
