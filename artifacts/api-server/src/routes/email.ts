import { Router } from "express";
import nodemailer from "nodemailer";

const router = Router();

function replacePlaceholders(template: string, vars: Record<string, string>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => vars[key] ?? "");
}

router.post("/send-email", async (req, res) => {
  try {
    const { smtp, from, replyTo, to, subject, html, text, variables } = req.body;

    if (!to) {
      res.status(400).json({ success: false, error: "Missing required field: to" });
      return;
    }
    if (!subject) {
      res.status(400).json({ success: false, error: "Missing required field: subject" });
      return;
    }
    if (!html && !text) {
      res.status(400).json({ success: false, error: "Missing required field: html or text" });
      return;
    }
    if (!smtp || !smtp.host || !smtp.auth?.user || !smtp.auth?.pass) {
      res.status(400).json({ success: false, error: "Missing or incomplete SMTP configuration" });
      return;
    }

    const transporter = nodemailer.createTransport({
      host: smtp.host,
      port: smtp.port ?? 587,
      secure: smtp.secure ?? false,
      auth: {
        user: smtp.auth.user,
        pass: smtp.auth.pass,
      },
    });

    const finalVars: Record<string, string> = variables ?? {};

    const info = await transporter.sendMail({
      from: from ?? smtp.auth.user,
      replyTo: replyTo ?? undefined,
      to,
      subject: replacePlaceholders(subject, finalVars),
      html: html ? replacePlaceholders(html, finalVars) : undefined,
      text: text ? replacePlaceholders(text, finalVars) : undefined,
    });

    res.json({ success: true, messageId: info.messageId });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ success: false, error: message });
  }
});

export default router;
