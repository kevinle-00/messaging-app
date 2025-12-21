import express from "express";
import {
  createConversation,
  getConversations,
  getMessagesByConversationId,
  createMessage,
} from "../controllers/conversation.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { validateRequest } from "../middleware/validateRequest.middleware";
import { createConversationSchema } from "../schemas/conversation.schema";
import { idParamSchema } from "../schemas/common.schema";
import { insertMessageSchema } from "@shared/schemas/message";

const router = express.Router();

router.post(
  "/",
  requireAuth,
  validateRequest({ body: createConversationSchema }),
  createConversation,
);

router.get("/", requireAuth, getConversations);

router.get(
  "/:id/messages",
  requireAuth,
  validateRequest({ params: idParamSchema }),
  getMessagesByConversationId,
);

router.post(
  "/:id/messages",
  requireAuth,
  validateRequest({ body: insertMessageSchema, params: idParamSchema }),
  createMessage,
);

export default router;
