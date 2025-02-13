import React from "react";
import { useNavigate, useRouter } from "@tanstack/react-router";
import { useForm } from "@tanstack/react-form";
import { useQueryClient } from "@tanstack/react-query";

import { loginUser } from "@/api/auth";

export const LogIn = () => {
  const navigate = useNavigate();
  const router = useRouter();
  const queryClient = useQueryClient();

  const form = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      // Do something with form data
      const username = value.username;
      const password = value.password;
      const res = await loginUser({ username, password });

      if (res.success) {
        await queryClient.invalidateQueries({ queryKey: ["user"] });
        router.invalidate();
        await navigate({ to: "/" });
        return null;
      } else {
        if (!res.isFormError) {
          alert("Login failed");
        }
        form.setErrorMap({
          onSubmit: res.isFormError ? res.error : "Unexpected error",
        });
      }
    },
  });

  return (
    <div>
      <div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <div>
            <form.Field
              name="username"
              // eslint-disable-next-line react/no-children-prop
              children={(field) => (
                <input
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Enter username"
                />
              )}
            />
          </div>
          <div>
            <form.Field
              name="password"
              // eslint-disable-next-line react/no-children-prop
              children={(field) => (
                <input
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Enter password"
                />
              )}
            />
          </div>
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};
