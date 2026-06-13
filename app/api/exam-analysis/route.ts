import { NextRequest, NextResponse } from "next/server";
import { fetchExamAnalysis, fetchAllExamAnalyses, DATA } from "@/lib/exam-analysis";

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
    if (slug && DATA[slug]) {
      return NextResponse.json({ ...DATA[slug], lastUpdated: new Date().toISOString() });
    }
    return NextResponse.json(DATA);
  }
}
