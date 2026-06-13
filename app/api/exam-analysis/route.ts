import { NextRequest, NextResponse } from "next/server";
import { fetchExamAnalysis, fetchAllExamAnalyses, EXAM_SLUGS } from "@/lib/exam-analysis";

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("slug");

  try {
    if (slug) {
      const data = await fetchExamAnalysis(slug);
      return NextResponse.json(data);
    }
    const all = await fetchAllExamAnalyses();
    return NextResponse.json(all);
  } catch {
    const { FALLBACK_DATA } = await import("@/lib/exam-analysis");
    if (slug && FALLBACK_DATA[slug]) {
      return NextResponse.json({ ...FALLBACK_DATA[slug], lastUpdated: new Date().toISOString() });
    }
    return NextResponse.json(FALLBACK_DATA);
  }
}
