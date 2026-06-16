import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { generateSlug } from "@/lib/utils";

export const metadata = {
  title: "管理分类",
};

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    include: { _count: { select: { posts: true } } },
    orderBy: { createdAt: "desc" },
  });

  async function createCategory(formData: FormData) {
    "use server";
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;

    if (!name || name.length < 2) return;

    let slug = generateSlug(name);
    let suffix = 1;
    while (await prisma.category.findUnique({ where: { slug } })) {
      slug = generateSlug(name) + "-" + suffix;
      suffix++;
    }

    await prisma.category.create({
      data: { name, slug, description: description || null },
    });

    revalidatePath("/admin/categories");
    revalidatePath("/categories");
    revalidatePath("/");
  }

  async function deleteCategory(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    if (!id) return;

    await prisma.category.delete({ where: { id } });

    revalidatePath("/admin/categories");
    revalidatePath("/categories");
    revalidatePath("/");
  }

  async function updateCategory(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;

    if (!id || !name || name.length < 2) return;

    const existing = await prisma.category.findUnique({ where: { id } });
    if (!existing) return;

    let slug = existing.slug;
    if (name !== existing.name) {
      slug = generateSlug(name);
      let suffix = 1;
      while (await prisma.category.findFirst({ where: { slug, id: { not: id } } })) {
        slug = generateSlug(name) + "-" + suffix;
        suffix++;
      }
    }

    await prisma.category.update({
      where: { id },
      data: { name, slug, description: description || null },
    });

    revalidatePath("/admin/categories");
    revalidatePath("/categories");
    revalidatePath("/");
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">📂 管理分类</h1>

      {/* Create form */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
        <h2 className="font-semibold text-gray-900 mb-4">新建分类</h2>
        <form action={createCategory} className="space-y-3">
          <input
            name="name"
            type="text"
            required
            placeholder="分类名称"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            name="description"
            type="text"
            placeholder="分类描述（可选）"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition"
          >
            创建分类
          </button>
        </form>
      </div>

      {/* Category list */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left px-6 py-3 font-medium text-gray-600">名称</th>
              <th className="text-left px-6 py-3 font-medium text-gray-600">Slug</th>
              <th className="text-center px-6 py-3 font-medium text-gray-600">帖子数</th>
              <th className="text-right px-6 py-3 font-medium text-gray-600">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {categories.map((cat) => (
              <tr key={cat.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div>
                    <p className="font-medium text-gray-900">{cat.name}</p>
                    {cat.description && (
                      <p className="text-xs text-gray-400">{cat.description}</p>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-500 font-mono text-xs">{cat.slug}</td>
                <td className="px-6 py-4 text-center text-gray-500">{cat._count.posts}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {/* Edit form (simplified: just rename) */}
                    <form action={updateCategory} className="flex gap-1">
                      <input type="hidden" name="id" value={cat.id} />
                      <input
                        name="name"
                        type="text"
                        defaultValue={cat.name}
                        className="w-24 px-2 py-1 border border-gray-300 rounded text-xs
                                   focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                      <button
                        type="submit"
                        className="px-2 py-1 text-xs text-blue-600 bg-blue-50 rounded hover:bg-blue-100 transition"
                      >
                        更新
                      </button>
                    </form>
                    <form action={deleteCategory}>
                      <input type="hidden" name="id" value={cat.id} />
                      <button
                        type="submit"
                        className="px-2 py-1 text-xs text-red-600 bg-red-50 rounded hover:bg-red-100 transition"
                        onClick={(e) => {
                          if (!confirm(`确定删除分类 "${cat.name}" 吗？该分类下的帖子不会被删除。`)) {
                            e.preventDefault();
                          }
                        }}
                      >
                        删除
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
