import admin from "firebase-admin";
import app from "./app.ts";
import { prisma } from "./config/db.ts";
import { env } from "./config/env.ts";
import { logger } from "./config/logger.ts";

// Initialize Firebase Admin
// Expects GOOGLE_APPLICATION_CREDENTIALS env var to be set to path of service account json
// OR FIREBASE_CONFIG env var
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
    });
    logger.success("Firebase Admin initialized");
  } catch (error) {
    logger.warn(
      "Failed to initialize Firebase Admin, social auth may not work:",
      error,
    );
  }
}

async function startServer() {
  try {
    await prisma.$connect();
    logger.success("Connected to PostgreSQL database");
    const PORT = Number(process.env.PORT) || 3005;

    // Start server
    app.listen(PORT, "0.0.0.0", () => {
      logger.success(`Backend running on port ${PORT}`);
      logger.info(`Environment: ${env.NODE_ENV}`);
    });
  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();

// Graceful shutdown
process.on("SIGINT", async () => {
  await prisma.$disconnect();
  logger.info("Database disconnected");
  process.exit(0);
});
