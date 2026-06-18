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
    const { endpoint } = await request.json();
    if (!endpoint) {
      return NextResponse.json({ error: "Missing endpoint" }, { status: 400 });
    }
    const subs = readSubs().filter((s) => s.endpoint !== endpoint);
    writeSubs(subs);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
