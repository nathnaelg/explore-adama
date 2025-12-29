import type { NextFunction, Request, Response } from "express";
import { prisma } from "../config/db.ts";
import { verifyAccessToken } from "../utils/jwt.ts";

export interface AuthRequest extends Request {
    user?: any;
}

export const laxAuth = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) {
        return next();
    }

    const token = header.split(" ")[1];

    try {
        const payload = verifyAccessToken(token);

        // Check if user exists and is not banned
        const user = await prisma.user.findUnique({
            where: { id: payload.sub },
            select: { id: true, role: true, email: true, banned: true }
        });

        if (user && !user.banned) {
            req.user = { sub: user.id, role: user.role, email: user.email };
        }
    } catch (error) {
        // If token is invalid, we just proceed as guest
        console.warn("LaxAuth: Invalid token provided");
    }
    next();
};
