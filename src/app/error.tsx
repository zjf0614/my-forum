"use client";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="max-w-lg mx-auto px-4 py-20 text-center">
      <p className="text-6xl mb-4">😵</p>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">出错了</h1>
      <p className="text-gray-500 mb-6">
        {error.message || "页面加载时发生错误，请稍后再试。"}
      </p>
      <div className="flex gap-3 justify-center">
        <button
          onClick={reset}
          className="px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition text-sm"
        >
          重试
        </button>
        <a
          href="/"
          className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition text-sm"
        >
          返回首页
        </a>
      </div>
    </div>
  );
}
