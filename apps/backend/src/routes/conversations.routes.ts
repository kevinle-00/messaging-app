import express from "express";
import {
  createConversation,
  getConversations,
  getMessagesByConversationId,
} from "../controllers/conversation.controller.ts";
import { requireAuth } from "../middleware/auth.middleware.ts";
import { validateRequest } from "../middleware/validateRequest.middleware.ts";
import { createConversationSchema } from "../schemas/conversation.schema.ts";
import { idParamSchema } from "../schemas/common.schema.ts";
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
  validateRequest({ params: IdParamSchema }),
  getMessagesByConversationId,
);

export default router;

