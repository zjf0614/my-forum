"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { prisma } from "@/lib/prisma";
import { postSchema } from "@/lib/validations";
import { generateSlug } from "@/lib/utils";

export async function createPost(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    throw new Error("请先登录");
  }

  const rawData = {
    title: formData.get("title") as string,
    content: formData.get("content") as string,
    categoryId: formData.get("categoryId") as string,
  };

  const parsed = postSchema.safeParse(rawData);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message || "输入数据无效");
  }

  const { title, content, categoryId } = parsed.data;

  // Generate unique slug
  let slug = generateSlug(title);
  let suffix = 1;
  while (await prisma.post.findUnique({ where: { slug } })) {
    slug = generateSlug(title) + "-" + suffix;
    suffix++;
  }

  await prisma.post.create({
    data: {
      title,
      content,
      slug,
      authorId: (session.user as any).id,
      categoryId,
    },
  });

  revalidatePath("/");
  redirect(`/posts/${slug}`);
}

export async function deletePost(postId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    throw new Error("请先登录");
  }

  const post = await prisma.post.findUnique({ where: { id: postId } });

  if (!post) {
    throw new Error("帖子不存在");
  }

  // Only author or admin can delete
  if ((session.user as any).id !== post.authorId && (session.user as any).role !== "ADMIN") {
    throw new Error("没有权限删除");
  }

  await prisma.post.delete({ where: { id: postId } });

  revalidatePath("/");
  redirect("/");
}

export async function togglePublishPost(postId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    throw new Error("没有权限");
  }

  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post) throw new Error("帖子不存在");

  await prisma.post.update({
    where: { id: postId },
    data: { published: !post.published },
  });

  revalidatePath("/");
  revalidatePath(`/posts/${post.slug}`);
}
