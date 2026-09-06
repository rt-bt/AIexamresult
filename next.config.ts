import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "www.aiexamresult.com" }
    ]
  },
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  
  outputFileTracingIncludes: { "/*": ["./data/posts/**", "./data/scraped.json", "./data/scraped-data.ts"] },
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


