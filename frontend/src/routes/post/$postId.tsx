import React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import { getPostById } from "@/api/posts";

import PostCard from "@/components/Home/PostCard";
import { CommentForm } from "@/components/post/CommentForm";

export const Route = createFileRoute("/post/$postId")({
  component: RouteComponent,
  loader: async ({ params }) => {
    return getPostById(params.postId);
  },
});

function RouteComponent() {
  const { postId } = Route.useParams();

  const {
    data: post,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["post", postId],
    queryFn: () => getPostById(postId),
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });

  console.log({ post });

  if (error) {
    throw new Error();
  }
  return (
    <div>
      {isLoading ? (
        <div>Loading ...</div>
      ) : (
        <div className="mx-4">
          {post && (
            <>
              <PostCard post={post?.data} index={0} />
              <CommentForm postId={post.data.id} />
            </>
          )}
        </div>
      )}
    </div>
  );
}
