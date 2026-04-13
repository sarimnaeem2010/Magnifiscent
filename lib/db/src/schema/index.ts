import {
  pgTable,
  pgEnum,
  serial,
  text,
  integer,
  real,
  boolean,
  jsonb,
  timestamp,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

/* ─── Enums ─── */
export const orderStatusEnum = pgEnum("order_status", [
  "Pending",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
]);

export const categoryEnum = pgEnum("product_category", ["men", "women"]);

export const discountTypeEnum = pgEnum("discount_type", ["percent", "fixed"]);

export const policyKeyEnum = pgEnum("policy_key", [
  "returns",
  "shipping",
  "privacy",
  "terms",
]);

/* ─── Products ─── */
export const productsTable = pgTable("products", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  img: text("img").notNull().default(""),
  img2: text("img2").notNull().default(""),
  price: text("price").notNull(),
  priceNum: real("price_num").notNull(),
  originalPrice: text("original_price").notNull(),
  originalPriceNum: real("original_price_num").notNull(),
  reviews: integer("reviews").notNull().default(0),
  rating: real("rating").notNull().default(5),
  category: categoryEnum("category").notNull(),
  desc: text("desc").notNull().default(""),
  notes: jsonb("notes").$type<string[]>().notNull().default([]),
  size: text("size").notNull().default("100ml / 3.4 Fl.oz"),
  stock: integer("stock").notNull().default(20),
  active: boolean("active").notNull().default(true),
});

export const insertProductSchema = createInsertSchema(productsTable);
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof productsTable.$inferSelect;

/* ─── Orders ─── */
export const ordersTable = pgTable("orders", {
  id: text("id").primaryKey(),
  customer: jsonb("customer")
    .$type<{ name: string; email: string; phone: string; address: string }>()
    .notNull(),
  total: real("total").notNull(),
  status: orderStatusEnum("status").notNull().default("Pending"),
  date: text("date").notNull(),
  paymentMethod: text("payment_method").notNull().default(""),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertOrderSchema = createInsertSchema(ordersTable).omit({ createdAt: true });
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type DbOrder = typeof ordersTable.$inferSelect;

/* ─── Order Items ─── */
export const orderItemsTable = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: text("order_id")
    .notNull()
    .references(() => ordersTable.id, { onDelete: "cascade" }),
  productId: integer("product_id").notNull(),
  productName: text("product_name").notNull(),
  qty: integer("qty").notNull().default(1),
  price: real("price").notNull(),
});

export const insertOrderItemSchema = createInsertSchema(orderItemsTable).omit({ id: true });
export type InsertOrderItem = z.infer<typeof insertOrderItemSchema>;
export type OrderItem = typeof orderItemsTable.$inferSelect;

/* ─── Deals ─── */
export const dealsTable = pgTable("deals", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  contains: jsonb("contains").$type<string[]>().notNull().default([]),
  price: real("price").notNull(),
  originalPrice: real("original_price").notNull(),
  discount: real("discount").notNull().default(0),
  active: boolean("active").notNull().default(true),
});

export const insertDealSchema = createInsertSchema(dealsTable);
export type InsertDeal = z.infer<typeof insertDealSchema>;
export type Deal = typeof dealsTable.$inferSelect;

/* ─── Discount Codes ─── */
export const discountCodesTable = pgTable("discount_codes", {
  id: text("id").primaryKey(),
  code: text("code").notNull().unique(),
  type: discountTypeEnum("type").notNull(),
  value: real("value").notNull(),
  minOrder: real("min_order").notNull().default(0),
  maxUses: integer("max_uses").notNull().default(0),
  usedCount: integer("used_count").notNull().default(0),
  active: boolean("active").notNull().default(true),
  expiry: text("expiry").notNull().default(""),
});

export const insertDiscountCodeSchema = createInsertSchema(discountCodesTable);
export type InsertDiscountCode = z.infer<typeof insertDiscountCodeSchema>;
export type DiscountCode = typeof discountCodesTable.$inferSelect;

/* ─── Store Settings (single row, id = 1) ─── */
export const storeSettingsTable = pgTable("store_settings", {
  id: integer("id").primaryKey().default(1),
  storeName: text("store_name").notNull().default("MagnifiScent"),
  email: text("email").notNull().default("hello@magnifiscent.com"),
  phone: text("phone").notNull().default("+1 (800) 555-0199"),
  currency: text("currency").notNull().default("Rs."),
  freeShippingThreshold: real("free_shipping_threshold").notNull().default(100),
  instagramUrl: text("instagram_url").notNull().default("https://instagram.com/magnifiscent"),
  twitterUrl: text("twitter_url").notNull().default("https://twitter.com/magnifiscent"),
  facebookUrl: text("facebook_url").notNull().default("https://facebook.com/magnifiscent"),
  adminPassword: text("admin_password").notNull().default("admin123"),
});

export const insertStoreSettingsSchema = createInsertSchema(storeSettingsTable);
export type InsertStoreSettings = z.infer<typeof insertStoreSettingsSchema>;
export type StoreSettings = typeof storeSettingsTable.$inferSelect;

/* ─── Extended Settings (single row, id = 1) ─── */
export const extendedSettingsTable = pgTable("extended_settings", {
  id: integer("id").primaryKey().default(1),
  seoTitle: text("seo_title").notNull().default("MagnifiScent — Premium Eau de Parfum"),
  seoDescription: text("seo_description")
    .notNull()
    .default(
      "Discover MagnifiScent's collection of premium Eau de Parfum fragrances for men and women. Authentic, long-lasting luxury perfumes."
    ),
  seoOgImage: text("seo_og_image").notNull().default(""),
  shippingRate: real("shipping_rate").notNull().default(200),
  shippingCarrier: text("shipping_carrier").notNull().default("TCS Courier"),
  taxRate: real("tax_rate").notNull().default(0),
  showTaxInCart: boolean("show_tax_in_cart").notNull().default(false),
  ga4Id: text("ga4_id").notNull().default(""),
  fbPixelId: text("fb_pixel_id").notNull().default(""),
  maintenanceMode: boolean("maintenance_mode").notNull().default(false),
  maintenanceMessage: text("maintenance_message")
    .notNull()
    .default("We're making some updates to bring you a better experience. We'll be back very soon!"),
});

export const insertExtendedSettingsSchema = createInsertSchema(extendedSettingsTable);
export type InsertExtendedSettings = z.infer<typeof insertExtendedSettingsSchema>;
export type ExtendedSettings = typeof extendedSettingsTable.$inferSelect;

/* ─── Payment Settings (single row, id = 1) ─── */
export const paymentSettingsTable = pgTable("payment_settings", {
  id: integer("id").primaryKey().default(1),
  cod: boolean("cod").notNull().default(true),
  card: boolean("card").notNull().default(true),
});

export const insertPaymentSettingsSchema = createInsertSchema(paymentSettingsTable);
export type InsertPaymentSettings = z.infer<typeof insertPaymentSettingsSchema>;
export type PaymentSettings = typeof paymentSettingsTable.$inferSelect;

/* ─── Email Config (single row, id = 1) ─── */
export const emailConfigTable = pgTable("email_config", {
  id: integer("id").primaryKey().default(1),
  host: text("host").notNull().default("smtp.gmail.com"),
  port: integer("port").notNull().default(587),
  secure: boolean("secure").notNull().default(false),
  username: text("username").notNull().default(""),
  password: text("password").notNull().default(""),
  fromName: text("from_name").notNull().default("MagnifiScent"),
  fromEmail: text("from_email").notNull().default("hello@magnifiscent.com"),
  replyTo: text("reply_to").notNull().default("hello@magnifiscent.com"),
  toggles: jsonb("toggles")
    .$type<Record<string, boolean>>()
    .notNull()
    .default({}),
  templates: jsonb("templates")
    .$type<Record<string, { subject: string; body: string }>>()
    .notNull()
    .default({}),
});

export const insertEmailConfigSchema = createInsertSchema(emailConfigTable);
export type InsertEmailConfig = z.infer<typeof insertEmailConfigSchema>;
export type EmailConfig = typeof emailConfigTable.$inferSelect;

/* ─── Hero Slides ─── */
export const heroSlidesTable = pgTable("hero_slides", {
  id: text("id").primaryKey(),
  src: text("src").notNull(),
  alt: text("alt").notNull().default(""),
  position: integer("position").notNull().default(0),
});

export const insertHeroSlideSchema = createInsertSchema(heroSlidesTable);
export type InsertHeroSlide = z.infer<typeof insertHeroSlideSchema>;
export type HeroSlide = typeof heroSlidesTable.$inferSelect;

/* ─── Gender Banners (single row, id = 1) ─── */
export const genderBannersTable = pgTable("gender_banners", {
  id: integer("id").primaryKey().default(1),
  men: text("men").notNull().default(""),
  women: text("women").notNull().default(""),
});

export const insertGenderBannersSchema = createInsertSchema(genderBannersTable);
export type InsertGenderBanners = z.infer<typeof insertGenderBannersSchema>;
export type GenderBanners = typeof genderBannersTable.$inferSelect;

/* ─── Notes Images ─── */
export const notesImagesTable = pgTable("notes_images", {
  id: serial("id").primaryKey(),
  note: text("note").notNull().unique(),
  imageUrl: text("image_url").notNull().default(""),
  position: integer("position").notNull().default(0),
});

export const insertNotesImageSchema = createInsertSchema(notesImagesTable).omit({ id: true });
export type InsertNotesImage = z.infer<typeof insertNotesImageSchema>;
export type NotesImage = typeof notesImagesTable.$inferSelect;

/* ─── Product Images (per-product overrides) ─── */
export const productImagesTable = pgTable("product_images", {
  id: serial("id").primaryKey(),
  productSlug: text("product_slug").notNull().unique(),
  img: text("img").notNull().default(""),
  img2: text("img2").notNull().default(""),
});

export const insertProductImageSchema = createInsertSchema(productImagesTable).omit({ id: true });
export type InsertProductImage = z.infer<typeof insertProductImageSchema>;
export type ProductImage = typeof productImagesTable.$inferSelect;

/* ─── Ticker Messages ─── */
export const tickerMessagesTable = pgTable("ticker_messages", {
  id: serial("id").primaryKey(),
  message: text("message").notNull(),
  position: integer("position").notNull().default(0),
});

export const insertTickerMessageSchema = createInsertSchema(tickerMessagesTable).omit({ id: true });
export type InsertTickerMessage = z.infer<typeof insertTickerMessageSchema>;
export type TickerMessage = typeof tickerMessagesTable.$inferSelect;

/* ─── Deal Images ─── */
export const dealImagesTable = pgTable("deal_images", {
  id: serial("id").primaryKey(),
  dealId: text("deal_id").notNull().unique(),
  img1: text("img1").notNull().default(""),
  img2: text("img2").notNull().default(""),
});

export const insertDealImageSchema = createInsertSchema(dealImagesTable).omit({ id: true });
export type InsertDealImage = z.infer<typeof insertDealImageSchema>;
export type DealImage = typeof dealImagesTable.$inferSelect;

/* ─── Instagram Reels ─── */
export const instagramReelsTable = pgTable("instagram_reels", {
  id: text("id").primaryKey(),
  url: text("url").notNull().default(""),
  img: text("img").notNull().default(""),
  label: text("label").notNull().default(""),
  likes: integer("likes").notNull().default(0),
  position: integer("position").notNull().default(0),
});

export const insertInstagramReelSchema = createInsertSchema(instagramReelsTable);
export type InsertInstagramReel = z.infer<typeof insertInstagramReelSchema>;
export type InstagramReel = typeof instagramReelsTable.$inferSelect;

/* ─── Home Headings (single row, id = 1) ─── */
export const homeHeadingsTable = pgTable("home_headings", {
  id: integer("id").primaryKey().default(1),
  deals: text("deals").notNull().default("Deals & Combo"),
  dealsSubtitle: text("deals_subtitle")
    .notNull()
    .default("Save more with our exclusive fragrance bundles"),
  shopByGender: text("shop_by_gender").notNull().default("Shop By Gender"),
  shopByGenderSubtitle: text("shop_by_gender_subtitle")
    .notNull()
    .default("Curated collections crafted for him and for her"),
  allProducts: text("all_products").notNull().default("All Products"),
  allProductsSubtitle: text("all_products_subtitle")
    .notNull()
    .default("Every scent in our signature collection"),
  shopByNotes: text("shop_by_notes").notNull().default("Shop By Notes"),
  shopByNotesSubtitle: text("shop_by_notes_subtitle")
    .notNull()
    .default("Find your perfect fragrance by scent family"),
  instagramTitle: text("instagram_title").notNull().default("Scent That Spreads"),
  instagramSubtitle: text("instagram_subtitle")
    .notNull()
    .default("Everyone's favourite MagnifiScent Fragrances"),
  reviews: text("reviews").notNull().default("Buyer's Reviews"),
  reviewsSubtitle: text("reviews_subtitle")
    .notNull()
    .default("Real experiences from our fragrance community"),
  whyChoose: text("why_choose").notNull().default("Why Choose MagnifiScent?"),
  whyChooseSubtitle: text("why_choose_subtitle")
    .notNull()
    .default("Authenticity, longevity, and luxury — without compromise"),
});

export const insertHomeHeadingsSchema = createInsertSchema(homeHeadingsTable);
export type InsertHomeHeadings = z.infer<typeof insertHomeHeadingsSchema>;
export type HomeHeadings = typeof homeHeadingsTable.$inferSelect;

/* ─── Policy Pages ─── */
export const policyPagesTable = pgTable("policy_pages", {
  id: serial("id").primaryKey(),
  key: policyKeyEnum("key").notNull().unique(),
  title: text("title").notNull(),
  content: text("content").notNull().default(""),
});

export const insertPolicyPageSchema = createInsertSchema(policyPagesTable).omit({ id: true });
export type InsertPolicyPage = z.infer<typeof insertPolicyPageSchema>;
export type PolicyPage = typeof policyPagesTable.$inferSelect;

/* ─── Blog Posts ─── */
export const blogPostsTable = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  excerpt: text("excerpt").notNull().default(""),
  content: text("content").notNull().default(""),
  coverImage: text("cover_image").notNull().default(""),
  published: boolean("published").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertBlogPostSchema = createInsertSchema(blogPostsTable).omit({ id: true, createdAt: true });
export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;
export type BlogPost = typeof blogPostsTable.$inferSelect;
