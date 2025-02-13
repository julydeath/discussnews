import { hc } from "hono/client";

import { APIRoutes } from "../../../../server";

const client = hc<APIRoutes>("/", {
  fetch: (input: RequestInfo | URL, init?: RequestInit) =>
    fetch(input, {
      ...init,
      credentials: "include",
    }),
}).api;

export const createPost = async ({
  title,
  url,
  content,
}: {
  title: string;
  url?: string;
  content?: string;
}) => {
  try {
    const res = await client.posts.$post({
      form: { title, url, content },
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const getPosts = async () => {
  try {
    const res = await client.posts.$get({
      query: {
        page: "1",
        limit: "10",
      },
    });
    const data = await res.json();
    return data;
    // throw Error("");
  } catch (error) {
    console.log(error);
  }
};

export const upVotePost = async (id: string) => {
  try {
    const res = await client.posts[":id"].upvote.$post({
      param: {
        id: id,
      },
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};
