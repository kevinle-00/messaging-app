import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Conversation } from "@shared/schemas";
import { Link } from "@tanstack/react-router";

function ConversationItem({ conversation }: { conversation: Conversation }) {
  const participant = conversation.participants[0];
  const lastMsg = conversation.lastMessage;

  return (
    <Link
      to="/conversations/$id"
      params={{ id: conversation.id }}
      activeOptions={{ exact: false }}
    >
      {({ isActive }) => (
        <Item
          variant="outline"
          className={`py-3 px-3 transition-colors ${
            isActive
              ? "bg-sidebar-accent-active text-sidebar-accent-foreground border-sidebar-accent-active-border"
              : "hover:bg-sidebar-accent/50"
          }`}
        >
          <ItemMedia>
            <Avatar className="size-10">
              <AvatarImage src="https://github.com/evilrabbit.png" />
              <AvatarFallback>
                {participant?.name?.slice(0, 2).toUpperCase() || "??"}
              </AvatarFallback>
            </Avatar>
          </ItemMedia>
          <ItemContent>
            <ItemTitle className="font-semibold text-sm">
              {participant?.name || "Unknown User"}
            </ItemTitle>
            <ItemDescription className="truncate text-xs">
              {lastMsg?.content
                ? lastMsg.content.length > 30
                  ? lastMsg.content.substring(0, 30) + "..."
                  : lastMsg.content
                : "No messages yet"}
            </ItemDescription>
          </ItemContent>
        </Item>
      )}
    </Link>
  );
}
export { ConversationItem };
