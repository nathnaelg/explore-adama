export interface BlogPost {
  id: string;
  authorId: string;
  title: string;
  body: string;
  category: string;
  tags: string[];
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  updatedAt: string;
  author?: {
    id: string;
    email: string;
    profile?: {
      name: string;
      avatar?: string;
    };
  };
  media?: BlogMedia[];
  comments?: BlogComment[];
  viewCount?: number;
  likeCount?: number;
  commentCount?: number;
}

export interface BlogMedia {
  id: string;
  postId: string;
  url: string;
  type: 'IMAGE' | 'VIDEO';
  caption: string;
}

export interface BlogComment {
  id: string;
  postId: string;
  userId: string;
  content: string;
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

export interface CreateBlogPostDto {
  title: string;
  body: string;
  category?: string;
  tags?: string[];
}

export interface UpdateBlogPostDto {
  title?: string;
  body?: string;
  category?: string;
  tags?: string[];
  status?: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export interface CreateBlogCommentDto {
  content: string;
}

export interface ModerateBlogPostDto {
  action: 'APPROVE' | 'REJECT' | 'PENDING';
  reason?: string;
}

export interface BlogListResponse {
  items: BlogPost[];
  page: number;
  limit: number;
  total: number;
}

export interface BlogQueryParams {
  q?: string;
  page?: number;
  limit?: number;
  category?: string;
  authorId?: string;
  status?: string;
  sortBy?: 'createdAt' | 'updatedAt' | 'viewCount' | 'likeCount';
  sortOrder?: 'asc' | 'desc';
}