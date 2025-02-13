import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  component: AboutComponent,
});

function AboutComponent() {
  // throw Error("Hello this is error");

  return (
    <div className="p-2">
      <h3>About</h3>
    </div>
  );
}
