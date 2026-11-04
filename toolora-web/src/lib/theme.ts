// Har category ka apna rang — tiles, covers aur badges me visual variety ke liye.
export type Tone = { from: string; to: string; ink: string; soft: string };

const tones: Record<string, Tone> = {
  writing: { from: "#4f46e5", to: "#7c3aed", ink: "#4338ca", soft: "#eef0ff" },
  coding: { from: "#0f766e", to: "#0891b2", ink: "#0f766e", soft: "#e6f6f4" },
  "image-generation": { from: "#db2777", to: "#f97316", ink: "#be185d", soft: "#fdeef5" },
  video: { from: "#dc2626", to: "#f59e0b", ink: "#b91c1c", soft: "#fdeeee" },
  audio: { from: "#7c3aed", to: "#ec4899", ink: "#6d28d9", soft: "#f3edff" },
  research: { from: "#0369a1", to: "#4f46e5", ink: "#0369a1", soft: "#e8f3fb" },
  productivity: { from: "#16a34a", to: "#0d9488", ink: "#15803d", soft: "#e9f7ee" },
  marketing: { from: "#ea580c", to: "#e11d48", ink: "#c2410c", soft: "#fdf0e8" },
  chatbots: { from: "#2563eb", to: "#06b6d4", ink: "#1d4ed8", soft: "#ebf2fe" },
  automation: { from: "#9333ea", to: "#2563eb", ink: "#7e22ce", soft: "#f4ecfd" },
  "project-management": { from: "#0d9488", to: "#65a30d", ink: "#0f766e", soft: "#e6f6f4" },
  crm: { from: "#e11d48", to: "#9333ea", ink: "#be123c", soft: "#fdecf0" },
  "email-marketing": { from: "#f59e0b", to: "#ea580c", ink: "#b45309", soft: "#fdf5e6" },
  analytics: { from: "#2563eb", to: "#7c3aed", ink: "#1d4ed8", soft: "#ebf2fe" },
  "customer-support": { from: "#0891b2", to: "#16a34a", ink: "#0e7490", soft: "#e7f6fa" },
  finance: { from: "#15803d", to: "#ca8a04", ink: "#166534", soft: "#e9f5ec" },
  security: { from: "#334155", to: "#4f46e5", ink: "#334155", soft: "#eef0f4" },
  design: { from: "#c026d3", to: "#f43f5e", ink: "#a21caf", soft: "#faeafc" },
  // Sections
  reviews: { from: "#f59e0b", to: "#ea580c", ink: "#b45309", soft: "#fdf5e6" },
  compare: { from: "#2563eb", to: "#7c3aed", ink: "#1d4ed8", soft: "#ebf2fe" },
  alternatives: { from: "#0d9488", to: "#2563eb", ink: "#0f766e", soft: "#e6f6f4" },
  guides: { from: "#16a34a", to: "#0d9488", ink: "#15803d", soft: "#e9f7ee" },
  blog: { from: "#4f46e5", to: "#c026d3", ink: "#4338ca", soft: "#eef0ff" },
  "ai-tools": { from: "#6366f1", to: "#8b5cf6", ink: "#4338ca", soft: "#eef0ff" },
  saas: { from: "#0d9488", to: "#65a30d", ink: "#0f766e", soft: "#e6f6f4" },
  search: { from: "#334155", to: "#6366f1", ink: "#334155", soft: "#eef0f4" },
  trust: { from: "#334155", to: "#4f46e5", ink: "#334155", soft: "#eef0f4" },
};

const fallback: Tone = { from: "#312e81", to: "#7c3aed", ink: "#4338ca", soft: "#eef0ff" };

export function tone(slug?: string | null): Tone {
  return (slug && tones[slug]) || fallback;
}
