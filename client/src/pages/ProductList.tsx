import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Star, ShoppingCart, Filter, Heart } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store/store';
import { addToCart } from '@/store/cartSlice';
import { setFilters } from '@/store/productSlice';
import { addToWishlist, removeFromWishlist, fetchWishlist, addToWishlistLocal, removeFromWishlistLocal } from '@/store/wishlistSlice';
import { CATEGORIES } from '@/utils/constants';
import { toast } from 'sonner';

// Define Product type to match the productSlice
type Product = {
  _id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  category: string;
  image: string;
  stock: number;
  ratings: {
    average: number;
    count: number;
  };
  isActive: boolean;
  isFeatured: boolean;
};

interface ProductListProps {
  onNavigate: (page: string, productId?: string) => void;
}

export default function ProductList({ onNavigate }: ProductListProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { products, filters } = useSelector((state: RootState) => state.products);
  const { products: wishlistProducts } = useSelector((state: RootState) => state.wishlist);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [sortBy, setSortBy] = useState('name');

  const handleAddToCart = (product: Product) => {
    dispatch(addToCart({
      id: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
    }));
    toast.success(`${product.name} added to cart!`);
  };

  const isInWishlist = (productId: string) => {
    return wishlistProducts.some(item => item.product._id === productId);
  };

  const handleWishlistToggle = async (product: Product) => {
    if (!isAuthenticated) {
      onNavigate('login');
      return;
    }

    try {
      if (isInWishlist(product._id)) {
        const result = await dispatch(removeFromWishlist(product._id));
        // If API failed, use local action
        if (removeFromWishlist.rejected.match(result)) {
          dispatch(removeFromWishlistLocal(product._id));
        }
        toast.success(`${product.name} removed from wishlist`);
      } else {
        const result = await dispatch(addToWishlist(product._id));
        // If API failed, use local action
        if (addToWishlist.rejected.match(result)) {
          dispatch(addToWishlistLocal(product));
        }
        toast.success(`${product.name} added to wishlist`);
      }
    } catch (error) {
      console.error('Wishlist error:', error);
      // Fallback to local actions
      if (isInWishlist(product._id)) {
        dispatch(removeFromWishlistLocal(product._id));
        toast.success(`${product.name} removed from wishlist`);
      } else {
        dispatch(addToWishlistLocal(product));
        toast.success(`${product.name} added to wishlist`);
      }
    }
  };

  const handleCategoryChange = (category: string) => {
    dispatch(setFilters({ category }));
  };

  // Filter products based on current filters
  const filteredProducts = products.filter(product => {
    if (filters.category && filters.category !== 'All') {
      return product.category === filters.category;
    }
    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.ratings.average - a.ratings.average;
      default:
        return a.name.localeCompare(b.name);
    }
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-4">Products</h1>
          
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <span className="text-sm font-medium">Category:</span>
              </div>
              <Select value={filters.category || 'All'} onValueChange={handleCategoryChange}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Sort by:</span>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Rating</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </motion.div>

        {/* Products Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={(filters.category || 'All') + sortBy}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {sortedProducts.map((product) => (
              <motion.div
                key={product._id}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className="group"
              >
                <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300 h-full">
                  <div 
                    className="relative cursor-pointer"
                    onClick={() => onNavigate('product-detail', product._id)}
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {product.discount > 0 && (
                      <Badge className="absolute top-2 left-2 bg-red-500">
                        -{product.discount}%
                      </Badge>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute top-2 right-2 h-8 w-8 p-0 bg-white/80 hover:bg-white"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleWishlistToggle(product);
                      }}
                    >
                      <Heart 
                        className={`h-4 w-4 ${
                          isInWishlist(product._id) 
                            ? 'fill-red-500 text-red-500' 
                            : 'text-gray-600'
                        }`} 
                      />
                    </Button>
                    {product.stock === 0 && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <Badge variant="destructive">Out of Stock</Badge>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4 flex flex-col h-full">
                    <h3 
                      className="font-semibold mb-2 line-clamp-2 cursor-pointer hover:text-blue-600"
                      onClick={() => onNavigate('product-detail', product._id)}
                    >
                      {product.name}
                    </h3>
                    <div className="flex items-center mb-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(product.ratings.average)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600 ml-2">
                        {product.ratings.average} ({product.ratings.count})
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-grow">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-bold">
                          ₹{product.price != null ? product.price : 'N/A'}
                        </span>
                        {product.originalPrice && product.originalPrice > (product.price || 0) && (
                          <span className="text-sm text-gray-500 line-through">
                            ₹{product.originalPrice}
                          </span>
                        )}
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleAddToCart(product)}
                        disabled={product.stock === 0}
                        className="shrink-0"
                      >
                        <ShoppingCart className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* No products found */}
        {sortedProducts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <h3 className="text-xl font-semibold mb-2">No products found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your search or filter criteria</p>
            <Button onClick={() => dispatch(setFilters({ category: 'All' }))}>
              Show All Products
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}