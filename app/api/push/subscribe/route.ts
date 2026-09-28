import { NextResponse } from "next/server";
import * as fs from "fs";
import * as path from "path";

const DATA_DIR = process.env.VERCEL === "1"
  ? path.join("/tmp", "data")
  : path.join(process.cwd(), "data");
const FILE = path.join(DATA_DIR, "push-subscriptions.json");

type Subscription = { endpoint: string; p256dh: string; auth: string; createdAt?: string; updatedAt?: string };

function readSubs(): Subscription[] {
  try {
    const raw = fs.readFileSync(FILE, "utf-8");
    return JSON.parse(raw);
  } catch { return []; }
}

function writeSubs(data: Subscription[]) {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch {}
}

export async function POST(request: Request) {
  try {
    const { endpoint, keys } = await request.json();
    if (!endpoint || !keys?.p256dh || !keys?.auth) {
      return NextResponse.json({ error: "Invalid subscription" }, { status: 400 });
    }
    const subs = readSubs();
    const existing = subs.findIndex((s) => s.endpoint === endpoint);
    if (existing >= 0) {
      subs[existing] = { endpoint, p256dh: keys.p256dh, auth: keys.auth, updatedAt: new Date().toISOString() };
    } else {
      subs.push({ endpoint, p256dh: keys.p256dh, auth: keys.auth, createdAt: new Date().toISOString() });
    }
    writeSubs(subs);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
