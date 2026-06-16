"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { prisma } from "@/lib/prisma";
import { replySchema } from "@/lib/validations";

export async function createReply(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    throw new Error("请先登录");
  }

  const rawData = {
    content: formData.get("content") as string,
    postId: formData.get("postId") as string,
  };

  const parsed = replySchema.safeParse(rawData);
  if (!parsed.success) {
    throw new Error(parsed.error.errors[0]?.message || "输入数据无效");
  }

  await prisma.reply.create({
    data: {
      content: parsed.data.content,
      postId: parsed.data.postId,
      authorId: (session.user as any).id,
    },
  });

  // Find the post slug to revalidate
  const post = await prisma.post.findUnique({
    where: { id: parsed.data.postId },
    select: { slug: true },
  });

  if (post) {
    revalidatePath(`/posts/${post.slug}`);
  }
  revalidatePath("/");
}

export async function deleteReply(replyId: string, postSlug: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    throw new Error("请先登录");
  }

  const reply = await prisma.reply.findUnique({ where: { id: replyId } });

  if (!reply) {
    throw new Error("回复不存在");
  }

  if ((session.user as any).id !== reply.authorId && (session.user as any).role !== "ADMIN") {
    throw new Error("没有权限删除");
  }

  await prisma.reply.delete({ where: { id: replyId } });

  revalidatePath(`/posts/${postSlug}`);
  revalidatePath("/");
}
