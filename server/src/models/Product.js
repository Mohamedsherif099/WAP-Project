import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    category: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    averageRating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    totalReviews: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Calculate average rating before saving
productSchema.pre('save', async function () {
    if (this.reviews.length > 0) {
        const reviews = await mongoose.model('Review').find({ _id: { $in: this.reviews } });
        const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
        this.averageRating = totalRating / reviews.length;
        this.totalReviews = reviews.length;
    }
});

const Product = mongoose.model('Product', productSchema);
export default Product; 