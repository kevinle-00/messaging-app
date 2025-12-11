import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { ConversationItem } from "./ConversationItem";
import { useEffect, useState } from "react";
import type { Conversation } from "../../../../packages/shared/src/schemas/conversation";
import { AppSidebarFooter } from "./AppSidebarFooter";
import { authClient } from "@/lib/authClient";

export function AppSidebar() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [error, setError] = useState("");
  const { data: session } = authClient.useSession();

  const user = session?.user;

  //TODO: Implement sign out functionality

  if (!user) {
    return null;
  }

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/conversations`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          },
        );

        if (!res.ok) throw new Error("Failed to fetch");

        const data = await res.json();
        console.log(data);
        setConversations(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch conversations",
        );
      }
    };
    fetchConversations();
  }, []);
  return (
    <Sidebar>
      <SidebarHeader className="pl-4 text-xl font-bold">ChatApp</SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Direct Messages</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {conversations.map((conversation) => (
                <SidebarMenuItem key={conversation.id}>
                  <ConversationItem
                    conversation={conversation}
                  ></ConversationItem>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <AppSidebarFooter user={user}></AppSidebarFooter>
    </Sidebar>
  );
}
