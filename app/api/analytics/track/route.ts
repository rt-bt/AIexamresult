import { NextResponse } from "next/server";
import { logVisit } from "@/lib/analytics";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const path = searchParams.get("path") || "/";
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    || request.headers.get("x-real-ip")
    || "127.0.0.1";

  let country = "", region = "", city = "";
  try {
    if (ip && ip !== "127.0.0.1" && ip !== "::1") {
      const geo = await fetch(`http://ip-api.com/json/${ip}?fields=country,regionName,city`, { signal: AbortSignal.timeout(3000) });
      if (geo.ok) {
        const data = await geo.json();
        country = data.country || "";
        region = data.regionName || "";
        city = data.city || "";
      }
    }
  } catch {}

  logVisit({
    path,
    timestamp: new Date().toISOString(),
    ip,
    country,
    region,
    city,
    referrer: searchParams.get("ref") || "",
  });

  return NextResponse.json({ ok: true });
}
