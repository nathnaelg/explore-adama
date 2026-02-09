
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Checking Latest Reviews...');

    const reviews = await prisma.review.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
            user: { select: { email: true } }
        }
    });

    console.table(reviews.map(r => ({
        id: r.id,
        user: r.user.email,
        placeId: r.placeId,
        rating: r.rating,
        comment: r.comment,
        status: r.status,  // <--- This is what we need to see
        createdAt: r.createdAt
    })));
}

main()
    .catch((e) => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
