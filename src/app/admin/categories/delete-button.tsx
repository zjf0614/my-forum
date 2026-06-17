"use client";

export function DeleteCategoryButton({ name }: { name: string }) {
  return (
    <button
      type="submit"
      className="px-2 py-1 text-xs text-red-600 bg-red-50 rounded hover:bg-red-100 transition"
      onClick={(e) => {
        if (!confirm(`确定删除分类 "${name}" 吗？该分类下的帖子不会被删除。`)) {
          e.preventDefault();
        }
      }}
    >
      删除
    </button>
  );
}
