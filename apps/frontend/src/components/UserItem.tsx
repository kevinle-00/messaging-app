import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Button } from "@/components/ui/button";

function UserItem() {
  return (
    <Item variant="outline">
      <ItemMedia>
        <Avatar className="size-10">
          <AvatarImage src="https://github.com/evilrabbit.png" />
          <AvatarFallback>TU</AvatarFallback>
        </Avatar>
      </ItemMedia>
      <ItemContent>
        <ItemTitle>Test User</ItemTitle>
        <ItemDescription>Last seen 46 minutes ago</ItemDescription>
      </ItemContent>
      <ItemActions>
        <Button>Message</Button>
      </ItemActions>
    </Item>
  );
}

export { UserItem };
