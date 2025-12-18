import type { Request } from "express";
import type { User } from "@shared/types";

declare global {
  namespace Express {
    interface Request {
      user?: User;
      session?: any;
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

export interface AuthedRequest extends Request {
  user: User;
}

export interface AuthedValidatedRequest<
  Body = any,
  Params = any,
  Query = any,
> extends AuthedRequest {
  body: Body;
  params: Params;
  query: Query;
}

export {};
