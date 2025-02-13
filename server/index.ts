import { Hono } from "hono";
import { getCookie } from "hono/cookie";
import { cors } from "hono/cors";

import type { Context } from "./context";
import { authRouter } from "./routes/auth";
import { postsRouter } from "./routes/posts";
import {
  deleteSessionTokenCookie,
  setSessionTokenCookie,
  validateSessionToken,
} from "./session";

const app = new Hono<Context>();

app.use("*", cors(), async (c, next) => {
  const token = getCookie(c, "session");
  if (!token) {
    c.set("user", null);
    c.set("session", null);
    return next();
  }
  const { session, user } = await validateSessionToken(token);

  if (session) {
    setSessionTokenCookie(c, token, session.expiresAt);
  }
  if (session === null) {
    deleteSessionTokenCookie(c);
    return next();
  }

  c.set("user", user);
  c.set("session", session);

  return next();
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const routes = app
  .basePath("/api")
  .route("/auth", authRouter)
  .route("/posts", postsRouter);

export default app;
export type APIRoutes = typeof routes;
