import React, { useState } from "react";

import { upVotePost } from "@/api/posts";
import { ArrowUp } from "lucide-react";
import { toast } from "sonner";

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

const PostCard = ({ post, index }: { post: Post; index: number }) => {
  const date = new Date(post?.createdAt);
  const [isUpvoted, setIsUpvoted] = useState(post?.isUpvoted);
  const [upvoteCount, setUpvoteCount] = useState(post?.points);

  const handleUpvote = async () => {
    const res = await upVotePost(post.id.toString());
    if (res?.success) {
      setIsUpvoted(true);
      setUpvoteCount(res?.data.count);
    } else {
      toast.error("error", { description: "Something went wrong" });
    }
  };

  return (
    <div className="border border-gray-200 p-2 rounded-lg flex">
      <div>{index}.</div>
      <div className="flex flex-col">
        <div className="flex items-center">
          {/* {!post.isUpvoted && (
            <ArrowUp
              className="cursor-pointer"
              onClick={() => handleUpvote()}
              size={20}
            />
          )} */}
          {!post.isUpvoted && !isUpvoted && (
            <ArrowUp
              className="cursor-pointer"
              onClick={() => handleUpvote()}
              size={20}
            />
          )}
          <div className="text-base text-gray-700 font-medium">
            {post.title}
          </div>
          {post.url && <div className="text-gray-500">({post?.url})</div>}
        </div>
        <div className="text-gray-500 mt-1 flex gap-1">
          {upvoteCount} points
          <div className="text-gray-500">by {post.author.username}</div>
          <div>
            {date.toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}{" "}
          </div>
          <div>{post.commentCount} comments</div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
