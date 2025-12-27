import type { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../utils/jwt.ts";

export interface AuthRequest extends Request {
    user?: any;
}

export const laxAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) {
        return next();
    }

    const token = header.split(" ")[1];

    try {
        const payload = verifyAccessToken(token);
        req.user = { sub: payload.sub, role: payload.role, email: payload.email };
    } catch (error) {
        // If token is invalid, we just proceed as guest
        console.warn("LaxAuth: Invalid token provided");
    }
    next();
};
