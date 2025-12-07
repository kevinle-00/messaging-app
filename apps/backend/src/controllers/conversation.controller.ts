import prisma from "../lib/db";
import type { Request, Response, NextFunction } from "express";
import type { ValidatedRequest } from "../types/express";
import { z } from "zod";
import { createConversationSchema } from "../schemas/conversation.schema";
import { idParamSchema } from "../schemas/common.schema";

export const createConversation = async (
  req: ValidatedRequest<z.infer<typeof createConversationSchema>>,
  res: Response,
  next: NextFunction,
) => {
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

export const getConversations = async (
  req: Request,
  res: Response,
  next: NextFunction,
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
        participants: true,
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });

    return res.json(conversations);
  } catch (error) {
    next(error);
  }
};

export const getMessagesByConversationId = async (
  req: ValidatedRequest<any, z.infer<typeof idParamSchema>>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const conversationId = req.params.id;

    const messages = await prisma.message.findMany({
      where: { conversationId },
      include: { sender: true },
      orderBy: { createdAt: "asc" },
    });

    res.json(messages);
  } catch (error) {
    next(error);
  }
};
