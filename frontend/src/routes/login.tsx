import { createFileRoute, redirect } from "@tanstack/react-router";

import { getCurrentUser } from "@/api/auth";

import { LogIn } from "@/components/auth/Login";

export const Route = createFileRoute("/login")({
  component: LogIn,
  beforeLoad: async () => {
    const user = await getCurrentUser();

    console.log({ user });
    if (user?.success) {
      throw redirect({ to: "/" });
    }
  },
});
