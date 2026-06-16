import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "分类",
};

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    include: {
      _count: { select: { posts: true } },
    },
    orderBy: { name: "asc" },
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">📂 全部分类</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/categories/${cat.slug}`}
            className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md hover:border-blue-200 transition group"
          >
            <h2 className="font-semibold text-gray-900 group-hover:text-blue-600 transition mb-1">
              {cat.name}
            </h2>
            {cat.description && (
              <p className="text-sm text-gray-500 mb-3">{cat.description}</p>
            )}
            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
              {cat._count.posts} 篇帖子
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
