import { Router } from "express";
import nodemailer from "nodemailer";

const router = Router();

/* ── Variable replacement ── */
function replacePlaceholders(template: string, vars: Record<string, string>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => vars[key] ?? "");
}

/* ── Server-side default templates (used as fallback only) ── */
const SERVER_DEFAULT_TEMPLATES: Record<string, { subject: string; body: string }> = {
  order_confirmation: {
    subject: "Your MagnifiScent Order is Confirmed!",
    body: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#fff;border:1px solid #e5e7eb;border-radius:8px">
<h2 style="font-family:Georgia,serif;color:#111827;margin-top:0">Order Confirmed!</h2>
<p>Dear {{customer_name}},</p>
<p>Thank you for your order! Your order <strong>{{order_id}}</strong> totalling <strong>{{order_total}}</strong> has been received and is being processed.</p>
<p>Your order will be dispatched within 1–2 business days.</p>
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
<p>Thank you for placing your first order with us. Your order <strong>{{order_id}}</strong> is being processed.</p>
<p style="color:#6b7280;font-size:14px"><em>— The {{store_name}} Team</em></p>
</div>`,
  },
  new_order_alert: {
    subject: "New Order Received — {{order_id}}",
    body: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#fff;border:1px solid #e5e7eb;border-radius:8px">
<h2 style="font-family:Georgia,serif;color:#111827;margin-top:0">New Order Alert</h2>
<p>Customer: <strong>{{customer_name}}</strong></p>
<p>Order: <strong>{{order_id}}</strong> — Total: <strong>{{order_total}}</strong></p>
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
 * Accepts:
 *   smtp: { host, port, secure, auth: { user, pass } }  — required
 *   from: string  — "Name <email>"
 *   replyTo?: string
 *   to: string  — recipient (for customer emails)
 *              OR use customerEmail for the checkout contract
 *   type: string  — template key ("order_confirmation", "test", etc.)
 *
 *   Business payload (checkout contract):
 *   orderId?, customerEmail?, customerName?, orderTotal?, items?
 *
 *   Template override (uses admin-saved template if provided):
 *   template?: { subject: string; body: string }
 *
 *   variables?: Record<string, string>  — merged with auto-mapped business fields
 *
 * Security: rate-limited per SMTP user; validates smtp host is present.
 */
router.post("/send-email", async (req, res) => {
  try {
    const {
      smtp, from, replyTo,
      to, customerEmail,
      type,
      orderId, customerName, orderTotal, items,
      template: clientTemplate,
      variables: extraVars,
    } = req.body;

    if (!type) {
      res.status(400).json({ success: false, error: "Missing required field: type" });
      return;
    }
    if (!smtp?.host || !smtp?.auth?.user || !smtp?.auth?.pass) {
      res.status(400).json({ success: false, error: "Missing or incomplete SMTP config (host, auth.user, auth.pass required)" });
      return;
    }

    const recipient = customerEmail ?? to;
    if (!recipient) {
      res.status(400).json({ success: false, error: "Missing recipient: provide 'to' or 'customerEmail'" });
      return;
    }

    // Rate limit by SMTP user to prevent open relay abuse
    if (!checkRateLimit(smtp.auth.user)) {
      res.status(429).json({ success: false, error: "Rate limit exceeded. Try again in a minute." });
      return;
    }

    // Build variables map: auto-map business payload fields + caller-supplied extras
    const vars: Record<string, string> = {
      customer_name: customerName ?? "",
      order_id: orderId ?? "",
      order_total: String(orderTotal ?? ""),
      store_name: "MagnifiScent",
      ...(extraVars ?? {}),
    };

    // Resolve template: prefer admin-saved template (sent from client), fall back to server defaults
    const tpl = clientTemplate ?? SERVER_DEFAULT_TEMPLATES[type];
    if (!tpl) {
      res.status(400).json({ success: false, error: `Unknown email type: ${type}` });
      return;
    }

    const subject = replacePlaceholders(tpl.subject, vars);
    const html = replacePlaceholders(tpl.body, vars);

    const transporter = nodemailer.createTransport({
      host: smtp.host,
      port: smtp.port ?? 587,
      secure: smtp.secure ?? false,
      auth: {
        user: smtp.auth.user,
        pass: smtp.auth.pass,
      },
    });

    const info = await transporter.sendMail({
      from: from ?? smtp.auth.user,
      replyTo: replyTo ?? undefined,
      to: recipient,
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
