import type { Request } from "express";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email?: string;
      };
    }
  }
}

export interface ValidatedRequest<
  Body = any,
  Params = any,
  Query = any,
> extends Request {
  body: Body;
  params: Params;
  query: Query;
}

export {};
