import prisma from "../lib/db.js";
import z from "zod";
import { userSchema } from "@monorepo/shared/schemas";
import type { User } from "@monorepo/shared/schemas";
import type { RequestHandler } from "express";

export const getUsers: RequestHandler<unknown, User[]> = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, excludeExisting } = req.query;
    const userId = req.user!.id;

    const users = await prisma.user.findMany({
      where: {
        id: { not: userId },
        ...(excludeExisting === "true" && {
          NOT: {
            conversations: {
              some: {
                conversation: {
                  participants: { some: { userId } },
                },
              },
            },
          },
        }),
      },
      select: {
        id: true,
        name: true,
        image: true,
      },
      orderBy: {
        name: "asc",
      },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
    });

    const validated = z.array(userSchema).parse(users);
    return res.json(validated);
  } catch (error) {
    next(error);
  }
};