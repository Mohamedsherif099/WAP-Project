import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';

dotenv.config();

const sampleProducts = [
    {
        name: "iPhone 15 Pro",
        description: "Latest iPhone with pro camera system and A17 Pro chip",
        price: 999.99,
        category: "Electronics",
        imageUrl: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aXBob25lJTIwMTV8ZW58MHx8MHx8fDA%3D"
    },
    {
        name: "Organic Fresh Fruits Basket",
        description: "Assorted seasonal organic fruits",
        price: 49.99,
        category: "Groceries",
        imageUrl: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZnJ1aXRzJTIwYmFza2V0fGVufDB8fDB8fHww"
    },
    {
        name: "Yoga Mat Premium",
        description: "Non-slip yoga mat with alignment lines",
        price: 39.99,
        category: "Sports & Exercise",
        imageUrl: "https://images.unsplash.com/photo-1592432678016-e910b452f9a2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8eW9nYSUyMG1hdHxlbnwwfHwwfHx8MA%3D%3D"
    },
    {
        name: "Smart LED TV 65\"",
        description: "4K Ultra HD Smart TV with HDR and Dolby Vision",
        price: 1299.99,
        category: "Electronics",
        imageUrl: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dHZ8ZW58MHx8MHx8fDA%3D"
    },
    {
        name: "First Aid Kit Premium",
        description: "Comprehensive first aid kit for home and travel",
        price: 79.99,
        category: "Healthcare",
        imageUrl: "https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Zmlyc3QlMjBhaWQlMjBraXR8ZW58MHx8MHx8fDA%3D"
    },
    {
        name: "Fresh Organic Vegetables Box",
        description: "Weekly supply of fresh organic vegetables",
        price: 59.99,
        category: "Groceries",
        imageUrl: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dmVnZXRhYmxlc3xlbnwwfHwwfHx8MA%3D%3D"
    },
    {
        name: "Dumbbell Set 20kg",
        description: "Professional rubber coated dumbbell set",
        price: 149.99,
        category: "Sports & Exercise",
        imageUrl: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZHVtYmJlbGx8ZW58MHx8MHx8fDA%3D"
    },
    {
        name: "Digital Blood Pressure Monitor",
        description: "Automatic upper arm blood pressure monitor",
        price: 89.99,
        category: "Healthcare",
        imageUrl: "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Ymxvb2QlMjBwcmVzc3VyZSUyMG1vbml0b3J8ZW58MHx8MHx8fDA%3D"
    }
];

async function seed() {
    try {
        const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/reviewme';
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        // Clear existing data
        await Product.deleteMany({});
        console.log('Cleared existing products');

        // Insert products
        await Product.insertMany(sampleProducts);
        console.log('Inserted products');

        console.log('Seeding completed successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
}

seed(); 