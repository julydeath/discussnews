import { createFileRoute, redirect } from "@tanstack/react-router";

import { getCurrentUser } from "@/api/auth";

import { SignUp } from "@/components/auth/SignUp";

export const Route = createFileRoute("/signup")({
  component: SignUp,
  beforeLoad: async () => {
    const user = await getCurrentUser();
    if (user?.success) {
      throw redirect({ to: "/" });
    }
  },
});
