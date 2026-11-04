import { Schema, model } from "mongoose";
import { SOURCE_TYPES } from "../constants.js";

// Har product fact ka proof: kya likha, kahan se, kab check kiya.
const sourceFactSchema = new Schema(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true, index: true },
    fieldName: { type: String, required: true, trim: true },
    factValue: { type: String, required: true },
    sourceUrl: { type: String, required: true },
    sourceType: { type: String, enum: SOURCE_TYPES, default: "official" },
    checkedAt: { type: Date, required: true },
    evidenceNote: { type: String, default: "" },
  },
  { timestamps: true },
);

export const SourceFact = model("SourceFact", sourceFactSchema);
