import prisma from "../lib/db.ts";

export const createConversation = async (req, res, next) => {
  return console.log("Create conversation");
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
  return console.log("Get messages by conversation id");
};
