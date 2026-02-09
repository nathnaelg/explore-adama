
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Checking User Push Tokens...');

    // Find all users with a push token
    const usersWithToken = await prisma.user.findMany({
        where: {
            pushToken: {
                not: null
            }
        },
        select: {
            id: true,
            email: true,
            pushToken: true,
            role: true
        }
    });

    console.log(`\nFound ${usersWithToken.length} users with push tokens:`);
    console.table(usersWithToken);

    if (usersWithToken.length === 0) {
        console.log('\n❌ NO USERS HAVE PUSH TOKENS! This is likely the issue.');
        console.log('Ensure the mobile app is calling registerPushTokenWithBackend() successfully.');
    } else {
        console.log('\n✅ Push tokens found. Checking push notification sending logs is next.');

        // Also verify the token format
        usersWithToken.forEach(u => {
            if (u.pushToken && !u.pushToken.startsWith('ExponentPushToken[')) {
                console.warn(`⚠️ WARNING: User ${u.email} has a potentially invalid token format: ${u.pushToken}`);
            }
        });
    }
}

main()
    .catch((e) => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
