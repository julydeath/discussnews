import * as React from "react";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

import { Toaster } from "sonner";

import { Footer } from "@/components/Footer/Footer";
import { Navbar } from "@/components/Navbar/Navnar";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <>
      <div className="flex flex-col min-h-screen">
        <main className="container mx-auto grow">
          <Navbar />
          <Outlet />
        </main>
        <footer>
          <Footer />
        </footer>
      </div>
      <Toaster />
      <ReactQueryDevtools />
      <TanStackRouterDevtools position="bottom-left" />
    </>
  );
}
