import type { Metadata } from "next";
import { Fraunces, Geist_Mono, Inter } from "next/font/google";
import { siteConfig } from "@/lib/site";
import "./globals.css";

// Body: Inter (reference site jaisa clean editorial look).
const inter = Inter({ variable: "--font-inter", subsets: ["latin"], display: "swap" });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
// Headings ke liye serif (reference site jaisa editorial look).
const fraunces = Fraunces({ variable: "--font-fraunces", subsets: ["latin"], weight: ["600", "700"], display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name}: AI tool reviews, comparisons and alternatives`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  // Staging par index na ho; launch par NEXT_PUBLIC_SITE_INDEXABLE=true karein.
  robots: siteConfig.indexable ? { index: true, follow: true } : { index: false, follow: false },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${geistMono.variable} ${fraunces.variable} flex min-h-screen flex-col antialiased`}>
        {children}
      </body>
    </html>
  );
}
