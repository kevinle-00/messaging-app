import { auth } from "../auth/auth";
import { fromNodeHeaders } from "better-auth/node";

export const requireAuth = async (req, res, next) => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });

  if (!session) {
    return res.status(401).json({ error: "Unauthenticated" });
  }

  req.user = session.user;
  req.session = session.session;

  next();
};
