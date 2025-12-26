
import type { NextFunction, Request, Response } from "express";
import { env } from "../config/env.ts"; // adjust path
import { verifyAccessToken } from "../utils/jwt.ts";

/**
 * Accept either:
 * - `x-api-key: <ML_SECRET>`
 * - `Authorization: Bearer <ML_SECRET>`
 */
export function isAuthenticatedWithApiKey(req: Request, res: Response, next: NextFunction) {
  const apiKey = req.header("x-api-key");
  const auth = req.header("authorization") || req.header("Authorization");

  // Prefer x-api-key if present
  const tokenFromApiKey = apiKey?.trim();

  // Support Bearer token as a fallback
  let tokenFromAuth: string | undefined;
  if (auth) {
    const parts = String(auth).split(" ");
    if (parts.length === 2) {
      tokenFromAuth = parts[1];
    }
  }

  const token = tokenFromApiKey || tokenFromAuth;

  if (!token) {
    return res.status(401).json({ error: "missing authorization" });
  }

  // 1. Check if token matches ML_SECRET
  if (env.ML_SECRET && token === env.ML_SECRET) {
    return next();
  }

  // 2. Fallback: Check if token is a valid JWT with ADMIN role
  try {
    // If auth provided as Bearer, use that. If header 'x-api-key' was used but it's not secret, try using it as JWT (unlikely but possible).
    // Safer to rely on tokenFromAuth for JWT.
    if (tokenFromAuth) {
      const payload = verifyAccessToken(tokenFromAuth);
      if (payload && payload.role === "ADMIN") {
        // Success! Attach user to req if needed, but for now just pass.
        (req as any).user = payload;
        return next();
      }
    }
  } catch (err) {
    // ignore jwt error, proceed to 401
  }

  return res.status(401).json({ error: "invalid api key or unauthorized admin" });
}

