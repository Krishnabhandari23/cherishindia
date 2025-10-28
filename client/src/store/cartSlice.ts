import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  total: number;
  isOpen: boolean;
}

const initialState: CartState = {
  items: JSON.parse(localStorage.getItem('cart') || '[]'),
  total: 0,
  isOpen: false,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Omit<CartItem, 'quantity'>>) => {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
      cartSlice.caseReducers.calculateTotal(state);
      localStorage.setItem('cart', JSON.stringify(state.items));
      // Automatically show cart when item is added
      state.isOpen = true;
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      cartSlice.caseReducers.calculateTotal(state);
      localStorage.setItem('cart', JSON.stringify(state.items));
    },
    updateQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
      const item = state.items.find(item => item.id === action.payload.id);
      if (item) {
        item.quantity = action.payload.quantity;
        if (item.quantity <= 0) {
          state.items = state.items.filter(item => item.id !== action.payload.id);
        }
      }
      cartSlice.caseReducers.calculateTotal(state);
      localStorage.setItem('cart', JSON.stringify(state.items));
    },
    clearCart: (state) => {
      state.items = [];
      state.total = 0;
      localStorage.removeItem('cart');
    },
    toggleCart: (state) => {
      state.isOpen = !state.isOpen;
    },
    showCart: (state) => {
      state.isOpen = true;
    },
    hideCart: (state) => {
      state.isOpen = false;
    },
    calculateTotal: (state) => {
      state.total = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart, toggleCart, showCart, hideCart, calculateTotal } = cartSlice.actions;
export default cartSlice.reducer;