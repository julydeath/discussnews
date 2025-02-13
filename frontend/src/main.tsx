import React from "react";
import { createRouter, Link, RouterProvider } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { Loader2Icon } from "lucide-react";
import ReactDOM from "react-dom/client";

import { routeTree } from "./routeTree.gen";

import "./globals.css";

import { Notfound } from "./components/NotFound";
import { Button } from "./components/ui/button";

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
  defaultErrorComponent: ({ error }) => (
    <div className="flex flex-col justify-center items-center text-center p-20">
      <header className="p-8 text-2xl">
        <p>Oops Something went wrong</p>
      </header>
      <div></div>
      <footer className="flex gap-2">
        <Button
          onClick={() => {
            router.invalidate();
          }}
          variant={"outline"}
        >
          Try again
        </Button>
        <Button>
          <Link to="/">Go to home</Link>
        </Button>
      </footer>
    </div>
  ),
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
