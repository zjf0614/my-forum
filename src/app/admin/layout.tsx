import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user || (session.user as any).role !== "ADMIN") {
    redirect("/");
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <nav className="w-full md:w-48 flex-shrink-0">
          <div className="bg-white border border-gray-200 rounded-xl p-4 sticky top-20">
            <h2 className="font-semibold text-gray-900 mb-3">⚙️ 管理后台</h2>
            <ul className="space-y-1">
              <li>
                <Link
                  href="/admin"
                  className="block px-3 py-2 text-sm text-gray-600 rounded-lg hover:bg-gray-100 hover:text-blue-600 transition"
                >
                  📊 仪表盘
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/categories"
                  className="block px-3 py-2 text-sm text-gray-600 rounded-lg hover:bg-gray-100 hover:text-blue-600 transition"
                >
                  📂 管理分类
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/users"
                  className="block px-3 py-2 text-sm text-gray-600 rounded-lg hover:bg-gray-100 hover:text-blue-600 transition"
                >
                  👥 管理用户
                </Link>
              </li>
              <li className="pt-3 border-t border-gray-100 mt-2">
                <Link
                  href="/"
                  className="block px-3 py-2 text-sm text-gray-400 rounded-lg hover:bg-gray-100 transition"
                >
                  ← 返回论坛
                </Link>
              </li>
            </ul>
          </div>
        </nav>

        {/* Main */}
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}
