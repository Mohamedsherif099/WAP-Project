import { Request, Response } from 'express';
import Product from '../models/Product.js';
import { SortOrder } from 'mongoose';

// Get all products with filtering and pagination
export const getProducts = async (req: Request, res: Response) => {
    try {
        const { category, sort, page = 1, limit = 10, search } = req.query;

        let query: any = {};
        if (category) {
            query.category = category;
        }
        if (search) {
            query.$text = { $search: search as string };
        }

        const sortOptions: Record<string, { [key: string]: SortOrder }> = {
            'price-asc': { price: 1 },
            'price-desc': { price: -1 },
            'rating-desc': { averageRating: -1 },
            'newest': { createdAt: -1 }
        };

        // If searching, add text score to sort
        const sortQuery = search
            ? { score: { $meta: "textScore" }, ...sortOptions[sort as string] }
            : sortOptions[sort as string] || { createdAt: -1 };

        const products = await Product.find(query)
            .sort(sortQuery)
            .limit(Number(limit))
            .skip((Number(page) - 1) * Number(limit));

        const total = await Product.countDocuments(query);

        res.json({
            products,
            totalPages: Math.ceil(total / Number(limit)),
            currentPage: Number(page)
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get single product by ID
export const getProduct = async (req: Request, res: Response) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Create new product
export const createProduct = async (req: Request, res: Response) => {
    try {
        const { name, description, price, category, imageUrl } = req.body;
        const product = new Product({
            name,
            description,
            price,
            category,
            imageUrl
        });
        await product.save();
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Update product
export const updateProduct = async (req: Request, res: Response) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete product
export const deleteProduct = async (req: Request, res: Response) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json({ message: 'Product deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}; 