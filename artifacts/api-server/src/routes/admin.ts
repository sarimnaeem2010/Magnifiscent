import { Router } from "express";
import { db } from "../lib/db.js";
import { storeSettingsTable } from "@workspace/db";
import { requireAdminAuth } from "../middleware/auth.js";
import path from "path";
import fs from "fs/promises";

const router = Router();

const DEFAULT_PASSWORD = "admin123";

async function getStoredPassword(): Promise<string> {
  try {
    const [row] = await db.select({ adminPassword: storeSettingsTable.adminPassword }).from(storeSettingsTable).limit(1);
    return row?.adminPassword ?? DEFAULT_PASSWORD;
  } catch {
    return DEFAULT_PASSWORD;
  }
}

/* POST /api/admin/login — public; validates the admin password and returns a token on success */
router.post("/admin/login", async (req, res) => {
  try {
    const { password } = req.body;
    if (!password) {
      res.status(400).json({ success: false, error: "Missing required field: password" });
      return;
    }
    const storedPassword = await getStoredPassword();
    if (password !== storedPassword) {
      res.status(401).json({ success: false, error: "Invalid password" });
      return;
    }
    const token = process.env.ADMIN_API_KEY || process.env.SESSION_SECRET || "";
    res.json({ success: true, token });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ success: false, error: message });
  }
});

/* POST /api/admin/publish — admin auth required; confirms all changes are live */
router.post("/admin/publish", requireAdminAuth, (_req, res) => {
  res.json({ success: true, publishedAt: new Date().toISOString() });
});

/* POST /api/admin/change-password — admin auth required; updates the admin password */
router.post("/admin/change-password", requireAdminAuth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      res.status(400).json({ success: false, error: "Missing required fields: currentPassword, newPassword" });
      return;
    }
    const storedPassword = await getStoredPassword();
    if (currentPassword !== storedPassword) {
      res.status(401).json({ success: false, error: "Current password is incorrect" });
      return;
    }
    if (newPassword.length < 6) {
      res.status(400).json({ success: false, error: "New password must be at least 6 characters" });
      return;
    }
    await db
      .insert(storeSettingsTable)
      .values({ id: 1, adminPassword: newPassword })
      .onConflictDoUpdate({
        target: storeSettingsTable.id,
        set: { adminPassword: newPassword },
      });
    res.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ success: false, error: message });
  }
});

/* POST /api/admin/upload — admin auth required; saves base64 image to disk and returns a URL */
router.post("/admin/upload", requireAdminAuth, async (req, res) => {
  try {
    const { image } = req.body as { image?: string };
    if (!image || typeof image !== "string" || !image.startsWith("data:image/")) {
      res.status(400).json({ success: false, error: "Invalid image data" });
      return;
    }
    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");
    const uploadDir = path.join(process.cwd(), "uploads", "products");
    await fs.mkdir(uploadDir, { recursive: true });
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`;
    await fs.writeFile(path.join(uploadDir, filename), buffer);
    res.json({ success: true, url: `/uploads/products/${filename}` });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ success: false, error: message });
  }
});

export default router;
