export type LiveProduct = { id: string; name: string; slug: string; category: string; price: number; stock: number; active: boolean; img: string; img2: string; desc: string; rating: number; reviews: number };

/* ─── Media types ─── */
export type HeroSlide = { id: string; src: string; alt: string };
export type GenderBanners = { men: string; women: string };
export type NotesImages = Record<string, string>;
export type ProductCustomImages = Record<string, { img: string; img2: string }>;
export type DealCustomImages = Record<string, { img1?: string; img2?: string }>;

/* ─── Announcement Ticker defaults ─── */
export const DEFAULT_TICKER_MESSAGES = [
  "FREE SHIPPING ON ORDERS ABOVE Rs. 100",
  "20 DAYS RETURN & REFUND POLICY",
  "100% AUTHENTIC FRAGRANCES",
];

/* ─── Admin Deal type ─── */
export type AdminDealEntry = {
  id: string;
  name: string;
  contains: string[];
  price: number;
  originalPrice: number;
  active: boolean;
  discount: number;
};

/* ─── Instagram Reels type ─── */
export type InstagramReel = {
  id: string;
  url: string;
  img: string;
  label: string;
  likes: number;
};

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

/* ─── Payment Settings type ─── */
export type PaymentSettings = { cod: boolean; card: boolean };

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

/* ─── Discount Codes type ─── */
export type DiscountCode = {
  id: string;
  code: string;
  type: "percent" | "fixed";
  value: number;
  active: boolean;
  expiry: string;
};

/* ─── Email Templates ─── */
export type EmailTemplateKey =
  | "order_confirmation"
  | "order_shipped"
  | "order_delivered"
  | "abandoned_cart"
  | "welcome_email"
  | "new_order_alert"
  | "low_stock_alert";

export type EmailTemplate = {
  subject: string;
  body: string;
};

export type EmailTemplates = Record<EmailTemplateKey, EmailTemplate>;

export const DEFAULT_EMAIL_TEMPLATES: EmailTemplates = {
  order_confirmation: {
    subject: "Your MagnifiScent Order is Confirmed!",
    body: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#fff;border:1px solid #e5e7eb;border-radius:8px">
<h2 style="font-family:Georgia,serif;color:#111827;margin-top:0">Order Confirmed!</h2>
<p>Dear {{customer_name}},</p>
<p>Thank you for your order! Here are your order details:</p>
<table style="width:100%;border-collapse:collapse;margin:16px 0">
  <tr><td style="padding:8px 0;color:#6b7280;border-bottom:1px solid #f3f4f6"><strong>Order ID:</strong></td><td style="padding:8px 0;border-bottom:1px solid #f3f4f6">{{order_id}}</td></tr>
  <tr><td style="padding:8px 0;color:#6b7280;border-bottom:1px solid #f3f4f6"><strong>Order Total:</strong></td><td style="padding:8px 0;border-bottom:1px solid #f3f4f6">{{order_total}}</td></tr>
  <tr><td style="padding:8px 0;color:#6b7280"><strong>Store:</strong></td><td style="padding:8px 0">{{store_name}}</td></tr>
</table>
<p>Your order will be dispatched within 1–2 business days.</p>
<p style="color:#6b7280;font-size:14px"><em>— The {{store_name}} Team</em></p>
</div>`,
  },
  order_shipped: {
    subject: "Your MagnifiScent order has been shipped!",
    body: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#fff;border:1px solid #e5e7eb;border-radius:8px">
<h2 style="font-family:Georgia,serif;color:#111827;margin-top:0">Your Order Is On Its Way!</h2>
<p>Dear {{customer_name}},</p>
<p>Your order <strong>{{order_id}}</strong> has been shipped.</p>
<p>Estimated delivery: 3–5 business days.</p>
<p style="color:#6b7280;font-size:14px"><em>— The {{store_name}} Team</em></p>
</div>`,
  },
  order_delivered: {
    subject: "Your MagnifiScent order has been delivered!",
    body: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#fff;border:1px solid #e5e7eb;border-radius:8px">
<h2 style="font-family:Georgia,serif;color:#111827;margin-top:0">Order Delivered!</h2>
<p>Dear {{customer_name}},</p>
<p>Your order <strong>{{order_id}}</strong> has been delivered. We hope you love your fragrance!</p>
<p style="color:#6b7280;font-size:14px"><em>— The {{store_name}} Team</em></p>
</div>`,
  },
  abandoned_cart: {
    subject: "You left something behind — complete your MagnifiScent order",
    body: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#fff;border:1px solid #e5e7eb;border-radius:8px">
<h2 style="font-family:Georgia,serif;color:#111827;margin-top:0">Your Cart Misses You</h2>
<p>Dear {{customer_name}},</p>
<p>You left items in your cart. Come back and complete your order before they sell out!</p>
<p style="color:#6b7280;font-size:14px"><em>— The {{store_name}} Team</em></p>
</div>`,
  },
  welcome_email: {
    subject: "Welcome to MagnifiScent — Thank you for your first order!",
    body: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#fff;border:1px solid #e5e7eb;border-radius:8px">
<h2 style="font-family:Georgia,serif;color:#111827;margin-top:0">Welcome to {{store_name}}!</h2>
<p>Dear {{customer_name}},</p>
<p>Thank you for placing your first order with us. We're thrilled to have you as a customer!</p>
<p>Your order <strong>{{order_id}}</strong> is being processed and will be dispatched soon.</p>
<p style="color:#6b7280;font-size:14px"><em>— The {{store_name}} Team</em></p>
</div>`,
  },
  new_order_alert: {
    subject: "New Order Received — {{order_id}}",
    body: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#fff;border:1px solid #e5e7eb;border-radius:8px">
<h2 style="font-family:Georgia,serif;color:#111827;margin-top:0">New Order Alert</h2>
<p>A new order has been placed on your store.</p>
<table style="width:100%;border-collapse:collapse;margin:16px 0">
  <tr><td style="padding:8px 0;color:#6b7280;border-bottom:1px solid #f3f4f6"><strong>Order ID:</strong></td><td style="padding:8px 0;border-bottom:1px solid #f3f4f6">{{order_id}}</td></tr>
  <tr><td style="padding:8px 0;color:#6b7280;border-bottom:1px solid #f3f4f6"><strong>Customer:</strong></td><td style="padding:8px 0;border-bottom:1px solid #f3f4f6">{{customer_name}}</td></tr>
  <tr><td style="padding:8px 0;color:#6b7280"><strong>Total:</strong></td><td style="padding:8px 0">{{order_total}}</td></tr>
</table>
</div>`,
  },
  low_stock_alert: {
    subject: "Low Stock Alert — {{store_name}}",
    body: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#fff;border:1px solid #e5e7eb;border-radius:8px">
<h2 style="font-family:Georgia,serif;color:#111827;margin-top:0">Low Stock Alert</h2>
<p>A product in your store is running low on stock. Please review your inventory and restock as needed.</p>
<p style="color:#6b7280;font-size:14px"><em>— {{store_name}} Admin</em></p>
</div>`,
  },
};

/* ─── Email Notification Toggles ─── */
export type EmailToggles = {
  order_confirmation: boolean;
  order_shipped: boolean;
  order_delivered: boolean;
  abandoned_cart: boolean;
  welcome_email: boolean;
  new_order_alert: boolean;
  low_stock_alert: boolean;
};

export const DEFAULT_EMAIL_TOGGLES: EmailToggles = {
  order_confirmation: true,
  order_shipped: true,
  order_delivered: false,
  abandoned_cart: false,
  welcome_email: false,
  new_order_alert: true,
  low_stock_alert: false,
};

/* ─── Order payload type ─── */
export type NewOrderPayload = {
  id: string;
  customer: { name: string; email: string; phone: string; address: string };
  items: Array<{ productId: number; productName: string; qty: number; price: number }>;
  total: number;
  status: "Pending";
  date: string;
  paymentMethod: string;
};


