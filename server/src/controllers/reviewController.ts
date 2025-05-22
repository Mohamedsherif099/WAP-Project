import { Request, Response } from 'express';
import Review from '../models/Review.js';
import Product from '../models/Product.js';

// Get reviews for a product
export const getProductReviews = async (req: Request, res: Response) => {
    try {
        const { productId } = req.params;
        const reviews = await Review.find({ product: productId }).sort({ createdAt: -1 });
        res.json({ reviews });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Create a review
export const createReview = async (req: Request, res: Response) => {
    try {
        const { product, username, rating, title, comment } = req.body;

        // Validate required fields
        if (!product || !username || !rating || !title || !comment) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Check if product exists
        const productExists = await Product.findById(product);
        if (!productExists) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Prevent duplicate review by same username for the same product
        const existing = await Review.findOne({ product, username });
        if (existing) {
            return res.status(400).json({ message: 'You have already reviewed this product' });
        }

        const review = new Review({ product, username, rating, title, comment });
        await review.save();

        // Update product's average rating and total reviews
        const productReviews = await Review.find({ product });
        const totalRating = productReviews.reduce((sum, r) => sum + r.rating, 0);
        const averageRating = totalRating / productReviews.length;

        await Product.findByIdAndUpdate(product, {
            averageRating,
            totalReviews: productReviews.length
        });

        res.status(201).json(review);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete a review
export const deleteReview = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const review = await Review.findById(id);

        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        await Review.findByIdAndDelete(id);

        // Update product's average rating and total reviews
        const productReviews = await Review.find({ product: review.product });
        const totalRating = productReviews.reduce((sum, r) => sum + r.rating, 0);
        const averageRating = productReviews.length > 0 ? totalRating / productReviews.length : 0;

        await Product.findByIdAndUpdate(review.product, {
            averageRating,
            totalReviews: productReviews.length
        });

        res.json({ message: 'Review deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Mark review as helpful
export const markReviewHelpful = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const review = await Review.findByIdAndUpdate(
            id,
            { $inc: { helpful: 1 } },
            { new: true }
        );

        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        res.json(review);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}; 