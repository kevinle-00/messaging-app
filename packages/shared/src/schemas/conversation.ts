import { z } from "zod";

export const conversationSchema = z.object({
  id: z.cuid(),
  participants: z.array(
    z.object({
      userId: z.string(),
      name: z.string(),
      image: z.string().nullable(),
    }),
  ),
  lastMessage: z
    .object({
      id: z.cuid(),
      content: z.string(),
      senderId: z.string(),
      createdAt: z.coerce.date(),
    })
    .nullable(),
});

export type Conversation = z.infer<typeof conversationSchema>;

