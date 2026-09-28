import { NextRequest, NextResponse } from "next/server";
import { submitToIndexNow, INDEXNOW_KEY } from "@/lib/indexnow";
import { sectionItems } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET() {
  // Pull latest 50 posts across all categories and submit to IndexNow
  const allPosts = Object.values(sectionItems).flat();
  const latestUrls = allPosts
    .filter((p) => p.slug)
    .slice(0, 50)
    .map((p) => `https://www.aiexamresult.com/post/${p.slug}`);

  // Also include homepage and major section routes
  const priorityUrls = [
    "https://www.aiexamresult.com/",
    "https://www.aiexamresult.com/results",
    "https://www.aiexamresult.com/latest-jobs",
    "https://www.aiexamresult.com/admit-card",
    "https://www.aiexamresult.com/answer-key",
    ...latestUrls,
  ];

  const result = await submitToIndexNow(priorityUrls);
  return NextResponse.json({
    status: result.success ? "success" : "partial_or_error",
    key: INDEXNOW_KEY,
    submittedCount: result.count,
    sampleUrls: priorityUrls.slice(0, 5),
    error: result.error,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const urls: string[] = body.urls || (body.url ? [body.url] : []);
    if (!urls.length) {
      return NextResponse.json({ error: "Missing 'urls' array in JSON body" }, { status: 400 });
    }

    const result = await submitToIndexNow(urls);
    return NextResponse.json({
      success: result.success,
      submittedCount: result.count,
      error: result.error,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Invalid request" }, { status: 500 });
  }
}
