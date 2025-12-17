import { createFileRoute } from "@tanstack/react-router";
import { MessageInput } from "@/components/MessageInput";
export const Route = createFileRoute("/conversations/$id")({
  component: ConversationPage,
});
import { useState, useEffect } from "react";

interface Message {
  id: string;
  conversationId: string;
  content: string;
  senderId: string;
  createdAt: string;
  sender: {
    id: string;
    name: string;
  };
  //TODO: Map the message type more accurately to the message objects returned by backend, for example, the message objects include a sender object with sender username etc.
}

import { ChatMessage } from "@/components/ChatMessage";
import { authClient } from "@/lib/authClient";

function ConversationPage() {
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const { id } = Route.useParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const getMessages = async () => {
      setIsLoading(true);
      setError("");

      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/conversations/${id}/messages`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          },
        );

        if (!res.ok) throw new Error("Failed to fetch");

        const data = await res.json();
        setMessages(data);
        console.log(data);
        console.log(messages);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch messages",
        );
        setMessages([]);
      } finally {
        setIsLoading(false);
      }
    };

    getMessages();
  }, [id]);
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-auto p-4">
        {messages.map((msg) => (
          <div key={msg.id}>
            <ChatMessage msg={msg} isOwnMessage={msg.senderId === user?.id} />
          </div>
        ))}
      </div>
      <MessageInput></MessageInput>
    </div>
  );
}
