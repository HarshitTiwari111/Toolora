import { timingSafeEqual } from "node:crypto";
import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export type AdminClaims = { sub: string; email: string; role: "admin" | "editor" };

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      admin?: AdminClaims;
    }
  }
}

export function signAdminToken(claims: AdminClaims) {
  return jwt.sign(claims, env.jwtSecret, { expiresIn: env.jwtExpiresIn as jwt.SignOptions["expiresIn"] });
}

// Admin panel: "Authorization: Bearer <jwt>"
export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const header = req.get("authorization") ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!token) return res.status(401).json({ error: "Login required" });
  try {
    req.admin = jwt.verify(token, env.jwtSecret) as AdminClaims;
    next();
  } catch {
    res.status(401).json({ error: "Session expired, please log in again" });
  }
}

function safeEqual(a: string, b: string) {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  return ab.length === bb.length && timingSafeEqual(ab, bb);
}

// n8n automation: "x-api-key: <AUTOMATION_API_KEY>". Ye key sirf drafts bana sakti hai.
export function requireAutomation(req: Request, res: Response, next: NextFunction) {
  const key = req.get("x-api-key") ?? "";
  if (!key || !safeEqual(key, env.automationApiKey)) {
    return res.status(401).json({ error: "Invalid automation API key" });
  }
  next();
}
