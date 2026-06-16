import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="max-w-lg mx-auto px-4 py-20 text-center">
      <p className="text-8xl mb-4">🔍</p>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">404</h1>
      <p className="text-gray-500 mb-6 text-lg">找不到你要找的页面</p>
      <div className="flex gap-3 justify-center">
        <Link
          href="/"
          className="px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition text-sm"
        >
          返回首页
        </Link>
        <Link
          href="/categories"
          className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition text-sm"
        >
          浏览分类
        </Link>
      </div>
    </div>
  );
}
