const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import models
const User = require('./src/models/User');
const Product = require('./src/models/Product');

// Comprehensive product data across multiple categories
const sampleProducts = [
  // Electronics Category
  {
    name: 'Premium Wireless Headphones',
    description: 'High-quality wireless headphones with noise cancellation.',
    price: 2999,
    originalPrice: 3999,
    discount: 25,
    category: 'Electronics',
    subcategory: 'Audio',
    brand: 'SoundMax',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop&auto=format',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop&auto=format'
    ],
    ratings: { average: 4.8, count: 324 },
    stock: 50,
    weight: 0.3,
    dimensions: { length: 20, width: 18, height: 8 },
    isFeatured: true,
    tags: ['wireless', 'bluetooth', 'headphones', 'music', 'premium']
  },
  {
    name: 'Smartphone Case',
    description: 'Premium leather case with card holder functionality.',
    price: 899,
    originalPrice: 1199,
    discount: 25,
    category: 'Electronics',
    subcategory: 'Accessories',
    brand: 'ProtectPlus',
    image: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=500&h=500&fit=crop&auto=format',
    images: [
      'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=500&h=500&fit=crop&auto=format'
    ],
    ratings: { average: 4.5, count: 128 },
    stock: 75,
    weight: 0.1,
    dimensions: { length: 15, width: 8, height: 1 },
    isFeatured: false,
    tags: ['case', 'leather', 'protection', 'smartphone']
  },
  {
    name: 'Wireless Bluetooth Speaker',
    description: 'Portable wireless speaker with deep bass and 12-hour battery life.',
    price: 1999,
    originalPrice: 2499,
    discount: 20,
    category: 'Electronics',
    subcategory: 'Audio',
    brand: 'SoundWave',
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&h=500&fit=crop&auto=format',
    images: [
      'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&h=500&fit=crop&auto=format'
    ],
    ratings: { average: 4.6, count: 189 },
    stock: 45,
    weight: 0.8,
    dimensions: { length: 25, width: 10, height: 10 },
    isFeatured: true,
    tags: ['speaker', 'bluetooth', 'portable', 'music', 'bass']
  },

  // Clothing Category
  {
    name: 'Cotton Casual T-Shirt',
    description: 'Comfortable 100% cotton t-shirt perfect for daily wear.',
    price: 599,
    originalPrice: 799,
    discount: 25,
    category: 'Clothing',
    subcategory: 'Men\'s Clothing',
    brand: 'StyleCraft',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop&auto=format',
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop&auto=format'
    ],
    ratings: { average: 4.4, count: 256 },
    stock: 120,
    weight: 0.2,
    dimensions: { length: 70, width: 50, height: 2 },
    isFeatured: false,
    tags: ['tshirt', 'cotton', 'casual', 'comfortable', 'daily wear']
  },
  {
    name: 'Denim Jeans',
    description: 'Classic blue denim jeans with perfect fit and comfort.',
    price: 1899,
    originalPrice: 2399,
    discount: 21,
    category: 'Clothing',
    subcategory: 'Men\'s Clothing',
    brand: 'DenimCo',
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&h=500&fit=crop&auto=format',
    images: [
      'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&h=500&fit=crop&auto=format'
    ],
    ratings: { average: 4.7, count: 198 },
    stock: 85,
    weight: 0.6,
    dimensions: { length: 100, width: 40, height: 3 },
    isFeatured: true,
    tags: ['jeans', 'denim', 'classic', 'blue', 'comfortable']
  },
  {
    name: 'Elegant Summer Dress',
    description: 'Beautiful floral summer dress perfect for casual outings.',
    price: 1499,
    originalPrice: 1999,
    discount: 25,
    category: 'Clothing',
    subcategory: 'Women\'s Clothing',
    brand: 'FloralFashion',
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500&h=500&fit=crop&auto=format',
    images: [
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500&h=500&fit=crop&auto=format'
    ],
    ratings: { average: 4.6, count: 142 },
    stock: 65,
    weight: 0.3,
    dimensions: { length: 95, width: 45, height: 2 },
    isFeatured: true,
    tags: ['dress', 'summer', 'floral', 'elegant', 'casual']
  },

  // Home & Garden Category
  {
    name: 'Ceramic Coffee Mug Set',
    description: 'Set of 4 beautiful ceramic coffee mugs with elegant design.',
    price: 899,
    originalPrice: 1199,
    discount: 25,
    category: 'Home & Garden',
    subcategory: 'Kitchen',
    brand: 'HomeCraft',
    image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=500&h=500&fit=crop&auto=format',
    images: [
      'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=500&h=500&fit=crop&auto=format'
    ],
    ratings: { average: 4.5, count: 89 },
    stock: 40,
    weight: 1.2,
    dimensions: { length: 25, width: 20, height: 15 },
    isFeatured: false,
    tags: ['mug', 'coffee', 'ceramic', 'kitchen', 'set']
  },
  {
    name: 'Decorative Table Lamp',
    description: 'Modern decorative table lamp with warm LED lighting.',
    price: 2299,
    originalPrice: 2899,
    discount: 21,
    category: 'Home & Garden',
    subcategory: 'Lighting',
    brand: 'LightCraft',
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500&h=500&fit=crop&auto=format',
    images: [
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500&h=500&fit=crop&auto=format'
    ],
    ratings: { average: 4.8, count: 156 },
    stock: 30,
    weight: 1.5,
    dimensions: { length: 30, width: 30, height: 45 },
    isFeatured: true,
    tags: ['lamp', 'lighting', 'decorative', 'modern', 'LED']
  },
  {
    name: 'Indoor Plant Pot Set',
    description: 'Set of 3 ceramic plant pots perfect for indoor gardening.',
    price: 1199,
    originalPrice: 1599,
    discount: 25,
    category: 'Home & Garden',
    subcategory: 'Garden',
    brand: 'GreenThumb',
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500&h=500&fit=crop&auto=format',
    images: [
      'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500&h=500&fit=crop&auto=format'
    ],
    ratings: { average: 4.3, count: 78 },
    stock: 55,
    weight: 2.0,
    dimensions: { length: 40, width: 35, height: 25 },
    isFeatured: false,
    tags: ['pot', 'plant', 'ceramic', 'garden', 'indoor']
  },

  // Books Category
  {
    name: 'The Art of Programming',
    description: 'Comprehensive guide to modern programming techniques and best practices.',
    price: 1299,
    originalPrice: 1699,
    discount: 24,
    category: 'Books',
    subcategory: 'Technology',
    brand: 'TechPress',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&h=500&fit=crop&auto=format',
    images: [
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&h=500&fit=crop&auto=format'
    ],
    ratings: { average: 4.9, count: 567 },
    stock: 25,
    weight: 0.8,
    dimensions: { length: 24, width: 18, height: 3 },
    isFeatured: true,
    tags: ['book', 'programming', 'technology', 'education', 'guide']
  },
  {
    name: 'Mystery Novel Collection',
    description: 'Collection of 3 bestselling mystery novels by renowned authors.',
    price: 999,
    originalPrice: 1299,
    discount: 23,
    category: 'Books',
    subcategory: 'Fiction',
    brand: 'MysteryBooks',
    image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500&h=500&fit=crop&auto=format',
    images: [
      'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500&h=500&fit=crop&auto=format'
    ],
    ratings: { average: 4.6, count: 234 },
    stock: 35,
    weight: 1.2,
    dimensions: { length: 20, width: 13, height: 8 },
    isFeatured: false,
    tags: ['book', 'mystery', 'fiction', 'novel', 'collection']
  },
  {
    name: 'Cookbook - Indian Cuisine',
    description: 'Authentic Indian recipes with step-by-step cooking instructions.',
    price: 799,
    originalPrice: 999,
    discount: 20,
    category: 'Books',
    subcategory: 'Cooking',
    brand: 'CulinaryArts',
    image: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=500&h=500&fit=crop&auto=format',
    images: [
      'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=500&h=500&fit=crop&auto=format'
    ],
    ratings: { average: 4.7, count: 189 },
    stock: 40,
    weight: 0.6,
    dimensions: { length: 25, width: 20, height: 2 },
    isFeatured: true,
    tags: ['cookbook', 'indian', 'cuisine', 'recipes', 'cooking']
  },

  // Sports Category
  {
    name: 'Yoga Mat Premium',
    description: 'High-quality non-slip yoga mat for comfortable practice.',
    price: 1599,
    originalPrice: 1999,
    discount: 20,
    category: 'Sports',
    subcategory: 'Yoga',
    brand: 'YogaLife',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500&h=500&fit=crop&auto=format',
    images: [
      'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500&h=500&fit=crop&auto=format'
    ],
    ratings: { average: 4.8, count: 298 },
    stock: 60,
    weight: 1.8,
    dimensions: { length: 180, width: 60, height: 0.6 },
    isFeatured: true,
    tags: ['yoga', 'mat', 'fitness', 'exercise', 'non-slip']
  },
  {
    name: 'Dumbbell Set',
    description: 'Adjustable dumbbell set perfect for home workouts.',
    price: 3999,
    originalPrice: 4999,
    discount: 20,
    category: 'Sports',
    subcategory: 'Weights',
    brand: 'FitStrong',
    image: 'https://images.unsplash.com/photo-1571019613914-85f342c6a11e?w=500&h=500&fit=crop&auto=format',
    images: [
      'https://images.unsplash.com/photo-1571019613914-85f342c6a11e?w=500&h=500&fit=crop&auto=format'
    ],
    ratings: { average: 4.7, count: 167 },
    stock: 25,
    weight: 15.0,
    dimensions: { length: 40, width: 30, height: 20 },
    isFeatured: false,
    tags: ['dumbbell', 'weights', 'fitness', 'workout', 'adjustable']
  },
  {
    name: 'Running Shoes',
    description: 'Lightweight running shoes with superior cushioning and support.',
    price: 2799,
    originalPrice: 3499,
    discount: 20,
    category: 'Sports',
    subcategory: 'Footwear',
    brand: 'RunFast',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop&auto=format',
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop&auto=format'
    ],
    ratings: { average: 4.6, count: 456 },
    stock: 80,
    weight: 0.8,
    dimensions: { length: 30, width: 12, height: 10 },
    isFeatured: true,
    tags: ['shoes', 'running', 'sports', 'lightweight', 'cushioning']
  }
];

// Export seedDatabase function for auto-seeding
async function seedDatabase() {
  try {
    // Don't clear existing data, just add products if none exist
    const adminUser = await User.findOne({ role: 'admin' });
    
    // Create admin user if doesn't exist
    let adminUserId;
    if (!adminUser) {
      const admin = new User({
        name: 'Admin User',
        email: 'admin@cherishindia.com',
        password: 'admin123',
        role: 'admin',
        isEmailVerified: true
      });
      const savedAdmin = await admin.save();
      adminUserId = savedAdmin._id;
      console.log('👤 Created admin user');
    } else {
      adminUserId = adminUser._id;
      console.log('👤 Admin user already exists');
    }
    
    // Check if products exist
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      // Add admin as creator to all products
      const productsWithCreator = sampleProducts.map(product => ({
        ...product,
        createdBy: adminUserId
      }));
      
      const createdProducts = await Product.insertMany(productsWithCreator);
      console.log(`📦 Created ${createdProducts.length} products`);
    } else {
      console.log(`📦 Found ${productCount} existing products`);
    }
    
    console.log('🎉 Database seeding completed!');
    return true;
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    throw error;
  }
}

// For direct execution
async function seed() {
  try {
    const MONGO = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/cherishindia';
    await mongoose.connect(MONGO);
    console.log('✅ Connected to MongoDB for seeding');
    
    await seedDatabase();
    
    console.log('\n🔑 Test Credentials:');
    console.log('Admin: admin@cherishindia.com / admin123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

// Run seeding if this file is executed directly
if (require.main === module) {
  seed();
}

module.exports = { seedDatabase };