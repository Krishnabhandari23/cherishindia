import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { 
  ArrowLeft, 
  CheckCircle, 
  Package, 
  Truck, 
  MapPin, 
  CreditCard, 
  Smartphone,
  Calendar,
  Clock,
  Download,
  Home
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store/store';
import { clearCart } from '@/store/cartSlice';
import { apiService } from '@/utils/api';
import { toast } from 'sonner';

interface CheckoutProps {
  onNavigate: (page: string) => void;
}

interface OrderSuccessData {
  orderNumber: string;
  orderId: string;
  estimatedDelivery: string;
  total: number;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
}

export default function Checkout({ onNavigate }: CheckoutProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { items, total } = useSelector((state: RootState) => state.cart);
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [orderData, setOrderData] = useState<OrderSuccessData | null>(null);
  
  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    phone: '',
    email: user?.email || '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India',
    landmark: '',
    paymentMethod: 'cod',
    customerNotes: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.fullName) newErrors.fullName = 'Full name is required';
    if (!formData.phone) newErrors.phone = 'Phone number is required';
    if (!formData.street) newErrors.street = 'Street address is required';
    if (!formData.city) newErrors.city = 'City is required';
    if (!formData.state) newErrors.state = 'State is required';
    if (!formData.zipCode) newErrors.zipCode = 'ZIP code is required';
    if (!formData.paymentMethod) newErrors.paymentMethod = 'Payment method is required';
    
    if (formData.phone && !/^[+]?[\d\s-()]{10,}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    
    if (formData.zipCode && !/^\d{6}$/.test(formData.zipCode)) {
      newErrors.zipCode = 'Please enter a valid 6-digit ZIP code';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const calculateTotals = () => {
    const subtotal = total;
    const tax = Math.round(subtotal * 0.18 * 100) / 100; // 18% GST
    const shipping = subtotal > 500 ? 0 : 50; // Free shipping above ₹500
    const finalTotal = subtotal + tax + shipping;
    
    return { subtotal, tax, shipping, total: finalTotal };
  };

  const handlePlaceOrder = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to place an order');
      onNavigate('login');
      return;
    }

    if (!validateForm()) {
      toast.error('Please fill all required fields correctly');
      return;
    }

    setIsLoading(true);

    try {
      const orderItems = items.map(item => ({
        productId: item.id,
        quantity: item.quantity
      }));

      const shippingAddress = {
        fullName: formData.fullName,
        phone: formData.phone,
        email: formData.email,
        street: formData.street,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        country: formData.country,
        landmark: formData.landmark
      };

      const orderPayload = {
        items: orderItems,
        shippingAddress,
        paymentMethod: formData.paymentMethod,
        notes: {
          customerNotes: formData.customerNotes
        }
      };

      const response = await apiService.createOrder(orderPayload);
      
      if (response.success) {
        const order = response.data;
        
        // Calculate estimated delivery (7 days from now)
        const estimatedDate = new Date();
        estimatedDate.setDate(estimatedDate.getDate() + 7);
        
        setOrderData({
          orderNumber: order.orderNumber,
          orderId: order._id,
          estimatedDelivery: estimatedDate.toLocaleDateString('en-IN', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }),
          total: order.total,
          items: order.items.map((item: any) => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price
          }))
        });
        
        dispatch(clearCart());
        setShowSuccessModal(true);
        toast.success('Order placed successfully!');
      }
    } catch (error: any) {
      console.error('Order placement error:', error);
      toast.error(error.message || 'Failed to place order. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const totals = calculateTotals();

  if (items.length === 0) {
    onNavigate('cart');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Button
            variant="ghost"
            onClick={() => onNavigate('cart')}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Cart
          </Button>
          <h1 className="text-3xl font-bold">Checkout</h1>
          <p className="text-gray-600">Complete your order</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Address */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MapPin className="mr-2 h-5 w-5" />
                    Delivery Address
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fullName">Full Name *</Label>
                      <Input
                        id="fullName"
                        value={formData.fullName}
                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                        className={errors.fullName ? 'border-red-500' : ''}
                      />
                      {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className={errors.phone ? 'border-red-500' : ''}
                      />
                      {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email (Optional)</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="street">Street Address *</Label>
                    <Input
                      id="street"
                      value={formData.street}
                      onChange={(e) => handleInputChange('street', e.target.value)}
                      className={errors.street ? 'border-red-500' : ''}
                    />
                    {errors.street && <p className="text-red-500 text-sm mt-1">{errors.street}</p>}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        className={errors.city ? 'border-red-500' : ''}
                      />
                      {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                    </div>
                    <div>
                      <Label htmlFor="state">State *</Label>
                      <Input
                        id="state"
                        value={formData.state}
                        onChange={(e) => handleInputChange('state', e.target.value)}
                        className={errors.state ? 'border-red-500' : ''}
                      />
                      {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
                    </div>
                    <div>
                      <Label htmlFor="zipCode">ZIP Code *</Label>
                      <Input
                        id="zipCode"
                        value={formData.zipCode}
                        onChange={(e) => handleInputChange('zipCode', e.target.value)}
                        className={errors.zipCode ? 'border-red-500' : ''}
                      />
                      {errors.zipCode && <p className="text-red-500 text-sm mt-1">{errors.zipCode}</p>}
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="landmark">Landmark (Optional)</Label>
                    <Input
                      id="landmark"
                      value={formData.landmark}
                      onChange={(e) => handleInputChange('landmark', e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Payment Method */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard className="mr-2 h-5 w-5" />
                    Payment Method
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Select
                    value={formData.paymentMethod}
                    onValueChange={(value) => handleInputChange('paymentMethod', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cod">💰 Cash on Delivery</SelectItem>
                      <SelectItem value="card">💳 Credit/Debit Card</SelectItem>
                      <SelectItem value="upi">📱 UPI</SelectItem>
                      <SelectItem value="netbanking">🏦 Net Banking</SelectItem>
                      <SelectItem value="wallet">📱 Wallet</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.paymentMethod && <p className="text-red-500 text-sm mt-1">{errors.paymentMethod}</p>}
                </CardContent>
              </Card>
            </motion.div>

            {/* Order Notes */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Order Notes (Optional)</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Any special instructions for your order..."
                    value={formData.customerNotes}
                    onChange={(e) => handleInputChange('customerNotes', e.target.value)}
                    rows={3}
                  />
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="sticky top-8"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Order Items */}
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div key={item.id} className="flex justify-between items-center">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{item.name}</p>
                          <p className="text-gray-500 text-xs">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-semibold">₹{(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                  
                  <Separator />
                  
                  {/* Pricing Breakdown */}
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal ({items.length} items)</span>
                      <span>₹{totals.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>GST (18%)</span>
                      <span>₹{totals.tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span className={totals.shipping === 0 ? 'text-green-600' : ''}>
                        {totals.shipping === 0 ? 'Free' : `₹${totals.shipping.toFixed(2)}`}
                      </span>
                    </div>
                    {totals.subtotal <= 500 && (
                      <p className="text-xs text-gray-500">
                        Add ₹{(501 - totals.subtotal).toFixed(2)} more for free shipping
                      </p>
                    )}
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>₹{totals.total.toFixed(2)}</span>
                  </div>
                  
                  <Button
                    className="w-full"
                    size="lg"
                    onClick={handlePlaceOrder}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Placing Order...' : `Place Order - ₹${totals.total.toFixed(2)}`}
                  </Button>
                  
                  <div className="text-xs text-gray-500 space-y-1">
                    <p className="flex items-center">
                      <Truck className="mr-1 h-3 w-3" />
                      Free delivery in 5-7 business days
                    </p>
                    <p className="flex items-center">
                      <Package className="mr-1 h-3 w-3" />
                      Easy returns within 30 days
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Order Success Modal */}
      <AnimatePresence>
        {showSuccessModal && orderData && (
          <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
            <DialogContent className="max-w-2xl p-0 overflow-hidden">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-gradient-to-br from-green-50 to-blue-50"
              >
                {/* Header with Success Animation */}
                <div className="relative overflow-hidden bg-gradient-to-r from-green-500 to-green-600 text-white p-8 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="mb-4"
                  >
                    <CheckCircle className="h-20 w-20 mx-auto" />
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <h2 className="text-3xl font-bold mb-2">Order Placed Successfully!</h2>
                    <p className="text-green-100">Thank you for shopping with Cherish India</p>
                  </motion.div>
                  
                  {/* Floating decorative elements */}
                  <div className="absolute top-4 left-4 opacity-20">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    >
                      ✨
                    </motion.div>
                  </div>
                  <div className="absolute top-8 right-8 opacity-20">
                    <motion.div
                      animate={{ rotate: -360 }}
                      transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    >
                      🎉
                    </motion.div>
                  </div>
                </div>

                {/* Order Details */}
                <div className="p-8 space-y-6">
                  {/* Order Number and Details */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="bg-white rounded-lg p-6 border-2 border-green-100"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Order Number</p>
                        <p className="text-xl font-bold text-green-600">{orderData.orderNumber}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Total Amount</p>
                        <p className="text-xl font-bold">₹{orderData.total.toFixed(2)}</p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Delivery Information */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="bg-blue-50 rounded-lg p-6"
                  >
                    <div className="flex items-center mb-4">
                      <Truck className="h-6 w-6 text-blue-600 mr-3" />
                      <h3 className="text-lg font-semibold text-blue-800">Delivery Information</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-blue-600 mr-2" />
                        <div>
                          <p className="text-gray-600">Estimated Delivery</p>
                          <p className="font-semibold text-blue-800">{orderData.estimatedDelivery}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 text-blue-600 mr-2" />
                        <div>
                          <p className="text-gray-600">Delivery Time</p>
                          <p className="font-semibold text-blue-800">10 AM - 6 PM</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Next Steps */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 }}
                    className="bg-gray-50 rounded-lg p-6"
                  >
                    <h3 className="text-lg font-semibold mb-4">What happens next?</h3>
                    <div className="space-y-3">
                      <div className="flex items-start">
                        <div className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">
                          1
                        </div>
                        <div>
                          <p className="font-semibold">Order Confirmation</p>
                          <p className="text-sm text-gray-600">We'll send you a confirmation email shortly</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">
                          2
                        </div>
                        <div>
                          <p className="font-semibold">Order Processing</p>
                          <p className="text-sm text-gray-600">Your order will be prepared for shipment</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="bg-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">
                          3
                        </div>
                        <div>
                          <p className="font-semibold">Delivery Tracking</p>
                          <p className="text-sm text-gray-600">Track your package from our store to your door</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Action Buttons */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2 }}
                    className="flex flex-col sm:flex-row gap-4"
                  >
                    <Button
                      onClick={() => {
                        setShowSuccessModal(false);
                        onNavigate('home');
                      }}
                      className="flex-1"
                      size="lg"
                    >
                      <Home className="mr-2 h-4 w-4" />
                      Continue Shopping
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        // In a real app, this would download/view order details
                        toast.info('Order details feature coming soon!');
                      }}
                      className="flex-1"
                      size="lg"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download Invoice
                    </Button>
                  </motion.div>

                  {/* Support Info */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.4 }}
                    className="text-center text-sm text-gray-600 pt-4 border-t"
                  >
                    <p>Need help? Contact us at <strong>support@cherishindia.com</strong> or call <strong>1800-123-4567</strong></p>
                  </motion.div>
                </div>
              </motion.div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </div>
  );
}