const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required']
  },
  orderNumber: {
    type: String,
    unique: true
    // removed required: true since it's auto-generated
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    name: {
      type: String,
      required: true
    },
    image: String,
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Quantity must be at least 1']
    },
    price: {
      type: Number,
      required: true,
      min: [0, 'Price cannot be negative']
    },
    totalPrice: {
      type: Number,
      required: true,
      min: [0, 'Total price cannot be negative']
    }
  }],
  subtotal: {
    type: Number,
    required: true,
    min: [0, 'Subtotal cannot be negative']
  },
  tax: {
    type: Number,
    default: 0,
    min: [0, 'Tax cannot be negative']
  },
  shipping: {
    type: Number,
    default: 0,
    min: [0, 'Shipping cost cannot be negative']
  },
  discount: {
    type: Number,
    default: 0,
    min: [0, 'Discount cannot be negative']
  },
  total: {
    type: Number,
    required: true,
    min: [0, 'Total cannot be negative']
  },
  currency: {
    type: String,
    default: 'INR',
    enum: ['INR', 'USD', 'EUR']
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['card', 'upi', 'netbanking', 'wallet', 'cod'],
    required: true
  },
  paymentDetails: {
    transactionId: String,
    paymentGateway: String,
    paymentDate: Date
  },
  shippingAddress: {
    fullName: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    email: String,
    street: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    zipCode: {
      type: String,
      required: true
    },
    country: {
      type: String,
      default: 'India'
    },
    landmark: String
  },
  billingAddress: {
    fullName: String,
    phone: String,
    email: String,
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: {
      type: String,
      default: 'India'
    }
  },
  tracking: {
    trackingNumber: String,
    carrier: String,
    trackingUrl: String,
    estimatedDelivery: Date,
    shippedDate: Date,
    deliveredDate: Date
  },
  notes: {
    customerNotes: String,
    adminNotes: String
  },
  couponCode: String,
  refundDetails: {
    refundAmount: Number,
    refundDate: Date,
    refundReason: String,
    refundMethod: String
  },
  history: [{
    status: String,
    date: {
      type: Date,
      default: Date.now
    },
    note: String,
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for order age in days
orderSchema.virtual('ageInDays').get(function() {
  const now = new Date();
  const orderDate = new Date(this.createdAt);
  return Math.floor((now - orderDate) / (1000 * 60 * 60 * 24));
});

// Virtual for total items count
orderSchema.virtual('totalItems').get(function() {
  return this.items.reduce((total, item) => total + item.quantity, 0);
});

// Indexes for better query performance
orderSchema.index({ user: 1 });
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ paymentStatus: 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ 'tracking.trackingNumber': 1 });

// Generate order number before saving
orderSchema.pre('save', function(next) {
  if (!this.orderNumber) {
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    this.orderNumber = `ORD-${timestamp.slice(-8)}-${random}`;
  }
  next();
});

// Add status change to history
orderSchema.methods.addStatusHistory = function(status, note, updatedBy) {
  this.history.push({
    status,
    note,
    updatedBy,
    date: new Date()
  });
  this.status = status;
  return this.save();
};

// Calculate total based on items
orderSchema.methods.calculateTotal = function() {
  this.subtotal = this.items.reduce((sum, item) => sum + item.totalPrice, 0);
  this.total = this.subtotal + this.tax + this.shipping - this.discount;
  return this.total;
};

// Static method to find orders by user
orderSchema.statics.findByUser = function(userId) {
  return this.find({ user: userId }).populate('items.product', 'name image').sort({ createdAt: -1 });
};

// Static method to find orders by status
orderSchema.statics.findByStatus = function(status) {
  return this.find({ status }).populate('user', 'name email').populate('items.product', 'name image');
};

module.exports = mongoose.model('Order', orderSchema);
