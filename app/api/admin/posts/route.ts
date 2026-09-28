import type { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/server/db";
import { slugify } from "@/lib/utils";

const postSchema = z.object({
  title: z.string().min(8),
  excerpt: z.string().min(20),
  content: z.unknown(),
  type: z.enum(["RESULT", "JOB", "ADMIT_CARD", "ANSWER_KEY", "ADMISSION", "SYLLABUS", "SCHOLARSHIP", "BOARD_RESULT", "UNIVERSITY_RESULT", "ENTRANCE_EXAM", "NOTIFICATION"]),
  status: z.enum(["DRAFT", "SCHEDULED", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
  categoryId: z.string(),
  authorId: z.string(),
  state: z.string().optional(),
  organization: z.string().optional(),
  qualification: z.string().optional()
});

export async function GET() {
  const posts = await prisma.post.findMany({
    orderBy: { updatedAt: "desc" },
    take: 50,
    include: { category: true, seo: true, tags: true }
  });
  return NextResponse.json({ posts });
}

export async function POST(request: Request) {
  const parsed = postSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid post", details: parsed.error.flatten() }, { status: 400 });

  const post = await prisma.post.create({
    data: {
      ...parsed.data,
      content: parsed.data.content as Prisma.InputJsonValue,
      slug: slugify(parsed.data.title),
      publishedAt: parsed.data.status === "PUBLISHED" ? new Date() : null
    }
  });

  return NextResponse.json({ post }, { status: 201 });
}
