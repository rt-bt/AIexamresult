import { NextResponse } from "next/server";
import * as fs from "fs";
import * as path from "path";
import webpush from "web-push";

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

export async function POST(request: Request) {
  try {
    const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
    const privateKey = process.env.VAPID_PRIVATE_KEY;
    if (!publicKey || !privateKey) {
      return NextResponse.json({ error: "VAPID keys not configured" }, { status: 500 });
    }

    webpush.setVapidDetails("mailto:rtbtrack@gmail.com", publicKey, privateKey);

    const { title = "AI Exam Result", body = "New update available", url = "https://www.aiexamresult.com" } = await request.json();

    const subs = readSubs();
    let sent = 0;
    let failed = 0;

    for (const sub of subs) {
      try {
        await webpush.sendNotification({
          endpoint: sub.endpoint,
          keys: { p256dh: sub.p256dh, auth: sub.auth },
        }, JSON.stringify({ title, body, url }));
        sent++;
      } catch {
        failed++;
      }
    }

    return NextResponse.json({ ok: true, sent, failed, total: subs.length });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
