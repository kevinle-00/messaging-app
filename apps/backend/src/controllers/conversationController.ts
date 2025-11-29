import prisma from "../lib/db.ts";

export const createConversation = async (req, res, next) => {
  return console.log("Create conversation");
};

export const getMessagesByConversationId = async (req, res, next) => {
  return console.log("Get messages by conversation id");
};

export const getConversations = async (req, res, next) => {
  return console.log("Get conversations");
};
