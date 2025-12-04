import express from "express";
import {
  createConversation,
  getConversations,
  getMessagesByConversationId,
} from "../controllers/conversation.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { validateRequest } from "../middleware/validateRequest.middleware";
import { createConversationSchema } from "../schemas/conversation.schema";
import { idParamSchema } from "../schemas/common.schema";
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

export default router;
