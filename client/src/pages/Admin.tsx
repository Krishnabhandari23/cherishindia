import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store/store';
import { fetchProducts } from '@/store/productSlice';
import apiService from '@/utils/api';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Package, Users, ShoppingCart, TrendingUp, Edit, Trash2, Plus, Eye, Clock, CheckCircle, XCircle, Truck, RefreshCcw, Filter, Search } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

// Product type matching the store
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

interface AdminProps {
  onNavigate: (page: string) => void;
}

interface ProductForm {
  name: string;
  price: string;
  originalPrice: string;
  category: string;
  image: string;
  description: string;
  stock: number;
}

export default function Admin({ onNavigate }: AdminProps) {
  const dispatch = useDispatch<AppDispatch>();
  const products = useSelector((state: RootState) => state.products.products);
  const { user } = useSelector((state: RootState) => state.auth);
  const { toast } = useToast();
  
  // Product state
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showProductDialog, setShowProductDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [productForm, setProductForm] = useState<ProductForm>({
    name: '',
    price: '',
    originalPrice: '',
    category: '',
    image: '',
    description: '',
    stock: 1
  });

  // Orders state
  const [orders, setOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [showOrderDialog, setShowOrderDialog] = useState(false);
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [updatingOrderStatus, setUpdatingOrderStatus] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchProducts({}));
    fetchOrders();
  }, [dispatch]);

  // Fetch orders function
  const fetchOrders = async () => {
    setOrdersLoading(true);
    try {
      const response = await apiService.getAllOrders({ limit: 50 });
      if (response.success) {
        // The API returns { success: true, data: { orders: [...], pagination: {...} } }
        const ordersData = response.data?.orders || response.data || [];
        // Ensure we always set an array
        setOrders(Array.isArray(ordersData) ? ordersData : []);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      // Ensure orders is set to empty array on error
      setOrders([]);
      toast({
        title: 'Error',
        description: 'Failed to fetch orders',
        variant: 'destructive'
      });
    } finally {
      setOrdersLoading(false);
    }
  };

  // Redirect if not admin
  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-4">You need admin privileges to access this page.</p>
          <Button onClick={() => onNavigate('home')}>Go Home</Button>
        </div>
      </div>
    );
  }

  const handleSubmitProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Basic validation
    if (!productForm.name.trim() || !productForm.price || !productForm.category.trim() || !productForm.description.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    if (parseFloat(productForm.price) <= 0) {
      toast({
        title: "Validation Error", 
        description: "Price must be greater than 0",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }
    
    const productData = {
      name: productForm.name,
      price: parseFloat(productForm.price),
      originalPrice: parseFloat(productForm.originalPrice || productForm.price),
      category: productForm.category,
      image: productForm.image || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400',
      description: productForm.description,
      stock: productForm.stock,
      discount: productForm.originalPrice ? 
        Math.round(((parseFloat(productForm.originalPrice) - parseFloat(productForm.price)) / parseFloat(productForm.originalPrice)) * 100) : 0,
      isActive: true,
      isFeatured: false
    };

    try {
      if (editingProduct) {
        await apiService.updateProduct(editingProduct._id, productData);
        toast({
          title: "Success",
          description: "Product updated successfully!",
        });
      } else {
        await apiService.createProduct(productData);
        toast({
          title: "Success", 
          description: "Product created successfully!",
        });
      }
      
      // Refresh the products list
      dispatch(fetchProducts({}));
    } catch (error: any) {
      console.error('Error saving product:', error);
      toast({
        title: "Error",
        description: error.message || 'Failed to save product',
        variant: "destructive",
      });
      setIsSubmitting(false);
      return; // Don't close the dialog on error
    }

    setIsSubmitting(false);

    // Reset form
    setProductForm({
      name: '',
      price: '',
      originalPrice: '',
      category: '',
      image: '',
      description: '',
      stock: 1
    });
    setShowProductDialog(false);
    setEditingProduct(null);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      price: product.price.toString(),
      originalPrice: product.originalPrice?.toString() || product.price.toString(),
      category: product.category,
      image: product.image,
      description: product.description,
      stock: product.stock
    });
    setShowProductDialog(true);
  };

  const handleDeleteProduct = async (productId: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        await apiService.deleteProduct(productId);
        toast({
          title: "Success",
          description: "Product deleted successfully!",
        });
        
        // Refresh the products list
        dispatch(fetchProducts({}));
      } catch (error: any) {
        console.error('Error deleting product:', error);
        toast({
          title: "Error",
          description: error.message || 'Failed to delete product',
          variant: "destructive",
        });
      }
    }
  };

  // Order management functions
  const handleUpdateOrderStatus = async (orderId: string, newStatus: string, note?: string) => {
    setUpdatingOrderStatus(orderId);
    try {
      await apiService.updateOrderStatus(orderId, newStatus, note);
      toast({
        title: "Success",
        description: "Order status updated successfully!",
      });
      
      // Refresh orders list
      fetchOrders();
    } catch (error: any) {
      console.error('Error updating order status:', error);
      toast({
        title: "Error",
        description: error.message || 'Failed to update order status',
        variant: "destructive",
      });
    } finally {
      setUpdatingOrderStatus(null);
    }
  };

  const handleViewOrder = (order: any) => {
    setSelectedOrder(order);
    setShowOrderDialog(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'processing': return 'bg-purple-100 text-purple-800';
      case 'shipped': return 'bg-indigo-100 text-indigo-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'refunded': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'confirmed': return <CheckCircle className="h-4 w-4" />;
      case 'processing': return <RefreshCcw className="h-4 w-4" />;
      case 'shipped': return <Truck className="h-4 w-4" />;
      case 'delivered': return <CheckCircle className="h-4 w-4" />;
      case 'cancelled': return <XCircle className="h-4 w-4" />;
      case 'refunded': return <RefreshCcw className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  // Filter orders based on status and search
  const filteredOrders = (Array.isArray(orders) ? orders : []).filter(order => {
    const matchesStatus = orderStatusFilter === 'all' || order.status === orderStatusFilter;
    const matchesSearch = orderSearchQuery === '' || 
      order.orderNumber.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
      order.user.name.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
      order.user.email.toLowerCase().includes(orderSearchQuery.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

  const stats = {
    totalProducts: products.length,
    totalUsers: 1250, // Mock data - could be fetched from API
    totalOrders: orders.length,
    revenue: orders.reduce((sum, order) => sum + (order.total || 0), 0)
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.name}</p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Products</p>
                      <p className="text-2xl font-bold">{stats.totalProducts}</p>
                    </div>
                    <Package className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Users</p>
                      <p className="text-2xl font-bold">{stats.totalUsers}</p>
                    </div>
                    <Users className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Orders</p>
                      <p className="text-2xl font-bold">{stats.totalOrders}</p>
                    </div>
                    <ShoppingCart className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Revenue</p>
                      <p className="text-2xl font-bold">${stats.revenue.toLocaleString()}</p>
                    </div>
                    <div className="text-2xl">💰</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="products">
            <div className="space-y-6">
              {/* Add Product Button */}
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Product Management</h2>
                <Button onClick={() => {
                  setEditingProduct(null);
                  setIsSubmitting(false);
                  setProductForm({
                    name: '',
                    price: '',
                    originalPrice: '',
                    category: '',
                    image: '',
                    description: '',
                    stock: 1
                  });
                  setShowProductDialog(true);
                }}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Product
                </Button>
              </div>

              {/* Products List */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <Card key={product._id}>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-48 object-cover"
                    />
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold line-clamp-2">{product.name}</h3>
                        <Badge variant={product.stock > 0 ? 'default' : 'destructive'}>
                          {product.stock > 0 ? `${product.stock} in stock` : 'Out of Stock'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{product.category}</p>
                      <p className="text-lg font-bold mb-4">₹{product.price}</p>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditProduct(product)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteProduct(product._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Order Management</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={fetchOrders}
                    disabled={ordersLoading}
                  >
                    <RefreshCcw className={`mr-2 h-4 w-4 ${ordersLoading ? 'animate-spin' : ''}`} />
                    Refresh
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="flex items-center space-x-2">
                    <Filter className="h-4 w-4 text-gray-500" />
                    <Select value={orderStatusFilter} onValueChange={setOrderStatusFilter}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Orders</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="shipped">Shipped</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                        <SelectItem value="refunded">Refunded</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center space-x-2 flex-1">
                    <Search className="h-4 w-4 text-gray-500" />
                    <Input
                      placeholder="Search by order number, customer name, or email..."
                      value={orderSearchQuery}
                      onChange={(e) => setOrderSearchQuery(e.target.value)}
                      className="max-w-md"
                    />
                  </div>
                </div>

                {/* Orders Table */}
                {ordersLoading ? (
                  <div className="text-center py-8">
                    <RefreshCcw className="h-8 w-8 mx-auto animate-spin text-gray-400 mb-4" />
                    <p className="text-gray-500">Loading orders...</p>
                  </div>
                ) : filteredOrders.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <ShoppingCart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No orders found</p>
                    <p className="text-sm">
                      {orderStatusFilter !== 'all' || orderSearchQuery !== '' 
                        ? 'Try adjusting your filters' 
                        : 'Orders will appear here when customers place them'}
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Order #</TableHead>
                          <TableHead>Customer</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Payment</TableHead>
                          <TableHead>Total</TableHead>
                          <TableHead>Items</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredOrders.map((order) => (
                          <TableRow key={order._id}>
                            <TableCell className="font-medium">
                              {order.orderNumber}
                            </TableCell>
                            <TableCell>
                              <div>
                                <div className="font-medium">{order.user?.name || 'Unknown'}</div>
                                <div className="text-sm text-gray-500">{order.user?.email || 'No email'}</div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">
                                {new Date(order.createdAt).toLocaleDateString()}
                              </div>
                              <div className="text-xs text-gray-500">
                                {new Date(order.createdAt).toLocaleTimeString()}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge className={`${getStatusColor(order.status)} flex items-center space-x-1`}>
                                {getStatusIcon(order.status)}
                                <span className="capitalize">{order.status}</span>
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">
                                <div className="capitalize">{order.paymentMethod}</div>
                                <Badge 
                                  variant={order.paymentStatus === 'completed' ? 'default' : 'secondary'}
                                  className="text-xs"
                                >
                                  {order.paymentStatus}
                                </Badge>
                              </div>
                            </TableCell>
                            <TableCell className="font-semibold">
                              ₹{order.total?.toFixed(2) || '0.00'}
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">
                                {order.items?.length || 0} item(s)
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleViewOrder(order)}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                
                                {order.status !== 'delivered' && order.status !== 'cancelled' && (
                                  <Select
                                    value={order.status}
                                    onValueChange={(newStatus) => handleUpdateOrderStatus(order._id, newStatus)}
                                    disabled={updatingOrderStatus === order._id}
                                  >
                                    <SelectTrigger className="w-[120px]">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="pending">Pending</SelectItem>
                                      <SelectItem value="confirmed">Confirmed</SelectItem>
                                      <SelectItem value="processing">Processing</SelectItem>
                                      <SelectItem value="shipped">Shipped</SelectItem>
                                      <SelectItem value="delivered">Delivered</SelectItem>
                                      <SelectItem value="cancelled">Cancelled</SelectItem>
                                    </SelectContent>
                                  </Select>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Product Form Dialog */}
        <Dialog open={showProductDialog} onOpenChange={setShowProductDialog}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmitProduct} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Product Name</Label>
                  <Input
                    id="name"
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="price">Price (₹)</Label>
                  <Input
                    type="number"
                    id="price"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    required
                    min="0"
                    step="0.01"
                  />
                </div>
                <div>
                  <Label htmlFor="originalPrice">Original Price (₹)</Label>
                  <Input
                    type="number"
                    id="originalPrice"
                    value={productForm.originalPrice}
                    onChange={(e) => setProductForm({ ...productForm, originalPrice: e.target.value })}
                    min="0"
                    step="0.01"
                  />
                </div>
                <div>
                  <Label htmlFor="image">Image URL</Label>
                  <Input
                    id="image"
                    value={productForm.image}
                    onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                    placeholder="https://..."
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="stock">Stock Quantity</Label>
                  <Input
                    type="number"
                    id="stock"
                    value={productForm.stock}
                    onChange={(e) => setProductForm({ ...productForm, stock: parseInt(e.target.value) || 0 })}
                    required
                    min="0"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  rows={3}
                  required
                />
              </div>
              <div className="flex space-x-4 pt-4">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : (editingProduct ? 'Update Product' : 'Add Product')}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  disabled={isSubmitting}
                  onClick={() => {
                    setShowProductDialog(false);
                    setEditingProduct(null);
                    setIsSubmitting(false);
                    setProductForm({
                      name: '',
                      price: '',
                      originalPrice: '',
                      category: '',
                      image: '',
                      description: '',
                      stock: 1
                    });
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Order Details Dialog */}
        <Dialog open={showOrderDialog} onOpenChange={setShowOrderDialog}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Order Details - {selectedOrder?.orderNumber}</DialogTitle>
            </DialogHeader>
            
            {selectedOrder && (
              <div className="space-y-6">
                {/* Order Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-2">Order Info</h3>
                      <div className="space-y-1 text-sm">
                        <div>Order #: <strong>{selectedOrder.orderNumber}</strong></div>
                        <div>Date: {new Date(selectedOrder.createdAt).toLocaleString()}</div>
                        <div className="flex items-center space-x-2">
                          <span>Status:</span>
                          <Badge className={getStatusColor(selectedOrder.status)}>
                            {getStatusIcon(selectedOrder.status)}
                            <span className="capitalize ml-1">{selectedOrder.status}</span>
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-2">Customer</h3>
                      <div className="space-y-1 text-sm">
                        <div><strong>{selectedOrder.user?.name || 'Unknown'}</strong></div>
                        <div>{selectedOrder.user?.email || 'No email'}</div>
                        <div>{selectedOrder.shippingAddress?.phone}</div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-2">Payment</h3>
                      <div className="space-y-1 text-sm">
                        <div>Method: <span className="capitalize">{selectedOrder.paymentMethod}</span></div>
                        <div>Status: 
                          <Badge 
                            variant={selectedOrder.paymentStatus === 'completed' ? 'default' : 'secondary'}
                            className="ml-1"
                          >
                            {selectedOrder.paymentStatus}
                          </Badge>
                        </div>
                        <div className="text-lg font-bold">₹{selectedOrder.total?.toFixed(2)}</div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Shipping Address */}
                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2">Shipping Address</h3>
                    <div className="text-sm">
                      <div>{selectedOrder.shippingAddress?.fullName}</div>
                      <div>{selectedOrder.shippingAddress?.street}</div>
                      <div>
                        {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} {selectedOrder.shippingAddress?.zipCode}
                      </div>
                      <div>{selectedOrder.shippingAddress?.country}</div>
                    </div>
                  </CardContent>
                </Card>

                {/* Order Items */}
                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-4">Order Items</h3>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Product</TableHead>
                            <TableHead>Quantity</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Total</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {selectedOrder.items?.map((item: any, index: number) => (
                            <TableRow key={index}>
                              <TableCell>
                                <div className="flex items-center space-x-3">
                                  {item.image && (
                                    <img 
                                      src={item.image} 
                                      alt={item.name}
                                      className="w-12 h-12 object-cover rounded"
                                    />
                                  )}
                                  <div>
                                    <div className="font-medium">{item.name}</div>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>{item.quantity}</TableCell>
                              <TableCell>₹{item.price?.toFixed(2)}</TableCell>
                              <TableCell>₹{item.totalPrice?.toFixed(2)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                    
                    {/* Order Totals */}
                    <div className="mt-4 space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>₹{selectedOrder.subtotal?.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tax:</span>
                        <span>₹{selectedOrder.tax?.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Shipping:</span>
                        <span>₹{selectedOrder.shipping?.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-bold text-base border-t pt-2">
                        <span>Total:</span>
                        <span>₹{selectedOrder.total?.toFixed(2)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Customer Notes */}
                {selectedOrder.notes?.customerNotes && (
                  <Card>
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-2">Customer Notes</h3>
                      <p className="text-sm text-gray-600">{selectedOrder.notes.customerNotes}</p>
                    </CardContent>
                  </Card>
                )}

                {/* Order History */}
                {selectedOrder.history && selectedOrder.history.length > 0 && (
                  <Card>
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-4">Order History</h3>
                      <div className="space-y-3">
                        {selectedOrder.history.map((historyItem: any, index: number) => (
                          <div key={index} className="flex items-center space-x-3 text-sm">
                            <div className={`w-2 h-2 rounded-full ${getStatusColor(historyItem.status).replace('text-', 'bg-').replace('-800', '-500')}`}></div>
                            <div className="flex-1">
                              <div className="font-medium capitalize">{historyItem.status}</div>
                              {historyItem.note && <div className="text-gray-600">{historyItem.note}</div>}
                            </div>
                            <div className="text-gray-500">
                              {new Date(historyItem.date).toLocaleString()}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}