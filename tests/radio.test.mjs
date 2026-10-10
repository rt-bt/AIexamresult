import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();

test("Radio Data: radio-stations.json contains valid stations and active streams", () => {
  const filePath = path.join(ROOT, "data", "radio-stations.json");
  assert.ok(fs.existsSync(filePath), "data/radio-stations.json must exist");

  const stations = JSON.parse(fs.readFileSync(filePath, "utf8"));
  assert.ok(Array.isArray(stations), "Stations must be an array");
  assert.ok(stations.length >= 50, `Must have at least 50 stations, got ${stations.length}`);

  for (const s of stations) {
    assert.ok(s.id && s.name && s.slug, `Station must have id, name and slug: ${JSON.stringify(s)}`);
    assert.ok(s.streamUrl, `Station must have streamUrl: ${s.name}`);
    assert.match(s.streamUrl, /^https?:\/\//i, `streamUrl must be http/https: ${s.streamUrl}`);
  }
});

test("Radio Stations: Core Indian channels are present", () => {
  const filePath = path.join(ROOT, "data", "radio-stations.json");
  const stations = JSON.parse(fs.readFileSync(filePath, "utf8"));
  const slugs = new Set(stations.map((s) => s.slug));

  const expected = ["mirchi", "vividh-bharati", "big", "fm-gold", "fm-rainbow"];
  for (const slug of expected) {
    assert.ok(slugs.has(slug), `Expected station slug ${slug} to be present`);
  }
});

test("Header & Navigation: Radio tab exists in Header and mobile nav", () => {
  const headerContent = fs.readFileSync(path.join(ROOT, "components", "site", "header.tsx"), "utf8");
  assert.match(headerContent, /\["Radio",\s*\"\/radio\"\]/, "Header nav must contain ['Radio', '/radio']");

  const mobileNavContent = fs.readFileSync(path.join(ROOT, "components", "site", "mobile-bottom-nav.tsx"), "utf8");
  assert.match(mobileNavContent, /\["Live Radio",\s*\"\/radio\",\s*Radio\]/, "mobile-bottom-nav must contain Live Radio link");
});

test("Sitemap & Routes: /radio is included in sitemap.ts", () => {
  const sitemapContent = fs.readFileSync(path.join(ROOT, "app", "sitemap.ts"), "utf8");
  assert.match(sitemapContent, /path:\s*\"\/radio\"/, "sitemap.ts must contain /radio path");
});

test("Radio Page: app/radio/page.tsx has SEO metadata and JSON-LD schema", () => {
  const pagePath = path.join(ROOT, "app", "radio", "page.tsx");
  assert.ok(fs.existsSync(pagePath), "app/radio/page.tsx must exist");

  const pageContent = fs.readFileSync(pagePath, "utf8");
  assert.match(pageContent, /canonical:\s*`\$\{SITE_URL\}\/radio`/, "Must have canonical URL");
  assert.match(pageContent, /RadioClient/, "Must render RadioClient component");
  assert.match(pageContent, /BroadcastService/, "Must have BroadcastService JSON-LD");
});

test("Radio Security: All 93 stations use HTTPS to prevent browser Mixed Content blocking", () => {
  const filePath = path.join(ROOT, "data", "radio-stations.json");
  const stations = JSON.parse(fs.readFileSync(filePath, "utf8"));
  for (const s of stations) {
    assert.ok(
      s.streamUrl.startsWith("https://"),
      `Station "${s.name}" (${s.slug}) streamUrl must start with https:// to avoid Mixed Content, got: ${s.streamUrl}`
    );
    if (s.fallbackStreamUrl) {
      assert.ok(
        s.fallbackStreamUrl.startsWith("https://"),
        `Station "${s.name}" fallbackStreamUrl must start with https://, got: ${s.fallbackStreamUrl}`
      );
    }
  }
});

