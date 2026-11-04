// Admin user banata hai ya uska password reset karta hai.
// Usage: .env me ADMIN_EMAIL aur ADMIN_PASSWORD set karo, phir `npm run create-admin`.
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { connectDb } from "../db.js";
import { AdminUser } from "../models/misc.js";

async function main() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD ?? "";
  const name = process.env.ADMIN_NAME ?? "Admin";
  if (!email || !email.includes("@")) throw new Error("Set ADMIN_EMAIL in .env");
  if (password.length < 12) throw new Error("ADMIN_PASSWORD must be at least 12 characters");

  await connectDb();
  const passwordHash = await bcrypt.hash(password, 12);
  const existing = await AdminUser.findOne({ email });
  if (existing) {
    existing.passwordHash = passwordHash;
    existing.name = name;
    await existing.save();
    console.log(`[admin] Password updated for ${email}`);
  } else {
    await AdminUser.create({ email, name, passwordHash, role: "admin" });
    console.log(`[admin] Admin user created: ${email}`);
  }
  await mongoose.disconnect();
}

main().catch(async (err) => {
  console.error("[admin] Failed:", err.message);
  await mongoose.disconnect();
  process.exit(1);
});
