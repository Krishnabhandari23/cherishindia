// MongoDB Playground for Cherish India E-Commerce
// Connect to the database: use('cherishindia')

// Switch to the cherish india database
use('cherishindia');

// ==============================================
// DATABASE OVERVIEW AND STATISTICS
// ==============================================

// Get database statistics
db.runCommand({ dbStats: 1 });

// List all collections
db.runCommand("listCollections");

// Get collection statistics
db.users.stats();
db.products.stats();
db.orders.stats();

// ==============================================
// USER QUERIES
// ==============================================

// Find all users
db.users.find({});

// Find admin users
db.users.find({ role: 'admin' });

// Find users by city
db.users.find({ 'address.city': 'Mumbai' });

// Count total users
db.users.countDocuments();

// Find users with phone numbers
db.users.find({ phone: { $exists: true, $ne: null } });

// Find users created in the last 30 days
db.users.find({
  createdAt: {
    $gte: new Date(new Date().setDate(new Date().getDate() - 30))
  }
});

// ==============================================
// PRODUCT QUERIES
// ==============================================

// Find all active products
db.products.find({ isActive: true });

// Find products by category
db.products.find({ category: 'Electronics' });

// Find featured products
db.products.find({ isFeatured: true });

// Find products with discount
db.products.find({ discount: { $gt: 0 } });

// Find products in price range (₹500 - ₹2000)
db.products.find({
  price: { $gte: 500, $lte: 2000 }
});

// Find products with low stock (less than 10)
db.products.find({ stock: { $lt: 10 } });

// Find products by text search
db.products.find({
  $text: { $search: "wireless bluetooth" }
});

// Find top-rated products (rating >= 4.5)
db.products.find({
  'ratings.average': { $gte: 4.5 }
});

// Count products by category
db.products.aggregate([
  { $match: { isActive: true } },
  {
    $group: {
      _id: '$category',
      count: { $sum: 1 },
      avgPrice: { $avg: '$price' },
      totalStock: { $sum: '$stock' }
    }
  },
  { $sort: { count: -1 } }
]);

// Find most expensive products
db.products.find({}, { name: 1, price: 1, category: 1 })
  .sort({ price: -1 })
  .limit(5);

// Find products with most reviews
db.products.find({}, { name: 1, 'ratings.count': 1 })
  .sort({ 'ratings.count': -1 })
  .limit(5);

// ==============================================
// ORDER QUERIES
// ==============================================

// Find all orders
db.orders.find({});

// Find orders by status
db.orders.find({ status: 'delivered' });

// Find orders by payment method
db.orders.find({ paymentMethod: 'card' });

// Find orders for a specific user
db.orders.find({ user: ObjectId('USER_ID_HERE') });

// Find orders in the last 7 days
db.orders.find({
  createdAt: {
    $gte: new Date(new Date().setDate(new Date().getDate() - 7))
  }
});

// Find high-value orders (above ₹5000)
db.orders.find({ total: { $gt: 5000 } });

// Count orders by status
db.orders.aggregate([
  {
    $group: {
      _id: '$status',
      count: { $sum: 1 },
      totalRevenue: { $sum: '$total' }
    }
  },
  { $sort: { count: -1 } }
]);

// Monthly sales report
db.orders.aggregate([
  {
    $match: {
      status: { $in: ['delivered', 'shipped'] }
    }
  },
  {
    $group: {
      _id: {
        year: { $year: '$createdAt' },
        month: { $month: '$createdAt' }
      },
      totalOrders: { $sum: 1 },
      totalRevenue: { $sum: '$total' },
      averageOrderValue: { $avg: '$total' }
    }
  },
  { $sort: { '_id.year': -1, '_id.month': -1 } }
]);

// Top customers by order value
db.orders.aggregate([
  {
    $match: { status: 'delivered' }
  },
  {
    $group: {
      _id: '$user',
      totalSpent: { $sum: '$total' },
      orderCount: { $sum: 1 }
    }
  },
  {
    $lookup: {
      from: 'users',
      localField: '_id',
      foreignField: '_id',
      as: 'userInfo'
    }
  },
  {
    $project: {
      totalSpent: 1,
      orderCount: 1,
      userName: { $arrayElemAt: ['$userInfo.name', 0] },
      userEmail: { $arrayElemAt: ['$userInfo.email', 0] }
    }
  },
  { $sort: { totalSpent: -1 } },
  { $limit: 10 }
]);

// ==============================================
// BUSINESS ANALYTICS
// ==============================================

// Total revenue calculation
db.orders.aggregate([
  {
    $match: { status: 'delivered' }
  },
  {
    $group: {
      _id: null,
      totalRevenue: { $sum: '$total' },
      totalOrders: { $sum: 1 },
      averageOrderValue: { $avg: '$total' }
    }
  }
]);

// Most sold products
db.orders.aggregate([
  { $match: { status: 'delivered' } },
  { $unwind: '$items' },
  {
    $group: {
      _id: '$items.product',
      totalQuantitySold: { $sum: '$items.quantity' },
      totalRevenue: { $sum: '$items.totalPrice' },
      orderCount: { $sum: 1 }
    }
  },
  {
    $lookup: {
      from: 'products',
      localField: '_id',
      foreignField: '_id',
      as: 'productInfo'
    }
  },
  {
    $project: {
      totalQuantitySold: 1,
      totalRevenue: 1,
      orderCount: 1,
      productName: { $arrayElemAt: ['$productInfo.name', 0] },
      productCategory: { $arrayElemAt: ['$productInfo.category', 0] }
    }
  },
  { $sort: { totalQuantitySold: -1 } },
  { $limit: 10 }
]);

// Revenue by category
db.orders.aggregate([
  { $match: { status: 'delivered' } },
  { $unwind: '$items' },
  {
    $lookup: {
      from: 'products',
      localField: 'items.product',
      foreignField: '_id',
      as: 'productInfo'
    }
  },
  {
    $group: {
      _id: { $arrayElemAt: ['$productInfo.category', 0] },
      totalRevenue: { $sum: '$items.totalPrice' },
      totalQuantity: { $sum: '$items.quantity' },
      orderCount: { $sum: 1 }
    }
  },
  { $sort: { totalRevenue: -1 } }
]);

// ==============================================
// INVENTORY MANAGEMENT
// ==============================================

// Products with low stock alert
db.products.find({
  isActive: true,
  stock: { $lt: 5 }
}, {
  name: 1,
  stock: 1,
  category: 1
});

// Out of stock products
db.products.find({
  isActive: true,
  stock: 0
});

// Total inventory value
db.products.aggregate([
  {
    $match: { isActive: true }
  },
  {
    $group: {
      _id: null,
      totalValue: { $sum: { $multiply: ['$price', '$stock'] } },
      totalProducts: { $sum: 1 },
      totalStock: { $sum: '$stock' }
    }
  }
]);

// Inventory by category
db.products.aggregate([
  {
    $match: { isActive: true }
  },
  {
    $group: {
      _id: '$category',
      totalProducts: { $sum: 1 },
      totalStock: { $sum: '$stock' },
      totalValue: { $sum: { $multiply: ['$price', '$stock'] } }
    }
  },
  { $sort: { totalValue: -1 } }
]);

// ==============================================
// DATA QUALITY CHECKS
// ==============================================

// Find products without images
db.products.find({
  $or: [
    { image: { $exists: false } },
    { image: null },
    { image: '' }
  ]
});

// Find users without complete address
db.users.find({
  $or: [
    { 'address.street': { $exists: false } },
    { 'address.city': { $exists: false } },
    { 'address.state': { $exists: false } }
  ]
});

// Find orders without shipping address
db.orders.find({
  $or: [
    { shippingAddress: { $exists: false } },
    { 'shippingAddress.street': { $exists: false } }
  ]
});

// ==============================================
// PERFORMANCE OPTIMIZATION QUERIES
// ==============================================

// Create indexes for better performance
db.products.createIndex({ category: 1 });
db.products.createIndex({ price: 1 });
db.products.createIndex({ 'ratings.average': -1 });
db.products.createIndex({ isFeatured: 1 });
db.products.createIndex({ name: 'text', description: 'text' });

db.orders.createIndex({ user: 1 });
db.orders.createIndex({ status: 1 });
db.orders.createIndex({ createdAt: -1 });

db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ role: 1 });

// Check existing indexes
db.products.getIndexes();
db.orders.getIndexes();
db.users.getIndexes();

// ==============================================
// SAMPLE DATA UPDATES
// ==============================================

// Update product stock
db.products.updateOne(
  { name: 'Wireless Bluetooth Headphones' },
  { $inc: { stock: -5 } }
);

// Add review to a product
db.products.updateOne(
  { name: 'Cotton Casual T-Shirt' },
  {
    $push: {
      reviews: {
        user: ObjectId('USER_ID_HERE'),
        rating: 5,
        comment: 'Excellent quality!',
        createdAt: new Date()
      }
    }
  }
);

// Update order status
db.orders.updateOne(
  { orderNumber: 'ORD-12345678-001' },
  {
    $set: { status: 'shipped' },
    $push: {
      history: {
        status: 'shipped',
        date: new Date(),
        note: 'Order has been shipped'
      }
    }
  }
);

// ==============================================
// CLEANUP OPERATIONS
// ==============================================

// Remove inactive products older than 1 year
db.products.deleteMany({
  isActive: false,
  updatedAt: {
    $lt: new Date(new Date().setFullYear(new Date().getFullYear() - 1))
  }
});

// Remove unverified users older than 30 days
db.users.deleteMany({
  isEmailVerified: false,
  createdAt: {
    $lt: new Date(new Date().setDate(new Date().getDate() - 30))
  }
});

// ==============================================
// BACKUP AND RESTORE PREPARATION
// ==============================================

// Export collections (run these in terminal)
/*
mongodump --db cherishindia --collection users --out backup/
mongodump --db cherishindia --collection products --out backup/
mongodump --db cherishindia --collection orders --out backup/

mongorestore --db cherishindia_backup backup/cherishindia/
*/