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
import { AppSidebarFooter } from "./AppSidebarFooter";
import { authClient } from "@/lib/authClient";
import type { Conversation } from "@shared/schemas";
import z from "zod";
import { conversationSchema } from "@shared/schemas";
import { Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function AppSidebar() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { data: session, isPending } = authClient.useSession();

  const user = session?.user;

  useEffect(() => {
    if (isPending) return;

    if (!user?.id) {
      setConversations([]);
      setIsLoading(false);
      return;
    }

    const fetchConversations = async () => {
      setIsLoading(true);
      setError("");

      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/conversations`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          },
        );

        if (!res.ok) {
          throw new Error(
            res.status === 401
              ? "Unauthorised"
              : `Failed to fetch conversations (${res.status})`,
          );
        }

        const data = await res.json();
        const validated = z.array(conversationSchema).parse(data);
        setConversations(validated);
      } catch (err) {
        const errorMessage =
          err instanceof z.ZodError
            ? "Invalid data received from server"
            : err instanceof Error
              ? err.message
              : "Failed to fetch conversations";

        setError(errorMessage);
        setConversations([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchConversations();
  }, [user?.id, isPending]);

  return (
    <Sidebar>
      <SidebarHeader className="pl-4 text-xl font-bold">ChatApp</SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Direct Messages</SidebarGroupLabel>
          <SidebarGroupContent>
            {isLoading || isPending ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : error ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : conversations.length === 0 ? (
              <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                No conversations yet
              </div>
            ) : (
              <SidebarMenu>
                {conversations.map((conversation) => (
                  <SidebarMenuItem key={conversation.id}>
                    <ConversationItem conversation={conversation} />
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            )}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <AppSidebarFooter user={user} />
    </Sidebar>
  );
}
