import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PostCard } from "@/components/post-card";
import { Pagination } from "@/components/pagination";

const POSTS_PER_PAGE = 15;

export const metadata = {
  title: "搜索",
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const { q, page } = await searchParams;
  const currentPage = Math.max(1, parseInt(page || "1", 10));
  const query = q?.trim() || "";

  let posts: any[] = [];
  let totalPosts = 0;

  if (query) {
    [posts, totalPosts] = await Promise.all([
      prisma.post.findMany({
        where: {
          published: true,
          OR: [
            { title: { contains: query } },
            { content: { contains: query } },
          ],
        },
        include: {
          author: { select: { name: true, image: true } },
          category: { select: { name: true, slug: true } },
          _count: { select: { replies: true } },
        },
        orderBy: { createdAt: "desc" },
        skip: (currentPage - 1) * POSTS_PER_PAGE,
        take: POSTS_PER_PAGE,
      }),
      prisma.post.count({
        where: {
          published: true,
          OR: [
            { title: { contains: query } },
            { content: { contains: query } },
          ],
        },
      }),
    ]);
  }

  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">🔍 搜索</h1>

      {/* Search form */}
      <form action="/search" method="GET" className="mb-8">
        <div className="flex gap-2">
          <input
            type="search"
            name="q"
            defaultValue={query}
            placeholder="搜索帖子标题或内容..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-sm
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            autoFocus={!query}
          />
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium
                       hover:bg-blue-700 transition text-sm"
          >
            搜索
          </button>
        </div>
      </form>

      {/* Results */}
      {query ? (
        <div>
          <p className="text-sm text-gray-500 mb-4">
            搜索 &quot;{query}&quot; — 找到 {totalPosts} 篇相关帖子
          </p>

          {posts.length === 0 ? (
            <div className="text-center py-20 text-gray-500 bg-white border border-gray-200 rounded-xl">
              <p className="text-5xl mb-4">🔍</p>
              <p>没有找到相关帖子</p>
              <p className="text-sm mt-1">试试其他关键词</p>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
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
              ))}
            </div>
          )}

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            baseUrl={`/search?q=${encodeURIComponent(query)}`}
          />
        </div>
      ) : (
        <div className="text-center py-20 text-gray-500 bg-white border border-gray-200 rounded-xl">
          <p className="text-5xl mb-4">🔍</p>
          <p className="text-lg">输入关键词搜索帖子</p>
        </div>
      )}
    </div>
  );
}
