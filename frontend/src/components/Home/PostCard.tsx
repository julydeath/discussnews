import React from "react";

import { ArrowUp } from "lucide-react";

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

  return (
    <div className="border border-gray-200 p-2 rounded-lg flex">
      <div>{index}.</div>
      <div className="flex flex-col">
        <div className="flex items-center">
          {!post.isUpvoted && <ArrowUp size={20} />}
          <div className="text-base text-gray-700 font-medium">
            {post.title}
          </div>
          {post.url && <div className="text-gray-500">({post?.url})</div>}
        </div>
        <div className="text-gray-500 mt-1 flex gap-1">
          {post.points} points
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
