import { Router } from "express";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const router = Router();

/*
 * Config file: <api-server-root>/data/email-config.json
 * At runtime, import.meta.url is artifacts/api-server/dist/index.mjs
 * path.dirname → artifacts/api-server/dist
 * ../data      → artifacts/api-server/data   ✓
 */
const CONFIG_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../data");
const CONFIG_PATH = path.join(CONFIG_DIR, "email-config.json");

/* ── Auth helper ────────────────────────────────────────────────────────── */
function getAdminKey(): string {
  return process.env.ADMIN_API_KEY || process.env.SESSION_SECRET || "";
}

function isAuthorized(req: { headers: Record<string, string | string[] | undefined> }): boolean {
  const key = getAdminKey();
  if (!key) return true; // no key configured → open (dev mode only)
  const authHeader = req.headers["authorization"] ?? "";
  return authHeader === `Bearer ${key}`;
}

/* ── Types ───────────────────────────────────────────────────────────────── */
export type ServerSmtpSettings = {
  host: string;
  port: number;
  secure: boolean;
  username: string;
  password: string;
  fromName: string;
  fromEmail: string;
  replyTo: string;
};

export type ServerEmailToggles = {
  order_confirmation: boolean;
  order_shipped: boolean;
  order_delivered: boolean;
  abandoned_cart: boolean;
  welcome_email: boolean;
  new_order_alert: boolean;
  low_stock_alert: boolean;
};

export type ServerEmailTemplate = { subject: string; body: string };
export type ServerEmailTemplates = Record<string, ServerEmailTemplate>;

export type EmailConfig = {
  smtp: ServerSmtpSettings | null;
  toggles: ServerEmailToggles;
  templates: ServerEmailTemplates;
};

const DEFAULT_TOGGLES: ServerEmailToggles = {
  order_confirmation: true,
  order_shipped: true,
  order_delivered: false,
  abandoned_cart: false,
  welcome_email: false,
  new_order_alert: true,
  low_stock_alert: false,
};

async function readConfig(): Promise<EmailConfig> {
  try {
    const raw = await readFile(CONFIG_PATH, "utf-8");
    const parsed = JSON.parse(raw);
    return {
      smtp: parsed.smtp ?? null,
      toggles: { ...DEFAULT_TOGGLES, ...(parsed.toggles ?? {}) },
      templates: parsed.templates ?? {},
    };
  } catch {
    return { smtp: null, toggles: { ...DEFAULT_TOGGLES }, templates: {} };
  }
}

async function writeConfig(config: EmailConfig): Promise<void> {
  await mkdir(CONFIG_DIR, { recursive: true });
  await writeFile(CONFIG_PATH, JSON.stringify(config, null, 2), "utf-8");
}

/* GET /api/email-config — requires admin auth; returns config with password masked */
router.get("/email-config", async (req, res) => {
  if (!isAuthorized(req)) {
    res.status(401).json({ success: false, error: "Unauthorized" });
    return;
  }
  try {
    const config = await readConfig();
    const safeConfig = {
      ...config,
      smtp: config.smtp
        ? { ...config.smtp, password: config.smtp.password ? "••••••••" : "" }
        : null,
    };
    res.json({ success: true, config: safeConfig });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ success: false, error: message });
  }
});

/* POST /api/email-config — requires admin auth; saves full config */
router.post("/email-config", async (req, res) => {
  if (!isAuthorized(req)) {
    res.status(401).json({ success: false, error: "Unauthorized" });
    return;
  }
  try {
    const { smtp, toggles, templates } = req.body;
    const existing = await readConfig();

    const updated: EmailConfig = {
      smtp: smtp !== undefined ? smtp : existing.smtp,
      toggles: toggles !== undefined ? { ...DEFAULT_TOGGLES, ...toggles } : existing.toggles,
      templates: templates !== undefined ? templates : existing.templates,
    };

    // If password is the masked placeholder, keep the existing password
    if (updated.smtp && updated.smtp.password === "••••••••" && existing.smtp) {
      updated.smtp.password = existing.smtp.password;
    }

    await writeConfig(updated);
    res.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ success: false, error: message });
  }
});

export { readConfig };
export default router;
