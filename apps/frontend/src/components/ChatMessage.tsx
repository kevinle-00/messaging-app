import { Card, CardContent } from "@/components/ui/card";
export function ChatMessage({
  msg,
  showTimestamp,
}: {
  msg: any;
  showTimestamp: boolean;
}) {
  const messageDate = new Date(msg.createdAt);
  const today = new Date();
  const isToday = messageDate.toDateString() === today.toDateString();

  return (
    <div>
      <Card className="p-4 shadow-none w-fit">
        <CardContent className="p-0">
          <p>{msg.content}</p>
        </CardContent>
      </Card>
      {showTimestamp && (
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
      )}
    </div>
  );
}
