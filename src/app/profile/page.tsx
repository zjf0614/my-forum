import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/auth";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";

export const metadata = {
  title: "个人中心",
};

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/login");
  }

  const userId = (session.user as any).id;

  const [user, userPosts, userReplies] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: {
        name: true,
        email: true,
        role: true,
        createdAt: true,
        _count: { select: { posts: true, replies: true } },
      },
    }),
    prisma.post.findMany({
      where: { authorId: userId, published: true },
      include: {
        category: { select: { name: true, slug: true } },
        _count: { select: { replies: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
    prisma.reply.findMany({
      where: { authorId: userId },
      include: {
        post: { select: { title: true, slug: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
  ]);

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Profile header */}
      <div className="bg-white border border-gray-200 rounded-xl p-8 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-2xl">
            {(user.name || "U")[0].toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{user.name || "用户"}</h1>
            <p className="text-gray-500">{user.email}</p>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">
                {user.role === "ADMIN" ? "👑 管理员" : user.role === "MODERATOR" ? "⭐ 版主" : "👤 用户"}
              </span>
              <span className="text-xs text-gray-400">注册于 {formatDate(user.createdAt)}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-6 mt-6 pt-6 border-t border-gray-100">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{user._count.posts}</p>
            <p className="text-sm text-gray-500">帖子</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{user._count.replies}</p>
            <p className="text-sm text-gray-500">回复</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* My posts */}
        <div>
          <h2 className="font-semibold text-gray-900 mb-4">📝 我的帖子</h2>
          {userPosts.length === 0 ? (
            <p className="text-gray-500 text-sm">还没有发过帖子</p>
          ) : (
            <div className="space-y-3">
              {userPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/posts/${post.slug}`}
                  className="block bg-white border border-gray-200 rounded-lg p-4 hover:border-blue-200 transition"
                >
                  <p className="font-medium text-gray-900 text-sm line-clamp-1">{post.title}</p>
                  <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                    <span>{post.category.name}</span>
                    <span>·</span>
                    <span>{post._count.replies} 回复</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* My replies */}
        <div>
          <h2 className="font-semibold text-gray-900 mb-4">💬 我的回复</h2>
          {userReplies.length === 0 ? (
            <p className="text-gray-500 text-sm">还没有回复过帖子</p>
          ) : (
            <div className="space-y-3">
              {userReplies.map((reply) => (
                <Link
                  key={reply.id}
                  href={`/posts/${reply.post.slug}`}
                  className="block bg-white border border-gray-200 rounded-lg p-4 hover:border-blue-200 transition"
                >
                  <p className="text-xs text-gray-400 mb-1">回复了：{reply.post.title}</p>
                  <p className="text-sm text-gray-700 line-clamp-2">{reply.content}</p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
