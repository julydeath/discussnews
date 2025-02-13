import React from "react";
import { Link, useNavigate, useRouter } from "@tanstack/react-router";
import { useForm } from "@tanstack/react-form";
import { useQueryClient } from "@tanstack/react-query";

import { loginUser } from "@/api/auth";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

const LogInSchema = z.object({
  username: z.string().min(3, { message: "min length must 3" }),
  password: z.string().nonempty("Password is required"),
});

export const LogIn = () => {
  const navigate = useNavigate();
  const router = useRouter();
  const queryClient = useQueryClient();

  const form = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
    validators: {
      onChange: LogInSchema,
    },
    onSubmit: async ({ value }) => {
      const username = value.username;
      const password = value.password;
      const res = await loginUser({ username, password });

      if (res.success) {
        await queryClient.invalidateQueries({ queryKey: ["user"] });
        router.invalidate();
        await navigate({ to: "/" });
        return null;
      } else {
        console.log({ res });
        // if (!res.isFormError) {
        //   toast.error("Login failed", { description: res.error });
        // }
        // form.setErrorMap({
        //   onSubmit: res.isFormError ? res.error : "Unexpected error",
        // });
        toast.error("Login failed", { description: res.error });
      }
    },
  });

  return (
    <div className="flex flex-col justify-center items-center h-[80vh]">
      <div className="w-lg mg:w-2xl border border-gray-200 p-6 rounded-xl">
        <div className="text-center  pt-4 text-2xl md:text-4xl text-gray-700">
          Welcome back
        </div>
        <div className="text-center py-2 text-md md:text-lg text-gray-700">
          Log in to your account to continue.
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
                  {isSubmitting ? "..." : "Login"}
                </Button>
              )}
            />
          </form>
        </div>
      </div>
      <div>
        <p className="p-4">
          Don&apos;t have account?{"  "}
          <Link style={{ color: "gray" }} to={"/signup"}>
            Create here
          </Link>
        </p>
      </div>
    </div>
  );
};
