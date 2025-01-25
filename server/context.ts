import type { Env } from "hono";

import { z } from "zod";

import type { Session, User } from "./db/schemas/auth";
import { insertCommentsSchema } from "./db/schemas/comments";
import { insertPostSchema } from "./db/schemas/posts";
import APIRoutes from "./index";

export { type APIRoutes };

export interface Context extends Env {
  Variables: {
    user: User | null;
    session: Session | null;
  };
}

export type SuccessResponse<T = void> = {
  success: true;
  message: string;
} & (T extends void ? object : { data: T });

export const LoginSchema = z.object({
  username: z.string().min(3).max(14),
  password: z.string().min(3),
});

export const createPostSchema = insertPostSchema
  .pick({
    title: true,
    url: true,
    content: true,
  })
  .refine((data) => data.url || data.content, {
    message: "Either url or content must be provided",
    path: ["url", "content"],
  });

export const sortBySchema = z.enum(["points", "recent"]);
export const orderBySchema = z.enum(["asc", "desc"]);

export const paginationSchema = z.object({
  limit: z.coerce.number().optional().default(10),
  page: z.coerce.number().optional().default(1),
  sortBy: sortBySchema.optional().default("points"),
  order: orderBySchema.optional().default("desc"),
  author: z.number().optional(),
  site: z.string().optional(),
});

export const createCommentSchema = insertCommentsSchema.pick({ content: true });

export type Post = {
  id: number;
  title: string;
  url: string | null;
  content: string | null;
  points: number;
  createdAt: string;
  commentCount: number;
  author: {
    id: number;
    username: string;
  };
  isUpvoted: boolean;
};

export type Comment = {
  id: number;
  userId: number;
  content: string;
  points: number;
  depth: number;
  commentCount: number;
  createdAt: string;
  postId: number;
  parentCommentId: number | null;
  commentUpvotes: {
    userId: number;
  }[];
  author: {
    username: string;
    id: number;
  };
  childComments?: Comment[];
};

export type PaginatedResponse<T> = {
  pagination: {
    page: number;
    totalPages: number;
  };
  data: T;
} & Omit<SuccessResponse, "data">;
