import { Router } from "express";
import { eq } from "drizzle-orm";
import { db } from "../lib/db.js";
import { dealsTable } from "@workspace/db";
import { requireAdminAuth } from "../middleware/auth.js";

const router = Router();

/* GET /api/deals — public returns active only; admin with ?all=true returns all */
router.get("/deals", async (req, res) => {
  try {
    const wantsAll = req.query.all === "true";
    if (wantsAll) {
      requireAdminAuth(req, res, async () => {
        try {
          const deals = await db.select().from(dealsTable).orderBy(dealsTable.id);
          res.json({ success: true, deals });
        } catch (err) {
          const message = err instanceof Error ? err.message : "Unknown error";
          res.status(500).json({ success: false, error: message });
        }
      });
      return;
    }
    const deals = await db
      .select()
      .from(dealsTable)
      .where(eq(dealsTable.active, true))
      .orderBy(dealsTable.id);
    res.json({ success: true, deals });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ success: false, error: message });
  }
});

/* POST /api/deals — admin auth required; create a new deal */
router.post("/deals", requireAdminAuth, async (req, res) => {
  try {
    const { id, name, contains, price, originalPrice, discount, active } = req.body;
    if (!id || !name || price === undefined || originalPrice === undefined) {
      res.status(400).json({ success: false, error: "Missing required fields: id, name, price, originalPrice" });
      return;
    }
    const [deal] = await db
      .insert(dealsTable)
      .values({ id, name, contains: contains ?? [], price, originalPrice, discount: discount ?? 0, active: active ?? true })
      .returning();
    res.status(201).json({ success: true, deal });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ success: false, error: message });
  }
});

/* PATCH /api/deals/:id — admin auth required; partial update */
router.patch("/deals/:id", requireAdminAuth, async (req, res) => {
  try {
    const { name, contains, price, originalPrice, discount, active } = req.body;
    const update: Record<string, unknown> = {};
    if (name !== undefined) update.name = name;
    if (contains !== undefined) update.contains = contains;
    if (price !== undefined) update.price = price;
    if (originalPrice !== undefined) update.originalPrice = originalPrice;
    if (discount !== undefined) update.discount = discount;
    if (active !== undefined) update.active = active;

    if (Object.keys(update).length === 0) {
      res.status(400).json({ success: false, error: "No fields to update" });
      return;
    }

    const [updated] = await db
      .update(dealsTable)
      .set(update)
      .where(eq(dealsTable.id, String(req.params.id)))
      .returning();
    if (!updated) {
      res.status(404).json({ success: false, error: "Deal not found" });
      return;
    }
    res.json({ success: true, deal: updated });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ success: false, error: message });
  }
});

/* DELETE /api/deals/:id — admin auth required */
router.delete("/deals/:id", requireAdminAuth, async (req, res) => {
  try {
    const [deleted] = await db
      .delete(dealsTable)
      .where(eq(dealsTable.id, String(req.params.id)))
      .returning();
    if (!deleted) {
      res.status(404).json({ success: false, error: "Deal not found" });
      return;
    }
    res.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ success: false, error: message });
  }
});

export default router;
