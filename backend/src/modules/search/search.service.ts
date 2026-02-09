import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const searchService = {
    searchAll: async (query: string) => {
        if (!query) {
            return {
                places: [],
                events: [],
                categories: [],
                blogPosts: [],
                users: [],
            };
        }

        const lowerQuery = query.toLowerCase();

        const [places, events, categories, blogPosts, users] = await Promise.all([
            // Search Places
            prisma.place.findMany({
                where: {
                    OR: [
                        { name: { contains: query, mode: "insensitive" } },
                        { description: { contains: query, mode: "insensitive" } },
                        { address: { contains: query, mode: "insensitive" } },
                    ],
                },
                take: 5,
                include: {
                    images: { take: 1 },
                },
            }),

            // Search Events
            prisma.event.findMany({
                where: {
                    OR: [
                        { title: { contains: query, mode: "insensitive" } },
                        { description: { contains: query, mode: "insensitive" } },
                    ],
                },
                take: 5,
                include: {
                    images: { take: 1 },
                },
            }),

            // Search Categories
            prisma.category.findMany({
                where: {
                    name: { contains: query, mode: "insensitive" },
                },
                take: 5,
            }),

            // Search Blog Posts
            prisma.blogPost.findMany({
                where: {
                    OR: [
                        { title: { contains: query, mode: "insensitive" } },
                        { body: { contains: query, mode: "insensitive" } },
                    ],
                    status: "APPROVED",
                },
                take: 5,
                include: {
                    author: {
                        include: {
                            profile: true,
                        },
                    },
                    media: { take: 1 },
                },
            }),

            // Search Users (bloggers)
            prisma.user.findMany({
                where: {
                    profile: {
                        name: { contains: query, mode: "insensitive" },
                    },
                    blogPosts: {
                        some: {}, // Only users who have at least one blog post
                    },
                },
                take: 5,
                include: {
                    profile: true,
                },
            }),
        ]);

        return {
            places,
            events,
            categories,
            blogPosts,
            users,
        };
    },
};
