import express from "express";
import cors from "cors";
import helmet from "helmet";
import { env } from "./config/env.js";
import { errorHandler } from "./lib/http.js";
import { adminRouter } from "./routes/admin.js";
import { automationRouter } from "./routes/automation.js";
import { healthRouter } from "./routes/health.js";
import { publicRouter } from "./routes/public.js";

export function createApp() {
  const app = express();

  app.disable("x-powered-by");
  app.set("trust proxy", 1);
  app.use(helmet());
  // Sirf apne frontend ko allow karo. Server-to-server calls (Next.js, n8n) par CORS lagta hi nahi.
  app.use(cors({ origin: env.corsOrigins }));
  // Image upload base64 hota hai (3 MB file ~ 4 MB JSON). Baaki sab 2 MB.
  app.use("/api/automation/images", express.json({ limit: "5mb" }));
  app.use(express.json({ limit: "2mb" }));

  app.use("/api/health", healthRouter);
  app.use("/api/public", publicRouter);
  app.use("/api/admin", adminRouter);
  app.use("/api/automation", automationRouter);

  app.use((_req, res) => {
    res.status(404).json({ error: "Not found" });
  });
  app.use(errorHandler);

  return app;
}
