import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { X, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { removeFromCart, updateQuantity, toggleCart } from '@/store/cartSlice';

interface CartSidebarProps {
  onNavigate: (page: string) => void;
}

export default function CartSidebar({ onNavigate }: CartSidebarProps) {
  const dispatch = useDispatch();
  const { items, total, isOpen } = useSelector((state: RootState) => state.cart);

  const handleUpdateQuantity = (id: string, newQuantity: number) => {
    dispatch(updateQuantity({ id, quantity: newQuantity }));
  };

  const handleRemoveItem = (id: string) => {
    dispatch(removeFromCart(id));
  };

  const handleCheckout = () => {
    dispatch(toggleCart());
    onNavigate('checkout');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => dispatch(toggleCart())}
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-bold">Shopping Cart</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => dispatch(toggleCart())}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="text-center py-16">
                  <ShoppingBag className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500 mb-4">Your cart is empty</p>
                  <Button onClick={() => {
                    dispatch(toggleCart());
                    onNavigate('products');
                  }}>
                    Continue Shopping
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="flex items-center space-x-4 p-4 border rounded-lg"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium text-sm line-clamp-2">{item.name}</h3>
                        <p className="text-sm text-gray-600">₹{item.price}</p>
                        <div className="flex items-center space-x-2 mt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                            className="h-6 w-6 p-0"
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="text-sm w-8 text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                            className="h-6 w-6 p-0"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveItem(item.id)}
                            className="h-6 w-6 p-0 text-red-500 hover:text-red-700 ml-2"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold">Total:</span>
                  <span className="text-lg font-bold">₹{total.toFixed(2)}</span>
                </div>
                <Button
                  className="w-full"
                  size="lg"
                  onClick={handleCheckout}
                >
                  Checkout
                </Button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}