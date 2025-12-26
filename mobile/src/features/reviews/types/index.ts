export interface Review {
    id: string;
    rating: number;
    comment?: string;
    userId: string;
    status: string;
    createdAt: string;
    user?: {
        id: string;
        email: string;
        profile?: {
            name: string;
            avatar?: string;
        };
    };
}

export interface CreateReviewDto {
    itemType: 'PLACE' | 'EVENT';
    itemId: string;
    rating: number;
    comment?: string;
}

export interface ReviewQueryParams {
    itemType: 'PLACE' | 'EVENT';
    itemId: string;
    page?: number;
    limit?: number;
}
