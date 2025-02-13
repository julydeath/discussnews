import { createFileRoute, redirect } from "@tanstack/react-router";

import { getCurrentUser } from "@/api/auth";

import SubmitForm from "@/components/submit/SubmitForm";

export const Route = createFileRoute("/submit")({
  component: SubmitForm,
  beforeLoad: async () => {
    const user = await getCurrentUser();
    if (!user?.success) {
      throw redirect({ to: "/" });
    }
  },
});
