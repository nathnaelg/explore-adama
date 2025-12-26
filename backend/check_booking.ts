
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function checkBooking() {
    const id = 'f5f13ef3-1487-43d9-ac59-646aa4c4a629';
    console.log(`Checking booking ${id}...`);
    const booking = await prisma.booking.findUnique({
        where: { id }
    });
    console.log('Booking found:', booking);
}

checkBooking()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
