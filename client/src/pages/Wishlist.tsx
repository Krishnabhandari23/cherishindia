import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { fetchWishlist, removeFromWishlist, removeFromWishlistLocal } from '../store/wishlistSlice';
import { addToCart, showCart } from '../store/cartSlice';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Heart, ShoppingCart, Star, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface WishlistProps {
  onNavigate: (page: string, productId?: string) => void;
}

const Wishlist: React.FC<WishlistProps> = ({ onNavigate }) => {
  const dispatch = useDispatch();
  const { products, isLoading, error } = useSelector((state: RootState) => state.wishlist);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchWishlist() as any);
    }
  }, [dispatch, isAuthenticated]);

  const handleRemoveFromWishlist = (productId: string) => {
    if (isAuthenticated) {
      dispatch(removeFromWishlist(productId) as any);
    } else {
      dispatch(removeFromWishlistLocal(productId));
    }
    toast.success('Removed from wishlist');
  };

  const handleAddToCart = (product: any) => {
    dispatch(addToCart({
      id: product._id,
      name: product.name,
      price: product.price,
      image: product.image
    }));
    
    // Show cart automatically
    dispatch(showCart());
    
    // Remove from wishlist when added to cart
    handleRemoveFromWishlist(product._id);
    
    toast.success(`${product.name} added to cart!`);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">My Wishlist</h1>
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <p className="text-red-600">Error loading wishlist: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Wishlist</h1>
        <p className="text-gray-600">
          {products.length === 0 
            ? "Your wishlist is empty. Start adding products you love!" 
            : `You have ${products.length} ${products.length === 1 ? 'item' : 'items'} in your wishlist`
          }
        </p>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-16">
          <Heart className="h-24 w-24 text-gray-300 mx-auto mb-6" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your wishlist is empty</h2>
          <p className="text-gray-600 mb-8">Discover amazing products and add them to your wishlist</p>
          <Button 
            className="bg-pink-600 hover:bg-pink-700"
            onClick={() => onNavigate('home')}
          >
            Start Shopping
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((item, index) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="h-full flex flex-col hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="p-0">
                  <div className="relative">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    {item.product.discount && (
                      <Badge 
                        variant="destructive" 
                        className="absolute top-2 left-2"
                      >
                        -{item.product.discount}%
                      </Badge>
                    )}
                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute top-2 right-2 bg-white hover:bg-red-50"
                      onClick={() => handleRemoveFromWishlist(item.product._id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </CardHeader>
                
                <CardContent className="flex-1 p-4">
                  <CardTitle className="text-lg mb-2 line-clamp-2">
                    {item.product.name}
                  </CardTitle>
                  
                  <div className="flex items-center mb-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(item.product.ratings.average)
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                      <span className="ml-1 text-sm text-gray-600">
                        ({item.product.ratings.count})
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl font-bold text-gray-900">
                      ₹{item.product.price}
                    </span>
                    {item.product.originalPrice && (
                      <span className="text-sm text-gray-500 line-through">
                        ₹{item.product.originalPrice}
                      </span>
                    )}
                  </div>
                  
                  <Badge variant="secondary" className="mb-2">
                    {item.product.category}
                  </Badge>
                  
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {item.product.description}
                  </p>
                  
                  <p className="text-xs text-gray-500 mt-2">
                    Added {new Date(item.addedAt).toLocaleDateString()}
                  </p>
                </CardContent>
                
                <CardFooter className="p-4 pt-0 flex gap-2">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => onNavigate('product-detail', item.product._id)}
                  >
                    View Details
                  </Button>
                  <Button
                    onClick={() => handleAddToCart(item.product)}
                    className="flex-1 bg-pink-600 hover:bg-pink-700"
                    disabled={item.product.stock === 0}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    {item.product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;