import { hc } from "hono/client";

import { APIRoutes } from "../../../../server";

const client = hc<APIRoutes>("/", {
  fetch: (input: RequestInfo | URL, init?: RequestInit) =>
    fetch(input, {
      ...init,
      credentials: "include",
    }),
}).api;
