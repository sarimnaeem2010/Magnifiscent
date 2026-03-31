import { Router } from "express";
import { eq, and } from "drizzle-orm";
import { db } from "../lib/db.js";
import { productsTable } from "@workspace/db";
import { requireAdminAuth } from "../middleware/auth.js";

const router = Router();

/* GET /api/products — public returns active; admin with ?all=true returns all */
router.get("/products", async (req, res) => {
  try {
    const wantsAll = req.query.all === "true";
    if (wantsAll) {
      requireAdminAuth(req, res, async () => {
        try {
          const products = await db.select().from(productsTable).orderBy(productsTable.id);
          res.json({ success: true, products });
        } catch (err) {
          const message = err instanceof Error ? err.message : "Unknown error";
          res.status(500).json({ success: false, error: message });
        }
      });
      return;
    }
    const products = await db
      .select()
      .from(productsTable)
      .where(eq(productsTable.active, true))
      .orderBy(productsTable.id);
    res.json({ success: true, products });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ success: false, error: message });
  }
});

/* GET /api/products/:slug — public, returns one active product */
router.get("/products/:slug", async (req, res) => {
  try {
    const [product] = await db
      .select()
      .from(productsTable)
      .where(and(eq(productsTable.slug, String(req.params.slug)), eq(productsTable.active, true)))
      .limit(1);
    if (!product) {
      res.status(404).json({ success: false, error: "Product not found" });
      return;
    }
    res.json({ success: true, product });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ success: false, error: message });
  }
});

/* POST /api/products — admin auth required; create a new product */
router.post("/products", requireAdminAuth, async (req, res) => {
  try {
    const { id, name, slug, img, img2, price, priceNum, originalPrice, originalPriceNum,
      reviews, rating, category, desc, notes, size, stock, active } = req.body;
    if (!id || !name || !slug || !category) {
      res.status(400).json({ success: false, error: "Missing required fields: id, name, slug, category" });
      return;
    }
    const [created] = await db.insert(productsTable).values({
      id: Number(id), name, slug, img: img ?? "", img2: img2 ?? "",
      price: price ?? "Rs. 0.00", priceNum: priceNum ?? 0,
      originalPrice: originalPrice ?? "Rs. 0.00", originalPriceNum: originalPriceNum ?? 0,
      reviews: reviews ?? 0, rating: rating ?? 5, category,
      desc: desc ?? "", notes: notes ?? [], size: size ?? "100ml",
      stock: stock ?? 0, active: active ?? false,
    }).returning();
    res.json({ success: true, product: created });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ success: false, error: message });
  }
});

/* DELETE /api/products/:id — admin auth required; remove a product */
router.delete("/products/:id", requireAdminAuth, async (req, res) => {
  try {
    const id = parseInt(String(req.params.id), 10);
    if (isNaN(id)) {
      res.status(400).json({ success: false, error: "Invalid product id" });
      return;
    }
    const [deleted] = await db.delete(productsTable).where(eq(productsTable.id, id)).returning();
    if (!deleted) {
      res.status(404).json({ success: false, error: "Product not found" });
      return;
    }
    res.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ success: false, error: message });
  }
});

/* PATCH /api/products/:id — admin auth required; partial update of stock/active/images/etc */
router.patch("/products/:id", requireAdminAuth, async (req, res) => {
  try {
    const id = parseInt(String(req.params.id), 10);
    if (isNaN(id)) {
      res.status(400).json({ success: false, error: "Invalid product id" });
      return;
    }
    const {
      stock, active, img, img2, name, slug, category,
      price, priceNum, originalPrice, originalPriceNum,
      desc, notes, size, rating, reviews
    } = req.body;
    const update: Record<string, unknown> = {};
    if (stock !== undefined) update.stock = stock;
    if (active !== undefined) update.active = active;
    if (img !== undefined) update.img = img;
    if (img2 !== undefined) update.img2 = img2;
    if (name !== undefined) update.name = name;
    if (slug !== undefined) update.slug = slug;
    if (category !== undefined) update.category = category;
    if (price !== undefined) update.price = price;
    if (priceNum !== undefined) update.priceNum = priceNum;
    if (originalPrice !== undefined) update.originalPrice = originalPrice;
    if (originalPriceNum !== undefined) update.originalPriceNum = originalPriceNum;
    if (desc !== undefined) update.desc = desc;
    if (notes !== undefined) update.notes = notes;
    if (size !== undefined) update.size = size;
    if (rating !== undefined) update.rating = rating;
    if (reviews !== undefined) update.reviews = reviews;

    if (Object.keys(update).length === 0) {
      res.status(400).json({ success: false, error: "No fields to update" });
      return;
    }

    const [updated] = await db
      .update(productsTable)
      .set(update)
      .where(eq(productsTable.id, id))
      .returning();
    if (!updated) {
      res.status(404).json({ success: false, error: "Product not found" });
      return;
    }
    res.json({ success: true, product: updated });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ success: false, error: message });
  }
});

export default router;
