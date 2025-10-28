const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  products: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Ensure a user can only have one wishlist
wishlistSchema.index({ user: 1 }, { unique: true });

// Prevent duplicate products in the same wishlist
wishlistSchema.index({ user: 1, 'products.product': 1 }, { unique: true, sparse: true });

module.exports = mongoose.model('Wishlist', wishlistSchema);