import { timeAgo } from "@/lib/utils";
import ReactMarkdown from "react-markdown";

interface ReplyCardProps {
  reply: {
    id: string;
    content: string;
    createdAt: Date;
    author: { id: string; name: string | null; image: string | null };
  };
  canDelete: boolean;
  postSlug: string;
}

export function ReplyCard({ reply, canDelete, postSlug }: ReplyCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 font-medium text-sm flex-shrink-0">
          {(reply.author.name || "U")[0].toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <span className="font-medium text-sm text-gray-900">
              {reply.author.name || "匿名"}
            </span>
            <span className="text-xs text-gray-400">{timeAgo(reply.createdAt)}</span>
          </div>

          <div className="prose prose-gray prose-sm max-w-none">
            <ReactMarkdown>{reply.content}</ReactMarkdown>
          </div>

          {canDelete && (
            <form
              action={async () => {
                "use server";
                const { deleteReply } = await import("@/actions/reply-actions");
                await deleteReply(reply.id, postSlug);
              }}
              className="mt-2"
            >
              <button
                type="submit"
                className="text-xs text-red-500 hover:text-red-700 transition"
                onClick={(e) => {
                  if (!confirm("确定要删除这条回复吗？")) e.preventDefault();
                }}
              >
                删除
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
