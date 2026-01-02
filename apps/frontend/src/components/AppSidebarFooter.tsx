import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarFooter,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ChevronUp } from "lucide-react";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useState } from "react";
import { LogOut, Loader2 } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { authClient } from "@/lib/authClient";
import type { User } from "@shared/schemas";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface AppSidebarFooterProps {
  user: User | undefined;
}

export function AppSidebarFooter({ user }: AppSidebarFooterProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  if (!user) {
    setIsLoading(true);
    return;
  }

  const handleSignOut = async () => {
    try {
      setIsLoading(true);

      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            navigate({ to: "/" });
          },
        },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign out failed");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <SidebarFooter>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton className="h-auto py-3 px-3 border flex items-center justify-center">
                {isLoading ? (
                  <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
                ) : error ? (
                  <Alert
                    variant="destructive"
                    className="border-none bg-transparent"
                  >
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                ) : (
                  <>
                    <Avatar className="size-10">
                      <AvatarImage src="https://github.com/evilrabbit.png" />
                      <AvatarFallback>
                        {user.name.substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    {user.name}
                    <ChevronUp className="ml-auto" />
                  </>
                )}
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              side="top"
              className="[width:var(--radix-popper-anchor-width)]"
            >
              <DropdownMenuItem>
                <span>Account</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <span>Test Item</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={handleSignOut}
                disabled={isLoading}
                className="text-red-600 focus:text-red-600"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing out...
                  </>
                ) : (
                  <>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </>
                )}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  );
}
