import { ImageResponse } from "next/og";

// Default social share image (WhatsApp, LinkedIn, X). Article pages apni cover image use karti hain.
export const alt = "Toolora.ai — AI tools reviews, comparisons and guides";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "linear-gradient(135deg, #121420 0%, #1b1e2d 60%, #2b2163 100%)",
          color: "#fff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 20,
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 44,
              fontWeight: 800,
            }}
          >
            T
          </div>
          <div style={{ fontSize: 44, fontWeight: 800 }}>Toolora</div>
          <div style={{ fontSize: 26, fontWeight: 800, background: "#f5b83d", color: "#121420", padding: "4px 12px", borderRadius: 10 }}>
            .ai
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: 68, fontWeight: 800, lineHeight: 1.1, maxWidth: 980 }}>
            Find the right AI tool — with facts you can check.
          </div>
          <div style={{ fontSize: 30, color: "#a5abc0" }}>Reviews · Comparisons · Alternatives · Guides</div>
        </div>
      </div>
    ),
    size,
  );
}
