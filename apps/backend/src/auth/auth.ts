import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "../lib/db.js";

export const auth = betterAuth({
  trustedOrigins: (request) => {
    const origins = ["http://localhost:3000", process.env.FRONTEND_URL].filter(
      (o): o is string => Boolean(o),
    );

    const origin = request?.headers.get("origin");
    if (
      origin &&
      /^https:\/\/messaging-app-frontend.*\.vercel\.app$/.test(origin)
    ) {
      origins.push(origin);
    }
    return origins;
  },
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  advanced: {
    useSecureCookies: process.env.NODE_ENV === "production",
  },
  cookie: {
    sameSite: "lax",
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
  },
  emailAndPassword: {
    enabled: true,
  },
});

