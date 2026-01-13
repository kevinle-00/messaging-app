import express from "express";
import { getUsers } from "src/controllers/user.controller";
import { requireAuth } from "src/middleware/auth.middleware";
import { validateRequest } from "src/middleware/validateRequest.middleware";

const router = express.Router();

router.get("/", requireAuth, getUsers);

export default router;
