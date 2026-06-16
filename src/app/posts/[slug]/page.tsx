import { notFound } from "next/navigation";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { ReplyForm } from "@/components/reply-form";
import { ReplyCard } from "@/components/reply-card";
import ReactMarkdown from "react-markdown";

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PostPageProps) {
  const { slug } = await params;
  const post = await prisma.post.findUnique({
    where: { slug },
    select: { title: true },
  });
  if (!post) return { title: "帖子不存在" };
  return { title: post.title };
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;
  const userRole = (session?.user as any)?.role;

  const post = await prisma.post.findUnique({
    where: { slug },
    include: {
      author: { select: { id: true, name: true, image: true } },
      category: { select: { name: true, slug: true } },
      replies: {
        include: { author: { select: { id: true, name: true, image: true } } },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!post || (!post.published && userRole !== "ADMIN")) {
    notFound();
  }

  const canDelete =
    userId === post.authorId || userRole === "ADMIN";

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-blue-600">首页</Link>
        <span>/</span>
        <Link href={`/categories/${post.category.slug}`} className="hover:text-blue-600">
          {post.category.name}
        </Link>
        <span>/</span>
        <span className="text-gray-400 truncate">{post.title}</span>
      </nav>

      {/* Post header */}
      <article className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium">
            {(post.author.name || "U")[0].toUpperCase()}
          </div>
          <div>
            <p className="font-medium text-gray-900">{post.author.name || "匿名"}</p>
            <p className="text-sm text-gray-500">{formatDate(post.createdAt)}</p>
          </div>
        </div>

        <Link
          href={`/categories/${post.category.slug}`}
          className="inline-block text-xs px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full mb-3 hover:bg-blue-100 transition"
        >
          {post.category.name}
        </Link>

        <h1 className="text-2xl font-bold text-gray-900 mb-4">{post.title}</h1>

        <div className="prose prose-gray max-w-none">
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>

        {/* Post actions */}
        {canDelete && (
          <div className="mt-6 pt-4 border-t border-gray-100 flex gap-2">
            <form action={async () => {
              "use server";
              const { deletePost } = await import("@/actions/post-actions");
              await deletePost(post.id);
            }}>
              <button
                type="submit"
                className="text-sm text-red-600 hover:text-red-700 bg-red-50 px-3 py-1.5 rounded-lg hover:bg-red-100 transition"
                onClick={(e) => {
                  if (!confirm("确定要删除这个帖子吗？")) e.preventDefault();
                }}
              >
                🗑 删除帖子
              </button>
            </form>
          </div>
        )}
      </article>

      {/* Replies section */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          💬 回复 ({post.replies.length})
        </h2>

        {post.replies.length === 0 ? (
          <div className="text-center py-12 text-gray-500 bg-white border border-gray-200 rounded-xl">
            <p className="text-3xl mb-2">💭</p>
            <p>还没有回复，来说点什么吧</p>
          </div>
        ) : (
          <div className="space-y-3">
            {post.replies.map((reply) => (
              <ReplyCard
                key={reply.id}
                reply={{
                  id: reply.id,
                  content: reply.content,
                  createdAt: reply.createdAt,
                  author: reply.author,
                }}
                canDelete={
                  userId === reply.authorId || userRole === "ADMIN"
                }
                postSlug={post.slug}
              />
            ))}
          </div>
        )}
      </div>

      {/* Reply form */}
      {session ? (
        <ReplyForm postId={post.id} />
      ) : (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-center">
          <p className="text-gray-600">
            想参与讨论？{" "}
            <Link href="/login" className="text-blue-600 hover:underline font-medium">
              立即登录
            </Link>{" "}
            或{" "}
            <Link href="/register" className="text-blue-600 hover:underline font-medium">
              注册账号
            </Link>
          </p>
        </div>
      )}
    </div>
  );
}
