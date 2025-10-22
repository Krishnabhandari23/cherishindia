const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import models
const User = require('./src/models/User');
const Product = require('./src/models/Product');
const Order = require('./src/models/Order');

// Sample data
const sampleProducts = [
  // Electronics Category (3 products)
  {
    name: 'Premium Wireless Bluetooth Headphones',
    description: 'Experience crystal-clear audio with our premium wireless headphones featuring active noise cancellation, 30-hour battery life, and comfortable over-ear design. Perfect for music lovers, professionals, and commuters who demand superior sound quality.',
    price: 2999,
    originalPrice: 3999,
    discount: 25,
    category: 'Electronics',
    subcategory: 'Audio',
    brand: 'SoundMax',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop&auto=format',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500&h=500&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500&h=500&fit=crop&auto=format'
    ],
    ratings: { average: 4.8, count: 324 },
    stock: 50,
    weight: 0.3,
    dimensions: { length: 20, width: 18, height: 8 },
    isFeatured: true,
    tags: ['wireless', 'bluetooth', 'headphones', 'music', 'premium', 'noise-cancelling']
  },
  {
    name: 'Premium Smartphone Case with Card Holder',
    description: 'Protect your smartphone in style with this premium leather case featuring built-in card slots, magnetic closure, and kickstand functionality. Compatible with wireless charging and designed for everyday durability.',
    price: 899,
    originalPrice: 1199,
    discount: 25,
    category: 'Electronics',
    subcategory: 'Accessories',
    brand: 'ProtectPlus',
    image: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=500&h=500&fit=crop&auto=format',
    images: [
      'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=500&h=500&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=500&h=500&fit=crop&auto=format'
    ],
    ratings: { average: 4.5, count: 156 },
    stock: 75,
    weight: 0.1,
    tags: ['smartphone', 'case', 'protection', 'card holder', 'stand', 'leather', 'wireless-charging']
  },
  {
    name: 'Fast Wireless Charging Pad - 15W',
    description: 'Charge your devices effortlessly with this sleek 15W fast wireless charging pad. Features intelligent charging technology, LED indicators, and universal compatibility with all Qi-enabled devices including iPhone and Android phones.',
    price: 1499,
    originalPrice: 1999,
    discount: 25,
    category: 'Electronics',
    subcategory: 'Chargers',
    brand: 'PowerTech',
    image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=500&h=500&fit=crop&auto=format',
    images: [
      'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=500&h=500&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop&auto=format'
    ],
    ratings: { average: 4.6, count: 89 },
    stock: 40,
    weight: 0.2,
    isFeatured: true,
    tags: ['wireless', 'charging', 'pad', 'fast', 'qi-enabled', '15w']
  },

  // Clothing Category (3 products)
  {
    name: 'Premium Cotton Casual T-Shirt',
    description: 'Ultra-soft 100% organic cotton t-shirt with perfect fit and exceptional comfort. Pre-shrunk fabric ensures lasting quality. Available in multiple vibrant colors and sizes from XS to XXL.',
    price: 599,
    originalPrice: 799,
    discount: 25,
    category: 'Clothing',
    subcategory: 'T-Shirts',
    brand: 'FashionHub',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop&auto=format',
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=500&h=500&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1503341338985-95e2e3ab9bdc?w=500&h=500&fit=crop&auto=format'
    ],
    ratings: { average: 4.7, count: 412 },
    stock: 100,
    weight: 0.2,
    isFeatured: true,
    tags: ['cotton', 'casual', 't-shirt', 'comfortable', 'everyday', 'organic']
  },
  {
    name: 'Classic Denim Jacket - Vintage Style',
    description: 'Timeless denim jacket featuring classic stonewash finish, button closure, and multiple pockets. Perfect for layering over t-shirts and creating effortless casual looks.',
    price: 2499,
    originalPrice: 3199,
    discount: 22,
    category: 'Clothing',
    subcategory: 'Jackets',
    brand: 'DenimCo',
    image: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=500&h=500&fit=crop&auto=format',
    images: [
      'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=500&h=500&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1594223790551-7de1bbdacf3d?w=500&h=500&fit=crop&auto=format'
    ],
    ratings: { average: 4.4, count: 178 },
    stock: 35,
    weight: 0.8,
    tags: ['denim', 'jacket', 'classic', 'casual', 'layering', 'vintage']
  },
  {
    name: 'Formal Dress Shirt',
    description: 'Crisp white formal dress shirt made from premium cotton blend. Perfect for office and formal events.',
    price: 1299,
    originalPrice: 1699,
    discount: 24,
    category: 'Clothing',
    subcategory: 'Shirts',
    brand: 'FormalWear',
    image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&h=400&fit=crop',
    stock: 60,
    weight: 0.3,
    tags: ['formal', 'dress shirt', 'cotton', 'office', 'white']
  },

  // Home & Garden Category (3 products)
  {
    name: 'Premium Ceramic Plant Pot Set (3-Piece)',
    description: 'Transform your living space with this elegant ceramic plant pot set featuring drainage holes, matching saucers, and modern minimalist design. Perfect for succulents, herbs, and small houseplants.',
    price: 1299,
    originalPrice: 1699,
    discount: 24,
    category: 'Home & Garden',
    subcategory: 'Planters',
    brand: 'GreenHome',
    image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=500&h=500&fit=crop&auto=format',
    images: [
      'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=500&h=500&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500&h=500&fit=crop&auto=format'
    ],
    ratings: { average: 4.5, count: 267 },
    stock: 30,
    weight: 2.5,
    isFeatured: true,
    tags: ['plant', 'pot', 'ceramic', 'indoor', 'decoration', 'gardening', 'set']
  },
  {
    name: 'LED Table Lamp',
    description: 'Modern LED table lamp with adjustable brightness and USB charging port. Energy efficient and stylish.',
    price: 1899,
    originalPrice: 2399,
    discount: 21,
    category: 'Home & Garden',
    subcategory: 'Lighting',
    brand: 'LightCraft',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    stock: 45,
    weight: 1.2,
    tags: ['led', 'table lamp', 'adjustable', 'usb', 'modern']
  },
  {
    name: 'Kitchen Knife Set',
    description: 'Professional 5-piece kitchen knife set with wooden block. High-quality stainless steel blades.',
    price: 3499,
    originalPrice: 4499,
    discount: 22,
    category: 'Home & Garden',
    subcategory: 'Kitchen',
    brand: 'ChefMaster',
    image: 'https://images.unsplash.com/photo-1593618998160-e34014d3c299?w=400&h=400&fit=crop',
    stock: 25,
    weight: 2.0,
    tags: ['kitchen', 'knife set', 'stainless steel', 'professional', 'wooden block']
  },

  // Sports Category (3 products)
  {
    name: 'Fitness Resistance Bands Set',
    description: 'Complete resistance bands set with different resistance levels. Includes door anchor and exercise guide.',
    price: 1499,
    originalPrice: 1999,
    discount: 25,
    category: 'Sports',
    subcategory: 'Fitness Equipment',
    brand: 'FitLife',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop',
    stock: 40,
    weight: 1.2,
    tags: ['fitness', 'resistance', 'bands', 'exercise', 'workout', 'home gym']
  },
  {
    name: 'Yoga Mat Premium',
    description: 'High-quality non-slip yoga mat with extra cushioning. Perfect for yoga, pilates, and home workouts.',
    price: 1799,
    originalPrice: 2299,
    discount: 22,
    category: 'Sports',
    subcategory: 'Yoga',
    brand: 'YogaPro',
    image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400&h=400&fit=crop',
    stock: 35,
    weight: 1.5,
    isFeatured: true,
    tags: ['yoga', 'mat', 'non-slip', 'cushioning', 'workout']
  },
  {
    name: 'Basketball',
    description: 'Official size basketball with superior grip and durability. Perfect for indoor and outdoor play.',
    price: 899,
    originalPrice: 1199,
    discount: 25,
    category: 'Sports',
    subcategory: 'Ball Sports',
    brand: 'SportMax',
    image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&h=400&fit=crop',
    stock: 50,
    weight: 0.6,
    tags: ['basketball', 'official size', 'grip', 'durable', 'sports']
  },

  // Books Category (3 products)
  {
    name: 'Programming Fundamentals Book',
    description: 'Comprehensive guide to programming fundamentals. Perfect for beginners and intermediate developers.',
    price: 899,
    originalPrice: 1199,
    discount: 25,
    category: 'Books',
    subcategory: 'Technology',
    brand: 'TechBooks',
    image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&h=400&fit=crop',
    stock: 25,
    weight: 0.8,
    tags: ['programming', 'book', 'learning', 'technology', 'coding']
  },
  {
    name: 'Cookbook: Healthy Recipes',
    description: 'Collection of 100+ healthy and delicious recipes for everyday cooking. Includes nutritional information.',
    price: 799,
    originalPrice: 999,
    discount: 20,
    category: 'Books',
    subcategory: 'Cooking',
    brand: 'HealthyEats',
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=400&fit=crop',
    stock: 30,
    weight: 0.6,
    tags: ['cookbook', 'healthy', 'recipes', 'nutrition', 'cooking']
  },
  {
    name: 'Mystery Novel: The Lost Key',
    description: 'Gripping mystery novel that will keep you on the edge of your seat. Bestselling author\'s latest work.',
    price: 499,
    originalPrice: 699,
    discount: 29,
    category: 'Books',
    subcategory: 'Fiction',
    brand: 'MysteryPress',
    image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=400&fit=crop',
    stock: 40,
    weight: 0.4,
    tags: ['mystery', 'novel', 'fiction', 'bestseller', 'thriller']
  },

  // Beauty Category (3 products)
  {
    name: 'Natural Face Cream',
    description: 'Organic face cream with natural ingredients. Suitable for all skin types, provides deep moisturization.',
    price: 1299,
    originalPrice: 1699,
    discount: 24,
    category: 'Beauty',
    subcategory: 'Skincare',
    brand: 'NaturalGlow',
    image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop',
    stock: 60,
    weight: 0.2,
    isFeatured: true,
    tags: ['face cream', 'natural', 'organic', 'moisturizer', 'skincare']
  },
  {
    name: 'Lipstick Set',
    description: 'Set of 5 long-lasting lipsticks in different shades. Creamy texture with rich pigmentation.',
    price: 1599,
    originalPrice: 1999,
    discount: 20,
    category: 'Beauty',
    subcategory: 'Makeup',
    brand: 'ColorPop',
    image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400&h=400&fit=crop',
    stock: 45,
    weight: 0.3,
    tags: ['lipstick', 'makeup', 'long-lasting', 'pigmented', 'creamy']
  },
  {
    name: 'Hair Serum',
    description: 'Nourishing hair serum for damaged and dry hair. Provides shine and reduces frizz.',
    price: 999,
    originalPrice: 1299,
    discount: 23,
    category: 'Beauty',
    subcategory: 'Haircare',
    brand: 'HairVita',
    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=400&fit=crop',
    stock: 55,
    weight: 0.15,
    tags: ['hair serum', 'nourishing', 'shine', 'anti-frizz', 'haircare']
  },

  // Health Category (3 products)
  {
    name: 'Vitamin C Tablets',
    description: 'High-potency Vitamin C tablets for immune support. 60 tablets per bottle, natural orange flavor.',
    price: 599,
    originalPrice: 799,
    discount: 25,
    category: 'Health',
    subcategory: 'Supplements',
    brand: 'HealthPlus',
    image: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=400&h=400&fit=crop',
    stock: 80,
    weight: 0.2,
    tags: ['vitamin c', 'tablets', 'immune support', 'supplements', 'health']
  },
  {
    name: 'Digital Thermometer',
    description: 'Accurate digital thermometer with fast reading. Fever alarm and memory function included.',
    price: 399,
    originalPrice: 599,
    discount: 33,
    category: 'Health',
    subcategory: 'Medical Devices',
    brand: 'MediCare',
    image: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400&h=400&fit=crop',
    stock: 70,
    weight: 0.1,
    tags: ['thermometer', 'digital', 'fever alarm', 'medical', 'accurate']
  },
  {
    name: 'Protein Powder',
    description: 'Whey protein powder for muscle building and recovery. Chocolate flavor, 1kg container.',
    price: 2499,
    originalPrice: 2999,
    discount: 17,
    category: 'Health',
    subcategory: 'Nutrition',
    brand: 'FitNutrition',
    image: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=400&h=400&fit=crop',
    stock: 30,
    weight: 1.0,
    tags: ['protein powder', 'whey', 'muscle building', 'chocolate', 'nutrition']
  },

  // Automotive Category (2 products)
  {
    name: 'Car Phone Mount',
    description: 'Universal car phone mount with 360-degree rotation. Strong suction cup and adjustable arm.',
    price: 799,
    originalPrice: 999,
    discount: 20,
    category: 'Automotive',
    subcategory: 'Accessories',
    brand: 'AutoTech',
    image: 'https://images.unsplash.com/photo-1558618739-b65606c0a1e8?w=400&h=400&fit=crop',
    stock: 65,
    weight: 0.3,
    tags: ['car mount', 'phone holder', 'universal', 'suction cup', 'automotive']
  },
  {
    name: 'Car Air Freshener Set',
    description: 'Set of 3 long-lasting car air fresheners with different scents. Easy to hang design.',
    price: 299,
    originalPrice: 399,
    discount: 25,
    category: 'Automotive',
    subcategory: 'Accessories',
    brand: 'FreshDrive',
    image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=400&fit=crop',
    stock: 100,
    weight: 0.1,
    tags: ['air freshener', 'car accessories', 'scented', 'long-lasting', 'hanging']
  },

  // Toys Category (3 products)
  {
    name: 'Educational Building Blocks',
    description: 'Colorful building blocks set for children. Helps develop creativity and motor skills.',
    price: 1899,
    originalPrice: 2399,
    discount: 21,
    category: 'Toys',
    subcategory: 'Educational',
    brand: 'KidsPlay',
    image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=400&fit=crop',
    stock: 60,
    weight: 1.5,
    isFeatured: true,
    tags: ['toys', 'educational', 'building', 'blocks', 'children', 'creativity']
  },
  {
    name: 'Remote Control Car',
    description: 'High-speed remote control car with rechargeable battery. Suitable for ages 8+ indoor and outdoor use.',
    price: 2299,
    originalPrice: 2899,
    discount: 21,
    category: 'Toys',
    subcategory: 'Remote Control',
    brand: 'SpeedToys',
    image: 'https://images.unsplash.com/photo-1558618666-e0c769d4b91b?w=400&h=400&fit=crop',
    stock: 25,
    weight: 0.8,
    tags: ['remote control', 'car', 'rechargeable', 'high-speed', 'toys']
  },
  {
    name: 'Puzzle Game 1000 Pieces',
    description: 'Challenging 1000-piece puzzle featuring beautiful landscape. Great for family time and brain exercise.',
    price: 699,
    originalPrice: 899,
    discount: 22,
    category: 'Toys',
    subcategory: 'Puzzles',
    brand: 'PuzzleMaster',
    image: 'https://images.unsplash.com/photo-1551623279-d7e35e8b2d8c?w=400&h=400&fit=crop',
    stock: 40,
    weight: 0.7,
    tags: ['puzzle', '1000 pieces', 'landscape', 'family', 'brain exercise']
  }
];

const sampleUsers = [
  {
    name: 'Admin User',
    email: 'admin@cherishindia.com',
    password: 'admin123',
    role: 'admin',
    phone: '+919876543210',
    address: {
      street: '123 Admin Street',
      city: 'Mumbai',
      state: 'Maharashtra',
      zipCode: '400001',
      country: 'India'
    }
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'user123',
    role: 'user',
    phone: '+919876543211',
    address: {
      street: '456 User Avenue',
      city: 'Delhi',
      state: 'Delhi',
      zipCode: '110001',
      country: 'India'
    }
  }
];

const MONGO = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/cherishindia';

}

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
      await admin.save();
      adminUserId = admin._id;
      console.log('👨‍💼 Created admin user');
    } else {
      adminUserId = adminUser._id;
    }
    
    // Create products if none exist
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      const productsWithCreator = sampleProducts.map(product => ({
        ...product,
        createdBy: adminUserId
      }));
      
      const createdProducts = await Product.insertMany(productsWithCreator);
      console.log(`📦 Created ${createdProducts.length} products`);
    }
    
    return true;
  } catch (error) {
    console.error('❌ Auto-seeding failed:', error);
    throw error;
  }
}

async function seed(){
  try {
    await mongoose.connect(MONGO, {useNewUrlParser:true, useUnifiedTopology:true});
    console.log('✅ Connected to MongoDB');
    
    // Clear existing data
    await Product.deleteMany({});
    await User.deleteMany({});
    await Order.deleteMany({});
    console.log('🗑️  Cleared existing data');
    
    // Create users (using save() to trigger password hashing middleware)
    const createdUsers = [];
    for (const userData of sampleUsers) {
      const user = new User(userData);
      await user.save();
      createdUsers.push(user);
    }
    console.log(`👥 Created ${createdUsers.length} users`);
    
    // Create products
    const adminUser = createdUsers.find(user => user.role === 'admin');
    const productsWithCreator = sampleProducts.map(product => ({
      ...product,
      createdBy: adminUser._id
    }));
    
    const createdProducts = await Product.insertMany(productsWithCreator);
    console.log(`📦 Created ${createdProducts.length} products`);
    
    console.log('\n🎉 Database seeding completed!');
    console.log('🔑 Test Credentials:');
    console.log('Admin: admin@cherishindia.com / admin123');
    console.log('User: john@example.com / user123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seed();

module.exports = { seedDatabase };
