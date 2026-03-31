import { Router } from "express";
import { db } from "../lib/db.js";
import {
  storeSettingsTable,
  extendedSettingsTable,
  paymentSettingsTable,
} from "@workspace/db";
import { requireAdminAuth } from "../middleware/auth.js";

const router = Router();

/* GET /api/settings — admin auth required; returns all three settings tables merged */
router.get("/settings", requireAdminAuth, async (_req, res) => {
  try {
    const [[store], [extended], [payment]] = await Promise.all([
      db.select().from(storeSettingsTable).limit(1),
      db.select().from(extendedSettingsTable).limit(1),
      db.select().from(paymentSettingsTable).limit(1),
    ]);
    res.json({
      success: true,
      settings: {
        store: store ?? null,
        extended: extended ?? null,
        payment: payment ?? null,
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ success: false, error: message });
  }
});

/* PUT /api/settings — admin auth required; updates any/all of the three settings tables */
router.put("/settings", requireAdminAuth, async (req, res) => {
  try {
    const { store, extended, payment } = req.body;

    await db.transaction(async (tx) => {
      if (store && typeof store === "object") {
        const { id: _id, ...storeData } = store;
        await tx
          .insert(storeSettingsTable)
          .values({ id: 1, ...storeData })
          .onConflictDoUpdate({ target: storeSettingsTable.id, set: storeData });
      }
      if (extended && typeof extended === "object") {
        const { id: _id, ...extData } = extended;
        await tx
          .insert(extendedSettingsTable)
          .values({ id: 1, ...extData })
          .onConflictDoUpdate({ target: extendedSettingsTable.id, set: extData });
      }
      if (payment && typeof payment === "object") {
        const { id: _id, ...payData } = payment;
        await tx
          .insert(paymentSettingsTable)
          .values({ id: 1, ...payData })
          .onConflictDoUpdate({ target: paymentSettingsTable.id, set: payData });
      }
    });

    res.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ success: false, error: message });
  }
});

export default router;
