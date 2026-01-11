//import * as React from "react";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { authClient } from "@/lib/authClient";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  const { data: session, isPending } = authClient.useSession();
  console.log("Session:", session);
  console.log("isPending:", isPending);
  const isAuthenticated = !!session?.user;

  if (isPending) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }
  if (!isAuthenticated) {
    return (
      <main className="flex h-screen items-center justify-center">
        <Outlet />
      </main>
    );
  }

  return (
    <SidebarProvider className="flex h-screen">
      <AppSidebar />
      <main className="flex-1 flex flex-col overflow-hidden">
        <SidebarTrigger />
        <div className="flex-1 overflow-hidden">
          <Outlet />
        </div>
      </main>
    </SidebarProvider>
  );
}
