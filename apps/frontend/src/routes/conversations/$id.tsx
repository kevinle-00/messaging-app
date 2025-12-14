import { createFileRoute } from "@tanstack/react-router";
import { MessageInput } from "@/components/MessageInput";
export const Route = createFileRoute("/conversations/$id")({
  component: ConversationPage,
});

function ConversationPage() {
  const { id } = Route.useParams();
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-auto">Conversation ID: {`${id}`}</div>
      <MessageInput></MessageInput>
    </div>
  );
}
