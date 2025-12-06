import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

function UserItem() {
  return (
    <Item variant="outline" className="py-3 px-3">
      <ItemMedia>
        <Avatar className="size-10">
          <AvatarImage src="https://github.com/evilrabbit.png" />
          <AvatarFallback>TU</AvatarFallback>
        </Avatar>
      </ItemMedia>
      <ItemContent>
        <ItemTitle>Test User</ItemTitle>
        <ItemDescription>Yea...</ItemDescription>
      </ItemContent>
    </Item>
  );
}

export { UserItem };
