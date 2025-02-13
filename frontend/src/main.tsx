import React from "react";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { Loader2Icon } from "lucide-react";
import ReactDOM from "react-dom/client";

import { routeTree } from "./routeTree.gen";

import "./globals.css";

import { Notfound } from "./components/NotFound";

const queryClient = new QueryClient();
// Set up a Router instance
const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  defaultPreloadStaleTime: 0,
  context: { queryClient },
  defaultPendingComponent: () => (
    <div className="mx-auto mt-8 flex flex-col items-center">
      <Loader2Icon className="animate-spin" />
    </div>
  ),
  defaultNotFoundComponent: Notfound,
});

// Register things for typesafety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById("app")!;

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  );
}
