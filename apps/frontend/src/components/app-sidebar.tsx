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
import z from "zod";
import { conversationSchema } from "@shared/schemas";
import { Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import type { User } from "@shared/schemas";
import { userSchema } from "@shared/schemas";
import { useNavigate } from "@tanstack/react-router";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useConversationStore } from "@/stores/conversationStore";
import socket from "@/lib/socket";

export function AppSidebar() {
  const conversations = useConversationStore((s) => s.conversations);
  const setConversations = useConversationStore((s) => s.setConversations);
  const addConversation = useConversationStore((s) => s.addConversation);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [newUsers, setNewUsers] = useState<User[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const { data: session, isPending } = authClient.useSession();
  const navigate = useNavigate();

  const user = session?.user;

  useEffect(() => {
    if (!user) return;

    socket.connect();
    socket.emit("user_join", {
      userId: user.id,
      username: user.name,
    });

    return () => {
      socket.disconnect();
    };
  }, [user]);

  const fetchNewUsers = async () => {
    setIsLoadingUsers(true);

    try {
      const res = await fetch(`/api/users?excludeExisting=true`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!res.ok) throw new Error("failed to fetch");

      const data = await res.json();
      const users = z.array(userSchema).parse(data);
      setNewUsers(users);
    } catch (err) {
      setNewUsers([]);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const handleDialogOpen = (open: boolean) => {
    setDialogOpen(open);
    if (open) fetchNewUsers();
  };

  const createConversation = async (selectedUser: User) => {
    try {
      if (!user?.id) return;

      const res = await fetch("/api/conversations", {
        method: "POST",
        body: JSON.stringify({
          participantIds: [user.id, selectedUser.id],
        }),
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (!res.ok) throw new Error("failed to fetch");

      const data = await res.json();
      const validated = conversationSchema.parse(data);
      addConversation(validated);
      return validated;
    } catch (err) {
      console.error("Failed to create conversation:", err);
    }
  };

  const handleSelectUser = async (selectedUser: User) => {
    const newConversation = await createConversation(selectedUser);
    if (newConversation) {
      setDialogOpen(false);
      navigate({ to: `/conversations/${newConversation.id}` });
    }
  };

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
        const res = await fetch(`/api/conversations`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

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
  }, [user?.id, isPending, setConversations]);

  useEffect(() => {
    socket.on("new_conversation", (conversation) => {
      const validated = conversationSchema.parse(conversation);
      addConversation(validated);
    });

    return () => {
      socket.off("new_conversation");
    };
  }, [addConversation]);

  return (
    <Sidebar>
      <SidebarHeader className="pl-4">
        <span className="text-xl font-bold">ChatApp</span>
        <Dialog open={dialogOpen} onOpenChange={handleDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">
              <Plus className="h-5 w-5" />
              New Conversation
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>New Conversation</DialogTitle>
              <DialogDescription>
                Find a user to have a conversation with.
              </DialogDescription>
              <ScrollArea className="h-72 w-full rounded-md border">
                <div className="p-4">
                  <h4 className="mb-4 text-sm leading-none font-medium">
                    Users
                  </h4>
                  {isLoadingUsers ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                  ) : newUsers.length === 0 ? (
                    <div className="py-4 text-center text-sm text-muted-foreground">
                      No users available
                    </div>
                  ) : (
                    newUsers.map((newUser) => (
                      <div key={newUser.id}>
                        <button
                          onClick={() => handleSelectUser(newUser)}
                          className="w-full text-left p-2 rounded hover:bg-accent text-sm"
                        >
                          {newUser.name}
                        </button>
                        <Separator className="my-2" />
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </SidebarHeader>
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