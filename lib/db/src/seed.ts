import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import { sql } from "drizzle-orm";
import * as schema from "./schema/index.js";
import { CATALOG_PRODUCTS, CATALOG_DEALS, CATALOG_TICKER_MESSAGES } from "./catalog.js";

const { Pool } = pg;

const WOMEN_PLACEHOLDER = "/noir-product.png";
const MEN_PLACEHOLDER = "/storm-product.png";

const PRODUCTS: schema.InsertProduct[] = CATALOG_PRODUCTS.map((p) => ({
  ...p,
  img: p.category === "men" ? MEN_PLACEHOLDER : WOMEN_PLACEHOLDER,
  img2: p.category === "men" ? MEN_PLACEHOLDER : WOMEN_PLACEHOLDER,
}));

const DEALS: schema.InsertDeal[] = CATALOG_DEALS.map((d) => ({ ...d, contains: [...d.contains] }));

const TICKER_MESSAGES = [...CATALOG_TICKER_MESSAGES];

const DEFAULT_EMAIL_TOGGLES: Record<string, boolean> = {
  order_confirmation: true,
  order_shipped: true,
  order_delivered: false,
  abandoned_cart: false,
  welcome_email: false,
  new_order_alert: true,
  low_stock_alert: false,
};

const POLICY_PAGES: schema.InsertPolicyPage[] = [
  {
    key: "returns",
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
5. Once we receive and inspect the item, we will process your refund within 5-7 business days

REFUND PROCESS

Approved refunds will be processed to the original payment method. Shipping charges are non-refundable unless the return is due to our error or a defective product.

EXCHANGES

We are happy to exchange an item for a different fragrance of equal value. Please contact us to arrange an exchange.

For any questions regarding our returns policy, please contact us at hello@magnifiscent.com.`,
  },
  {
    key: "shipping",
    title: "Shipping Info",
    content: `MagnifiScent delivers across Pakistan using trusted courier partners. Here is everything you need to know about our shipping process.

DELIVERY PARTNERS

We ship via TCS Couriers and Leopard Courier — two of Pakistan's most reliable delivery networks.

DELIVERY TIMEFRAMES

- Major cities (Karachi, Lahore, Islamabad, Rawalpindi, Peshawar, Quetta): 2-3 business days
- Other cities and towns: 3-5 business days
- Remote areas: 5-7 business days

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

Orders are processed within 1-2 business days after placement. Orders placed on weekends or public holidays will be processed on the next business day.

INTERNATIONAL SHIPPING

At this time, we only ship within Pakistan. International shipping is not available.

If you have any questions about your shipment, please contact us at hello@magnifiscent.com or call us directly.`,
  },
  {
    key: "privacy",
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
  {
    key: "terms",
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
];

type DrizzleDb = ReturnType<typeof drizzle<typeof schema>>;

export async function seedDatabase(db: DrizzleDb): Promise<void> {
  console.log("Seeding database...");

  const existingProducts = await db.select({ id: schema.productsTable.id }).from(schema.productsTable);
  if (existingProducts.length === 0) {
    await db.insert(schema.productsTable).values(PRODUCTS);
    console.log(`Inserted ${PRODUCTS.length} products`);
  } else {
    console.log(`Products already seeded (${existingProducts.length} found), patching empty images`);
    for (const p of PRODUCTS) {
      await db.update(schema.productsTable)
        .set({ img: p.img, img2: p.img2 })
        .where(sql`${schema.productsTable.id} = ${p.id} AND (${schema.productsTable.img} = '' OR ${schema.productsTable.img2} = '')`);
    }
    console.log("Placeholder images applied to any products with empty img fields");
  }

  const existingDeals = await db.select({ id: schema.dealsTable.id }).from(schema.dealsTable);
  if (existingDeals.length === 0) {
    await db.insert(schema.dealsTable).values(DEALS);
    console.log(`Inserted ${DEALS.length} deals`);
  } else {
    console.log(`Deals already seeded (${existingDeals.length} found), skipping`);
  }

  const existingSettings = await db.select({ id: schema.storeSettingsTable.id }).from(schema.storeSettingsTable);
  if (existingSettings.length === 0) {
    await db.insert(schema.storeSettingsTable).values({ id: 1 });
    console.log("Inserted default store settings");
  } else {
    console.log("Store settings already seeded, skipping");
  }

  const existingExtended = await db.select({ id: schema.extendedSettingsTable.id }).from(schema.extendedSettingsTable);
  if (existingExtended.length === 0) {
    await db.insert(schema.extendedSettingsTable).values({ id: 1 });
    console.log("Inserted default extended settings");
  } else {
    console.log("Extended settings already seeded, skipping");
  }

  const existingPayment = await db.select({ id: schema.paymentSettingsTable.id }).from(schema.paymentSettingsTable);
  if (existingPayment.length === 0) {
    await db.insert(schema.paymentSettingsTable).values({ id: 1 });
    console.log("Inserted default payment settings");
  } else {
    console.log("Payment settings already seeded, skipping");
  }

  const existingEmail = await db.select({ id: schema.emailConfigTable.id }).from(schema.emailConfigTable);
  if (existingEmail.length === 0) {
    await db.insert(schema.emailConfigTable).values({
      id: 1,
      toggles: DEFAULT_EMAIL_TOGGLES,
      templates: {},
    });
    console.log("Inserted default email config");
  } else {
    console.log("Email config already seeded, skipping");
  }

  const existingBanners = await db.select({ id: schema.genderBannersTable.id }).from(schema.genderBannersTable);
  if (existingBanners.length === 0) {
    await db.insert(schema.genderBannersTable).values({ id: 1 });
    console.log("Inserted default gender banners");
  } else {
    console.log("Gender banners already seeded, skipping");
  }

  const existingHeadings = await db.select({ id: schema.homeHeadingsTable.id }).from(schema.homeHeadingsTable);
  if (existingHeadings.length === 0) {
    await db.insert(schema.homeHeadingsTable).values({ id: 1 });
    console.log("Inserted default home headings");
  } else {
    console.log("Home headings already seeded, skipping");
  }

  const existingTicker = await db.select({ id: schema.tickerMessagesTable.id }).from(schema.tickerMessagesTable);
  if (existingTicker.length === 0) {
    await db.insert(schema.tickerMessagesTable).values(
      TICKER_MESSAGES.map((message, position) => ({ message, position }))
    );
    console.log(`Inserted ${TICKER_MESSAGES.length} ticker messages`);
  } else {
    console.log("Ticker messages already seeded, skipping");
  }

  const existingPolicies = await db.select({ id: schema.policyPagesTable.id }).from(schema.policyPagesTable);
  if (existingPolicies.length === 0) {
    await db.insert(schema.policyPagesTable).values(POLICY_PAGES);
    console.log(`Inserted ${POLICY_PAGES.length} policy pages`);
  } else {
    console.log("Policy pages already seeded, skipping");
  }

  console.log("Seeding complete.");
}

if (process.argv[1] && process.argv[1].includes("seed")) {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL must be set");
  }
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const db = drizzle(pool, { schema });
  seedDatabase(db)
    .then(() => pool.end())
    .catch((err) => {
      console.error("Seed failed:", err);
      process.exit(1);
    });
}
