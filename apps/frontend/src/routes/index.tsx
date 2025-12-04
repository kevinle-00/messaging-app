import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { MessageInput } from "@/components/MessageInput";
export const Route = createFileRoute("/")({
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
          <MessageInput></MessageInput>
        </div>
      </div>
    </div>
  );
}
