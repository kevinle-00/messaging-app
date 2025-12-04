import { createFileRoute } from "@tanstack/react-router";
import { LoginCard } from "@/components/LoginCard";
export const Route = createFileRoute("/login")({
  component: LoginPage,
});
function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold">Welcome to ChatApp</h1>
        <LoginCard></LoginCard>
      </div>
    </div>
  );
}

