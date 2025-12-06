import { createFileRoute } from "@tanstack/react-router";
import { MessageInput } from "@/components/MessageInput";
export const Route = createFileRoute("/conversations/")({
  component: ConversationsPage,
});

//import { UserItem } from "@/components/UserItem";
function ConversationsPage() {
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-auto"></div>
      <MessageInput></MessageInput>
    </div>
  );
}
