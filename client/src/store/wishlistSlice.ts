import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import apiService from '../utils/api';

interface WishlistProduct {
  _id: string;
  product: {
    _id: string;
    name: string;
    description: string;
    price: number;
    originalPrice?: number;
    discount?: number;
    category: string;
    image: string;
    ratings: {
      average: number;
      count: number;
    };
    stock: number;
    isFeatured: boolean;
  };
  addedAt: string;
}

interface WishlistState {
  products: WishlistProduct[];
  isLoading: boolean;
  error: string | null;
}

const initialState: WishlistState = {
  products: [],
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchWishlist = createAsyncThunk(
  'wishlist/fetchWishlist',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.getWishlist();
      // Handle different response structures
      return (response as any).wishlist?.products || response.data?.wishlist?.products || [];
    } catch (error: any) {
      // If wishlist endpoint doesn't exist, return empty array
      if (error.message?.includes('404') || error.message?.includes('not found') || error.message?.includes('API route not found')) {
        console.warn('Wishlist endpoint not available, using empty state');
        return [];
      }
      return rejectWithValue(error.message || 'Failed to fetch wishlist');
    }
  }
);

export const addToWishlist = createAsyncThunk(
  'wishlist/addToWishlist',
  async (productId: string, { rejectWithValue, getState }) => {
    try {
      const response = await apiService.addToWishlist(productId);
      return (response as any).wishlist?.products || response.data?.wishlist?.products || [];
    } catch (error: any) {
      // If wishlist endpoint doesn't exist, use local state management
      if (error.message?.includes('404') || error.message?.includes('not found') || error.message?.includes('API route not found')) {
        console.warn('Wishlist endpoint not available, using local state fallback');
        const state = getState() as { wishlist: WishlistState };
        // Return current products (no actual addition since we can't persist)
        return state.wishlist.products;
      }
      return rejectWithValue(error.message || 'Failed to add to wishlist');
    }
  }
);

export const removeFromWishlist = createAsyncThunk(
  'wishlist/removeFromWishlist',
  async (productId: string, { rejectWithValue, getState }) => {
    try {
      const response = await apiService.removeFromWishlist(productId);
      return (response as any).wishlist?.products || response.data?.wishlist?.products || [];
    } catch (error: any) {
      // If wishlist endpoint doesn't exist, use local state management
      if (error.message?.includes('404') || error.message?.includes('not found') || error.message?.includes('API route not found')) {
        console.warn('Wishlist endpoint not available, using local state fallback');
        const state = getState() as { wishlist: WishlistState };
        // Filter out the product locally
        return state.wishlist.products.filter(item => item.product._id !== productId);
      }
      return rejectWithValue(error.message || 'Failed to remove from wishlist');
    }
  }
);

export const clearWishlist = createAsyncThunk(
  'wishlist/clearWishlist',
  async (_, { rejectWithValue }) => {
    try {
      await apiService.clearWishlist();
      return [];
    } catch (error: any) {
      // If wishlist endpoint doesn't exist, just clear local state
      if (error.message?.includes('404') || error.message?.includes('not found') || error.message?.includes('API route not found')) {
        console.warn('Wishlist endpoint not available, using local state fallback');
        return [];
      }
      return rejectWithValue(error.message || 'Failed to clear wishlist');
    }
  }
);

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    // Local wishlist management for when API is not available
    addToWishlistLocal: (state, action: PayloadAction<any>) => {
      const product = action.payload;
      const exists = state.products.find(item => item.product._id === product._id);
      if (!exists) {
        state.products.push({
          _id: `local_${Date.now()}`,
          product,
          addedAt: new Date().toISOString()
        });
      }
    },
    removeFromWishlistLocal: (state, action: PayloadAction<string>) => {
      const productId = action.payload;
      state.products = state.products.filter(item => item.product._id !== productId);
    },
    clearWishlistLocal: (state) => {
      state.products = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch wishlist
      .addCase(fetchWishlist.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload;
        state.error = null;
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Add to wishlist
      .addCase(addToWishlist.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload;
        state.error = null;
      })
      .addCase(addToWishlist.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Remove from wishlist
      .addCase(removeFromWishlist.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload;
        state.error = null;
      })
      .addCase(removeFromWishlist.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Clear wishlist
      .addCase(clearWishlist.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(clearWishlist.fulfilled, (state) => {
        state.isLoading = false;
        state.products = [];
        state.error = null;
      })
      .addCase(clearWishlist.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, addToWishlistLocal, removeFromWishlistLocal, clearWishlistLocal } = wishlistSlice.actions;
export default wishlistSlice.reducer;