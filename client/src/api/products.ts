import client from './client';

export interface Product {
    _id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    imageUrl: string;
    averageRating: number;
    totalReviews: number;
    createdAt: string;
}

export interface ProductFilters {
    category?: string;
    sort?: 'newest' | 'price-asc' | 'price-desc' | 'rating-desc';
    page?: number;
    limit?: number;
}

export interface ProductsResponse {
    products: Product[];
    totalPages: number;
    currentPage: number;
}

export const getProducts = async (filters: ProductFilters = {}): Promise<ProductsResponse> => {
    const response = await client.get<ProductsResponse>('/products', { params: filters });
    return response.data;
};

export const getProduct = async (id: string): Promise<Product> => {
    const response = await client.get<Product>(`/products/${id}`);
    return response.data;
};

export const createProduct = async (product: Omit<Product, '_id' | 'createdAt' | 'updatedAt' | 'averageRating' | 'totalReviews'>): Promise<Product> => {
    const { data } = await client.post<Product>('/products', product);
    return data;
};

export const updateProduct = async (id: string, product: Partial<Product>): Promise<Product> => {
    const { data } = await client.put<Product>(`/products/${id}`, product);
    return data;
};

export const deleteProduct = async (id: string): Promise<void> => {
    await client.delete(`/products/${id}`);
};

export const createReview = async (productId: string, data: { rating: number; comment: string }) => {
    const response = await client.post(`/products/${productId}/reviews`, data);
    return response.data;
}; 