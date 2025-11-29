import express from "express";
import {
  createConversation,
  getConversations,
  getMessagesByConversationId,
} from "../controllers/conversationController.ts";

const router = express.Router();

router.post("/", createConversation);

router.get("/", getConversations);

router.get("/:id/messages", getMessagesByConversationId);

export default router;
