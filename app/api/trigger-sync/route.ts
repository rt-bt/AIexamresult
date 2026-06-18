import { NextResponse } from "next/server";

export async function POST() {
  const token = process.env.GH_TOKEN;
  if (!token) {
    return NextResponse.json({ error: "GH_TOKEN not configured" }, { status: 500 });
  }

  const res = await fetch(
    "https://api.github.com/repos/rt-bt/AIexamresult/actions/workflows/sync-sarkariresult.yml/dispatches",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "User-Agent": "aiexamresult-app",
      },
      body: JSON.stringify({ ref: "main" }),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    return NextResponse.json({ error: `GitHub API error: ${res.status} ${err}` }, { status: 502 });
  }

  return NextResponse.json({ ok: true, message: "Sync workflow triggered" });
}
