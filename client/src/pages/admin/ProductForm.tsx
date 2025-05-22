import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import {
    Box,
    Button,
    Card,
    CardContent,
    Container,
    TextField,
    Typography,
    Alert,
    MenuItem
} from '@mui/material';
import { getProduct, createProduct, updateProduct, Product } from '../../api/products';

const categories = [
    'electronics',
    'clothing',
    'books',
    'home'
];

export default function ProductForm() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const isEditing = !!id;

    const [formData, setFormData] = useState<Partial<Product>>({
        name: '',
        description: '',
        price: 0,
        category: '',
        imageUrl: ''
    });

    const { data: product } = useQuery(
        ['product', id],
        () => getProduct(id!),
        { enabled: isEditing }
    );

    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name,
                description: product.description,
                price: product.price,
                category: product.category,
                imageUrl: product.imageUrl
            });
        }
    }, [product]);

    const createMutation = useMutation(createProduct, {
        onSuccess: () => {
            queryClient.invalidateQueries('products');
            navigate('/admin/products');
        }
    });

    const updateMutation = useMutation(
        (data: Partial<Product>) => updateProduct(id!, data),
        {
            onSuccess: () => {
                queryClient.invalidateQueries(['product', id]);
                queryClient.invalidateQueries('products');
                navigate('/admin/products');
            }
        }
    );

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEditing) {
            updateMutation.mutate(formData);
        } else {
            createMutation.mutate(formData as Omit<Product, '_id' | 'createdAt' | 'updatedAt' | 'averageRating' | 'totalReviews'>);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'price' ? parseFloat(value) || 0 : value
        }));
    };

    const errorMessage = createMutation.error instanceof Error
        ? createMutation.error.message
        : updateMutation.error instanceof Error
            ? updateMutation.error.message
            : 'An error occurred';

    return (
        <Container maxWidth="md">
            <Card>
                <CardContent>
                    <Typography variant="h5" component="h1" gutterBottom>
                        {isEditing ? 'Edit Product' : 'Create Product'}
                    </Typography>
                    {(createMutation.error || updateMutation.error) && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {String(errorMessage)}
                        </Alert>
                    )}
                    <Box component="form" onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            label="Name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            margin="normal"
                            required
                        />
                        <TextField
                            fullWidth
                            label="Description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            margin="normal"
                            multiline
                            rows={4}
                            required
                        />
                        <TextField
                            fullWidth
                            label="Price"
                            name="price"
                            type="number"
                            value={formData.price}
                            onChange={handleChange}
                            margin="normal"
                            required
                            inputProps={{ min: 0, step: 0.01 }}
                        />
                        <TextField
                            fullWidth
                            select
                            label="Category"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            margin="normal"
                            required
                        >
                            {categories.map((category) => (
                                <MenuItem key={category} value={category}>
                                    {category.charAt(0).toUpperCase() + category.slice(1)}
                                </MenuItem>
                            ))}
                        </TextField>
                        <TextField
                            fullWidth
                            label="Image URL"
                            name="imageUrl"
                            value={formData.imageUrl}
                            onChange={handleChange}
                            margin="normal"
                            required
                        />
                        <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                            <Button
                                type="submit"
                                variant="contained"
                                disabled={createMutation.isLoading || updateMutation.isLoading}
                            >
                                {isEditing
                                    ? updateMutation.isLoading
                                        ? 'Saving...'
                                        : 'Save Changes'
                                    : createMutation.isLoading
                                        ? 'Creating...'
                                        : 'Create Product'}
                            </Button>
                            <Button
                                variant="outlined"
                                onClick={() => navigate('/admin/products')}
                            >
                                Cancel
                            </Button>
                        </Box>
                    </Box>
                </CardContent>
            </Card>
        </Container>
    );
} 