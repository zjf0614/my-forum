import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/auth";
import { prisma } from "@/lib/prisma";
import { createPost } from "@/actions/post-actions";

export const metadata = {
  title: "发帖",
};

export default async function CreatePostPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/login");
  }

  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">✏️ 发布新帖子</h1>

      <form action={createPost} className="bg-white border border-gray-200 rounded-xl p-6 space-y-5">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            标题 <span className="text-red-500">*</span>
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            minLength={2}
            maxLength={200}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="给你的帖子起个吸引人的标题"
          />
          <p className="text-xs text-gray-400 mt-1">至少2个字符，最多200个字符</p>
        </div>

        <div>
          <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-1">
            分类 <span className="text-red-500">*</span>
          </label>
          <select
            id="categoryId"
            name="categoryId"
            required
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">选择分类...</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
            内容 <span className="text-red-500">*</span>
          </label>
          <div className="mb-1">
            <span className="text-xs text-gray-400">支持 Markdown 格式：</span>
            <code className="text-xs bg-gray-100 px-1.5 py-0.5 rounded mx-1">**粗体**</code>
            <code className="text-xs bg-gray-100 px-1.5 py-0.5 rounded mx-1">*斜体*</code>
            <code className="text-xs bg-gray-100 px-1.5 py-0.5 rounded mx-1">[链接](url)</code>
            <code className="text-xs bg-gray-100 px-1.5 py-0.5 rounded mx-1">## 标题</code>
            <code className="text-xs bg-gray-100 px-1.5 py-0.5 rounded mx-1">- 列表</code>
          </div>
          <textarea
            id="content"
            name="content"
            required
            minLength={10}
            maxLength={50000}
            rows={15}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-mono
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                       resize-y"
            placeholder="在这里写下你想分享的内容...&#10;&#10;## 你可以使用 Markdown 排版&#10;&#10;让你的文章看起来更棒！"
          />
          <p className="text-xs text-gray-400 mt-1">至少10个字符</p>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium
                       hover:bg-blue-700 transition text-sm"
          >
            发布帖子
          </button>
          <a
            href="/"
            className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium
                       hover:bg-gray-50 transition text-sm inline-flex items-center"
          >
            取消
          </a>
        </div>
      </form>
    </div>
  );
}
