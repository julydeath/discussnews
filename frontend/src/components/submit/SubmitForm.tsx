/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { useForm } from "@tanstack/react-form";

import { createPost } from "@/api/posts";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

const CreatePostSchema = z.object({
  title: z.string().min(3, { message: "Title must be atleast 3 chars" }),
  url: z
    .string()
    .trim()
    .url({ message: "URL must be a valid URL" })
    .optional()
    .or(z.literal("")),
  content: z.string().optional(),
});

const SubmitForm = () => {
  const form = useForm({
    defaultValues: {
      title: "",
      url: "",
      content: "",
    },
    validators: {
      onChange: CreatePostSchema,
    },
    onSubmit: async ({ value }) => {
      const res: any = await createPost({
        title: value.title,
        url: value.url,
        content: value.content,
      });
      console.log({ res });
      if (res.success) {
        toast.success("Success", { description: res.message });
        value.title = "";
        value.url = "";
        value.content = "";
        return null;
      } else {
        toast.error("Error", { description: res.message });
      }
    },
  });
  return (
    <div className="w-xl md:w-4xl mx-auto flex flex-col justify-center h-[80vh] item center">
      <div className="text-3xl font-medium">Create Post</div>
      <div>
        <div className="flex flex-col">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
          >
            <div className="my-6">
              <form.Field
                name="title"
                // eslint-disable-next-line react/no-children-prop
                children={(field) => (
                  <>
                    <Label className="pb-2" htmlFor="username">
                      Title
                    </Label>
                    <Input
                      name={field.name}
                      type="text"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Enter title"
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
            <div className="my-6">
              <form.Field
                name="url"
                // eslint-disable-next-line react/no-children-prop
                children={(field) => (
                  <>
                    <Label htmlFor="url">Url</Label>
                    <Input
                      name={field.name}
                      type="text"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Enter url"
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
                name="content"
                // eslint-disable-next-line react/no-children-prop
                children={(field) => (
                  <>
                    <Label htmlFor="url">Content</Label>
                    <Textarea
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Enter content"
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
                  {isSubmitting ? "..." : "submit"}
                </Button>
              )}
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default SubmitForm;
