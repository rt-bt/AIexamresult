import { NextResponse } from "next/server";
import * as fs from "fs";
import * as path from "path";

const DATA_DIR = process.env.VERCEL === "1"
  ? path.join("/tmp", "data")
  : path.join(process.cwd(), "data");
const FILE = path.join(DATA_DIR, "subscribers.json");

function read() {
  try {
    const raw = fs.readFileSync(FILE, "utf-8");
    return JSON.parse(raw);
  } catch { return []; }
}

function write(data: unknown) {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch {}
}

export async function POST(request: Request) {
  try {
    const { email, categories } = await request.json();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const subs = read();
    const existing = subs.findIndex((s: { email: string }) => s.email === email);
    if (existing >= 0) {
      subs[existing].categories = [...new Set([...(subs[existing].categories || []), ...(categories || ["all"])])];
      subs[existing].updatedAt = new Date().toISOString();
    } else {
      subs.push({ email, categories: categories || ["all"], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    }
    write(subs);

    return NextResponse.json({ ok: true, message: "Subscribed successfully!" });
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
