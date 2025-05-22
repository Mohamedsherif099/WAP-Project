import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4001/api';

const client = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default client; 