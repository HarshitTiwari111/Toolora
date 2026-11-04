import { Schema, model, type InferSchemaType } from "mongoose";
import { PRICING_MODELS, PRODUCT_STATUSES, PRODUCT_TYPES } from "../constants.js";

const productSchema = new Schema(
  {
    brandName: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    productType: { type: String, enum: PRODUCT_TYPES, required: true },
    categories: { type: [String], default: [] },
    shortDescription: { type: String, default: "" },
    officialUrl: { type: String, required: true },
    // Affiliate link citations se alag track hota hai (PDF section 8).
    affiliateUrl: { type: String, default: "" },
    logoRightsNote: { type: String, default: "" },
    pricingModel: { type: String, enum: PRICING_MODELS, default: "unknown" },
    platforms: { type: [String], default: [] },
    useCases: { type: [String], default: [] },
    lastVerifiedAt: { type: Date, default: null },
    status: { type: String, enum: PRODUCT_STATUSES, default: "draft" },
  },
  { timestamps: true },
);

productSchema.index({ productType: 1, categories: 1, status: 1 });

export type ProductDoc = InferSchemaType<typeof productSchema>;
export const Product = model("Product", productSchema);
