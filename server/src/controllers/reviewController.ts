import { Request, Response } from 'express';
import Review from '../models/Review.js';
import Product from '../models/Product.js';

// Get all reviews
export const getAllReviews = async (req: Request, res: Response) => {
    try {
        const reviews = await Review.find().populate('product');
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching reviews' });
    }
};

// Get a review by ID
export const getReviewById = async (req: Request, res: Response) => {
    try {
        const review = await Review.findById(req.params.id).populate('product');
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }
        res.json(review);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching review' });
    }
};

// Create a new review
export const createReview = async (req: Request, res: Response) => {
    try {
        const review = new Review(req.body);
        await review.save();
        res.status(201).json(review);
    } catch (error) {
        res.status(400).json({ message: 'Error creating review' });
    }
};

// Update a review
export const updateReview = async (req: Request, res: Response) => {
    try {
        const review = await Review.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }
        res.json(review);
    } catch (error) {
        res.status(400).json({ message: 'Error updating review' });
    }
};

// Delete a review
export const deleteReview = async (req: Request, res: Response) => {
    try {
        const review = await Review.findByIdAndDelete(req.params.id);
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }
        res.json({ message: 'Review deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting review' });
    }
};

// Get reviews for a product
export const getProductReviews = async (req: Request, res: Response) => {
    try {
        const reviews = await Review.find({ product: req.params.productId })
            .populate('product');
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching product reviews' });
    }
};

// Mark a review as helpful
export const markReviewHelpful = async (req: Request, res: Response) => {
    try {
        const review = await Review.findById(req.params.id);
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }
        review.helpful = (review.helpful || 0) + 1;
        await review.save();
        res.json(review);
    } catch (error) {
        res.status(500).json({ message: 'Error marking review as helpful' });
    }
};