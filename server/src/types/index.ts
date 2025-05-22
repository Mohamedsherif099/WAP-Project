import { Document } from 'mongoose';

export interface IProduct extends Document {
    name: string;
    description: string;
    price: number;
    category: string;
    imageUrl: string;
    averageRating: number;
    totalReviews: number;
}

export interface IReview extends Document {
    username: string;
    product: IProduct['_id'];
    rating: number;
    title: string;
    comment: string;
    helpful: number;
} 