import { createFileRoute } from "@tanstack/react-router";
import { MessageInput } from "@/components/MessageInput";
export const Route = createFileRoute("/conversations/")({
  component: ConversationsPage,
});

import { UserItem } from "@/components/UserItem";

function ConversationsPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center space-y-6">
        <UserItem></UserItem>
        <UserItem></UserItem>
        <UserItem></UserItem>
        <MessageInput></MessageInput>
      </div>
    </div>
  );
}
