import type { Request, Response, NextFunction } from "express";

export interface AuthenticatedRequest extends Request {
  userId?: string;
  username?: string;
}

export function requireAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  if (req.session && (req.session as any).userId) {
    req.userId = (req.session as any).userId;
    req.username = (req.session as any).username;
    next();
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
}

