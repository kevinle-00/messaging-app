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
  senderId: z.string(),
  sender: senderSchema,
});

export const insertMessageSchema = z.object({
  content: z.string().min(1, "Message cannot be empty").max(1000),
});

export type Message = z.infer<typeof messageSchema>;

export type InsertMessage = z.infer<typeof insertMessageSchema>;
