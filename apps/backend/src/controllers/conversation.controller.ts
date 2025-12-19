import prisma from "../lib/db";
import z from "zod";
import {
  createConversationSchema,
  type CreateConversationInput,
} from "../schemas/conversation.schema";
import { idParamSchema, type IdParams } from "../schemas/common.schema";
import { conversationSchema } from "@shared/schemas";
import type { Conversation } from "@shared/schemas";
//import type { Conversation } from "@shared/schemas";
import type { Message } from "@shared/schemas";
import type { RequestHandler } from "express";
import { messageSchema } from "@shared/schemas";

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
