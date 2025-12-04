import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

function MessageInput() {
  return (
    <div className="flex items-end gap-2 p-4 border-t">
      <Textarea
        placeholder="Type a message..."
        className="min-h-[60px] max-h-[200px] resize-none"
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            // Send message
          }
        }}
      />
      <Button size="icon">
        <Send className="h-4 w-4" />
      </Button>
    </div>
  );
}

export { MessageInput };
