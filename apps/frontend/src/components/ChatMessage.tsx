import { Card, CardContent } from "@/components/ui/card";

export function ChatMessage({
  msg,
  isOwnMessage,
}: {
  msg: any;
  isOwnMessage: boolean;
}) {
  return (
    <div className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}>
      <Card className="max-w-[70%] w-fit">
        <CardContent>
          <p>{msg.sender.name}</p>
          <p>{msg.content}</p>
          <p>Created At: {msg.createdAt.toLocaleString()}</p>
        </CardContent>
      </Card>
    </div>
  );
}
