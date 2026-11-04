import { Schema, model } from "mongoose";
import { PRODUCT_TYPES, TOPIC_INTENTS, TOPIC_STATUSES } from "../constants.js";
import { makeTopicKey } from "../lib/text.js";

const topicSchema = new Schema(
  {
    primaryKeyword: { type: String, required: true, trim: true },
    secondaryQueries: { type: [String], default: [] },
    intent: { type: String, enum: TOPIC_INTENTS, required: true },
    productType: { type: String, enum: PRODUCT_TYPES, default: "ai" },
    brand: { type: String, default: "" },
    country: { type: String, default: "us" },
    language: { type: String, default: "en" },
    provider: { type: String, default: "" },
    // Sirf licensed keyword tool ka measured data; AI estimate nahi.
    volume: { type: Number, default: null },
    difficulty: { type: Number, default: null },
    clusterId: { type: String, default: "" },
    priority: { type: Number, min: 1, max: 5, default: 3 },
    sourceUrls: { type: [String], default: [] },
    // PDF step 7: sources kab check kiye.
    sourceCheckedAt: { type: Date, default: null },
    status: { type: String, enum: TOPIC_STATUSES, default: "new", index: true },
    assignedEditor: { type: String, default: "" },
    article: { type: Schema.Types.ObjectId, ref: "Article", default: null },
    topicKey: { type: String, required: true, unique: true },
  },
  { timestamps: true },
);

topicSchema.pre("validate", function () {
  if (this.primaryKeyword && this.intent) {
    this.topicKey = makeTopicKey(this.productType ?? "ai", this.intent, this.primaryKeyword);
  }
});

export const Topic = model("Topic", topicSchema);
