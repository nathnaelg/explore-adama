import type { NextFunction, Request, Response } from "express";
import { prisma } from "../config/db.ts";
import { verifyAccessToken } from "../utils/jwt.ts";

export interface AuthRequest extends Request {
  user?: any;
}

export const auth = async (req: AuthRequest, res: Response, next: NextFunction) => {

  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = header.split(" ")[1];

  try {
    const payload = verifyAccessToken(token)

    // Check if user still exists and is not banned
    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, role: true, email: true, banned: true }
    });

    if (!user || user.banned) {
      return res.status(401).json({ message: "User not found or banned" });
    }

    req.user = { sub: user.id, role: user.role, email: user.email }
    next()
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired access token" })
  }
}