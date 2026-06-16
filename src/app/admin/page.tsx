import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "管理后台",
};

export default async function AdminDashboard() {
  const [totalUsers, totalPosts, totalReplies, totalCategories] = await Promise.all([
    prisma.user.count(),
    prisma.post.count(),
    prisma.reply.count(),
    prisma.category.count(),
  ]);

  const latestUsers = await prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true, createdAt: true },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  const latestPosts = await prisma.post.findMany({
    select: { id: true, title: true, slug: true, createdAt: true },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  const stats = [
    { label: "用户总数", value: totalUsers, icon: "👥", color: "bg-blue-50 text-blue-700" },
    { label: "帖子总数", value: totalPosts, icon: "📝", color: "bg-green-50 text-green-700" },
    { label: "回复总数", value: totalReplies, icon: "💬", color: "bg-yellow-50 text-yellow-700" },
    { label: "分类数量", value: totalCategories, icon: "📂", color: "bg-purple-50 text-purple-700" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">📊 仪表盘</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white border border-gray-200 rounded-xl p-5">
            <div className={`inline-flex w-10 h-10 rounded-lg items-center justify-center text-lg ${stat.color}`}>
              {stat.icon}
            </div>
            <p className="text-3xl font-bold text-gray-900 mt-3">{stat.value}</p>
            <p className="text-sm text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Latest users */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="font-semibold text-gray-900 mb-4">最新用户</h2>
          <div className="space-y-3">
            {latestUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm text-gray-900">{user.name || "未命名"}</p>
                  <p className="text-xs text-gray-400">{user.email}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  user.role === "ADMIN" ? "bg-red-100 text-red-700" :
                  user.role === "MODERATOR" ? "bg-blue-100 text-blue-700" :
                  "bg-gray-100 text-gray-600"
                }`}>
                  {user.role}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Latest posts */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="font-semibold text-gray-900 mb-4">最新帖子</h2>
          <div className="space-y-3">
            {latestPosts.map((post) => (
              <div key={post.id}>
                <a href={`/posts/${post.slug}`} className="text-sm text-gray-900 hover:text-blue-600 transition line-clamp-1">
                  {post.title}
                </a>
                <p className="text-xs text-gray-400 mt-0.5">
                  {new Date(post.createdAt).toLocaleDateString("zh-CN")}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
