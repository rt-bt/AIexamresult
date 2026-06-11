import { NextResponse } from "next/server";
import { z } from "zod";
import { generateExamPost } from "@/lib/server/ai";
import { rateLimit } from "@/lib/server/rate-limit";

const schema = z.object({
  source: z.string().min(20),
  language: z.enum(["en", "hi", "both"]).default("both"),
  mode: z.enum(["generate", "humanize", "seo"]).default("generate")
});

export async function POST(request: Request) {
  const limited = await rateLimit("ai-generate", 12, 60);
  if (!limited.ok) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  const payload = schema.safeParse(await request.json());
  if (!payload.success) {
    return NextResponse.json({ error: "Invalid request", details: payload.error.flatten() }, { status: 400 });
  }

  const result = await generateExamPost(payload.data);
  return NextResponse.json(result);
}
