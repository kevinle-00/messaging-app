import { Button } from "@/components/ui/button";

import { createFileRoute, redirect } from "@tanstack/react-router";
import { authClient } from "@/lib/authClient";

export const Route = createFileRoute("/")({
  beforeLoad: async () => {
    const { data: session } = await authClient.getSession();
    if (session?.user) {
      throw redirect({ to: "/conversations" });
    }
  },
  component: HomePage,
});

function HomePage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold">Welcome to ChatApp</h1>
        <div className="space-x-4">
          <Button asChild>
            <a href="/login">Login</a>
          </Button>
          <Button variant="outline" asChild>
            <a href="/signup">Sign Up</a>
          </Button>
        </div>
      </div>
    </div>
  );
}
