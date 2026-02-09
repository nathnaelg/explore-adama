
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Force Approving Pending Reviews...');

    const result = await prisma.review.updateMany({
        where: {
            status: 'PENDING'
        },
        data: {
            status: 'APPROVED'
        }
    });

    console.log(`✅ Updated ${result.count} pending reviews to APPROVED status.`);
}

main()
    .catch((e) => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
