import * as fs from "fs";
import * as path from "path";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function extractDate(text: string): string | null {
  const m = text.match(/(\d{1,2})\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+(\d{4})/i);
  if (m) return `${m[1]} ${m[2]} ${m[3]}`;
  return null;
}

function searchPosts(query: string) {
  const postsDir = path.join(process.cwd(), "data", "posts");
  let files: string[] = [];
  try { files = fs.readdirSync(postsDir).filter((f) => f.endsWith(".json")); } catch { return []; }

  const results: { title: string; slug: string; lastDate?: string; category?: string }[] = [];
  const q = query.toLowerCase();

  for (const file of files.slice(0, 100)) {
    try {
      const raw = fs.readFileSync(path.join(postsDir, file), "utf-8");
      const post = JSON.parse(raw);
      if (post.title?.toLowerCase().includes(q) || post.category?.toLowerCase().includes(q)) {
        results.push({
          title: post.title,
          slug: post.slug,
          lastDate: post.lastDate,
          category: post.category,
        });
      }
    } catch {}
  }

  return results.slice(0, 5);
}

const helpText = `🤖 *AI Exam Result Bot*

Commands:
• Search any exam: \`SSC CGL result\`, \`RRB NTPC admit card\`
• Latest updates: \`latest\`
• Help: \`help\`, \`start\`

Powered by aiexamresult.com`;

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const mode = url.searchParams.get("hub.mode");
  const token = url.searchParams.get("hub.verify_token");
  const challenge = url.searchParams.get("hub.challenge");

  // Facebook/WhatsApp webhook verification
  if (mode === "subscribe" && token === process.env.WEBHOOK_VERIFY_TOKEN) {
    return new NextResponse(challenge, { status: 200 });
  }

  const message = url.searchParams.get("message") || "";
  if (!message) {
    return NextResponse.json({ ok: true, help: helpText });
  }

  const lower = message.toLowerCase().trim();

  if (lower === "start" || lower === "help") {
    return NextResponse.json({ ok: true, text: helpText });
  }

  if (lower === "latest") {
    const dataDir = path.join(process.cwd(), "data", "posts");
    let files: string[] = [];
    try { files = fs.readdirSync(dataDir).filter((f) => f.endsWith(".json")); } catch {
      return NextResponse.json({ ok: true, text: "No data available yet." });
    }
    const recent: { title: string; slug: string }[] = [];
    for (const file of files.slice(-5).reverse()) {
      try {
        const raw = fs.readFileSync(path.join(dataDir, file), "utf-8");
        const post = JSON.parse(raw);
        recent.push({ title: post.title, slug: post.slug });
      } catch {}
    }
    const text = recent.map((r) => `• ${r.title}\n  https://www.aiexamresult.com/post/${r.slug}`).join("\n\n");
    return NextResponse.json({ ok: true, text: `📢 *Latest Updates*\n\n${text}` });
  }

  const results = searchPosts(message);
  if (results.length === 0) {
    return NextResponse.json({
      ok: true,
      text: `❌ No results found for "${message}".\n\nTry: SSC CGL, RRB NTPC, UPSC, IBPS PO, CTET, NEET\nOr use \`latest\` to see recent updates.`,
    });
  }

  const text = results.map((r) =>
    `• ${r.title}${r.lastDate ? `\n  📅 Last Date: ${r.lastDate}` : ""}\n  https://www.aiexamresult.com/post/${r.slug}`
  ).join("\n\n");

  return NextResponse.json({ ok: true, text: `🔍 *Results for "${message}"*\n\n${text}` });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const message = body?.message?.text || body?.message || "";
    const url = new URL(request.url);
    url.searchParams.set("message", message);
    return await GET(new NextRequest(url));
  } catch {
    return NextResponse.json({ ok: true, text: "Error processing request. Send a text message." });
  }
}
