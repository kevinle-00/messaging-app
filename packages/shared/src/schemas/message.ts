import { z } from "zod";

const senderSchema = z.object({
  id: z.string(),
  name: z.string(),
  image: z.string().nullable(),
});

export const messageSchema = z.object({
  id: z.string(),
  content: z.string(),
  createdAt: z.coerce.date(),
  sender: senderSchema,
});

export type Message = z.infer<typeof messageSchema>;
