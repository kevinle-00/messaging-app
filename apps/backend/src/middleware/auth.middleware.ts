import { auth } from "../auth/auth.js";
import { fromNodeHeaders } from "better-auth/node";
import type { Request, Response, NextFunction } from "express";
export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });

  console.log("Request origin:", req.headers.origin);
  console.log("Session user:", session?.user?.id);

  if (!session) {
    return res.status(401).json({ error: "Unauthenticated" });
  }

  req.user = session.user;
  req.session = session.session;

  next();
};
