import { hc } from "hono/client";

import { APIRoutes } from "../../../../server";

const client = hc<APIRoutes>("/", {
  fetch: (input: RequestInfo | URL, init?: RequestInit) =>
    fetch(input, {
      ...init,
      credentials: "include",
    }),
}).api;

export const createUserAccount = async ({
  username,
  password,
}: {
  username: string;
  password: string;
}) => {
  try {
    const res = await client.auth.signup.$post({
      form: {
        username,
        password,
      },
    });

    if (res.ok) {
      const data = await res.json();
      return data;
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.log({ error });
    return {
      success: false,
      message: String(error),
    };
  }
};

export const loginUser = async ({
  username,
  password,
}: {
  username: string;
  password: string;
}) => {
  try {
    const res = await client.auth.login.$post({
      form: {
        username,
        password,
      },
    });

    if (res.ok) {
      const data = await res.json();
      return data;
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const getCurrentUser = async () => {
  try {
    const res = await client.auth.user.$get();
    if (res.ok) {
      const user = await res.json();
      return user;
    }
    return null;
  } catch (error) {
    console.log({ error });
  }
};
