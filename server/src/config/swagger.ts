import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Talabat API Documentation',
            version: '1.0.0',
            description: 'API documentation for the Talabat food delivery application',
        },
        servers: [
            {
                url: 'http://localhost:4001',
                description: 'Development server',
            },
            {
                url: 'https://reviewme-server.onrender.com',
                description: 'Production server',
            },
        ],
        components: {
            schemas: {
                Product: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string' },
                        name: { type: 'string' },
                        description: { type: 'string' },
                        price: { type: 'number' },
                        category: { type: 'string' },
                        imageUrl: { type: 'string' },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' },
                    },
                },
                Review: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string' },
                        product: { type: 'string' },
                        title: { type: 'string' },
                        content: { type: 'string' },
                        rating: { type: 'number', minimum: 1, maximum: 5 },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' },
                    },
                },
            },
        },
    },
    apis: ['./src/routes/*.ts'], // Path to the API routes
};

export const specs = swaggerJsdoc(options); 