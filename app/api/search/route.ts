import { NextResponse } from "next/server";
import { categorySections } from "@/lib/data";

const seen = new Set<string>();
const corpus = categorySections.flatMap((s) => s.items).filter((item) => {
  if (seen.has(item.slug)) return false;
  seen.add(item.slug);
  return true;
});

export function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get("q") ?? "").toLowerCase().trim();
  const state = searchParams.get("state")?.toLowerCase();
  const category = searchParams.get("category")?.toLowerCase();

  if (q.length < 2) return NextResponse.json({ items: [] });

  const items = corpus
    .filter((item) => !state || item.state.toLowerCase().includes(state))
    .filter((item) => !category || item.category.toLowerCase().includes(category))
    .map((item) => {
      const haystack = `${item.title} ${item.category} ${item.state} ${item.excerpt}`.toLowerCase();
      const direct = haystack.includes(q) ? 0 : 1;
      const typo = Math.min(...haystack.split(/\s+/).map((word) => distance(word, q)));
      return { item, score: direct + typo / 10 };
    })
    .sort((a, b) => a.score - b.score)
    .slice(0, 7)
    .map(({ item }) => ({
      title: item.title,
      category: item.category,
      state: item.state,
      url: `/post/${item.slug}`
    }));

  return NextResponse.json({ items });
}

function distance(a: string, b: string) {
  const matrix = Array.from({ length: a.length + 1 }, (_, i) => [i]);
  for (let j = 1; j <= b.length; j += 1) matrix[0][j] = j;

  for (let i = 1; i <= a.length; i += 1) {
    for (let j = 1; j <= b.length; j += 1) {
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
      );
    }
  }
  return matrix[a.length][b.length];
}
