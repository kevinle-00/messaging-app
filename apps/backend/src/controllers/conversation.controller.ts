import prisma from "../lib/db.js";
import z from "zod";
import {
  createConversationSchema,
  type CreateConversationInput,
} from "../schemas/conversation.schema";
import { idParamSchema, type IdParams } from "../schemas/common.schema.js";
import { conversationSchema } from "@monorepo/shared/schemas";
import type { Conversation } from "@monorepo/shared/schemas";
//import type { Conversation } from "@shared/schemas";
import type { Message } from "@monorepo/shared/schemas";
import type { RequestHandler } from "express";
import { messageSchema } from "@monorepo/shared/schemas";
import { insertMessageSchema } from "@monorepo/shared/schemas/message";
import type { InsertMessage } from "@monorepo/shared/schemas/message";
import { AppError } from "../lib/AppError.js";
import { getIO } from "../lib/socket-server.js";

const mapPrismaToConversation = (
  prismaConv: any,
  currentUserId: string,
): Conversation => {
  return {
    id: prismaConv.id,
    participants: prismaConv.participants
      .filter((p: any) => p.userId !== currentUserId)
      .map((p: any) => ({
        userId: p.user.id,
        name: p.user.name,
        image: p.user.image,
      })),
    lastMessage: prismaConv.messages?.[0]
      ? {
          id: prismaConv.messages[0].id,
          content: prismaConv.messages[0].content,
          senderId: prismaConv.messages[0].senderId,
          createdAt: prismaConv.messages[0].createdAt,
        }
      : null,
  };
};

export const createConversation: RequestHandler<
  any,
  Conversation,
  CreateConversationInput
> = async (req, res, next) => {
  try {
    const userId = req.user!.id;
    const { participantIds } = req.body;

    // Ensure current user is always included
    const allParticipantIds = [...new Set([userId, ...participantIds])];

    const conversation = await prisma.conversation.create({
      data: {
        participants: {
          createMany: {
            data: allParticipantIds.map((id) => ({ userId: id })),
          },
        },
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        },
        messages: {
          take: 1,
          orderBy: { createdAt: "desc" },
        },
      },
    });

    const validated = conversationSchema.parse(
      mapPrismaToConversation(conversation, userId),
    );

    res.status(201).json(validated);
  } catch (error) {
    next(error);
  }
};

export const getConversations: RequestHandler<any, Conversation[]> = async (
  req,
  res,
  next,
) => {
  try {
    const userId = req.user!.id;

    const conversations = await prisma.conversation.findMany({
      where: {
        participants: {
          some: {
            userId: userId,
          },
        },
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        },
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });

    const transformed = conversations.map((conv) =>
      mapPrismaToConversation(conv, userId),
    );

    const validated = z.array(conversationSchema).parse(transformed);

    return res.json(validated);
  } catch (error) {
    next(error);
  }
};

export const getMessagesByConversationId: RequestHandler<
  IdParams,
  Message[]
> = async (req, res, next) => {
  try {
    const conversationId = req.params.id;

    const messages = await prisma.message.findMany({
      where: { conversationId },
      select: {
        id: true,
        content: true,
        createdAt: true,
        senderId: true,
        sender: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    const validated = z.array(messageSchema).parse(messages);

    res.json(validated);
  } catch (error) {
    next(error);
  }
};

export const createMessage: RequestHandler<
  { id: string },
  Message,
  InsertMessage
> = async (req, res, next) => {
  try {
    const { content } = req.body;
    const { id: conversationId } = req.params;
    const { id: userId } = req.user;

    const conversation = await prisma.conversation.findFirst({
      where: {
        id: conversationId,
        participants: { some: { userId: userId } },
      },
    });

    if (!conversation) {
      throw new AppError("Not authorised", 403);
    }

    const newMessage = await prisma.$transaction(async (tx) => {
      const message = await tx.message.create({
        data: {
          content,
          conversationId,
          senderId: userId,
        },
        include: {
          sender: {
            select: { id: true, name: true, image: true },
          },
        },
      });

      await tx.conversation.update({
        where: { id: conversationId },
        data: { lastMessageAt: new Date() },
      });

      return message;
    });

    const validated = messageSchema.parse(newMessage);

    res.status(201).json(validated);
    const io = getIO();
    io.to(conversationId).emit("new_message", validated);
    console.log("message emitted");
  } catch (err) {
    next(err);
  }
};
