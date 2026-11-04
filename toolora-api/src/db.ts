import mongoose from "mongoose";
import { env } from "./config/env.js";

export async function connectDb() {
  mongoose.connection.on("disconnected", () => console.warn("[db] MongoDB disconnected"));
  mongoose.connection.on("reconnected", () => console.log("[db] MongoDB reconnected"));
  await mongoose.connect(env.mongodbUri, { serverSelectionTimeoutMS: 5000 });
  console.log(`[db] Connected to MongoDB database "${mongoose.connection.name}"`);
}

const states: readonly string[] = ["disconnected", "connected", "connecting", "disconnecting"];

export function dbStatus() {
  return {
    state: states[mongoose.connection.readyState] ?? "unknown",
    name: mongoose.connection.name,
  };
}
