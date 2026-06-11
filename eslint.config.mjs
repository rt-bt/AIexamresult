import { FlatCompat } from "@eslint/eslintrc";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({ baseDirectory: __dirname });

export default [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    files: ["lib/auto-sync.ts", "lib/sync-daemon.js", "scripts/generate-icons.js"],
    rules: {
      "@typescript-eslint/no-require-imports": "off",
      "@next/next/no-html-link-for-pages": "off",
    },
  },
  {
    files: ["lib/data.ts", "lib/run-scrape.ts", "lib/scraper.ts"],
    rules: {
      "@typescript-eslint/no-require-imports": "off",
    },
  },
  {
    files: ["components/site/install-banner.tsx"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
];
