import { Router } from "express";
import nodemailer from "nodemailer";
import { readConfig } from "./emailConfig";

const router = Router();

/* ── Variable replacement ── */
function replacePlaceholders(template: string, vars: Record<string, string>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => vars[key] ?? "");
}

/* ── Server-side default templates (fallback when admin hasn't customised) ── */
const SERVER_DEFAULT_TEMPLATES: Record<string, { subject: string; body: string }> = {
  order_confirmation: {
    subject: "Your MagnifiScent Order is Confirmed!",
    body: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#fff;border:1px solid #e5e7eb;border-radius:8px">
<h2 style="font-family:Georgia,serif;color:#111827;margin-top:0">Order Confirmed!</h2>
<p>Dear {{customer_name}},</p>
<p>Thank you for your order <strong>{{order_id}}</strong> totalling <strong>{{order_total}}</strong>. It is now being processed and will be dispatched within 1–2 business days.</p>
<p style="color:#6b7280;font-size:14px"><em>— The {{store_name}} Team</em></p>
</div>`,
  },
  order_shipped: {
    subject: "Your MagnifiScent order has been shipped!",
    body: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#fff;border:1px solid #e5e7eb;border-radius:8px">
<h2 style="font-family:Georgia,serif;color:#111827;margin-top:0">Your Order Is On Its Way!</h2>
<p>Dear {{customer_name}},</p>
<p>Your order <strong>{{order_id}}</strong> has been shipped. Estimated delivery: 3–5 business days.</p>
<p style="color:#6b7280;font-size:14px"><em>— The {{store_name}} Team</em></p>
</div>`,
  },
  order_delivered: {
    subject: "Your MagnifiScent order has been delivered!",
    body: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#fff;border:1px solid #e5e7eb;border-radius:8px">
<h2 style="font-family:Georgia,serif;color:#111827;margin-top:0">Order Delivered!</h2>
<p>Dear {{customer_name}},</p>
<p>Your order <strong>{{order_id}}</strong> has been delivered. We hope you love your fragrance!</p>
<p style="color:#6b7280;font-size:14px"><em>— The {{store_name}} Team</em></p>
</div>`,
  },
  abandoned_cart: {
    subject: "You left something behind — complete your MagnifiScent order",
    body: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#fff;border:1px solid #e5e7eb;border-radius:8px">
<h2 style="font-family:Georgia,serif;color:#111827;margin-top:0">Your Cart Misses You</h2>
<p>Dear {{customer_name}},</p>
<p>You left items in your cart. Come back and complete your order before they sell out!</p>
<p style="color:#6b7280;font-size:14px"><em>— The {{store_name}} Team</em></p>
</div>`,
  },
  welcome_email: {
    subject: "Welcome to MagnifiScent — Thank you for your first order!",
    body: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#fff;border:1px solid #e5e7eb;border-radius:8px">
<h2 style="font-family:Georgia,serif;color:#111827;margin-top:0">Welcome to {{store_name}}!</h2>
<p>Dear {{customer_name}},</p>
<p>Thank you for placing your first order <strong>{{order_id}}</strong> with us!</p>
<p style="color:#6b7280;font-size:14px"><em>— The {{store_name}} Team</em></p>
</div>`,
  },
  new_order_alert: {
    subject: "New Order Received — {{order_id}}",
    body: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#fff;border:1px solid #e5e7eb;border-radius:8px">
<h2 style="font-family:Georgia,serif;color:#111827;margin-top:0">New Order Alert</h2>
<p>Customer: <strong>{{customer_name}}</strong></p>
<p>Order ID: <strong>{{order_id}}</strong> — Total: <strong>{{order_total}}</strong></p>
</div>`,
  },
  low_stock_alert: {
    subject: "Low Stock Alert — {{store_name}}",
    body: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#fff;border:1px solid #e5e7eb;border-radius:8px">
<h2 style="font-family:Georgia,serif;color:#111827;margin-top:0">Low Stock Alert</h2>
<p>A product in your store is running low on stock. Please review your inventory.</p>
</div>`,
  },
  test: {
    subject: "MagnifiScent — Test Email",
    body: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#fff;border:1px solid #e5e7eb;border-radius:8px">
<h2 style="font-family:Georgia,serif;color:#111827;margin-top:0">Test Email</h2>
<p>Your SMTP settings are working correctly!</p>
<p style="color:#6b7280;font-size:14px"><em>— MagnifiScent Admin Panel</em></p>
</div>`,
  },
};

/* Simple in-memory rate limiter (per SMTP user, max 20 req/min) */
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
function checkRateLimit(key: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(key);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + 60_000 });
    return true;
  }
  if (entry.count >= 20) return false;
  entry.count++;
  return true;
}

/*
 * POST /api/send-email
 *
 * Callers provide ONLY business context:
 *   type: string — email type key
 *   orderId?, customerEmail?, customerName?, orderTotal?, items?
 *   variables?: Record<string, string> — extra variable overrides
 *
 * The server:
 *   1. Reads SMTP config from its own server-side storage (email-config.json)
 *   2. Checks the toggle for the requested type
 *   3. Resolves template (admin-saved first, server default as fallback)
 *   4. Replaces {{variables}} and sends via nodemailer
 *
 * SMTP credentials never travel through the client → server path for normal sends.
 * Admin test-sends (type: "test") work the same way once SMTP is stored server-side.
 */
router.post("/send-email", async (req, res) => {
  try {
    const { type, orderId, customerEmail, customerName, orderTotal, items, variables: extraVars } = req.body;

    if (!type) {
      res.status(400).json({ success: false, error: "Missing required field: type" });
      return;
    }

    // Load server-side config
    const config = await readConfig();

    if (!config.smtp?.host || !config.smtp?.username || !config.smtp?.password) {
      res.status(503).json({ success: false, error: "SMTP not configured on server. Save SMTP settings from the admin panel first." });
      return;
    }

    // Check toggle (skip for "test" sends)
    if (type !== "test" && config.toggles[type as keyof typeof config.toggles] === false) {
      res.json({ success: true, skipped: true, reason: `Notification type '${type}' is disabled.` });
      return;
    }

    const recipient = customerEmail;
    if (!recipient && type !== "new_order_alert" && type !== "low_stock_alert") {
      res.status(400).json({ success: false, error: "Missing required field: customerEmail" });
      return;
    }

    // Rate limit by SMTP username
    if (!checkRateLimit(config.smtp.username)) {
      res.status(429).json({ success: false, error: "Rate limit exceeded. Try again in a minute." });
      return;
    }

    // Resolve template: admin-saved (from server config) > server hardcoded default
    const savedTpl = config.templates[type];
    const defaultTpl = SERVER_DEFAULT_TEMPLATES[type];
    const tpl = (savedTpl?.subject && savedTpl?.body) ? savedTpl : defaultTpl;

    if (!tpl) {
      res.status(400).json({ success: false, error: `Unknown email type: ${type}` });
      return;
    }

    // Build variables map
    const vars: Record<string, string> = {
      customer_name: customerName ?? "",
      order_id: orderId ?? "",
      order_total: String(orderTotal ?? ""),
      store_name: "MagnifiScent",
      ...(extraVars ?? {}),
    };

    const subject = replacePlaceholders(tpl.subject, vars);
    const html = replacePlaceholders(tpl.body, vars);

    const transporter = nodemailer.createTransport({
      host: config.smtp.host,
      port: config.smtp.port ?? 587,
      secure: config.smtp.secure ?? false,
      auth: {
        user: config.smtp.username,
        pass: config.smtp.password,
      },
    });

    // Determine recipient: for admin alerts, send to the configured fromEmail
    const to = (type === "new_order_alert" || type === "low_stock_alert")
      ? config.smtp.fromEmail
      : (recipient ?? config.smtp.fromEmail);

    const info = await transporter.sendMail({
      from: `"${config.smtp.fromName}" <${config.smtp.fromEmail}>`,
      replyTo: config.smtp.replyTo || undefined,
      to,
      subject,
      html,
    });

    res.json({ success: true, messageId: info.messageId });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ success: false, error: message });
  }
});

export default router;
