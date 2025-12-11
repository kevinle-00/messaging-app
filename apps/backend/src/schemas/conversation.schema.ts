import { z } from "zod";

export const createConversationSchema = z.object({
  participantIds: z
    .array(z.cuid())
    .min(2, "Conversation must have at least 2 participants")
    .refine((ids) => new Set(ids).size === ids.length, {
      message: "Duplicate IDs are not allowed",
    }),
});

export type CreateConversationInput = z.infer<typeof createConversationSchema>;
