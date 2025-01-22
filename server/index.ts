import { cors } from "hono/cors";
import {
  deleteSessionTokenCookie,
  setSessionTokenCookie,
  validateSessionToken,
} from "./session";
import type { Context } from "./context";
import { Hono } from "hono";
import { authRouter } from "./routes/auth";

const app = new Hono<Context>();

app.get("/", (c) => {
  console.log("hi");
  return c.text("Hello Hono!");
});

app.use("*", cors(), async (c, next) => {
  const token = c.get("session");
  if (!token) {
    c.set("user", null);
    c.set("session", null);
    return next();
  }
  const { session, user } = await validateSessionToken(token.id);
  if (session) {
    setSessionTokenCookie(c, session.id, session.expiresAt);
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
const routes = app.basePath("/api").route("/auth", authRouter);

export default app;
export type APIRoutes = typeof routes;
