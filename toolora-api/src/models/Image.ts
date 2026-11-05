import { Schema, model } from "mongoose";

// Article images (cover + inline). Render ki disk temporary hai, isliye file MongoDB me rakhte hain.
// Website inhe /media/{id}/{name} par dikhati hai (Next.js route API se laata hai).
export const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"] as const;
export const MAX_IMAGE_BYTES = 3 * 1024 * 1024;

const imageSchema = new Schema(
  {
    filename: { type: String, required: true },
    contentType: { type: String, enum: IMAGE_TYPES, required: true },
    size: { type: Number, required: true },
    alt: { type: String, default: "" },
    data: { type: Buffer, required: true, select: false },
    createdBy: { type: String, enum: ["admin", "automation"], default: "automation" },
  },
  { timestamps: true },
);

export const ImageAsset = model("ImageAsset", imageSchema);
