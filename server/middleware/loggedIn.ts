import type { Context } from "@/context";
import { validateSessionToken } from "@/session";
import { getCookie } from "hono/cookie";
import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";

export const loggedIn = createMiddleware<Context>(async (c, next) => {
  const token = getCookie(c, "session");
  const { user } = await validateSessionToken(token!);
  if (!user) {
    throw new HTTPException(401, {
      message: "Unauthorized",
    });
  }

  await next();
});
