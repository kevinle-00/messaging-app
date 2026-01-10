import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "../lib/db.js";

export const auth = betterAuth({
  baseURL:
    process.env.BETTER_AUTH_URL || `http://localhost:${process.env.PORT}`,
  trustedOrigins: ["http://localhost:3000", process.env.FRONTEND_URL].filter(
    (origin): origin is string => Boolean(origin),
  ),
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  advanced: {
    useSecureCookies: process.env.NODE_ENV === "production",
  },
  cookie: {
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
  },
  emailAndPassword: {
    enabled: true,
  },
});
