import { cors } from "hono/cors";
import { getCookie } from "hono/cookie";
import {
  deleteSessionTokenCookie,
  setSessionTokenCookie,
  validateSessionToken,
} from "./session";
import type { Context } from "./context";
import { Hono } from "hono";

const app = new Hono<Context>();

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.use("*", cors(), async (c, next) => {
  const token = getCookie(c, "session");
  const expiresAt = new Date();
  if (!token) {
    c.set("user", null);
    c.set("session", null);
    return next();
  }
  const { session, user } = await validateSessionToken(token);
  if (session) {
    setSessionTokenCookie(c, token, expiresAt);
  }
  if (session === null) {
    deleteSessionTokenCookie(c);
    return next();
  }
  c.set("user", user);
  c.set("session", session);

  return next();
});

export default app;
