import { Schema, model } from "mongoose";
import { ADMIN_ROLES, LINK_TYPES, LOG_STATUSES } from "../constants.js";

// Link suggestions: automation suggest kare, editor approve kare (PDF section 8).
const linkSuggestionSchema = new Schema(
  {
    sourceArticle: { type: Schema.Types.ObjectId, ref: "Article", required: true, index: true },
    targetUrl: { type: String, required: true },
    anchorText: { type: String, required: true },
    reason: { type: String, default: "" },
    linkType: { type: String, enum: LINK_TYPES, required: true },
    approved: { type: Boolean, default: false },
  },
  { timestamps: true },
);
export const LinkSuggestion = model("LinkSuggestion", linkSuggestionSchema);

// n8n ke har node ka log (PDF section 2 + 6).
const workflowLogSchema = new Schema(
  {
    runId: { type: String, required: true, index: true },
    node: { type: String, required: true },
    status: { type: String, enum: LOG_STATUSES, required: true },
    retries: { type: Number, default: 0 },
    errorSummary: { type: String, default: "" },
    tokenCostEstimate: { type: Number, default: null },
    topicKey: { type: String, default: "" },
    meta: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true },
);
export const WorkflowLog = model("WorkflowLog", workflowLogSchema);

const adminUserSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    name: { type: String, default: "" },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: ADMIN_ROLES, default: "admin" },
    lastLoginAt: { type: Date, default: null },
  },
  { timestamps: true },
);
export const AdminUser = model("AdminUser", adminUserSchema);
