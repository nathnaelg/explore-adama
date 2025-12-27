
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const userId = "542617d2-505f-47ec-bbca-e82ec1ab6c57"; // User ID from logs

    console.log(`Creating test notification for user ${userId}...`);

    try {
        const notification = await prisma.notification.create({
            data: {
                userId,
                type: "SYSTEM",
                title: "Test Notification",
                message: "This is a manual test notification to verify delivery.",
                isRead: false,
                data: {}
            }
        });
        console.log("✅ Notification created:", notification.id);
    } catch (e) {
        console.error("❌ Failed to create notification:", e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
