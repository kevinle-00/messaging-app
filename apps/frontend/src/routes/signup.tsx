import { createFileRoute } from "@tanstack/react-router";
import { SignupCard } from "@/components/SignupCard";

export const Route = createFileRoute("/signup")({
  component: SignupPage,
});

function SignupPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold">Welcome to ChatApp</h1>
        <SignupCard></SignupCard>
      </div>
    </div>
  );
}
