import express, { type Express, type Request, type Response } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import router from "./routes";
import { logger } from "./lib/logger";
import { db } from "./lib/db.js";
import { productsTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { injectMeta } from "./lib/injectMeta.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const staticDir = process.env["STATIC_DIR"] ||
  path.join(__dirname, "..", "..", "magnifiscent", "dist", "public");

const SITE_DOMAIN = process.env["SITE_DOMAIN"] || "https://magnifiscent.com.pk";

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(cors());
app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ extended: true, limit: "15mb" }));

app.use("/api", router);

/* ── robots.txt ── */
app.get("/robots.txt", (_req, res) => {
  res.type("text/plain");
  res.send(
    [
      "User-agent: *",
      "Disallow: /admin",
      "Disallow: /admin/",
      "Disallow: /checkout",
      "Disallow: /api",
      "Disallow: /api/",
      "Allow: /",
      "",
      `Sitemap: ${SITE_DOMAIN}/sitemap.xml`,
    ].join("\n"),
  );
});

/* ── sitemap.xml ── */
app.get("/sitemap.xml", async (_req, res) => {
  try {
    const products = await db
      .select({ slug: productsTable.slug })
      .from(productsTable)
      .where(eq(productsTable.active, true));

    const today = new Date().toISOString().slice(0, 10);

    const staticPages = [
      { loc: "/", changefreq: "daily",   priority: "1.0", lastmod: today },
      { loc: "/products", changefreq: "daily",   priority: "0.9", lastmod: today },
      { loc: "/deals",    changefreq: "weekly",  priority: "0.8", lastmod: today },
      { loc: "/about",    changefreq: "monthly", priority: "0.5", lastmod: today },
      { loc: "/contact",  changefreq: "monthly", priority: "0.5", lastmod: today },
      { loc: "/returns",  changefreq: "monthly", priority: "0.4", lastmod: today },
      { loc: "/shipping", changefreq: "monthly", priority: "0.4", lastmod: today },
      { loc: "/privacy",  changefreq: "yearly",  priority: "0.3", lastmod: today },
      { loc: "/terms",    changefreq: "yearly",  priority: "0.3", lastmod: today },
    ];

    const productEntries = products.map((p) => ({
      loc: `/products/${p.slug}`,
      changefreq: "weekly",
      priority: "0.8",
      lastmod: today,
    }));

    const allEntries = [...staticPages, ...productEntries];

    const urlTags = allEntries
      .map(
        (e) =>
          `  <url>\n    <loc>${SITE_DOMAIN}${e.loc}</loc>\n    <lastmod>${e.lastmod}</lastmod>\n    <changefreq>${e.changefreq}</changefreq>\n    <priority>${e.priority}</priority>\n  </url>`,
      )
      .join("\n");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlTags}\n</urlset>`;

    res.header("Content-Type", "application/xml");
    res.send(xml);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).send(`<?xml version="1.0" encoding="UTF-8"?><error>${message}</error>`);
  }
});

/* ── Static files (index:false so / falls through to SSR handler) ── */
app.use(express.static(staticDir, { index: false }));

/* ── Static-page meta map ── */
const STATIC_META: Record<string, { title: string; description: string; ogType?: string }> = {
  "/products": {
    title: "All Perfumes — MagnifiScent Pakistan",
    description:
      "Shop all premium Eau de Parfum fragrances for men and women at MagnifiScent. Long-lasting scents with Cash on Delivery across Pakistan.",
  },
  "/products/men": {
    title: "Men's Perfumes — MagnifiScent Pakistan",
    description:
      "Explore MagnifiScent's men's fragrance collection. Bold, long-lasting Eau de Parfum with Cash on Delivery across Pakistan.",
  },
  "/products/women": {
    title: "Women's Perfumes — MagnifiScent Pakistan",
    description:
      "Discover MagnifiScent's women's fragrance collection. Elegant, long-lasting Eau de Parfum with Cash on Delivery across Pakistan.",
  },
  "/deals": {
    title: "Deals & Combo Offers — MagnifiScent Pakistan",
    description:
      "Save more with MagnifiScent's exclusive fragrance bundle deals. Premium perfume combos with Cash on Delivery across Pakistan.",
  },
  "/about": {
    title: "About MagnifiScent — Premium Perfumes Pakistan",
    description:
      "Learn about MagnifiScent — Pakistan's premium Eau de Parfum brand. Authentic fragrances crafted for men and women.",
  },
  "/contact": {
    title: "Contact Us — MagnifiScent Pakistan",
    description:
      "Get in touch with MagnifiScent. We're here to help with orders, fragrance advice, and everything in between.",
  },
  "/returns": {
    title: "Returns Policy — MagnifiScent Pakistan",
    description: "MagnifiScent's returns and exchange policy for perfume orders across Pakistan.",
  },
  "/shipping": {
    title: "Shipping Information — MagnifiScent Pakistan",
    description: "Shipping details, delivery times, and Cash on Delivery information for MagnifiScent orders.",
  },
  "/privacy": {
    title: "Privacy Policy — MagnifiScent",
    description: "MagnifiScent's privacy policy — how we collect, use, and protect your information.",
  },
  "/terms": {
    title: "Terms & Conditions — MagnifiScent",
    description: "MagnifiScent's terms and conditions of service.",
  },
};

/* ── Helper: read index.html (fresh each call in dev, but fine for production SSR) ── */
function readIndexHtml(): string {
  const indexPath = path.join(staticDir, "index.html");
  try {
    return fs.readFileSync(indexPath, "utf-8");
  } catch {
    return "";
  }
}

/* ── SPA fallback with server-side meta injection ── */
app.get("/{*path}", async (req: Request, res: Response) => {
  const html = readIndexHtml();
  if (!html) {
    res.status(404).send("Not found");
    return;
  }

  const urlPath = req.path.replace(/\/$/, "") || "/";

  // Skip meta injection for admin routes
  if (urlPath === "/admin" || urlPath.startsWith("/admin/")) {
    res.type("html").send(html);
    return;
  }

  // Static page meta
  if (urlPath === "/") {
    const injected = injectMeta(html, {
      title: "MagnifiScent — Premium Eau de Parfum Pakistan",
      description:
        "Discover MagnifiScent's collection of premium Eau de Parfum fragrances for men and women. Authentic, long-lasting luxury perfumes with free delivery and Cash on Delivery across Pakistan.",
      ogType: "website",
      ogUrl: SITE_DOMAIN,
    });
    res.type("html").send(injected);
    return;
  }

  const staticPageMeta = STATIC_META[urlPath];
  if (staticPageMeta) {
    const injected = injectMeta(html, {
      ...staticPageMeta,
      ogType: staticPageMeta.ogType ?? "website",
      ogUrl: `${SITE_DOMAIN}${urlPath}`,
    });
    res.type("html").send(injected);
    return;
  }

  // Product detail page: /products/:slug
  const productMatch = urlPath.match(/^\/products\/([^/]+)$/);
  if (productMatch) {
    const slug = productMatch[1];
    try {
      const rows = await db
        .select()
        .from(productsTable)
        .where(and(eq(productsTable.slug, slug), eq(productsTable.active, true)))
        .limit(1);

      if (rows.length > 0) {
        const p = rows[0];
        const notes = Array.isArray(p.notes) ? (p.notes as string[]).join(", ") : "";
        const rawDesc = `${p.name} by MagnifiScent — ${p.desc || `a premium Eau de Parfum with ${notes}. Long-lasting fragrance with Cash on Delivery across Pakistan.`}`;
        const desc = rawDesc.length > 160 ? rawDesc.slice(0, 157) + "…" : rawDesc;

        const productSchema = {
          "@context": "https://schema.org",
          "@type": "Product",
          name: p.name,
          description: p.desc,
          image: [p.img, p.img2].filter(Boolean),
          brand: { "@type": "Brand", name: "MagnifiScent" },
          sku: String(p.id),
          offers: {
            "@type": "Offer",
            priceCurrency: "PKR",
            price: p.priceNum,
            availability:
              p.stock > 0
                ? "https://schema.org/InStock"
                : "https://schema.org/OutOfStock",
            seller: { "@type": "Organization", name: "MagnifiScent" },
            url: `${SITE_DOMAIN}/products/${p.slug}`,
          },
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: p.rating,
            reviewCount: p.reviews,
            bestRating: 5,
            worstRating: 1,
          },
        };

        const breadcrumbSchema = {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: SITE_DOMAIN },
            { "@type": "ListItem", position: 2, name: "Products", item: `${SITE_DOMAIN}/products` },
            { "@type": "ListItem", position: 3, name: p.name, item: `${SITE_DOMAIN}/products/${p.slug}` },
          ],
        };

        const faqSchema = {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [
            {
              "@type": "Question",
              name: `Is ${p.name} long lasting?`,
              acceptedAnswer: {
                "@type": "Answer",
                text: `Yes, ${p.name} by MagnifiScent is formulated for long-lasting wear. It is an Eau de Parfum with ${p.size}, designed to keep you smelling great all day.`,
              },
            },
            {
              "@type": "Question",
              name: `What does ${p.name} smell like?`,
              acceptedAnswer: {
                "@type": "Answer",
                text: `${p.name} features the following scent notes: ${notes}. ${p.desc}`,
              },
            },
            {
              "@type": "Question",
              name: "Is Cash on Delivery available for this perfume?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Yes, MagnifiScent offers Cash on Delivery (COD) across Pakistan. Simply place your order and pay when it arrives at your door.",
              },
            },
          ],
        };

        const injected = injectMeta(html, {
          title: `${p.name} — MagnifiScent Pakistan`,
          description: desc,
          ogTitle: `${p.name} — MagnifiScent Pakistan`,
          ogDescription: desc,
          ogImage: p.img || "",
          ogType: "product",
          ogUrl: `${SITE_DOMAIN}/products/${p.slug}`,
          jsonLd: [productSchema, breadcrumbSchema, faqSchema],
        });

        res.type("html").send(injected);
        return;
      }
    } catch (err) {
      logger.error({ err }, "SSR meta injection failed for product slug: " + slug);
    }
  }

  // Default fallback
  res.type("html").send(html);
});

export default app;
