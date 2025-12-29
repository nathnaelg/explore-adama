
import { NextFunction, Request, Response } from "express";
import NodeCache from "node-cache";

// Standard TTL 10 seconds, check period 20 seconds
const cache = new NodeCache({ stdTTL: 10, checkperiod: 20 });

export const cacheMiddleware = (duration: number = 10) => {
    return (req: Request, res: Response, next: NextFunction) => {
        // Only cache GET requests
        if (req.method !== 'GET') {
            return next();
        }

        const key = `__express__${req.originalUrl || req.url}`;
        const cachedBody = cache.get(key);

        if (cachedBody) {
            res.set("X-Cache", "HIT");
            res.send(cachedBody);
            return;
        } else {
            res.set("X-Cache", "MISS");
            // Intercept send to cache the body
            const originalSend = res.send;
            res.send = (body) => {
                // Cache the response
                cache.set(key, body, duration);
                // Restore original send and call it
                res.send = originalSend;
                return res.send(body);
            };
            next();
        }
    };
};
