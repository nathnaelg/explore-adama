
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function createTestBooking() {
    try {
        const userId = "542617d2-505f-47ec-bbca-e82ec1ab6c57"; // User ID from logs (sub in JWT)

        // Find an event
        const event = await prisma.event.findFirst();
        if (!event) {
            console.log("No events found");
            return;
        }
        console.log("Found event:", event.id);

        const booking = await prisma.booking.create({
            data: {
                userId,
                eventId: event.id,
                quantity: 1,
                subTotal: 100,
                tax: 0,
                fees: 0,
                total: 100,
                status: "PENDING"
            }
        });
        console.log('Created booking:', booking.id);
    } catch (e) {
        console.error(e);
    }
}

createTestBooking()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
