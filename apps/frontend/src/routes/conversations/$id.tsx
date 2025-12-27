import { createFileRoute } from "@tanstack/react-router";
import { MessageInput } from "@/components/MessageInput";
export const Route = createFileRoute("/conversations/$id")({
  component: ConversationPage,
});
import { useState, useEffect } from "react";
import type { Message } from "@shared/schemas";
import { messageSchema } from "@shared/schemas";
import { z } from "zod";
import { authClient } from "@/lib/authClient";
import { ChatGroup } from "@/components/ChatGroup";
import socket from "@/lib/socket";

function ConversationPage() {
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const { id } = Route.useParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [typingUsers, setTypingUsers] = useState<string[]>([]);

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

      if (msg.sender.id === prevMsg!.sender.id && timeDiff < threshold) {
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
        const messages = z.array(messageSchema).parse(data);
        setMessages(messages);
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

  useEffect(() => {
    if (!user) return;

    socket.connect();
    socket.emit("user_join", {
      userId: user.id,
      username: user.name,
    });

    socket.emit("join_conversation", id);

    socket.on("new_message", (data) => {
      setMessages((prev) => [...prev, data.message]);
    });

    socket.on("user_typing", (data) => {
      setTypingUsers((prev) => [...prev, data.username]);
    });

    socket.on("user_stopped_typing", (data) => {
      setTypingUsers((prev) => prev.filter((user) => user !== data.username));
    });

    return () => {
      socket.emit("leave_conversation", id);
      socket.off("new_message");
      socket.off("user_typing");
      socket.off("user_stopped_typing");
    };
  }, [id, user]);

  const sendMessage = () => {
    if (!inputValue.trim() || !user) return;

    socket.emit("send_message", {
      conversationId: id,
      message: {
        id: Date.now(),
        content: inputValue,
        senderId: user.id,
        sender: {
          id: user.id,
          name: user.name,
          image: user.name,
        },
        createdAt: new Date().toISOString(),
      },
    });

    setInputValue("");
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-auto p-4">
        {groupMessages(messages).map((group) => (
          <ChatGroup
            key={group[0]?.id}
            messages={group}
            isOwnMessage={group[0]?.sender.id === user?.id}
          />
        ))}
      </div>
      <MessageInput
        value={inputValue}
        onChange={setInputValue}
        sendMessage={sendMessage}
      ></MessageInput>
    </div>
  );
}
