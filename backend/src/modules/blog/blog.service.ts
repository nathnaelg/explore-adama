import { prisma } from "../../config/db.ts";
import { GeminiClient } from "../chat/chat.gemini.ts";
import { NotificationService } from "../notifications/notification.service.ts";

export class BlogService {
  static async createPost({ authorId, title, body, category, tags = [] }: any) {
    const post = await prisma.blogPost.create({
      data: {
        authorId,
        title,
        body,
        category,
        tags,
      },
    });
    return post;
  }

  static async listPosts({
    q,
    category,
    page = 1,
    limit = 10,
    userId,
    isAdmin,
  }: {
    q?: string;
    category?: string;
    page?: number;
    limit?: number;
    userId?: string;
    isAdmin?: boolean;
  }) {
    const where: any = {};

    // Visibility rules:
    // 1. APPROVED posts are visible to everyone.
    // 2. PENDING/REJECTED posts are visible ONLY to the author OR an admin.
    if (isAdmin) {
      // Admin sees everything
    } else if (userId) {
      // Authenticated user sees APPROVED posts OR their OWN posts
      where.OR = [{ status: "APPROVED" }, { authorId: userId }];
    } else {
      // Guest sees only APPROVED posts
      where.status = "APPROVED";
    }

    // Add category filter if provided
    if (category && category.length) {
      where.category = category;
    }

    if (q && q.length) {
      const searchCondition = {
        OR: [
          { title: { contains: q, mode: "insensitive" } },
          { body: { contains: q, mode: "insensitive" } },
          { tags: { has: q } },
        ],
      };

      // Merge search condition with visibility condition
      if (where.OR) {
        // If we already have an OR (for userId case), we need to wrap both in an AND
        const visibilityCondition = { OR: where.OR };
        delete where.OR;
        where.AND = [visibilityCondition, searchCondition];
      } else {
        // Simple merge
        Object.assign(where, searchCondition);
      }
    }

    const posts = await prisma.blogPost.findMany({
      where,
      orderBy: [{ createdAt: "desc" }],
      skip: (page - 1) * limit,
      take: limit,
      include: {
        author: { select: { id: true, email: true, profile: true } },
        media: true,
        comments: true,
        likes: true, // inefficient for large scale but fine for now
      },
    });

    const total = await prisma.blogPost.count({ where });

    // Transform to include isLiked and likesCount
    const transformedPosts = posts.map((p) => ({
      ...p,
      likesCount: p.likes.length,
      isLiked: userId ? p.likes.some((l) => l.userId === userId) : false,
      likes: undefined, // hide raw likes array
    }));

    return { items: transformedPosts, page, limit, total };
  }

  static async getPostById(id: string, userId?: string) {
    const post = await prisma.blogPost.findUnique({
      where: { id },
      include: {
        author: { select: { id: true, email: true, profile: true } },
        media: true,
        comments: {
          orderBy: { createdAt: "asc" },
          include: {
            user: { select: { id: true, email: true, profile: true } },
          },
        },
        likes: true,
      },
    });

    if (!post) return null;

    // Increment view count (fire and forget)
    // We only increment if it's a "view" - usually triggered by GET detail.
    // To prevent spam, we might want to check unique visits, but for now simple increment.
    // We'll do this in a separate method or here. Let's do it here asynchronously.
    prisma.blogPost
      .update({
        where: { id },
        data: { viewCount: { increment: 1 } },
      })
      .catch(console.error);

    return {
      ...post,
      likesCount: post.likes.length,
      isLiked: userId ? post.likes.some((l) => l.userId === userId) : false,
      likes: undefined,
    };
  }

  static async toggleLike(postId: string, userId: string) {
    const existing = await prisma.like.findFirst({
      where: { postId, userId },
    });

    if (existing) {
      // Unlike
      await prisma.like.delete({ where: { id: existing.id } });
      return { liked: false };
    } else {
      // Like
      await prisma.like.create({
        data: { postId, userId },
      });
      return { liked: true };
    }
  }

  static async updatePost({
    id,
    userId,
    data,
  }: {
    id: string;
    userId: string;
    data: any;
  }) {
    // Only author or admin can update
    const post = await prisma.blogPost.findUnique({ where: { id } });
    if (!post) return null;
    // check author or admin role (assumes user role check done earlier; here we only check author)
    if (post.authorId !== userId) {
      // you could also allow ADMIN via a separate role-check middleware
      return null;
    }
    const updated = await prisma.blogPost.update({
      where: { id },
      data: {
        title: data.title ?? post.title,
        body: data.body ?? post.body,
        category: data.category ?? post.category,
        tags: Array.isArray(data.tags) ? data.tags : post.tags,
        status: data.status ?? post.status,
      },
    });
    return updated;
  }

  static async deletePost(id: string) {
    // Soft-delete or hard delete? We'll hard-delete here.
    // You may want to change to soft-delete (archive).
    return prisma.blogPost.delete({ where: { id } });
  }

  static async addMediaToPost({ postId, url, type = "image", publicId }: any) {
    const media = await prisma.blogMedia.create({
      data: {
        postId,
        url,
        type: type === "video" ? "VIDEO" : "IMAGE",
      },
    });
    return media;
  }

  // Comments
  static async createComment({ postId, userId, content }: any) {
    const comment = await prisma.comment.create({
      data: { postId, userId, content },
      include: { user: { select: { id: true, email: true, profile: true } } },
    });

    // Notify post author
    try {
      const post = await prisma.blogPost.findUnique({ where: { id: postId } });
      if (post && post.authorId !== userId) {
        await NotificationService.createNotification({
          userId: post.authorId,
          type: "SOCIAL",
          title: "New Comment",
          message: `${comment.user.profile?.name || "Someone"} commented on your post "${post.title}"`,
          data: { postId, commentId: comment.id },
        });
      }
    } catch (e) {
      console.error("Failed to send comment notification", e);
    }

    return comment;
  }

  static async listComments({ postId }: { postId: string }) {
    return prisma.comment.findMany({
      where: { postId },
      orderBy: { createdAt: "asc" },
      include: { user: { select: { id: true, email: true, profile: true } } },
    });
  }

  // Moderation
  static async moderatePost({ adminId, postId, action, reason }: any) {
    // create moderation record and update post status accordingly
    const actionStr = action.toUpperCase();
    const status =
      actionStr === "APPROVE"
        ? "APPROVED"
        : actionStr === "REJECT"
          ? "REJECTED"
          : "PENDING";
    const moderation = await prisma.moderation.create({
      data: {
        adminId,
        postId,
        action,
        reason,
      },
    });

    const updated = await prisma.blogPost.update({
      where: { id: postId },
      data: { status },
    });

    return { moderation, post: updated };
  }

  static async translatePost({
    id,
    targetLanguage,
  }: {
    id: string;
    targetLanguage: string;
  }) {
    const post = await this.getPostById(id);
    if (!post) throw new Error("Post not found");

    const [translatedTitle, translatedBody] = await Promise.all([
      GeminiClient.translate({ text: post.title, targetLanguage }),
      GeminiClient.translate({ text: post.body, targetLanguage }),
    ]);

    return {
      id: post.id,
      title: translatedTitle,
      body: translatedBody,
      language: targetLanguage,
    };
  }

  static async getCategories() {
    // Predefined categories that should always be available
    const defaultCategories = [
      "travel",
      "hotels",
      "restaurants",
      "culture",
      "events",
      "tips",
    ];

    // Get all distinct categories from approved blog posts
    const posts = await prisma.blogPost.findMany({
      where: {
        status: "APPROVED",
        category: { not: null },
      },
      select: {
        category: true,
      },
      distinct: ["category"],
    });

    // Extract and filter out null values
    const dbCategories = posts
      .map((p) => p.category)
      .filter((cat): cat is string => cat !== null);

    // Merge default categories with database categories and remove duplicates
    const allCategories = Array.from(
      new Set([...defaultCategories, ...dbCategories]),
    );

    return allCategories;
  }
}
