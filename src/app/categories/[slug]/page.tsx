import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PostCard } from "@/components/post-card";
import { Pagination } from "@/components/pagination";

const POSTS_PER_PAGE = 15;

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = await prisma.category.findUnique({
    where: { slug },
    select: { name: true },
  });
  if (!category) return { title: "分类不存在" };
  return { title: category.name };
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { slug } = await params;
  const { page } = await searchParams;
  const currentPage = Math.max(1, parseInt(page || "1", 10));

  const category = await prisma.category.findUnique({
    where: { slug },
    include: {
      _count: { select: { posts: true } },
    },
  });

  if (!category) {
    notFound();
  }

  const posts = await prisma.post.findMany({
    where: {
      categoryId: category.id,
      published: true,
    },
    include: {
      author: { select: { name: true, image: true } },
      category: { select: { name: true, slug: true } },
      _count: { select: { replies: true } },
    },
    orderBy: { createdAt: "desc" },
    skip: (currentPage - 1) * POSTS_PER_PAGE,
    take: POSTS_PER_PAGE,
  });

  const totalPages = Math.ceil(category._count.posts / POSTS_PER_PAGE);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-blue-600">首页</Link>
        <span>/</span>
        <Link href="/categories" className="hover:text-blue-600">分类</Link>
        <span>/</span>
        <span className="text-gray-400">{category.name}</span>
      </nav>

      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{category.name}</h1>
        {category.description && (
          <p className="text-gray-500">{category.description}</p>
        )}
        <p className="text-sm text-gray-400 mt-3">
          共 {category._count.posts} 篇帖子
        </p>
      </div>

      <div className="space-y-4">
        {posts.length === 0 ? (
          <div className="text-center py-20 text-gray-500 bg-white border border-gray-200 rounded-xl">
            <p className="text-5xl mb-4">📝</p>
            <p className="text-lg">该分类下还没有帖子</p>
            <Link href="/posts/create" className="text-blue-600 hover:underline text-sm mt-2 inline-block">
              成为第一个发帖的人 →
            </Link>
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

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        baseUrl={`/categories/${slug}`}
      />
    </div>
  );
}
