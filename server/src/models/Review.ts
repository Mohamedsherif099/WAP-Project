import mongoose, { Schema } from 'mongoose';
import { IReview } from '../types/index.js';

const reviewSchema = new Schema<IReview>({
    username: {
        type: String,
        required: true,
        trim: true
    },
    product: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    comment: {
        type: String,
        required: true
    },
    helpful: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Ensure one review per username per product
reviewSchema.index({ username: 1, product: 1 }, { unique: true });

const Review = mongoose.model<IReview>('Review', reviewSchema);
export default Review; 