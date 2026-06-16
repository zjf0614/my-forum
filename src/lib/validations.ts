import { z } from "zod";

// ── Register ──
export const registerSchema = z
  .object({
    name: z
      .string()
      .min(2, "用户名至少2个字符")
      .max(50, "用户名最多50个字符"),
    email: z.string().email("请输入有效的邮箱地址"),
    password: z
      .string()
      .min(8, "密码至少8个字符")
      .regex(/[a-zA-Z]/, "密码必须包含至少一个字母")
      .regex(/[0-9]/, "密码必须包含至少一个数字"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "两次输入的密码不一致",
    path: ["confirmPassword"],
  });

export type RegisterInput = z.infer<typeof registerSchema>;

// ── Login ──
export const loginSchema = z.object({
  email: z.string().email("请输入有效的邮箱地址"),
  password: z.string().min(1, "请输入密码"),
});

export type LoginInput = z.infer<typeof loginSchema>;

// ── Post ──
export const postSchema = z.object({
  title: z
    .string()
    .min(2, "标题至少2个字符")
    .max(200, "标题最多200个字符"),
  content: z
    .string()
    .min(10, "内容至少10个字符")
    .max(50000, "内容最多50000个字符"),
  categoryId: z.string().min(1, "请选择分类"),
});

export type PostInput = z.infer<typeof postSchema>;

// ── Reply ──
export const replySchema = z.object({
  content: z
    .string()
    .min(1, "请输入回复内容")
    .max(5000, "回复最多5000个字符"),
  postId: z.string(),
});

export type ReplyInput = z.infer<typeof replySchema>;

// ── Category (admin) ──
export const categorySchema = z.object({
  name: z
    .string()
    .min(2, "分类名称至少2个字符")
    .max(50, "分类名称最多50个字符"),
  description: z.string().max(200, "描述最多200个字符").optional(),
});

export type CategoryInput = z.infer<typeof categorySchema>;

// ── Search ──
export const searchSchema = z.object({
  q: z.string().min(1, "请输入搜索关键词").max(200, "搜索关键词最多200个字符"),
});

export type SearchInput = z.infer<typeof searchSchema>;
