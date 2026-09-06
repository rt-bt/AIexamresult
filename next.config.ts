import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "www.aiexamresult.com" }
    ]
  },
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  
  // Only include scraped.json for listing pages (~500KB, safe)
  outputFileTracingIncludes: { "/**": ["./data/scraped.json"] },
  // Explicitly exclude 1756 individual post JSON files (372MB total) from ALL
  // serverless functions. Without this, Next.js auto-traces them because
  // post/[slug]/page.tsx uses fs.readFileSync, causing 382MB > 250MB limit.
  outputFileTracingExcludes: { "/**": ["./data/posts/**", "./data/scraped-data.ts"] },

  webpack(config) {
    config.resolve.alias = {
      ...config.resolve.alias,
      "framer-motion$": require
        .resolve("framer-motion/package.json")
        .replace(/package\.json$/, "dist/cjs/index.js"),
    };
    return config;
  },
  async headers() {
    return [
      {
        source: "/sw.js",
        headers: [
          { key: "Cache-Control", value: "no-cache, no-store, must-revalidate" }
        ]
      },
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" }
        ]
      }
    ];
  }
};

export default nextConfig;


