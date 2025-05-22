import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import {
    Box,
    Button,
    Card,
    CardContent,
    Container,
    Divider,
    Grid,
    Rating,
    TextField,
    Typography,
    Alert,
    IconButton,
    Breadcrumbs,
    Link,
    Paper,
    Stack,
    Chip,
    Avatar,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    CircularProgress
} from '@mui/material';
import {
    Delete as DeleteIcon,
    ShoppingCart as CartIcon,
    LocalShipping as ShippingIcon,
    Security as SecurityIcon,
    ArrowBack as ArrowBackIcon,
    Check as CheckIcon
} from '@mui/icons-material';
import { getProduct } from '../api/products';
import { getProductReviews, createReview, deleteReview, Review } from '../api/reviews';
import { getStoredUsername } from '../utils/username';

export default function ProductDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const username = getStoredUsername();
    const [reviewForm, setReviewForm] = useState({
        rating: 5,
        title: '',
        comment: ''
    });

    const { data: product, isLoading: productLoading, error: productError } = useQuery(
        ['product', id],
        () => getProduct(id!),
        { enabled: !!id }
    );

    const { data: reviews, isLoading: reviewsLoading, error: reviewsError } = useQuery(
        ['reviews', id],
        () => getProductReviews(id!),
        { enabled: !!id }
    );

    const createReviewMutation = useMutation(createReview, {
        onSuccess: () => {
            queryClient.invalidateQueries(['reviews', id]);
            queryClient.invalidateQueries(['product', id]);
            setReviewForm({ rating: 5, title: '', comment: '' });
        }
    });

    const deleteReviewMutation = useMutation(deleteReview, {
        onSuccess: () => {
            queryClient.invalidateQueries(['reviews', id]);
            queryClient.invalidateQueries(['product', id]);
        }
    });

    const handleReviewSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!id) return;
        createReviewMutation.mutate({
            product: id,
            username,
            ...reviewForm
        });
    };

    const handleDeleteReview = (reviewId: string) => {
        deleteReviewMutation.mutate(reviewId);
    };

    if (productLoading || reviewsLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (productError) {
        return (
            <Container>
                <Alert severity="error" sx={{ mt: 2 }}>
                    Failed to load product details. Please try again later.
                </Alert>
            </Container>
        );
    }

    if (!product) {
        return (
            <Container>
                <Alert severity="error" sx={{ mt: 2 }}>
                    Product not found
                </Alert>
            </Container>
        );
    }

    // Calculate rating distribution
    const ratingDistribution = reviews?.reduce((acc: { [key: number]: number }, review) => {
        acc[review.rating] = (acc[review.rating] || 0) + 1;
        return acc;
    }, {}) || {};

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            {/* Breadcrumb Navigation */}
            <Breadcrumbs sx={{ mb: 3 }}>
                <Link color="inherit" href="/" underline="hover">
                    Home
                </Link>
                <Link color="inherit" href={`/?category=${product.category}`} underline="hover">
                    {product.category}
                </Link>
                <Typography color="text.primary">{product.name}</Typography>
            </Breadcrumbs>

            <Grid container spacing={4}>
                {/* Product Image Section */}
                <Grid item xs={12} md={6}>
                    <Paper
                        elevation={0}
                        sx={{
                            p: 2,
                            display: 'flex',
                            justifyContent: 'center',
                            bgcolor: 'background.default'
                        }}
                    >
                        <img
                            src={product.imageUrl}
                            alt={product.name}
                            style={{
                                maxWidth: '100%',
                                maxHeight: '500px',
                                objectFit: 'contain'
                            }}
                        />
                    </Paper>
                </Grid>

                {/* Product Info Section */}
                <Grid item xs={12} md={6}>
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="h4" component="h1" gutterBottom>
                            {product.name}
                        </Typography>

                        {/* Rating Summary */}
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Rating value={product.averageRating} precision={0.5} readOnly size="large" />
                            <Link href="#reviews" sx={{ ml: 1, textDecoration: 'none' }}>
                                {product.totalReviews} reviews
                            </Link>
                        </Box>

                        {/* Price Box */}
                        <Paper
                            elevation={0}
                            sx={{
                                p: 3,
                                mb: 3,
                                border: '1px solid',
                                borderColor: 'divider',
                                borderRadius: 2
                            }}
                        >
                            <Typography variant="h3" color="primary" gutterBottom>
                                ${product.price.toFixed(2)}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                Category: {product.category}
                            </Typography>
                        </Paper>

                        {/* Product Features */}
                        <List>
                            <ListItem>
                                <ListItemIcon>
                                    <CheckIcon color="primary" />
                                </ListItemIcon>
                                <ListItemText
                                    primary="Verified Reviews"
                                    secondary="All reviews are from verified users"
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemIcon>
                                    <CheckIcon color="primary" />
                                </ListItemIcon>
                                <ListItemText
                                    primary="Real Experiences"
                                    secondary="Read authentic customer experiences"
                                />
                            </ListItem>
                        </List>
                    </Box>
                </Grid>
            </Grid>

            <Divider sx={{ my: 4 }} />

            {/* Product Description */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h5" gutterBottom>
                    About this item
                </Typography>
                <Typography variant="body1" paragraph>
                    {product.description}
                </Typography>
                <List>
                    <ListItem>
                        <ListItemIcon>
                            <CheckIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText primary="High-quality materials" />
                    </ListItem>
                    <ListItem>
                        <ListItemIcon>
                            <CheckIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText primary="Durable and long-lasting" />
                    </ListItem>
                    <ListItem>
                        <ListItemIcon>
                            <CheckIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText primary="Satisfaction guaranteed" />
                    </ListItem>
                </List>
            </Box>

            <Divider sx={{ my: 4 }} />

            {/* Reviews Section */}
            <Box id="reviews" sx={{ mb: 4 }}>
                <Typography variant="h5" gutterBottom>
                    Customer Reviews
                </Typography>

                {/* Rating Summary */}
                <Grid container spacing={4}>
                    <Grid item xs={12} md={4}>
                        <Paper sx={{ p: 3, textAlign: 'center' }}>
                            <Typography variant="h3" color="primary">
                                {product.averageRating.toFixed(1)}
                            </Typography>
                            <Rating value={product.averageRating} precision={0.5} readOnly size="large" />
                            <Typography variant="body2" color="text.secondary">
                                Based on {product.totalReviews} reviews
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={8}>
                        <Stack spacing={1}>
                            {[5, 4, 3, 2, 1].map((rating) => (
                                <Box key={rating} sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Typography variant="body2" sx={{ width: 40 }}>
                                        {rating} stars
                                    </Typography>
                                    <Box sx={{ flex: 1, mx: 2 }}>
                                        <Box
                                            sx={{
                                                height: 8,
                                                bgcolor: 'grey.200',
                                                borderRadius: 1,
                                                overflow: 'hidden'
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    height: '100%',
                                                    bgcolor: 'primary.main',
                                                    width: `${(ratingDistribution[rating] || 0) / (product.totalReviews || 1) * 100}%`
                                                }}
                                            />
                                        </Box>
                                    </Box>
                                    <Typography variant="body2" color="text.secondary" sx={{ width: 40 }}>
                                        {ratingDistribution[rating] || 0}
                                    </Typography>
                                </Box>
                            ))}
                        </Stack>
                    </Grid>
                </Grid>

                {/* Review Form */}
                <Card sx={{ mt: 4, mb: 4 }}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Write a Review
                        </Typography>
                        <Box component="form" onSubmit={handleReviewSubmit}>
                            <Box sx={{ mb: 2 }}>
                                <Typography component="legend">Rating</Typography>
                                <Rating
                                    value={reviewForm.rating}
                                    onChange={(_, value) => setReviewForm(prev => ({ ...prev, rating: value || 5 }))}
                                    size="large"
                                />
                            </Box>
                            <TextField
                                fullWidth
                                label="Title"
                                value={reviewForm.title}
                                onChange={(e) => setReviewForm(prev => ({ ...prev, title: e.target.value }))}
                                margin="normal"
                                required
                            />
                            <TextField
                                fullWidth
                                label="Comment"
                                value={reviewForm.comment}
                                onChange={(e) => setReviewForm(prev => ({ ...prev, comment: e.target.value }))}
                                margin="normal"
                                multiline
                                rows={4}
                                required
                            />
                            <Button
                                type="submit"
                                variant="contained"
                                sx={{ mt: 2 }}
                                disabled={createReviewMutation.isLoading}
                            >
                                {createReviewMutation.isLoading ? 'Submitting...' : 'Submit Review'}
                            </Button>
                        </Box>
                    </CardContent>
                </Card>

                {/* Reviews List */}
                {reviewsError && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        Failed to load reviews. Please try again later.
                    </Alert>
                )}

                {reviews?.map((review: Review) => (
                    <Card key={review._id} sx={{ mb: 2 }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                        <Avatar sx={{ mr: 2 }}>{review.username[0].toUpperCase()}</Avatar>
                                        <Box>
                                            <Typography variant="subtitle1" component="div">
                                                {review.username}
                                            </Typography>
                                            <Rating value={review.rating} readOnly size="small" />
                                        </Box>
                                    </Box>
                                    <Typography variant="h6" gutterBottom>
                                        {review.title}
                                    </Typography>
                                </Box>
                                {username === review.username && (
                                    <IconButton
                                        size="small"
                                        color="error"
                                        onClick={() => handleDeleteReview(review._id)}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                )}
                            </Box>
                            <Typography variant="body1">
                                {review.comment}
                            </Typography>
                        </CardContent>
                    </Card>
                ))}

                {!reviewsError && (!reviews || reviews.length === 0) && (
                    <Alert severity="info">
                        No reviews yet. Be the first to review this product!
                    </Alert>
                )}
            </Box>
        </Container>
    );
} 