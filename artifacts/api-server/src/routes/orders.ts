import { Router } from "express";
import { eq, desc, inArray } from "drizzle-orm";
import { db } from "../lib/db.js";
import { ordersTable, orderItemsTable } from "@workspace/db";
import { requireAdminAuth } from "../middleware/auth.js";

const router = Router();

/* GET /api/orders — admin auth required, newest first, each order includes its items */
router.get("/orders", requireAdminAuth, async (_req, res) => {
  try {
    const orders = await db
      .select()
      .from(ordersTable)
      .orderBy(desc(ordersTable.createdAt));

    if (orders.length === 0) {
      res.json({ success: true, orders: [] });
      return;
    }

    const ids = orders.map((o) => o.id);
    const allItems = await db
      .select()
      .from(orderItemsTable)
      .where(inArray(orderItemsTable.orderId, ids));

    const itemsByOrder: Record<string, typeof allItems> = {};
    for (const item of allItems) {
      if (!itemsByOrder[item.orderId]) itemsByOrder[item.orderId] = [];
      itemsByOrder[item.orderId].push(item);
    }

    const result = orders.map((o) => ({ ...o, items: itemsByOrder[o.id] ?? [] }));
    res.json({ success: true, orders: result });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ success: false, error: message });
  }
});

/* POST /api/orders — public (called from checkout); inserts order + items in a transaction */
router.post("/orders", async (req, res) => {
  try {
    const { id, customer, items, total, status, date, paymentMethod } = req.body;
    if (!id || !customer || !items || total === undefined || !date) {
      res.status(400).json({ success: false, error: "Missing required fields: id, customer, items, total, date" });
      return;
    }
    if (!Array.isArray(items) || items.length === 0) {
      res.status(400).json({ success: false, error: "Order must contain at least one item" });
      return;
    }

    await db.transaction(async (tx) => {
      await tx.insert(ordersTable).values({
        id,
        customer,
        total,
        status: status ?? "Pending",
        date,
        paymentMethod: paymentMethod ?? "",
      });
      await tx.insert(orderItemsTable).values(
        items.map((item: { productId: number; productName: string; qty: number; price: number }) => ({
          orderId: id,
          productId: item.productId,
          productName: item.productName,
          qty: item.qty,
          price: item.price,
        }))
      );
    });

    res.status(201).json({ success: true, orderId: id });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ success: false, error: message });
  }
});

/* PATCH /api/orders/:id/status — admin auth required; update order status */
router.patch("/orders/:id/status", requireAdminAuth, async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];
    if (!validStatuses.includes(status)) {
      res.status(400).json({
        success: false,
        error: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
      });
      return;
    }
    const [updated] = await db
      .update(ordersTable)
      .set({ status })
      .where(eq(ordersTable.id, req.params.id))
      .returning();
    if (!updated) {
      res.status(404).json({ success: false, error: "Order not found" });
      return;
    }
    res.json({ success: true, order: updated });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ success: false, error: message });
  }
});

export default router;
