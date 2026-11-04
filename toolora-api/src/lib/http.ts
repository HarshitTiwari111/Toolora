import type { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import { z, ZodError } from "zod";

export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
    public details?: unknown,
  ) {
    super(message);
  }
}

export function parse<T extends z.ZodType>(schema: T, data: unknown): z.infer<T> {
  return schema.parse(data);
}

export function objectId(id: string) {
  if (!mongoose.isValidObjectId(id)) throw new HttpError(400, "Invalid id");
  return id;
}

export function notFoundIfNull<T>(doc: T, what = "Resource"): NonNullable<T> {
  if (doc === null || doc === undefined) throw new HttpError(404, `${what} not found`);
  return doc as NonNullable<T>;
}

// Pagination: ?page=1&limit=20 (max 100)
export function paging(query: Request["query"]) {
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(query.limit) || 20));
  return { page, limit, skip: (page - 1) * limit };
}

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: "Validation failed",
      details: err.issues.map((i) => ({ path: i.path.join("."), message: i.message })),
    });
  }
  if (err instanceof HttpError) {
    return res.status(err.status).json({ error: err.message, details: err.details });
  }
  if (typeof err === "object" && err && (err as { code?: number }).code === 11000) {
    const keys = Object.keys((err as { keyValue?: object }).keyValue ?? {});
    return res.status(409).json({ error: `Duplicate value for: ${keys.join(", ") || "unique field"}` });
  }
  if (err instanceof mongoose.Error.ValidationError) {
    return res.status(400).json({ error: "Validation failed", details: Object.values(err.errors).map((e) => e.message) });
  }
  console.error("[api] Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
}
