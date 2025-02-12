import React from "react";
import { redirect } from "@tanstack/react-router";
import { useForm } from "@tanstack/react-form";
import { useQuery } from "@tanstack/react-query";

import { createUserAccount, getCurrentUser } from "@/api/auth";

export const SignUp = () => {
  const form = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      // Do something with form data
      const username = value.username;
      const password = value.password;
      const data = await createUserAccount({ username, password });
      console.log({ data });
    },
  });

  const { data: username } = useQuery({
    queryKey: ["user"],
    queryFn: getCurrentUser,
  });

  if (username?.success) {
    redirect({
      to: "/",
    });
  }

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
