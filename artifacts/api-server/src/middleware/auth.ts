import type { Request, Response, NextFunction } from "express";

function getAdminKey(): string {
  return process.env.ADMIN_API_KEY || process.env.SESSION_SECRET || "";
}

export function isAuthorized(req: Request): boolean {
  const key = getAdminKey();
  if (!key) return true;
  const authHeader = (req.headers["authorization"] as string) ?? "";
  return authHeader === `Bearer ${key}`;
}

export function requireAdminAuth(req: Request, res: Response, next: NextFunction): void {
  if (!isAuthorized(req)) {
    res.status(401).json({ success: false, error: "Unauthorized" });
    return;
  }
  next();
}
