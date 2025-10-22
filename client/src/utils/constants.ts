// Determine API base URL based on environment
const getApiBaseUrl = () => {
  // If VITE_API_BASE_URL is explicitly set, use it
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  
  // If accessing from localhost (development), use local backend if available
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:5000/api';
  }
  
  // For production deployment, use Render backend URL
  return 'https://cherishindia.onrender.com/api';
};

const API_BASE_URL = getApiBaseUrl();

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    ME: '/auth/me',
    PROFILE: '/auth/profile',
    PASSWORD: '/auth/password',
    REFRESH: '/auth/refresh-token',
  },
  PRODUCTS: {
    GET_ALL: '/products',
    GET_BY_ID: '/products',
    FEATURED: '/products/featured',
    CATEGORIES: '/products/categories',
    REVIEWS: '/products', // /products/:id/reviews
  },
  ORDERS: {
    CREATE: '/orders',
    GET_USER_ORDERS: '/orders',
    GET_BY_ID: '/orders',
    CANCEL: '/orders', // /orders/:id/cancel
    UPDATE_STATUS: '/orders', // /orders/:id/status
    ADMIN_ALL: '/orders/admin/all',
  },
};

export { API_BASE_URL };

export const CATEGORIES = [
  'All',
  'Electronics',
  'Clothing',
  'Home & Garden',
  'Sports',
  'Books',
  'Beauty',
  'Health',
  'Automotive',
  'Toys',
  'Others'
];

export const MOCK_PRODUCTS = [
  {
    id: 1,
    name: "iPhone 15 Pro",
    price: 999,
    originalPrice: 1099,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400",
    rating: 4.8,
    reviews: 1234,
    description: "Latest iPhone with titanium design and advanced camera system.",
    inStock: true,
    discount: 9
  },
  {
    id: 2,
    name: "Nike Air Max 270",
    price: 150,
    originalPrice: 180,
    category: "Sports",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400",
    rating: 4.6,
    reviews: 856,
    description: "Comfortable running shoes with Air Max technology.",
    inStock: true,
    discount: 17
  },
  {
    id: 3,
    name: "MacBook Pro 16\"",
    price: 2499,
    originalPrice: 2699,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400",
    rating: 4.9,
    reviews: 2341,
    description: "Powerful laptop for professionals with M3 chip.",
    inStock: true,
    discount: 7
  },
  {
    id: 4,
    name: "Wireless Headphones",
    price: 299,
    originalPrice: 349,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
    rating: 4.5,
    reviews: 678,
    description: "Premium noise-cancelling wireless headphones.",
    inStock: true,
    discount: 14
  },
  {
    id: 5,
    name: "Designer T-Shirt",
    price: 45,
    originalPrice: 60,
    category: "Clothing",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400",
    rating: 4.3,
    reviews: 234,
    description: "Premium cotton t-shirt with modern design.",
    inStock: true,
    discount: 25
  },
  {
    id: 6,
    name: "Smart Watch",
    price: 399,
    originalPrice: 449,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400",
    rating: 4.7,
    reviews: 1567,
    description: "Advanced fitness tracking and smart features.",
    inStock: true,
    discount: 11
  }
];

export const MOCK_USER = {
  id: 1,
  name: "John Doe",
  email: "john@example.com",
  isAdmin: false
};