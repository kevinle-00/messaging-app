import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
export function ChatMessage({
  msg,
  isOwnMessage,
}: {
  msg: any;
  isOwnMessage: boolean;
}) {
  const messageDate = new Date(msg.createdAt);
  const today = new Date();
  const isToday = messageDate.toDateString() === today.toDateString();

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
      <div className="max-w-[70%] w-fit">
        <Card className="p-4 shadow-none">
          <CardContent className="p-0">
            <p>{msg.content}</p>
          </CardContent>
        </Card>
        <div className="text-xs text-muted-foreground mt-1">
          {isToday
            ? messageDate.toLocaleTimeString([], {
                hour: "numeric",
                minute: "2-digit",
              })
            : messageDate.toLocaleDateString([], {
                month: "short",
                day: "numeric",
              })}
        </div>
      </div>
    </div>
  );
}
