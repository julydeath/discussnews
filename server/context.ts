import type { Env } from "hono";
import type { Session, User } from "./db/schemas/auth";
import { z } from "zod";

export interface Context extends Env {
  Variables: {
    user: User | null;
    session: Session | null;
  };
}

export const LoginSchema = z.object({
  username: z.string().min(3).max(14),
  password: z.string().min(3),
});
