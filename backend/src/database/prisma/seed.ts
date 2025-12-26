import { MediaType, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Start seeding ...');

    // 1. Create Categories
    const nature = await prisma.category.upsert({
        where: { key: 'nature' },
        update: {},
        create: {
            key: 'nature',
            name: 'Nature & Wildlife',
        },
    });

    const history = await prisma.category.upsert({
        where: { key: 'history' },
        update: {},
        create: {
            key: 'history',
            name: 'Historical Sites',
        },
    });

    const relaxation = await prisma.category.upsert({
        where: { key: 'relaxation' },
        update: {},
        create: {
            key: 'relaxation',
            name: 'Relaxation & Spa',
        },
    });

    console.log('Created categories:', { nature, history, relaxation });

    // 2. Create Places
    const sodere = await prisma.place.create({
        data: {
            name: 'Sodere Resort',
            description: 'A famous hot spring resort located near the Awash River. Perfect for relaxation and weekend getaways.',
            categoryId: relaxation.id,
            latitude: 8.4000,
            longitude: 39.5167,
            address: 'Sodere, Oromia, Ethiopia',
            viewCount: 150,
            avgRating: 4.5,
            images: {
                create: [
                    {
                        url: 'https://media-cdn.tripadvisor.com/media/photo-s/01/0e/96/0c/swiming-pool.jpg', // Placeholder
                        type: MediaType.IMAGE,
                        caption: 'Main Swimming Pool',
                    },
                ],
            },
        },
    });

    const awash = await prisma.place.create({
        data: {
            name: 'Awash National Park',
            description: 'One of the oldest national parks in Ethiopia, known for its wildlife and the majestic Awash Falls.',
            categoryId: nature.id,
            latitude: 8.8833,
            longitude: 40.0000,
            address: 'Awash, Ethiopia',
            viewCount: 200,
            avgRating: 4.8,
            images: {
                create: [
                    {
                        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Awash_falls.jpg/1200px-Awash_falls.jpg',
                        type: MediaType.IMAGE,
                        caption: 'Awash Falls',
                    },
                ],
            },
        },
    });

    const adamaPark = await prisma.place.create({
        data: {
            name: 'Adama Park',
            description: 'A beatiful park in the heart of Adama City.',
            categoryId: nature.id,
            latitude: 8.5414,
            longitude: 39.2689,
            address: 'Adama, Ethiopia',
            viewCount: 120,
            avgRating: 4.2
        }
    })

    console.log('Created places:', { sodere, awash, adamaPark });

    // 3. Create Events
    const culturalNight = await prisma.event.create({
        data: {
            title: 'Cultural Music Night',
            description: 'Enjoy traditional Ethiopian music and dance at Sodere Resort.',
            placeId: sodere.id,
            categoryId: relaxation.id,
            date: new Date(new Date().setDate(new Date().getDate() + 7)), // 7 days from now
            startTime: new Date(new Date().setHours(19, 0, 0, 0)),
            endTime: new Date(new Date().setHours(23, 0, 0, 0)),
            price: 200,
            images: {
                create: [
                    {
                        url: 'https://i.ytimg.com/vi/q1R2r4Y4b3Q/maxresdefault.jpg',
                        type: MediaType.IMAGE,
                        caption: 'Traditional Dance Performance',
                    },
                ],
            },
        },
    });

    const hikingTrip = await prisma.event.create({
        data: {
            title: 'Hiking Adventure',
            description: 'Group hiking trip to nearby hills.',
            categoryId: nature.id,
            date: new Date(new Date().setDate(new Date().getDate() + 3)),
            startTime: new Date(new Date().setHours(6, 0, 0, 0)),
            endTime: new Date(new Date().setHours(14, 0, 0, 0)),
            price: 500
        }
    })

    console.log('Created events:', { culturalNight, hikingTrip });

    // 4. Create some Global Recommendations (linking to these items)
    // Note: The schema for Recommendation is usually personalized, but let's see if there's a simpler way or just rely on "Places" endpoint.
    // The home screen calls /recommendations/global, let's see what that returns in code or if it relies on existing data.
    // Assuming /recommendations/global aggregates popular places/events if no explicit recommendation rows exist.
    // But if it requires explicit Recommendation rows, we might need to add them.
    // Let's create one just in case, though usually "Global" implies non-user-specific.
    // If the backend logic pulls from "Recommendation" table without userId, we might need entries.
    // Checking schema: Recommendation has userId? (nullable). So maybe userId=null is global?

    /*
    await prisma.recommendation.create({
        data: {
            itemId: sodere.id,
            itemType: 'PLACE',
            score: 0.95,
            reason: 'Popular Choice',
            userId: null 
        }
    })
    */

    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
