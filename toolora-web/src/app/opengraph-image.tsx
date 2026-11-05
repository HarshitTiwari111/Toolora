import { ImageResponse } from "next/og";

// Default social share image (WhatsApp, LinkedIn, X). Article pages apni cover image use karti hain.
export const alt = "Toolora.ai: AI tool reviews, comparisons and guides";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const MARK = `data:image/svg+xml;base64,${Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40">\n  <defs>\n    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">\n      <stop offset="0" stop-color="#4f46e5"/>\n      <stop offset=".55" stop-color="#7c3aed"/>\n      <stop offset="1" stop-color="#a21caf"/>\n    </linearGradient>\n    <linearGradient id="hl" x1="0" y1="0" x2="0" y2="1">\n      <stop offset="0" stop-color="#fff" stop-opacity=".28"/>\n      <stop offset="1" stop-color="#fff" stop-opacity="0"/>\n    </linearGradient>\n    <linearGradient id="sp" x1="0" y1="0" x2="1" y2="1">\n      <stop offset="0" stop-color="#fde68a"/>\n      <stop offset="1" stop-color="#f59e0b"/>\n    </linearGradient>\n  </defs>\n  <rect width="40" height="40" rx="12" fill="url(#bg)"/>\n  <path d="M0 12A12 12 0 0 1 12 0h16a12 12 0 0 1 12 12v6H0z" fill="url(#hl)"/>\n  <rect x="8.5" y="10.5" width="15.5" height="5.2" rx="2.6" fill="#fff"/>\n  <rect x="13.65" y="10.5" width="5.2" height="19.5" rx="2.6" fill="#fff"/>\n  <path d="M29.5 7.6Q30 13.1 35.4 13.6Q30 14.1 29.5 19.6Q29 14.1 23.6 13.6Q29 13.1 29.5 7.6Z" fill="url(#sp)"/>\n</svg>`).toString("base64")}`;

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
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse ke andar plain img hi chalta hai */}
          <img src={MARK} width={76} height={76} alt="" />
          <div style={{ display: "flex", fontSize: 52, fontWeight: 700, letterSpacing: -1 }}>
            <span>Toolora</span>
            <span style={{ color: "#fbbf24", marginLeft: -6 }}>.ai</span>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: 68, fontWeight: 800, lineHeight: 1.1, maxWidth: 980 }}>
            Pick the AI tool that fits the job.
          </div>
          <div style={{ fontSize: 30, color: "#a5abc0" }}>Reviews · Comparisons · Alternatives · Guides</div>
        </div>
      </div>
    ),
    size,
  );
}
