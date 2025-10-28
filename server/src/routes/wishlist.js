const express = require('express');
const router = express.Router();
const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');
const { auth } = require('../middleware/auth');

// Get user's wishlist
router.get('/', auth, async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user.id })
      .populate({
        path: 'products.product',
        model: 'Product',
        select: 'name description price originalPrice discount category image ratings stock isFeatured'
      });

    if (!wishlist) {
      return res.json({
        success: true,
        wishlist: {
          products: []
        }
      });
    }

    // Filter out any null products (in case product was deleted)
    const validProducts = wishlist.products.filter(item => item.product !== null);

    res.json({
      success: true,
      wishlist: {
        ...wishlist.toObject(),
        products: validProducts
      }
    });
  } catch (error) {
    console.error('Get wishlist error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch wishlist'
    });
  }
});

// Add product to wishlist
router.post('/add/:productId', auth, async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user.id;

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Find or create wishlist
    let wishlist = await Wishlist.findOne({ user: userId });
    
    if (!wishlist) {
      wishlist = new Wishlist({
        user: userId,
        products: []
      });
    }

    // Check if product is already in wishlist
    const existingProduct = wishlist.products.find(
      item => item.product.toString() === productId
    );

    if (existingProduct) {
      return res.status(400).json({
        success: false,
        message: 'Product already in wishlist'
      });
    }

    // Add product to wishlist
    wishlist.products.push({
      product: productId,
      addedAt: new Date()
    });

    await wishlist.save();

    // Populate the response
    await wishlist.populate({
      path: 'products.product',
      model: 'Product',
      select: 'name description price originalPrice discount category image ratings stock isFeatured'
    });

    res.json({
      success: true,
      message: 'Product added to wishlist',
      wishlist
    });
  } catch (error) {
    console.error('Add to wishlist error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add product to wishlist'
    });
  }
});

// Remove product from wishlist
router.delete('/remove/:productId', auth, async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user.id;

    const wishlist = await Wishlist.findOne({ user: userId });
    
    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: 'Wishlist not found'
      });
    }

    // Remove product from wishlist
    wishlist.products = wishlist.products.filter(
      item => item.product.toString() !== productId
    );

    await wishlist.save();

    // Populate the response
    await wishlist.populate({
      path: 'products.product',
      model: 'Product',
      select: 'name description price originalPrice discount category image ratings stock isFeatured'
    });

    res.json({
      success: true,
      message: 'Product removed from wishlist',
      wishlist
    });
  } catch (error) {
    console.error('Remove from wishlist error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove product from wishlist'
    });
  }
});

// Clear entire wishlist
router.delete('/clear', auth, async (req, res) => {
  try {
    const userId = req.user.id;

    await Wishlist.findOneAndUpdate(
      { user: userId },
      { products: [] },
      { new: true }
    );

    res.json({
      success: true,
      message: 'Wishlist cleared successfully'
    });
  } catch (error) {
    console.error('Clear wishlist error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to clear wishlist'
    });
  }
});

module.exports = router;