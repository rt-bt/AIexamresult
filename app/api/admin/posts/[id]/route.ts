import type { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/server/db";

const updateSchema = z.object({
  title: z.string().min(8).optional(),
  excerpt: z.string().min(20).optional(),
  content: z.unknown().optional(),
  status: z.enum(["DRAFT", "SCHEDULED", "PUBLISHED", "ARCHIVED"]).optional(),
  state: z.string().optional(),
  organization: z.string().optional(),
  qualification: z.string().optional(),
  publishedAt: z.string().datetime().or(z.date()).optional().nullable(),
});

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const parsed = updateSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid post update" }, { status: 400 });

  const existingPost = await prisma.post.findUnique({
    where: { id },
    select: { publishedAt: true, status: true }
  });
  if (!existingPost) return NextResponse.json({ error: "Post not found" }, { status: 404 });

  let publishedAt: Date | null | undefined = undefined;
  if (parsed.data.publishedAt !== undefined) {
    // Explicit administrator setting/change of publication date
    publishedAt = parsed.data.publishedAt ? new Date(parsed.data.publishedAt) : null;
  } else if (parsed.data.status === "PUBLISHED" && !existingPost.publishedAt) {
    // Only assign date when transitioning to PUBLISHED for the first time
    publishedAt = new Date();
  }

  const { publishedAt: _pAt, ...otherData } = parsed.data;

  const post = await prisma.post.update({
    where: { id },
    data: {
      ...otherData,
      content: otherData.content as Prisma.InputJsonValue | undefined,
      ...(publishedAt !== undefined ? { publishedAt } : {})
    }
  });
  return NextResponse.json({ post });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.post.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
