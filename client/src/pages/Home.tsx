import React, { useState } from 'react';
import { useQuery } from 'react-query';
import {
    Box,
    Container,
    Grid,
    Card,
    CardContent,
    CardMedia,
    Typography,
    Rating,
    TextField,
    InputAdornment,
    Pagination,
    Alert,
    Chip,
    Stack
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { getProducts, ProductFilters } from '../api/products';

// Import Aref Ruqaa font
import '@fontsource/aref-ruqaa';

const categories = ['All', 'Electronics', 'Healthcare', 'Groceries', 'Sports & Exercise'];

export default function Home() {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState<ProductFilters>({
        category: '',
        sort: 'newest',
        page: 1
    });

    const { data, isLoading, error } = useQuery(
        ['products', filters],
        () => getProducts(filters),
        {
            keepPreviousData: true,
            staleTime: 5 * 60 * 1000, // Data stays fresh for 5 minutes
            cacheTime: 10 * 60 * 1000, // Cache is kept for 10 minutes
            refetchOnWindowFocus: false // Don't refetch when window regains focus
        }
    );

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
        // TODO: Implement search functionality
    };

    const handleCategoryClick = (category: string) => {
        setFilters(prev => ({
            ...prev,
            category: category === 'All' ? '' : category,
            page: 1
        }));
    };

    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setFilters(prev => ({ ...prev, page: value }));
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                pt: { xs: 4, md: 8 }
            }}
        >
            {/* Search Section */}
            <Box sx={{ width: '100%', maxWidth: 600, mb: 4 }}>
                <Typography
                    variant="h2"
                    component="h1"
                    sx={{
                        textAlign: 'center',
                        mb: 1,
                        fontWeight: 'bold',
                        color: 'primary.main',
                        fontSize: { xs: '2.5rem', md: '3.5rem' }
                    }}
                >
                    Talabat
                </Typography>
                <Typography
                    variant="h3"
                    component="h2"
                    sx={{
                        textAlign: 'center',
                        mb: 4,
                        fontWeight: 'bold',
                        color: 'primary.main',
                        fontSize: { xs: '2rem', md: '2.5rem' }
                    }}
                >
                    طلبات
                </Typography>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={handleSearch}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            borderRadius: 28,
                            boxShadow: 2,
                            height: 56,
                            fontSize: '1.1rem',
                            '&:hover': {
                                boxShadow: 3
                            }
                        }
                    }}
                />
            </Box>

            {/* Categories */}
            <Stack
                direction="row"
                spacing={1}
                sx={{
                    mb: 6,
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    gap: 1,
                    px: 2
                }}
            >
                {categories.map((category) => (
                    <Chip
                        key={category}
                        label={category}
                        onClick={() => handleCategoryClick(category)}
                        color={filters.category === (category === 'All' ? '' : category) ? 'primary' : 'default'}
                        sx={{
                            m: 0.5,
                            fontSize: '1rem',
                            height: 36,
                            '&:hover': {
                                transform: 'scale(1.05)',
                                transition: 'transform 0.2s'
                            }
                        }}
                    />
                ))}
            </Stack>

            {/* Products Grid */}
            {isLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
                    <Typography>Loading products...</Typography>
                </Box>
            ) : error ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
                    <Alert severity="error">
                        Failed to load products. Please try again later.
                    </Alert>
                </Box>
            ) : data?.products.length ? (
                <>
                    <Grid container spacing={4} sx={{ width: '100%', px: 2 }}>
                        {data.products.map((product) => (
                            <Grid item key={product._id} xs={12} sm={6} md={4}>
                                <Card
                                    sx={{
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        cursor: 'pointer',
                                        transition: 'transform 0.2s, box-shadow 0.2s',
                                        '&:hover': {
                                            transform: 'scale(1.02)',
                                            boxShadow: 6
                                        }
                                    }}
                                    onClick={() => navigate(`/products/${product._id}`)}
                                >
                                    <CardMedia
                                        component="img"
                                        height="200"
                                        image={product.imageUrl}
                                        alt={product.name}
                                        sx={{ objectFit: 'contain', p: 2 }}
                                    />
                                    <CardContent sx={{ flexGrow: 1 }}>
                                        <Typography gutterBottom variant="h6" component="h2">
                                            {product.name}
                                        </Typography>
                                        <Typography variant="h6" color="primary" gutterBottom>
                                            ${product.price.toFixed(2)}
                                        </Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                            <Rating value={product.averageRating} precision={0.5} readOnly size="small" />
                                            <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                                                ({product.totalReviews})
                                            </Typography>
                                        </Box>
                                        <Typography variant="body2" color="text.secondary">
                                            {product.category}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                    {data.totalPages > 1 && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, mb: 4 }}>
                            <Pagination
                                count={data.totalPages}
                                page={data.currentPage}
                                onChange={handlePageChange}
                                color="primary"
                                size="large"
                            />
                        </Box>
                    )}
                </>
            ) : (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
                    <Typography>No products found.</Typography>
                </Box>
            )}
        </Box>
    );
} 