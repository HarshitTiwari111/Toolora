import { env } from "./config/env.js";
import { connectDb } from "./db.js";
import { createApp } from "./app.js";

async function main() {
  await connectDb();
  const app = createApp();
  app.listen(env.port, () => {
    console.log(`[api] toolora-api listening on http://localhost:${env.port}`);
  });
}

main().catch((err) => {
  console.error("[api] Failed to start:", err);
  process.exit(1);
});
