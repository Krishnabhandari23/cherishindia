import { useState, useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from '@/store/store';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store/store';
import { calculateTotal } from '@/store/cartSlice';
import { validateToken } from '@/store/authSlice';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';

// Components
import Navbar from '@/components/Navbar';
import CartSidebar from '@/components/CartSidebar';

// Pages
import Home from '@/pages/Home';
import ProductList from '@/pages/ProductList';
import ProductDetail from '@/pages/ProductDetail';
import Cart from '@/pages/Cart';
import Checkout from '@/pages/Checkout';
import Login from '@/pages/Login';
import Admin from '@/pages/Admin';

function AppContent() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const dispatch = useDispatch<AppDispatch>();

  // Initialize app on mount
  useEffect(() => {
    dispatch(calculateTotal());
    
    // Validate token if it exists in localStorage
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(validateToken());
    }
  }, [dispatch]);

  const handleNavigate = (page: string, productId?: string) => {
    setCurrentPage(page);
    if (productId) {
      setSelectedProductId(productId);
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onNavigate={handleNavigate} />;
      case 'products':
        return <ProductList onNavigate={handleNavigate} />;
      case 'product-detail':
        return selectedProductId ? (
          <ProductDetail productId={selectedProductId} onNavigate={handleNavigate} />
        ) : (
          <ProductList onNavigate={handleNavigate} />
        );
      case 'cart':
        return <Cart onNavigate={handleNavigate} />;
      case 'checkout':
        return <Checkout onNavigate={handleNavigate} />;
      case 'login':
        return <Login onNavigate={handleNavigate} />;
      case 'admin':
        return <Admin onNavigate={handleNavigate} />;
      default:
        return <Home onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onNavigate={handleNavigate} currentPage={currentPage} />
      <main>{renderPage()}</main>
      <CartSidebar onNavigate={handleNavigate} />
    </div>
  );
}

const App = () => (
  <Provider store={store}>
    <TooltipProvider>
      <Toaster />
      <AppContent />
    </TooltipProvider>
  </Provider>
);

export default App;