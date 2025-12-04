import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/conversations/$id")({
  component: ConversationPage,
});

function ConversationPage() {
  return <div>Hello "/conversations/$id"!</div>;
}
