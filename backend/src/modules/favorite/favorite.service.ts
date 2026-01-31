import { RecommendationItemType } from "@prisma/client";
import { prisma } from "../../config/db.ts";
import { NotificationService } from "../notifications/notification.service.ts";

export class FavoriteService {
  static async add(
    userId: string,
    itemId: string,
    itemType: RecommendationItemType,
  ) {
    const exists = await prisma.favorite.findFirst({
      where: { userId, itemId, itemType },
    });

    if (exists) throw new Error("Already favorited");

    const fav = await prisma.favorite.create({
      data: { userId, itemId, itemType },
    });

    try {
      await NotificationService.createNotification({
        userId,
        type: "SOCIAL", // or SYSTEM if preferred
        title: "Added to Favorites",
        message: `You added this ${itemType.toLowerCase()} to your favorites.`,
        data: { itemId, itemType },
      });
    } catch (e) {
      console.error("Failed to send favorite notification", e);
    }

    return fav;
  }

  static async remove(
    userId: string,
    itemId: string,
    itemType: RecommendationItemType,
  ) {
    const fav = await prisma.favorite.findFirst({
      where: { userId, itemId, itemType },
    });

    if (!fav) throw new Error("Favorite not found");

    await prisma.favorite.delete({ where: { id: fav.id } });
    return { deleted: true };
  }

  static async list(userId: string, page = 1, perPage = 20) {
    const skip = (page - 1) * perPage;

    const [data, total] = await Promise.all([
      prisma.favorite.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        skip,
        take: perPage,
      }),
      prisma.favorite.count({ where: { userId } }),
    ]);

    return { data, total, page, perPage };
  }

  static async isFavorited(
    userId: string,
    itemId: string,
    itemType: RecommendationItemType,
  ) {
    const fav = await prisma.favorite.findFirst({
      where: { userId, itemId, itemType },
    });
    return { favorited: !!fav };
  }
}
