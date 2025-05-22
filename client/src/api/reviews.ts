import client from './client';

export interface Review {
    _id: string;
    username: string;
    product: string;
    rating: number;
    title: string;
    comment: string;
    helpful: number;
    createdAt: string;
}

export interface ReviewsResponse {
    reviews: Review[];
    totalPages: number;
    currentPage: number;
}

export interface ReviewFilters {
    sort?: 'newest' | 'oldest' | 'rating-desc' | 'rating-asc' | 'helpful';
    page?: number;
    limit?: number;
}

export interface CreateReviewData {
    product: string;
    username: string;
    rating: number;
    title: string;
    comment: string;
}

export const getProductReviews = async (productId: string) => {
    const response = await client.get<{ reviews: Review[] }>(`/reviews/product/${productId}`);
    return response.data.reviews;
};

export const createReview = async (reviewData: CreateReviewData) => {
    const response = await client.post<Review>('/reviews', reviewData);
    return response.data;
};

export const updateReview = async (id: string, review: Partial<Review>): Promise<Review> => {
    const { data } = await client.put<Review>(`/reviews/${id}`, review);
    return data;
};

export const deleteReview = async (reviewId: string) => {
    await client.delete(`/reviews/${reviewId}`);
};

export const markReviewHelpful = async (id: string): Promise<Review> => {
    const { data } = await client.post<Review>(`/reviews/${id}/helpful`);
    return data;
}; 