import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import path from "path";
import { fileURLToPath } from "url";
import router from "./routes";
import { logger } from "./lib/logger";
import { db } from "./lib/db.js";
import { productsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const staticDir = process.env["STATIC_DIR"] ||
  path.join(__dirname, "..", "..", "magnifiscent", "dist", "public");

const SITE_DOMAIN = process.env["SITE_DOMAIN"] || "https://magnifiscent.com";

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

// Serve built frontend static files in production
app.use(express.static(staticDir));

// SPA fallback — serve index.html for all non-API routes (Express 5 syntax)
app.get("/{*path}", (_req, res) => {
  res.sendFile(path.join(staticDir, "index.html"));
});

export default app;
