
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Checking Blog Posts...');

    const total = await prisma.blogPost.count();
    console.log(`Total Posts: ${total}`);

    const approved = await prisma.blogPost.count({ where: { status: 'APPROVED' } });
    console.log(`Approved Posts: ${approved}`);

    const pending = await prisma.blogPost.count({ where: { status: 'PENDING' } });
    console.log(`Pending Posts: ${pending}`);

    const rejected = await prisma.blogPost.count({ where: { status: 'REJECTED' } });
    console.log(`Rejected Posts: ${rejected}`);

    console.log('\n--- Recent Posts ---');
    const posts = await prisma.blogPost.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: { id: true, title: true, status: true, category: true }
    });
    console.table(posts);

    console.log('\n--- Searching for "hotels" ---');
    const searchResults = await prisma.blogPost.findMany({
        where: {
            OR: [
                { title: { contains: 'hotels', mode: 'insensitive' } },
                { body: { contains: 'hotels', mode: 'insensitive' } },
                { category: { contains: 'hotels', mode: 'insensitive' } }
            ]
        },
        select: { id: true, title: true, status: true }
    });
    console.table(searchResults);
}

main()
    .catch((e) => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
