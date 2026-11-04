import type { Metadata } from "next";
import { Fraunces, Geist, Geist_Mono } from "next/font/google";
import { siteConfig } from "@/lib/site";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
// Headings ke liye serif (reference site jaisa editorial look).
const fraunces = Fraunces({ variable: "--font-fraunces", subsets: ["latin"], weight: ["600", "700"], display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — AI tools reviews, comparisons and alternatives`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  // Staging par index na ho; launch par NEXT_PUBLIC_SITE_INDEXABLE=true karein.
  robots: siteConfig.indexable ? { index: true, follow: true } : { index: false, follow: false },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} flex min-h-screen flex-col antialiased`}>
        {children}
      </body>
    </html>
  );
}
