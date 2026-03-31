import { Router } from "express";
import { eq, asc } from "drizzle-orm";
import { db } from "../lib/db.js";
import {
  heroSlidesTable,
  genderBannersTable,
  notesImagesTable,
  productImagesTable,
  tickerMessagesTable,
  dealImagesTable,
  instagramReelsTable,
  homeHeadingsTable,
  policyPagesTable,
} from "@workspace/db";
import { requireAdminAuth } from "../middleware/auth.js";

const router = Router();

/* ─── Hero Slides ─── */
router.get("/hero-slides", async (_req, res) => {
  try {
    const slides = await db.select().from(heroSlidesTable).orderBy(asc(heroSlidesTable.position));
    res.json({ success: true, slides });
  } catch (err) {
    res.status(500).json({ success: false, error: err instanceof Error ? err.message : "Unknown error" });
  }
});

router.put("/hero-slides", requireAdminAuth, async (req, res) => {
  try {
    const { slides } = req.body;
    if (!Array.isArray(slides)) {
      res.status(400).json({ success: false, error: "slides must be an array" });
      return;
    }
    await db.transaction(async (tx) => {
      await tx.delete(heroSlidesTable);
      if (slides.length > 0) {
        await tx.insert(heroSlidesTable).values(
          slides.map((s: { id: string; src: string; alt?: string }, i: number) => ({
            id: s.id,
            src: s.src,
            alt: s.alt ?? "",
            position: i,
          }))
        );
      }
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err instanceof Error ? err.message : "Unknown error" });
  }
});

/* ─── Gender Banners ─── */
router.get("/gender-banners", async (_req, res) => {
  try {
    const [row] = await db.select().from(genderBannersTable).limit(1);
    res.json({ success: true, banners: row ?? { men: "", women: "" } });
  } catch (err) {
    res.status(500).json({ success: false, error: err instanceof Error ? err.message : "Unknown error" });
  }
});

router.put("/gender-banners", requireAdminAuth, async (req, res) => {
  try {
    const { men, women } = req.body;
    const update: Record<string, string> = {};
    if (men !== undefined) update.men = men;
    if (women !== undefined) update.women = women;
    await db
      .insert(genderBannersTable)
      .values({ id: 1, ...update })
      .onConflictDoUpdate({ target: genderBannersTable.id, set: update });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err instanceof Error ? err.message : "Unknown error" });
  }
});

/* ─── Notes Images ─── */
router.get("/notes-images", async (_req, res) => {
  try {
    const rows = await db.select().from(notesImagesTable).orderBy(asc(notesImagesTable.position));
    const map: Record<string, string> = {};
    for (const r of rows) map[r.note] = r.imageUrl;
    res.json({ success: true, notesImages: map });
  } catch (err) {
    res.status(500).json({ success: false, error: err instanceof Error ? err.message : "Unknown error" });
  }
});

router.put("/notes-images", requireAdminAuth, async (req, res) => {
  try {
    const { notesImages } = req.body;
    if (!notesImages || typeof notesImages !== "object") {
      res.status(400).json({ success: false, error: "notesImages must be an object" });
      return;
    }
    await db.transaction(async (tx) => {
      await tx.delete(notesImagesTable);
      const entries = Object.entries(notesImages as Record<string, string>);
      if (entries.length > 0) {
        await tx.insert(notesImagesTable).values(
          entries.map(([note, imageUrl], i) => ({ note, imageUrl, position: i }))
        );
      }
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err instanceof Error ? err.message : "Unknown error" });
  }
});

/* ─── Product Images ─── */
router.get("/product-images", async (_req, res) => {
  try {
    const rows = await db.select().from(productImagesTable).orderBy(asc(productImagesTable.productSlug));
    const map: Record<string, { img: string; img2: string }> = {};
    for (const r of rows) map[r.productSlug] = { img: r.img, img2: r.img2 };
    res.json({ success: true, productImages: map });
  } catch (err) {
    res.status(500).json({ success: false, error: err instanceof Error ? err.message : "Unknown error" });
  }
});

router.put("/product-images", requireAdminAuth, async (req, res) => {
  try {
    const { productImages } = req.body;
    if (!productImages || typeof productImages !== "object") {
      res.status(400).json({ success: false, error: "productImages must be an object" });
      return;
    }
    await db.transaction(async (tx) => {
      await tx.delete(productImagesTable);
      const entries = Object.entries(productImages as Record<string, { img: string; img2: string }>);
      if (entries.length > 0) {
        await tx.insert(productImagesTable).values(
          entries.map(([productSlug, imgs]) => ({
            productSlug,
            img: imgs.img ?? "",
            img2: imgs.img2 ?? "",
          }))
        );
      }
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err instanceof Error ? err.message : "Unknown error" });
  }
});

/* ─── Ticker Messages ─── */
router.get("/ticker-messages", async (_req, res) => {
  try {
    const rows = await db.select().from(tickerMessagesTable).orderBy(asc(tickerMessagesTable.position));
    res.json({ success: true, messages: rows.map((r) => r.message) });
  } catch (err) {
    res.status(500).json({ success: false, error: err instanceof Error ? err.message : "Unknown error" });
  }
});

router.put("/ticker-messages", requireAdminAuth, async (req, res) => {
  try {
    const { messages } = req.body;
    if (!Array.isArray(messages)) {
      res.status(400).json({ success: false, error: "messages must be an array" });
      return;
    }
    await db.transaction(async (tx) => {
      await tx.delete(tickerMessagesTable);
      if (messages.length > 0) {
        await tx.insert(tickerMessagesTable).values(
          messages.map((message: string, position: number) => ({ message, position }))
        );
      }
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err instanceof Error ? err.message : "Unknown error" });
  }
});

/* ─── Deal Images ─── */
router.get("/deal-images", async (_req, res) => {
  try {
    const rows = await db.select().from(dealImagesTable).orderBy(asc(dealImagesTable.dealId));
    const map: Record<string, { img1: string; img2: string }> = {};
    for (const r of rows) map[r.dealId] = { img1: r.img1, img2: r.img2 };
    res.json({ success: true, dealImages: map });
  } catch (err) {
    res.status(500).json({ success: false, error: err instanceof Error ? err.message : "Unknown error" });
  }
});

router.put("/deal-images", requireAdminAuth, async (req, res) => {
  try {
    const { dealImages } = req.body;
    if (!dealImages || typeof dealImages !== "object") {
      res.status(400).json({ success: false, error: "dealImages must be an object" });
      return;
    }
    await db.transaction(async (tx) => {
      await tx.delete(dealImagesTable);
      const entries = Object.entries(dealImages as Record<string, { img1?: string; img2?: string }>);
      if (entries.length > 0) {
        await tx.insert(dealImagesTable).values(
          entries.map(([dealId, imgs]) => ({
            dealId,
            img1: imgs.img1 ?? "",
            img2: imgs.img2 ?? "",
          }))
        );
      }
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err instanceof Error ? err.message : "Unknown error" });
  }
});

/* ─── Instagram Reels ─── */
router.get("/instagram-reels", async (_req, res) => {
  try {
    const reels = await db.select().from(instagramReelsTable).orderBy(asc(instagramReelsTable.position));
    res.json({ success: true, reels });
  } catch (err) {
    res.status(500).json({ success: false, error: err instanceof Error ? err.message : "Unknown error" });
  }
});

router.put("/instagram-reels", requireAdminAuth, async (req, res) => {
  try {
    const { reels } = req.body;
    if (!Array.isArray(reels)) {
      res.status(400).json({ success: false, error: "reels must be an array" });
      return;
    }
    await db.transaction(async (tx) => {
      await tx.delete(instagramReelsTable);
      if (reels.length > 0) {
        await tx.insert(instagramReelsTable).values(
          reels.map((r: { id: string; url: string; img: string; label: string; likes: number }, i: number) => ({
            id: r.id,
            url: r.url ?? "",
            img: r.img ?? "",
            label: r.label ?? "",
            likes: r.likes ?? 0,
            position: i,
          }))
        );
      }
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err instanceof Error ? err.message : "Unknown error" });
  }
});

/* ─── Home Headings ─── */
router.get("/home-headings", async (_req, res) => {
  try {
    const [row] = await db.select().from(homeHeadingsTable).limit(1);
    res.json({ success: true, headings: row ?? null });
  } catch (err) {
    res.status(500).json({ success: false, error: err instanceof Error ? err.message : "Unknown error" });
  }
});

router.put("/home-headings", requireAdminAuth, async (req, res) => {
  try {
    const { headings } = req.body;
    if (!headings || typeof headings !== "object") {
      res.status(400).json({ success: false, error: "headings must be an object" });
      return;
    }
    const { id: _id, ...data } = headings;
    await db
      .insert(homeHeadingsTable)
      .values({ id: 1, ...data })
      .onConflictDoUpdate({ target: homeHeadingsTable.id, set: data });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err instanceof Error ? err.message : "Unknown error" });
  }
});

/* ─── Policy Pages ─── */
router.get("/policy-pages", async (_req, res) => {
  try {
    const pages = await db.select().from(policyPagesTable).orderBy(asc(policyPagesTable.key));
    res.json({ success: true, pages });
  } catch (err) {
    res.status(500).json({ success: false, error: err instanceof Error ? err.message : "Unknown error" });
  }
});

router.put("/policy-pages", requireAdminAuth, async (req, res) => {
  try {
    const { pages } = req.body;
    if (!pages || typeof pages !== "object") {
      res.status(400).json({ success: false, error: "pages must be an object with keys: returns, shipping, privacy, terms" });
      return;
    }
    const validKeys = ["returns", "shipping", "privacy", "terms"] as const;
    await db.transaction(async (tx) => {
      for (const key of validKeys) {
        const page = pages[key];
        if (page && typeof page === "object") {
          await tx
            .insert(policyPagesTable)
            .values({ key, title: page.title ?? key, content: page.content ?? "" })
            .onConflictDoUpdate({
              target: policyPagesTable.key,
              set: { title: page.title ?? key, content: page.content ?? "" },
            });
        }
      }
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err instanceof Error ? err.message : "Unknown error" });
  }
});

/* GET /api/policy-pages/:key — public; returns a single policy page */
router.get("/policy-pages/:key", async (req, res) => {
  try {
    const validKeys = ["returns", "shipping", "privacy", "terms"];
    if (!validKeys.includes(req.params.key)) {
      res.status(400).json({ success: false, error: "Invalid policy page key" });
      return;
    }
    const [page] = await db
      .select()
      .from(policyPagesTable)
      .where(eq(policyPagesTable.key, req.params.key as "returns" | "shipping" | "privacy" | "terms"))
      .limit(1);
    if (!page) {
      res.status(404).json({ success: false, error: "Policy page not found" });
      return;
    }
    res.json({ success: true, page });
  } catch (err) {
    res.status(500).json({ success: false, error: err instanceof Error ? err.message : "Unknown error" });
  }
});

export default router;
