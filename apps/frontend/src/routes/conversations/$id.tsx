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
  //TODO: Migrate to using zod schemas as types (via z.infer)
}

import { authClient } from "@/lib/authClient";
import { ChatGroup } from "@/components/ChatGroup";
function ConversationPage() {
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const { id } = Route.useParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const groupMessages = (messages: Message[]) => {
    const groups: Message[][] = [];
    let currentGroup: Message[] = [];

    messages.forEach((msg, idx) => {
      if (idx === 0) {
        currentGroup.push(msg);
        return;
      }

      const prevMsg = messages[idx - 1];
      const timeDiff =
        new Date(msg.createdAt).getTime() -
        new Date(prevMsg!.createdAt).getTime();
      const threshold = 5 * 60 * 1000;

      if (msg.senderId === prevMsg!.senderId && timeDiff < threshold) {
        currentGroup.push(msg);
      } else {
        groups.push(currentGroup);
        currentGroup = [msg];
      }
    });

    if (currentGroup.length > 0) groups.push(currentGroup);
    return groups;
  };

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
        {groupMessages(messages).map((group) => (
          <ChatGroup
            key={group[0]?.id}
            messages={group}
            isOwnMessage={group[0]?.senderId === user?.id}
          />
        ))}
      </div>
      <MessageInput></MessageInput>
    </div>
  );
}
