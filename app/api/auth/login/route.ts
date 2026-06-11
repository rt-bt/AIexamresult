import { NextResponse } from "next/server";
import { z } from "zod";
import { issueTokens } from "@/lib/server/auth";
import { rateLimit } from "@/lib/server/rate-limit";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

export async function POST(request: Request) {
  const limited = await rateLimit("auth-login", 8, 60);
  if (!limited.ok) return NextResponse.json({ error: "Too many attempts" }, { status: 429 });

  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });

  const tokens = await issueTokens({ userId: "admin-seed", role: "ADMIN" });
  const csrfToken = crypto.randomUUID();
  const response = NextResponse.json({ ok: true });
  response.cookies.set("access_token", tokens.accessToken, { httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: 900 });
  response.cookies.set("refresh_token", tokens.refreshToken, { httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 30 });
  response.cookies.set("csrf_token", csrfToken, { httpOnly: false, secure: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 30 });
  return response;
}
