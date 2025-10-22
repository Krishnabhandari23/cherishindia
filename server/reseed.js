const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import models
const User = require('./src/models/User');
const Product = require('./src/models/Product');

// Import the product data from seed.js
const { seedDatabase } = require('./seed');

async function reseedDatabase() {
  try {
    const MONGO = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/cherishindia';
    await mongoose.connect(MONGO);
    console.log('✅ Connected to MongoDB for re-seeding');
    
    // Clear existing products
    await Product.deleteMany({});
    console.log('🗑️ Cleared existing products');
    
    // Re-run the seeding
    await seedDatabase();
    
    console.log('🎉 Database re-seeding completed!');
    console.log('\n🔑 Test Credentials:');
    console.log('Admin: admin@cherishindia.com / admin123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Re-seeding failed:', error);
    process.exit(1);
  }
}

// Run re-seeding
reseedDatabase();