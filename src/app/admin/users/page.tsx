import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";

export const metadata = {
  title: "管理用户",
};

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    include: { _count: { select: { posts: true, replies: true } } },
    orderBy: { createdAt: "desc" },
  });

  async function updateRole(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    const role = formData.get("role") as string;

    if (!id || !role) return;

    if (!["USER", "MODERATOR", "ADMIN"].includes(role)) return;

    await prisma.user.update({
      where: { id },
      data: { role: role as any },
    });

    revalidatePath("/admin/users");
  }

  const roleColors: Record<string, string> = {
    ADMIN: "bg-red-100 text-red-700",
    MODERATOR: "bg-blue-100 text-blue-700",
    USER: "bg-gray-100 text-gray-600",
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">👥 管理用户</h1>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-6 py-3 font-medium text-gray-600">用户</th>
                <th className="text-left px-6 py-3 font-medium text-gray-600 hidden md:table-cell">邮箱</th>
                <th className="text-center px-6 py-3 font-medium text-gray-600">角色</th>
                <th className="text-center px-6 py-3 font-medium text-gray-600 hidden md:table-cell">帖子</th>
                <th className="text-center px-6 py-3 font-medium text-gray-600 hidden md:table-cell">回复</th>
                <th className="text-left px-6 py-3 font-medium text-gray-600 hidden lg:table-cell">注册时间</th>
                <th className="text-right px-6 py-3 font-medium text-gray-600">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 font-medium text-xs">
                        {(user.name || "U")[0].toUpperCase()}
                      </div>
                      <span className="font-medium text-gray-900">
                        {user.name || "未命名"}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-500 hidden md:table-cell">{user.email}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${roleColors[user.role]}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center text-gray-500 hidden md:table-cell">
                    {user._count.posts}
                  </td>
                  <td className="px-6 py-4 text-center text-gray-500 hidden md:table-cell">
                    {user._count.replies}
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-400 hidden lg:table-cell">
                    {formatDate(user.createdAt)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <form action={updateRole} className="flex items-center justify-end gap-1">
                      <input type="hidden" name="id" value={user.id} />
                      <select
                        name="role"
                        defaultValue={user.role}
                        className="text-xs px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="USER">USER</option>
                        <option value="MODERATOR">MODERATOR</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>
                      <button
                        type="submit"
                        className="px-2 py-1 text-xs text-blue-600 bg-blue-50 rounded hover:bg-blue-100 transition"
                      >
                        更新
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
