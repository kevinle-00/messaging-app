import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Conversation } from "@shared/schemas";

function ConversationItem({ conversation }: { conversation: Conversation }) {
  return (
    <Item variant="outline" className="py-3 px-3">
      <ItemMedia>
        <Avatar className="size-10">
          <AvatarImage src="https://github.com/evilrabbit.png" />
          <AvatarFallback>
            {conversation.participants[0]?.name.substring(0, 2)}
          </AvatarFallback>
        </Avatar>
      </ItemMedia>
      <ItemContent>
        <ItemTitle>{conversation.participants[0]?.name}</ItemTitle>
        <ItemDescription>
          {conversation.lastMessage?.content &&
          conversation.lastMessage.content.length > 30
            ? conversation.lastMessage.content.substring(0, 30) + "..."
            : conversation.lastMessage?.content}
        </ItemDescription>
      </ItemContent>
    </Item>
  );
}

export { ConversationItem };
