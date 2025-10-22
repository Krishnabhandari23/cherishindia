const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [100, 'Product name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price cannot be negative'],
    get: function(value) {
      return Math.round(value * 100) / 100; // Round to 2 decimal places
    }
  },
  originalPrice: {
    type: Number,
    min: [0, 'Original price cannot be negative']
  },
  discount: {
    type: Number,
    min: [0, 'Discount cannot be negative'],
    max: [100, 'Discount cannot exceed 100%'],
    default: 0
  },
  category: {
    type: String,
    required: [true, 'Product category is required'],
    enum: ['Electronics', 'Clothing', 'Home & Garden', 'Sports', 'Books', 'Toys', 'Beauty', 'Health', 'Automotive', 'Others']
  },
  subcategory: {
    type: String,
    trim: true
  },
  brand: {
    type: String,
    trim: true
  },
  image: {
    type: String,
    required: [true, 'Product image is required'],
    default: 'https://via.placeholder.com/400x400?text=Product'
  },
  images: [{
    type: String
  }],
  stock: {
    type: Number,
    required: [true, 'Stock quantity is required'],
    min: [0, 'Stock cannot be negative'],
    default: 0
  },
  sku: {
    type: String,
    unique: true,
    sparse: true
  },
  weight: {
    type: Number,
    min: [0, 'Weight cannot be negative']
  },
  dimensions: {
    length: Number,
    width: Number,
    height: Number
  },
  ratings: {
    average: {
      type: Number,
      default: 0,
      min: [0, 'Rating cannot be negative'],
      max: [5, 'Rating cannot exceed 5']
    },
    count: {
      type: Number,
      default: 0,
      min: [0, 'Rating count cannot be negative']
    }
  },
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      required: true,
      maxlength: [500, 'Review comment cannot exceed 500 characters']
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  tags: [{
    type: String,
    trim: true
  }],
  seoTitle: String,
  seoDescription: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for availability status
productSchema.virtual('isAvailable').get(function() {
  return this.stock > 0 && this.isActive;
});

// Virtual for discounted price
productSchema.virtual('discountedPrice').get(function() {
  if (this.discount > 0 && this.originalPrice) {
    return Math.round((this.originalPrice * (100 - this.discount) / 100) * 100) / 100;
  }
  return this.price;
});

// Virtual for savings amount
productSchema.virtual('savings').get(function() {
  if (this.discount > 0 && this.originalPrice) {
    return Math.round((this.originalPrice - this.discountedPrice) * 100) / 100;
  }
  return 0;
});

// Indexes for better query performance
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ category: 1 });
productSchema.index({ price: 1 });
productSchema.index({ 'ratings.average': -1 });
productSchema.index({ isActive: 1 });
productSchema.index({ isFeatured: 1 });
productSchema.index({ createdAt: -1 });

// Generate SKU before saving if not provided
productSchema.pre('save', function(next) {
  if (!this.sku) {
    const prefix = this.category.substring(0, 3).toUpperCase();
    const timestamp = Date.now().toString().slice(-6);
    this.sku = `${prefix}-${timestamp}`;
  }
  next();
});

// Update average rating when reviews are modified
productSchema.methods.updateRating = function() {
  if (this.reviews.length > 0) {
    const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
    this.ratings.average = Math.round((totalRating / this.reviews.length) * 10) / 10;
    this.ratings.count = this.reviews.length;
  } else {
    this.ratings.average = 0;
    this.ratings.count = 0;
  }
  return this.save();
};

// Static method to find products by category
productSchema.statics.findByCategory = function(category) {
  return this.find({ category, isActive: true });
};

// Static method to find featured products
productSchema.statics.findFeatured = function(limit = 10) {
  return this.find({ isFeatured: true, isActive: true }).limit(limit);
};

module.exports = mongoose.model('Product', productSchema);
