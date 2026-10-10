import * as fs from "fs";
import * as path from "path";
import sharp from "sharp";

const SOURCE_IMAGE = "C:/Users/rtbt/.gemini/antigravity/brain/eff28b84-ebca-4ece-a0f4-3611ddb9aa29/.user_uploaded/media_1791559823353_19e62c8c.png";
const PUBLIC_DIR = path.join(process.cwd(), "public");
const APP_DIR = path.join(process.cwd(), "app");

async function generateIcons() {
  console.log("Generating website and app icons from master asset:", SOURCE_IMAGE);

  if (!fs.existsSync(SOURCE_IMAGE)) {
    throw new Error(`Source image not found: ${SOURCE_IMAGE}`);
  }

  // 1. Save master copy
  const masterBuf = fs.readFileSync(SOURCE_IMAGE);
  fs.writeFileSync(path.join(PUBLIC_DIR, "icon-master.png"), masterBuf);
  console.log("Saved public/icon-master.png (1000x1000)");

  // 2. Standard PWA & Web sizes
  const sizes = [
    { name: "icon-48.png", size: 48 },
    { name: "icon-72.png", size: 72 },
    { name: "icon-96.png", size: 96 },
    { name: "icon-128.png", size: 128 },
    { name: "icon-144.png", size: 144 },
    { name: "icon-152.png", size: 152 },
    { name: "icon-192.png", size: 192 },
    { name: "icon-256.png", size: 256 },
    { name: "icon-384.png", size: 384 },
    { name: "icon-512.png", size: 512 },
    { name: "apple-touch-icon.png", size: 180 },
  ];

  for (const { name, size } of sizes) {
    const dest = path.join(PUBLIC_DIR, name);
    await sharp(masterBuf)
      .resize(size, size, { fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 1 } })
      .png({ compressionLevel: 9 })
      .toFile(dest);
    console.log(`Generated public/${name} (${size}x${size})`);
  }

  // 3. Multi-resolution Favicon (.ico) with 16x16, 32x32, 48x48 frames
  const icoSizes = [16, 32, 48];
  const icoPngs = await Promise.all(
    icoSizes.map((s) =>
      sharp(masterBuf)
        .resize(s, s, { fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 1 } })
        .png()
        .toBuffer()
    )
  );

  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type 1 = icon
  header.writeUInt16LE(icoSizes.length, 4); // count

  let offset = 6 + 16 * icoSizes.length;
  const dirEntries = [];

  for (let i = 0; i < icoSizes.length; i++) {
    const s = icoSizes[i];
    const data = icoPngs[i];
    const entry = Buffer.alloc(16);
    entry.writeUInt8(s, 0); // width
    entry.writeUInt8(s, 1); // height
    entry.writeUInt8(0, 2); // palette
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // planes
    entry.writeUInt16LE(32, 6); // bpp
    entry.writeUInt32LE(data.length, 8); // size
    entry.writeUInt32LE(offset, 12); // offset
    dirEntries.push(entry);
    offset += data.length;
  }

  const icoBuf = Buffer.concat([header, ...dirEntries, ...icoPngs]);
  fs.writeFileSync(path.join(PUBLIC_DIR, "favicon.ico"), icoBuf);
  fs.writeFileSync(path.join(APP_DIR, "favicon.ico"), icoBuf);
  console.log("Generated public/favicon.ico and app/favicon.ico (multi-resolution 16/32/48)");

  console.log("All app icons successfully generated!");
}

generateIcons().catch((err) => {
  console.error("Error generating icons:", err);
  process.exit(1);
});
