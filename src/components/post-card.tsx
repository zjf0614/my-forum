import Link from "next/link";
import { timeAgo, truncate } from "@/lib/utils";

interface PostCardProps {
  post: {
    slug: string;
    title: string;
    content: string;
    createdAt: Date;
    author: { name: string | null; image: string | null };
    category: { name: string; slug: string };
    _count: { replies: number };
  };
}

export function PostCard({ post }: PostCardProps) {
  return (
    <article className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md hover:border-blue-200 transition-all">
      <div className="flex items-start gap-4">
        {/* Author avatar */}
        <div className="hidden sm:flex w-10 h-10 bg-blue-100 rounded-full items-center justify-center text-blue-600 font-medium text-sm flex-shrink-0">
          {(post.author.name || "U")[0].toUpperCase()}
        </div>

        <div className="flex-1 min-w-0">
          {/* Category badge + time */}
          <div className="flex items-center gap-2 mb-1.5">
            <Link
              href={`/categories/${post.category.slug}`}
              className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full hover:bg-blue-100 hover:text-blue-600 transition"
            >
              {post.category.name}
            </Link>
            <span className="text-xs text-gray-400">{timeAgo(post.createdAt)}</span>
          </div>

          {/* Title */}
          <Link href={`/posts/${post.slug}`} className="group">
            <h2 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition line-clamp-1">
              {post.title}
            </h2>
          </Link>

          {/* Excerpt */}
          <p className="text-sm text-gray-500 mt-1 line-clamp-2">
            {truncate(post.content, 200)}
          </p>

          {/* Meta */}
          <div className="flex items-center gap-3 mt-3 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <span className="font-medium text-gray-600">{post.author.name || "匿名"}</span>
            </span>
            <span className="flex items-center gap-1">
              💬 {post._count.replies} 回复
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
