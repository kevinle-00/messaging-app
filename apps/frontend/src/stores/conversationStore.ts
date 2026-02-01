import { create } from "zustand";
import type { Conversation, Message } from "@shared/schemas";

type ConversationStore = {
  conversations: Conversation[];
  setConversations: (convos: Conversation[]) => void;
  addConversation: (convo: Conversation) => void;
  updateLastMessage: (conversationId: string, message: Message) => void;
};

export const useConversationStore = create<ConversationStore>((set) => ({
  conversations: [],
  setConversations: (conversations) => set({ conversations }),
  addConversation: (convo) =>
    set((state) => ({ conversations: [convo, ...state.conversations] })),
  updateLastMessage: (conversationId, message) =>
    set((state) => ({
      conversations: state.conversations.map((c) =>
        c.id === conversationId ? { ...c, lastMessage: message } : c,
      ),
    })),
}));
