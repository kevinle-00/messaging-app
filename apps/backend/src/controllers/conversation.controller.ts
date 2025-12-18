import prisma from "../lib/db";
import type { Request, Response, NextFunction } from "express";
import type { ValidatedRequest } from "../types/express";

import {
  createConversationSchema,
  type CreateConversationInput,
} from "../schemas/conversation.schema";
import { idParamSchema, type IdParams } from "../schemas/common.schema";
import { conversationSchema } from "@shared/schemas";
//import type { Conversation } from "@shared/schemas";
import type { Message } from "@shared/schemas";
import type { RequestHandler } from "express";
export const createConversation: RequestHandler<
  any,
  any,
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
            data: allParticipantIds.map((id) => ({
              userId: id,
            })),
          },
        },
      },
      include: {
        participants: true,
      },
    });

    res.status(201).json(conversation);
  } catch (error) {
    next(error);
  }
};

export const getConversations: RequestHandler = async (req, res, next) => {
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

    const transformed = conversations.map((conv) => ({
      id: conv.id,
      participants: conv.participants
        .filter((p) => p.userId !== userId)
        .map((p) => ({
          userId: p.user.id,
          name: p.user.name,
          image: p.user.image,
        })),
      lastMessage: conv.messages[0]
        ? {
            id: conv.messages[0].id,
            content: conv.messages[0].content,
            senderId: conv.messages[0].senderId,
            createdAt: conv.messages[0].createdAt,
          }
        : null,
    }));

    const validated = transformed.map((c) => conversationSchema.parse(c));
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

    res.json(messages);
  } catch (error) {
    next(error);
  }
};

