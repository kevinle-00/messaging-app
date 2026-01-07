import express from "express";
import {
  createConversation,
  getConversations,
  getMessagesByConversationId,
  createMessage,
} from "../controllers/conversation.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { validateRequest } from "../middleware/validateRequest.middleware.js";
import { createConversationSchema } from "../schemas/conversation.schema.js";
import { idParamSchema } from "../schemas/common.schema.js";
import { insertMessageSchema } from "@monorepo/shared/schemas/message";

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
