// backend/src/modules/ticket/ticket.service.ts
// (New file: TicketService for handling ticket operations, including QR code generation)
// Install dependency: npm install qrcode
// This generates a QR code image for each ticket and saves it to a file or stores base64 in DB.
// For simplicity, we'll generate base64 string and store in ticket.qrCode (add qrCode: string to Prisma Ticket model).
// Update Prisma schema: model Ticket { ... qrCode String? @db.Text }
import QRCode from "qrcode"; // Import qrcode library
import { prisma } from "../../config/db.ts";

export class TicketService {
  // Generate QR code for a ticket (base64 image)
  // src/modules/tickets/ticket.service.ts
  static async generateQrCode(ticketId: string, qrToken: string) {
    try {
      const ticket = await prisma.ticket.findUnique({
        where: { id: ticketId },
      });
      if (!ticket) throw new Error("Ticket not found");

      // Use only the short, unique qrToken (already UUID) → perfect size
      const qrData = qrToken;

      const qrBase64 = await QRCode.toDataURL(qrData, {
        errorCorrectionLevel: "M", // ← Lower from H → fixes "data too big"
        type: "image/png",
        quality: 0.92,
        margin: 1,
        width: 512, // ← Smaller image = smaller data
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      });

      await prisma.ticket.update({
        where: { id: ticketId },
        data: { qrToken: qrBase64 },
      });

      console.log(`QR code generated successfully for ticket ${ticketId}`);
      return qrBase64;
    } catch (err: any) {
      console.error("QR generation failed for ticket", ticketId, err.message);
      // Don't crash the whole webhook — still mark booking as confirmed!
      return null;
    }
  }

  // Fetch ticket with QR code
  static async findById(id: string) {
    return prisma.ticket.findUnique({
      where: { id },
      include: { booking: true, event: true },
    });
  }

  // List all tickets for a user
  static async listTickets(userId: string, page = 1, perPage = 20) {
    // 1️⃣ Get user role from DB
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const skip = (page - 1) * perPage;

    // 2️⃣ Admin sees all, user sees own
    const whereCondition = user.role === "ADMIN" ? {} : { userId };

    // 3️⃣ Query tickets
    const [data, total] = await Promise.all([
      prisma.ticket.findMany({
        where: whereCondition,
        include: {
          booking: true,
          event: true,
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: perPage,
      }),
      prisma.ticket.count({
        where: whereCondition,
      }),
    ]);

    return { data, total, page, perPage };
  }

  // Other ticket operations can be added here
}
