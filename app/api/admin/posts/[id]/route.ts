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
  qualification: z.string().optional()
});

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const parsed = updateSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid post update" }, { status: 400 });

  const post = await prisma.post.update({
    where: { id },
    data: {
      ...parsed.data,
      content: parsed.data.content as Prisma.InputJsonValue | undefined,
      publishedAt: parsed.data.status === "PUBLISHED" ? new Date() : undefined
    }
  });
  return NextResponse.json({ post });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.post.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
