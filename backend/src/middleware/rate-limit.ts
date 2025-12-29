
import rateLimit from "express-rate-limit";

export const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 50000, // Increased for development with high polling
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        status: 429,
        message: "Too many requests, please try again later.",
    },
});

// Stricter limiter for specific actions if needed
export const strictLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 5000,
    message: {
        status: 429,
        message: "Too many requests, please slow down.",
    },
});
