// /home/natye/ai-tourism-backend/backend/src/config/cors.ts
import type { CorsOptions } from "cors";
import { env } from "./env.ts";

export const corsOptions: CorsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, postman)
    if (env.NODE_ENV !== "production") {
      return callback(null, true);
    }


    const allowedOrigins = [
      // Mobile app origins
      env.FRONTEND_URL,
      'exp://192.168.8.129:8081',
      
      // Development origins
      'http://localhost:8081',
      'http://localhost:3000',
      
      // Expo specific
      /\.exp\.direct$/,  // Expo tunnel
      /\.exp\.goog$/,    // Expo Go
      
      // Your specific network
      /^http:\/\/192\.168\.8\.\d{1,3}(:\d+)?$/,
      
      // Add your production domain when deployed
      // 'https://yourdomain.com',
      // 'https://app.yourdomain.com',
    ];

    const isAllowed = allowedOrigins.some((rule) =>
      typeof rule === "string"
        ? rule === origin
        : rule.test(origin)
    );

    if (isAllowed) {
      callback(null, true);
    } else {
      console.warn(`CORS blocked: ${origin}`);
      callback(new Error("Not allowed by CORS"), false);
    }
  },

  credentials: true,

  methods: [
    "GET",
    "POST",
    "PUT",
    "PATCH",
    "DELETE",
    "OPTIONS",
    "HEAD",
  ],

  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "Accept",
    "Origin",
    "X-Requested-With",
    "X-Device-Platform",
    "X-Device-Version",
    "X-App-Version",
    "X-API-Key",
  ],

  exposedHeaders: [
    "Authorization",
    "X-RateLimit-Limit",
    "X-RateLimit-Remaining",
    "X-RateLimit-Reset",
  ],

  optionsSuccessStatus: 204,
  maxAge: env.CORS_MAX_AGE,
  preflightContinue: false,
};