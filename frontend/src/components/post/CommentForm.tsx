import React from "react";
import { useForm } from "@tanstack/react-form";
import { useQueryClient } from "@tanstack/react-query";

import { commentPost } from "@/api/posts";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";

export const CommentForm = ({ postId }: { postId: number }) => {
  const queryClient = useQueryClient();

  const form = useForm({
    defaultValues: {
      content: "",
    },
    onSubmit: async ({ value }) => {
      // Do something with form data
      const res = await commentPost(postId.toString(), value.content);
      if (res?.success) {
        // queryClient.setQueryData(["post", postId.toString()], (oldData) => {
        //   return {
        //     ...oldData,
        //     data: {
        //       ...oldData.data,
        //       commentCount: oldData.data.commentCount + 1,
        //     },
        //   };
        // });

        // Then force a refetch to get fresh data
        await queryClient.invalidateQueries({
          queryKey: ["post", postId.toString()],
          exact: true, // This ensures only this specific query is invalidated
          refetchType: "all", // This forces an immediate refetch
        });
        form.reset();
        toast.success("Success", { description: res.message });
      }
    },
    validators: {
      onChange: z.object({
        content: z.string(),
      }),
    },
  });
  return (
    <div className="my-4">
      <div className="mb-1">Create Comment</div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <div>
          <form.Field
            name="content"
            // eslint-disable-next-line react/no-children-prop
            children={(field) => (
              <Textarea
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            )}
          />
        </div>
        <div className="w-full flex justify-end">
          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
            // eslint-disable-next-line react/no-children-prop
            children={([canSubmit, isSubmitting]) => (
              <Button className="my-2" type="submit" disabled={!canSubmit}>
                {isSubmitting ? "..." : "Submit"}
              </Button>
            )}
          />
        </div>
      </form>
    </div>
  );
};
