import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
export function ChatMessage({
  msg,
  isOwnMessage,
}: {
  msg: any;
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

      <Card className="max-w-[70%] w-fit p-4 shadow-none">
        <CardContent className="p-0">
          <p>{msg.content}</p>
        </CardContent>
      </Card>
    </div>
  );
}
