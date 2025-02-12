import { getCookie } from "hono/cookie";
import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";

import type { Context } from "@/context";
import { validateSessionToken } from "@/session";

export const loggedIn = createMiddleware<Context>(async (c, next) => {
  const token = getCookie(c, "session");
  console.log({ token });
  const { user } = await validateSessionToken(token!);

  console.log({ user });
  if (!user) {
    throw new HTTPException(401, {
      message: "Unauthorized",
    });
  }

  await next();
});
