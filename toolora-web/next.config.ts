import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // PDF ke saare URLs trailing slash ke saath hain (/ai-tools/writing/).
  trailingSlash: true,
  // sanitize-html Node ke built-in modules use karta hai; bundle karne par toot jaata hai.
  serverExternalPackages: ["sanitize-html"],
};

export default nextConfig;
