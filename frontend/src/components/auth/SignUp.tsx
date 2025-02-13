import React from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useForm } from "@tanstack/react-form";

import { createUserAccount } from "@/api/auth";
import { toast } from "sonner";
import * as z from "zod";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

const SignUpSchema = z.object({
  username: z.string().min(3, { message: "min length must 3" }),
  password: z.string().nonempty("Password is required"),
});

export const SignUp = () => {
  const navigate = useNavigate();
  const form = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      // Do something with form data
      const username = value.username;
      const password = value.password;
      const res = await createUserAccount({ username, password });
      console.log({ res });
      if (res.success) {
        toast.success("User created", { description: res.message });
        // redirect({ to: "/" });
        await navigate({ to: "/" });
      } else {
        toast.error("Signup Failed", { description: res.error });
      }
    },
    validators: {
      onChange: SignUpSchema,
    },
  });

  return (
    <div className="flex flex-col justify-center items-center h-[80vh]">
      <div className="w-lg mg:w-2xl border border-gray-200 p-6 rounded-xl">
        <div className="text-center  pt-4 text-2xl md:text-4xl text-gray-700">
          Welcome
        </div>
        <div className="text-center py-2 text-md md:text-lg text-gray-700">
          Sign up to get started.
        </div>
        <div className="flex flex-col">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
          >
            <div className="py-6">
              <form.Field
                name="username"
                // eslint-disable-next-line react/no-children-prop
                children={(field) => (
                  <>
                    <Label className="pb-2" htmlFor="username">
                      Username
                    </Label>
                    <Input
                      name={field.name}
                      type="text"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Enter username"
                    />
                    {field.state.meta.errors ? (
                      <em role="alert" className="text-destructive">
                        {field.state.meta.errors.join(", ")}
                      </em>
                    ) : null}
                  </>
                )}
              />
            </div>
            <div>
              <form.Field
                name="password"
                // eslint-disable-next-line react/no-children-prop
                children={(field) => (
                  <>
                    <Label htmlFor="password">Password</Label>
                    <Input
                      name={field.name}
                      type="password"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Enter password"
                    />
                    {field.state.meta.errors ? (
                      <em role="alert" className="text-destructive">
                        {field.state.meta.errors.join(", ")}
                      </em>
                    ) : null}
                  </>
                )}
              />
            </div>
            <form.Subscribe
              selector={(state) => [state.errorMap]}
              // eslint-disable-next-line react/no-children-prop
              children={([errorMap]) =>
                errorMap.onSubmit ? (
                  <p className="text-[0.8rem] font-medium text-destructive">
                    {errorMap.onSubmit?.toString()}
                  </p>
                ) : null
              }
            />
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
              // eslint-disable-next-line react/no-children-prop
              children={([canSubmit, isSubmitting]) => (
                <Button
                  className="w-full mt-8"
                  type="submit"
                  disabled={!canSubmit}
                >
                  {isSubmitting ? "..." : "Signup"}
                </Button>
              )}
            />
          </form>
        </div>
      </div>
      <div>
        <p className="p-4">
          Already have account?{"  "}
          <Link style={{ color: "gray" }} to={"/login"}>
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};
