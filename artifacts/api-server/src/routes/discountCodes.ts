import { Router } from "express";
import { eq } from "drizzle-orm";
import { db } from "../lib/db.js";
import { discountCodesTable } from "@workspace/db";
import { requireAdminAuth } from "../middleware/auth.js";

const router = Router();

/* GET /api/discount-codes — admin auth required */
router.get("/discount-codes", requireAdminAuth, async (_req, res) => {
  try {
    const codes = await db.select().from(discountCodesTable).orderBy(discountCodesTable.id);
    res.json({ success: true, codes });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ success: false, error: message });
  }
});

/* POST /api/discount-codes — admin auth required; create a new code */
router.post("/discount-codes", requireAdminAuth, async (req, res) => {
  try {
    const { id, code, type, value, minOrder, maxUses, active, expiry } = req.body;
    if (!id || !code || !type || value === undefined) {
      res.status(400).json({ success: false, error: "Missing required fields: id, code, type, value" });
      return;
    }
    if (!["percent", "fixed"].includes(type)) {
      res.status(400).json({ success: false, error: "type must be 'percent' or 'fixed'" });
      return;
    }
    const [discount] = await db
      .insert(discountCodesTable)
      .values({
        id,
        code: code.toUpperCase(),
        type,
        value,
        minOrder: minOrder ?? 0,
        maxUses: maxUses ?? 0,
        usedCount: 0,
        active: active ?? true,
        expiry: expiry ?? "",
      })
      .returning();
    res.status(201).json({ success: true, discount });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ success: false, error: message });
  }
});

/* PATCH /api/discount-codes/:id — admin auth required; partial update */
router.patch("/discount-codes/:id", requireAdminAuth, async (req, res) => {
  try {
    const { code, type, value, minOrder, maxUses, usedCount, active, expiry } = req.body;
    const update: Record<string, unknown> = {};
    if (code !== undefined) update.code = (code as string).toUpperCase();
    if (type !== undefined) update.type = type;
    if (value !== undefined) update.value = value;
    if (minOrder !== undefined) update.minOrder = minOrder;
    if (maxUses !== undefined) update.maxUses = maxUses;
    if (usedCount !== undefined) update.usedCount = usedCount;
    if (active !== undefined) update.active = active;
    if (expiry !== undefined) update.expiry = expiry;

    if (Object.keys(update).length === 0) {
      res.status(400).json({ success: false, error: "No fields to update" });
      return;
    }

    const [updated] = await db
      .update(discountCodesTable)
      .set(update)
      .where(eq(discountCodesTable.id, req.params.id))
      .returning();
    if (!updated) {
      res.status(404).json({ success: false, error: "Discount code not found" });
      return;
    }
    res.json({ success: true, discount: updated });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ success: false, error: message });
  }
});

/* DELETE /api/discount-codes/:id — admin auth required */
router.delete("/discount-codes/:id", requireAdminAuth, async (req, res) => {
  try {
    const [deleted] = await db
      .delete(discountCodesTable)
      .where(eq(discountCodesTable.id, req.params.id))
      .returning();
    if (!deleted) {
      res.status(404).json({ success: false, error: "Discount code not found" });
      return;
    }
    res.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ success: false, error: message });
  }
});

/* POST /api/discount-codes/apply — public; validates a code and returns the discount */
router.post("/discount-codes/apply", async (req, res) => {
  try {
    const { code, subtotal } = req.body;
    if (!code || subtotal === undefined) {
      res.status(400).json({ success: false, error: "Missing required fields: code, subtotal" });
      return;
    }
    const [found] = await db
      .select()
      .from(discountCodesTable)
      .where(eq(discountCodesTable.code, (code as string).toUpperCase().trim()))
      .limit(1);

    if (!found || !found.active) {
      res.json({ valid: false, discount: 0, message: "Invalid or inactive discount code." });
      return;
    }

    if (found.expiry) {
      const expiry = new Date(found.expiry);
      expiry.setHours(23, 59, 59);
      if (expiry < new Date()) {
        res.json({ valid: false, discount: 0, message: "This discount code has expired." });
        return;
      }
    }

    if (found.minOrder > 0 && subtotal < found.minOrder) {
      res.json({
        valid: false,
        discount: 0,
        message: `Minimum order of Rs. ${found.minOrder.toFixed(0)} required for this code.`,
      });
      return;
    }

    if (found.maxUses > 0 && found.usedCount >= found.maxUses) {
      res.json({ valid: false, discount: 0, message: "This discount code has reached its usage limit." });
      return;
    }

    const discount =
      found.type === "percent"
        ? Math.min(subtotal * (found.value / 100), subtotal)
        : Math.min(found.value, subtotal);

    const message =
      found.type === "percent"
        ? `${found.value}% discount applied!`
        : `Rs. ${found.value.toFixed(0)} discount applied!`;

    res.json({ valid: true, discount, message, code: found });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ success: false, error: message });
  }
});

export default router;
