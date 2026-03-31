import { Router } from "express";
import { eq } from "drizzle-orm";
import { db } from "../lib/db.js";
import { productsTable } from "@workspace/db";
import { requireAdminAuth } from "../middleware/auth.js";

const router = Router();

/* GET /api/products — public, returns all active products */
router.get("/products", async (_req, res) => {
  try {
    const products = await db
      .select()
      .from(productsTable)
      .orderBy(productsTable.id);
    res.json({ success: true, products });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ success: false, error: message });
  }
});

/* GET /api/products/:slug — public, returns one product */
router.get("/products/:slug", async (req, res) => {
  try {
    const [product] = await db
      .select()
      .from(productsTable)
      .where(eq(productsTable.slug, req.params.slug))
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

/* PATCH /api/products/:id — admin auth required; partial update of stock/active/images/etc */
router.patch("/products/:id", requireAdminAuth, async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ success: false, error: "Invalid product id" });
      return;
    }
    const { stock, active, img, img2, name, price, priceNum, originalPrice, originalPriceNum, desc, notes, size, rating, reviews } = req.body;
    const update: Record<string, unknown> = {};
    if (stock !== undefined) update.stock = stock;
    if (active !== undefined) update.active = active;
    if (img !== undefined) update.img = img;
    if (img2 !== undefined) update.img2 = img2;
    if (name !== undefined) update.name = name;
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
