// backend/src/modules/booking/booking.service.ts
// (No changes needed here, but confirming for completeness)
import crypto from "crypto";
import { prisma } from "../../config/db.ts";
import { NotificationService } from "../notifications/notification.service.ts";

export class BookingService {
  static async createBooking(data: {
    userId: string;
    eventId: string;
    quantity: number;
    subTotal: number;
    tax: number;
    fees: number;
    total: number;
  }) {
    const booking = await prisma.booking.create({
      data: {
        userId: data.userId,
        eventId: data.eventId,
        quantity: data.quantity,
        subTotal: data.subTotal,
        tax: data.tax,
        fees: data.fees,
        total: data.total,
        status: "PENDING"
      },
      include: { event: true } // Include event to get title for notification
    });

    try {
      await NotificationService.createNotification({
        userId: data.userId,
        type: "BOOKING",
        title: "Booking Initiated",
        message: `Your booking for ${booking.event.title} is pending payment.`,
        data: { bookingId: booking.id, eventId: booking.eventId }
      });
    } catch (e) {
      console.error("Failed to send pending booking notification", e);
    }

    return booking;
  }

  static async findById(id: string) {
    return prisma.booking.findUnique({
      where: { id },
      include: {
        event: true,
        tickets: true,
        user: { select: { id: true, email: true, profile: true } }
      }
    });
  }

  static async cancelBooking(id: string) {
    return prisma.booking.update({
      where: { id },
      data: { status: "CANCELLED" }
    });
  }

  static async listBookings(userId: string) {
    return prisma.booking.findMany({
      where: { userId },
      include: {
        event: true,
        tickets: true
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  // Confirm booking: update status, create tickets atomically and increment event bookingCount
  static async confirmBooking(bookingId: string, paymentId?: string) {
    const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
    if (!booking) return null;
    if (booking.status === "CONFIRMED") return booking; // idempotent

    // transaction: update booking, create tickets, update event bookingCount
    const created = await prisma.$transaction(async (tx) => {
      const updatedBooking = await tx.booking.update({
        where: { id: bookingId },
        data: {
          status: "CONFIRMED",
          transactionId: paymentId ?? undefined
        }
      });

      // Optimize ticket creation with Promise.all
      const ticketPromises = Array.from({ length: booking.quantity }).map(() =>
        tx.ticket.create({
          data: {
            bookingId,
            eventId: booking.eventId,
            userId: booking.userId,
            status: "CONFIRMED",
            qrToken: crypto.randomUUID()
          }
        })
      );

      const tickets = await Promise.all(ticketPromises);

      await tx.event.update({
        where: { id: booking.eventId },
        data: { bookingCount: { increment: booking.quantity } }
      });

      // return updated booking with tickets
      return tx.booking.findUnique({
        where: { id: bookingId },
        include: { tickets: true, event: true, user: true }
      });
    }, {
      timeout: 20000 // Increase timeout to 20s
    });



    if (created && created.status === "CONFIRMED") {
      try {
        await NotificationService.createNotification({
          userId: created.userId,
          type: "BOOKING",
          title: "Booking Confirmed",
          message: `Your booking for ${created.event.title} has been confirmed!`,
          data: { bookingId: created.id, eventId: created.event.id }
        });
      } catch (e) {
        console.error("Failed to send booking notification", e);
      }
    }

    return created;
  }
}