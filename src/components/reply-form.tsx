"use client";

import { useState, useRef } from "react";
import { createReply } from "@/actions/reply-actions";

export function ReplyForm({ postId }: { postId: string }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(formData: FormData) {
    setError("");
    setLoading(true);
    try {
      await createReply(formData);
      formRef.current?.reset();
    } catch (e: any) {
      setError(e.message || "回复失败");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <h3 className="font-medium text-gray-900 mb-3">写下你的回复</h3>
      <form ref={formRef} action={handleSubmit}>
        <input type="hidden" name="postId" value={postId} />
        <textarea
          name="content"
          required
          minLength={1}
          maxLength={5000}
          rows={4}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                     resize-y disabled:bg-gray-100"
          placeholder="分享你的想法..."
          disabled={loading}
        />
        {error && (
          <p className="text-red-500 text-xs mt-1">{error}</p>
        )}
        <div className="mt-3 flex items-center justify-between">
          <p className="text-xs text-gray-400">支持 Markdown 格式</p>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium
                       hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "发布中..." : "发布回复"}
          </button>
        </div>
      </form>
    </div>
  );
}
