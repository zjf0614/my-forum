import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PostCard } from "@/components/post-card";
import { Pagination } from "@/components/pagination";

const POSTS_PER_PAGE = 15;

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;
  const currentPage = Math.max(1, parseInt(page || "1", 10));

  const [posts, totalPosts, categories] = await Promise.all([
    prisma.post.findMany({
      where: { published: true },
      include: {
        author: { select: { name: true, image: true } },
        category: { select: { name: true, slug: true } },
        _count: { select: { replies: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (currentPage - 1) * POSTS_PER_PAGE,
      take: POSTS_PER_PAGE,
    }),
    prisma.post.count({ where: { published: true } }),
    prisma.category.findMany({
      include: { _count: { select: { posts: true } } },
      orderBy: { name: "asc" },
    }),
  ]);

  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Hero */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 mb-8 text-white">
            <h1 className="text-3xl font-bold mb-2">💬 分享论坛</h1>
            <p className="text-blue-100 text-lg">一个简洁的社区讨论平台，分享你的想法，发现有趣的话题</p>
            <div className="mt-4 flex gap-3">
              <Link
                href="/categories"
                className="inline-flex items-center px-4 py-2 bg-white text-blue-600 rounded-lg font-medium text-sm hover:bg-blue-50 transition"
              >
                浏览分类
              </Link>
              <Link
                href="/posts/create"
                className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg font-medium text-sm hover:bg-blue-400 transition border border-blue-400"
              >
                写帖子 →
              </Link>
            </div>
          </div>

          {/* Post list */}
          <div className="space-y-4">
            {posts.length === 0 ? (
              <div className="text-center py-20 text-gray-500">
                <p className="text-5xl mb-4">📝</p>
                <p className="text-lg">还没有帖子</p>
                <p className="text-sm mt-1">成为第一个发帖的人吧！</p>
              </div>
            ) : (
              posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={{
                    slug: post.slug,
                    title: post.title,
                    content: post.content,
                    createdAt: post.createdAt,
                    author: post.author,
                    category: post.category,
                    _count: post._count,
                  }}
                />
              ))
            )}
          </div>

          <Pagination currentPage={currentPage} totalPages={totalPages} baseUrl="" />
        </div>

        {/* Sidebar */}
        <aside className="w-full lg:w-64 flex-shrink-0">
          <div className="bg-white border border-gray-200 rounded-xl p-5 sticky top-20">
            <h3 className="font-semibold text-gray-900 mb-3">📂 分类</h3>
            <ul className="space-y-1">
              {categories.map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/categories/${cat.slug}`}
                    className="flex items-center justify-between py-1.5 px-2 text-sm text-gray-600 rounded-lg hover:bg-gray-100 hover:text-blue-600 transition"
                  >
                    <span>{cat.name}</span>
                    <span className="text-xs text-gray-400">{cat._count.posts}</span>
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-6 pt-4 border-t border-gray-100">
              <Link
                href="/categories"
                className="text-sm text-blue-600 hover:underline"
              >
                查看全部分类 →
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
