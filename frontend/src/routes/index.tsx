import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import { getPosts } from "@/api/posts";

import PostCard from "@/components/Home/PostCard";

export const Route = createFileRoute("/")({
  component: HomeComponent,
});

function HomeComponent() {
  const { data: posts } = useQuery({
    queryKey: ["posts"],
    queryFn: getPosts,
    refetchOnWindowFocus: true,
  });

  console.log({ posts });
  return (
    <div className="p-2 flex flex-col justify-center mt-10">
      <div>
        {posts &&
          posts.data &&
          posts?.data.map((post, index: number) => (
            <div key={post.id} className="my-2">
              <PostCard post={post} index={index} />
            </div>
          ))}
      </div>
    </div>
  );
}
