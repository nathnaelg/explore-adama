// src/app.ts
import cors from "cors";
import express from "express";

import { corsOptions } from "./config/cors.ts";
import { errorHandler } from "./middleware/error-handler.ts";
import { notFound } from "./middleware/not-found.ts";
import { globalLimiter } from "./middleware/rate-limit.ts";
import routes from "./routes/index.ts";

import cookieParser from "cookie-parser";
import fs from "fs";
import path from "path";
import swaggerUi from "swagger-ui-express";

const swaggerPath = path.join(process.cwd(), "src", "swagger.json");
const swaggerDocument = JSON.parse(fs.readFileSync(swaggerPath, "utf-8"));

const app = express();
app.use(cookieParser());

// ---------------------------
// Middleware
// ---------------------------
app.use(cors(corsOptions));
app.use(globalLimiter);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// ---------------------------
// API Routes
// ---------------------------
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/api", routes);

// ---------------------------
// Not Found Handler
// ---------------------------
app.use(notFound);

// ---------------------------
// Error Handler
// ---------------------------
app.use(errorHandler);

export default app;
