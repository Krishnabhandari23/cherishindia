import { useState } from 'react';
import { Search, ShoppingCart, User, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store/store';
import { toggleCart } from '@/store/cartSlice';
import { setFilters } from '@/store/productSlice';
import { logoutUser } from '@/store/authSlice';
import { motion, AnimatePresence } from 'framer-motion';

interface NavbarProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

export default function Navbar({ onNavigate, currentPage }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const searchQuery = useSelector((state: RootState) => state.products.filters.search);

  const cartItemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setFilters({ search: e.target.value }));
  };

  const handleLogout = async () => {
    await dispatch(logoutUser());
    onNavigate('home');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex-shrink-0 cursor-pointer"
            onClick={() => onNavigate('home')}
          >
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              ShopZone
            </h1>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Button
              variant={currentPage === 'home' ? 'default' : 'ghost'}
              onClick={() => onNavigate('home')}
            >
              Home
            </Button>
            <Button
              variant={currentPage === 'products' ? 'default' : 'ghost'}
              onClick={() => onNavigate('products')}
            >
              Products
            </Button>
            {user?.role === 'admin' && (
              <Button
                variant={currentPage === 'admin' ? 'default' : 'ghost'}
                onClick={() => onNavigate('admin')}
              >
                Admin
              </Button>
            )}
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={handleSearch}
                className="pl-10 pr-4 w-full"
              />
            </div>
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Cart */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                onClick={() => dispatch(toggleCart())}
              >
                <ShoppingCart className="h-5 w-5" />
                {cartItemsCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center text-xs">
                    {cartItemsCount}
                  </Badge>
                )}
              </Button>
            </motion.div>

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="hidden md:flex items-center space-x-2">
                <span className="text-sm text-gray-700">Hi, {user?.name}</span>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onNavigate('login')}
              >
                <User className="h-5 w-5" />
              </Button>
            )}

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={handleSearch}
              className="pl-10 pr-4 w-full"
            />
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t bg-white"
          >
            <div className="px-4 py-2 space-y-2">
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => {
                  onNavigate('home');
                  setIsMenuOpen(false);
                }}
              >
                Home
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => {
                  onNavigate('products');
                  setIsMenuOpen(false);
                }}
              >
                Products
              </Button>
              {user?.role === 'admin' && (
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => {
                    onNavigate('admin');
                    setIsMenuOpen(false);
                  }}
                >
                  Admin
                </Button>
              )}
              {!isAuthenticated && (
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => {
                    onNavigate('login');
                    setIsMenuOpen(false);
                  }}
                >
                  Login
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}