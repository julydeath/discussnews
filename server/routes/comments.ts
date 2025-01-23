import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { eq, sql } from "drizzle-orm";

import { db } from "@/adapter";
import type { Comment, Context, SuccessResponse } from "@/context";
import { commentsTable } from "@/db/schemas/comments";
import { postsTable } from "@/db/schemas/posts";
import { loggedIn } from "@/middleware/loggedIn";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

import { getISOFormatDateQuery } from "../../lib/utils";

export const commentsRouter = new Hono<Context>().post(
  "/:id",
  loggedIn,
  zValidator("param", z.object({ id: z.coerce.number() })),
  zValidator(
    "form",
    z.object({
      content: z.string().min(3, { message: "Comment must me min 3 char" }),
    }),
  ),
  async (c) => {
    const { id } = c.req.valid("param");
    const { content } = c.req.valid("form");
    const user = c.get("user")!;

    const comment = await db.transaction(async (tx) => {
      const [parentComment] = await tx
        .select({
          id: commentsTable.id,
          postId: commentsTable.postId,
          depth: commentsTable.depth,
        })
        .from(commentsTable)
        .where(eq(commentsTable.id, id));

      const [updatedParentComment] = await tx
        .update(commentsTable)
        .set({ commentCount: sql`${commentsTable.commentCount} + 1` })
        .where(eq(commentsTable.id, parentComment.id))
        .returning({ commentCount: commentsTable.commentCount });

      if (!parentComment || !updatedParentComment) {
        throw new HTTPException(501, { message: "Comment not found" });
      }

      const [updatedPost] = await tx
        .update(postsTable)
        .set({ commentCount: sql`${postsTable.commentCount} + 1` })
        .where(eq(postsTable.id, parentComment.postId))
        .returning({ commentCount: postsTable.commentCount });

      if (!updatedPost) {
        throw new HTTPException(404, {
          message: "Post not found",
        });
      }

      return await tx
        .insert(commentsTable)
        .values({
          content,
          userId: user.id,
          postId: id,
          parentCommentId: parentComment.id,
          depth: parentComment.depth + 1,
        })
        .returning({
          id: commentsTable.id,
          userId: commentsTable.userId,
          postId: commentsTable.postId,
          content: commentsTable.content,
          points: commentsTable.points,
          depth: commentsTable.depth,
          parentCommentId: commentsTable.parentCommentId,
          createdAt: getISOFormatDateQuery(commentsTable.createdAt).as(
            "created_at",
          ),
          commentCount: commentsTable.commentCount,
        });
    });

    return c.json<SuccessResponse<Comment>>({
      success: true,
      message: "Comment created",
      data: {
        ...comment,
        commentUpvotes: [],
        childComments: [],
        author: {
          username: user.username,
          id: user.id,
        },
      } as unknown as Comment,
    });
  },
);
