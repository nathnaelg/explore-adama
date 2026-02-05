import { NextFunction, Request, Response } from "express";
import { searchService } from "./search.service.ts";

export const searchController = {
    search: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { q } = req.query;

            if (typeof q !== "string") {
                return res.status(200).json({
                    data: {
                        places: [],
                        events: [],
                        categories: [],
                        blogPosts: [],
                        users: [],
                    },
                });
            }

            const results = await searchService.searchAll(q);

            res.status(200).json({
                status: "success",
                data: results,
            });
        } catch (error) {
            next(error);
        }
    },
};
