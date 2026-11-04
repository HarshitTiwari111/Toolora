import { Router } from "express";
import mongoose from "mongoose";
import { dbStatus } from "../db.js";

export const healthRouter = Router();

// GET /api/health — API aur database dono ka status.
healthRouter.get("/", async (_req, res) => {
  const db = dbStatus();
  let pingMs: number | null = null;
  if (db.state === "connected" && mongoose.connection.db) {
    const start = Date.now();
    await mongoose.connection.db.admin().ping();
    pingMs = Date.now() - start;
  }
  const ok = db.state === "connected";
  res.status(ok ? 200 : 503).json({
    status: ok ? "ok" : "degraded",
    service: "toolora-api",
    time: new Date().toISOString(),
    db: { ...db, pingMs },
  });
});
