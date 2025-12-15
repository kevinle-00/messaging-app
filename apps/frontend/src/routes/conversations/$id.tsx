import { createFileRoute } from "@tanstack/react-router";
import { MessageInput } from "@/components/MessageInput";
export const Route = createFileRoute("/conversations/$id")({
  component: ConversationPage,
});
import { useState, useEffect } from "react";

interface Message {
  id: string;
  content: string;
  senderId: string;
  createdAt: string;
}

function ConversationPage() {
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
      <div className="flex-1 overflow-auto">
        Conversation ID: {`${id}`}
        {messages.map((msg) => (
          <div key={msg.id}>
            <p>Message Content: {msg.content}</p>
            <p>Sender ID: {msg.senderId}</p>
            <p>Created At: {msg.createdAt.toLocaleString()}</p>
          </div>
        ))}
      </div>
      <MessageInput></MessageInput>
    </div>
  );
}
