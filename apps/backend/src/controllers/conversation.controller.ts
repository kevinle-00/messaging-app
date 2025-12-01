import prisma from "../lib/db.ts";

export const createConversation = async (req, res, next) => {
  try {
    const userId = req.user.id;
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

export const getConversations = async (req, res, next) => {
  try {
    const userId = req.user.id;

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

export const getMessagesByConversationId = async (req, res, next) => {
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

