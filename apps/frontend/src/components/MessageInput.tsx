import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

interface MessageInputProps {
  value: string;
  onChange: (value: string) => void;
  sendMessage: () => void;
}

function MessageInput({ value, onChange, sendMessage }: MessageInputProps) {
  return (
    <div className="flex items-end gap-2 p-4 border-t">
      <Textarea
        placeholder="Type a message..."
        className="min-h-[60px] max-h-[200px] resize-none"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
            // Send message
          }
        }}
      />
      <Button size="icon" onClick={sendMessage}>
        <Send className="h-4 w-4" />
      </Button>
    </div>
  );
}

export { MessageInput };
