import { Hono } from "hono";
import { getCookie } from "hono/cookie";
import { HTTPException } from "hono/http-exception";
import { eq } from "drizzle-orm";

import { db } from "@/adapter";
import { LoginSchema, type Context } from "@/context";
import { userTable } from "@/db/schemas/auth";
import { loggedIn } from "@/middleware/loggedIn";
import {
  createSession,
  deleteSessionTokenCookie,
  generateSessionToken,
  invalidateSession,
  setSessionTokenCookie,
  validateSessionToken,
} from "@/session";
import { zValidator } from "@hono/zod-validator";

import { generateRandomNumber } from "../../lib/generateNumbers";

export const authRouter = new Hono<Context>()
  .post("/signup", zValidator("form", LoginSchema), async (c) => {
    const { username, password } = c.req.valid("form");
    const passwordHash = await Bun.password.hash(password);
    const userId = generateRandomNumber(5);

    try {
      await db.insert(userTable).values({
        password_hash: passwordHash,
        username,
        id: userId,
      });

      const token = generateSessionToken();

      const session = await createSession(token, userId);

      setSessionTokenCookie(c, token, session.expiresAt);

      return c.json(
        {
          success: "true",
          message: "User created successfully",
        },
        201,
      );
    } catch (error) {
      console.log(error);
      if (
        error &&
        typeof error === "object" &&
        "code" in error &&
        error.code === "23505"
      ) {
        throw new HTTPException(409, { message: "Username already exits" });
      }
      throw new HTTPException(500, { message: "Failed to create user" });
    }
  })
  .post("/login", zValidator("form", LoginSchema), async (c) => {
    const { username, password } = c.req.valid("form");

    const [existingUser] = await db
      .select()
      .from(userTable)
      .where(eq(userTable.username, username))
      .limit(1);

    if (!existingUser) {
      throw new HTTPException(401, {
        message: "Incorrect username",
      });
    }

    const validPassword = await Bun.password.verify(
      password,
      existingUser.password_hash,
    );

    if (!validPassword) {
      throw new HTTPException(401, {
        message: "Incorrect password",
      });
    }

    const token = generateSessionToken();

    const session = await createSession(token, existingUser.id);

    setSessionTokenCookie(c, token, session.expiresAt);

    return c.json(
      {
        success: "true",
        message: "User logged in successfully",
      },
      201,
    );
  })
  .get("/logout", async (c) => {
    const token = getCookie(c, "session");
    console.log({ token });
    const { session } = await validateSessionToken(token!);
    if (!session) {
      return c.redirect("/");
    }

    await invalidateSession(session.id);
    deleteSessionTokenCookie(c);
    return c.redirect("/");
  })
  .get("/user", loggedIn, async (c) => {
    const user = c.get("user")!;
    return c.json({
      success: true,
      message: "User fetched",
      data: { username: user.username },
    });
  });
