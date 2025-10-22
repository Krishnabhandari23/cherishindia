const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import models
const User = require('./src/models/User');
const Product = require('./src/models/Product');

// Simple product data
const sampleProducts = [
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