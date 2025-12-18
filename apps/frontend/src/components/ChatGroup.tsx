import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ChatMessage } from "./ChatMessage";
export function ChatGroup({
  messages,
  isOwnMessage,
}: {
  messages: any;
  isOwnMessage: boolean;
}) {
  return (
    <div
      className={`flex gap-3 ${isOwnMessage ? "justify-end" : "justify-start"}`}
    >
      {!isOwnMessage && (
        <Avatar className="size-10">
          <AvatarImage src="https://github.com/evilrabbit.png" />
          <AvatarFallback>TU</AvatarFallback>
        </Avatar>
      )}
      <div
        className={`flex max-w-[70%] flex-col gap-1 ${isOwnMessage ? "items-end" : "items-start"}`}
      >
        {messages.map((msg, idx: number) => (
          <ChatMessage
            key={msg.id}
            msg={msg}
            showTimestamp={idx === messages.length - 1}
          />
        ))}
      </div>
    </div>
  );
}
