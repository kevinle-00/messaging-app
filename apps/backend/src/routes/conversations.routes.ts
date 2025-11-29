import express from "express";
import {
  createConversation,
  getConversations,
  getMessagesByConversationId,
} from "../controllers/conversation.controller.ts";
import { requireAuth } from "../middleware/auth.middleware.ts";
const router = express.Router();

router.post("/", requireAuth, createConversation);

router.get("/", requireAuth, getConversations);

router.get("/:id/messages", requireAuth, getMessagesByConversationId);

export default router;

