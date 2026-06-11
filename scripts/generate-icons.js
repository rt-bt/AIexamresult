const sharp = require("sharp");
const path = require("path");

const sizes = [48, 72, 96, 128, 144, 152, 192, 256, 384, 512];
const teal = [13, 148, 136, 255];
const orange = [234, 88, 12, 255];
const white = [255, 255, 255, 255];

async function generateIcons() {
  for (const size of sizes) {
    const s = size;
    const pad = Math.round(s * 0.16);
    const inner = s - pad * 2;
    const half = s / 2;

    const svg = `<svg width="${s}" height="${s}" viewBox="0 0 ${s} ${s}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#0D9488"/>
          <stop offset="100%" stop-color="#0F766E"/>
        </linearGradient>
      </defs>
      <rect width="${s}" height="${s}" rx="${Math.round(s * 0.18)}" fill="url(#bg)"/>
      <text x="${half}" y="${Math.round(half + s * 0.12)}" font-family="system-ui,sans-serif" font-weight="900" font-size="${Math.round(s * 0.4)}" fill="white" text-anchor="middle">AI</text>
      <text x="${half}" y="${Math.round(half + s * 0.45)}" font-family="system-ui,sans-serif" font-weight="800" font-size="${Math.round(s * 0.24)}" fill="#FBBF24" text-anchor="middle">EXAM</text>
    </svg>`;

    const outPath = path.join(__dirname, "..", "public", `icon-${size}.png`);
    await sharp(Buffer.from(svg)).png().toFile(outPath);
    console.log(`Created icon-${size}.png`);
  }
}

generateIcons().catch(console.error);
