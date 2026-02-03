import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { PrismaClient } = require("@prisma/client");

export const prisma = new PrismaClient({
    log: ['warn', 'error'],
});

async function testConnection() {
    try {
        await prisma.$connect();
        console.log("✅ Database connected successfully");
    } catch (error) {
        console.error("❌ Database connection failed:", error);
    }
}

testConnection();