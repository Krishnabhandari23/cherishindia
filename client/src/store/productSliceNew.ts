import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import apiService from '../utils/api';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  category: string;
  subcategory?: string;
  brand?: string;
  image: string;
  images?: string[];
  stock: number;
  weight?: number;
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
  };
  ratings: {
    average: number;
    count: number;
  };
  reviews?: Array<{
    user: string;
    rating: number;
    comment: string;
    createdAt: string;
  }>;
  isActive: boolean;
  isFeatured: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

interface ProductState {
  products: Product[];
  currentProduct: Product | null;
  featuredProducts: Product[];
  categories: string[];
  isLoading: boolean;
  error: string | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalProducts: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  filters: {
    category: string;
    search: string;
    minPrice?: number;
    maxPrice?: number;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
    featured?: boolean;
    inStock?: boolean;
  };
}

const initialState: ProductState = {
  products: [],
  currentProduct: null,
  featuredProducts: [],
  categories: [],
  isLoading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalProducts: 0,
    hasNextPage: false,
    hasPrevPage: false,
  },
  filters: {
    category: '',
    search: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  },
};

// Async thunks
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (params: { 
    page?: number;
    limit?: number;
    category?: string; 
    search?: string; 
    minPrice?: number;
    maxPrice?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    featured?: boolean;
    inStock?: boolean;
  } = {}, { rejectWithValue }) => {
    try {
      const response = await apiService.getProducts(params) as any;
      
      if (response.success) {
        return response.data;
      } else {
        return rejectWithValue(response.message || 'Failed to fetch products');
      }
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error occurred');
    }
  }
);

export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await apiService.getProduct(id) as any;
      
      if (response.success) {
        return response.data;
      } else {
        return rejectWithValue(response.message || 'Product not found');
      }
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error occurred');
    }
  }
);

export const fetchFeaturedProducts = createAsyncThunk(
  'products/fetchFeaturedProducts',
  async (limit: number = 8, { rejectWithValue }) => {
    try {
      const response = await apiService.getFeaturedProducts(limit) as any;
      
      if (response.success) {
        return response.data;
      } else {
        return rejectWithValue(response.message || 'Failed to fetch featured products');
      }
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error occurred');
    }
  }
);

export const fetchCategories = createAsyncThunk(
  'products/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.getCategories() as any;
      
      if (response.success) {
        return response.data;
      } else {
        return rejectWithValue(response.message || 'Failed to fetch categories');
      }
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error occurred');
    }
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    setFilters: (state, action: PayloadAction<Partial<typeof initialState.filters>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        category: '',
        search: '',
        sortBy: 'createdAt',
        sortOrder: 'desc',
      };
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch products
      .addCase(fetchProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload.products;
        state.pagination = action.payload.pagination;
        state.error = null;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch single product
      .addCase(fetchProductById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentProduct = action.payload;
        state.error = null;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch featured products
      .addCase(fetchFeaturedProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFeaturedProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.featuredProducts = action.payload;
        state.error = null;
      })
      .addCase(fetchFeaturedProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch categories
      .addCase(fetchCategories.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categories = action.payload;
        state.error = null;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearCurrentProduct, clearError, setFilters, clearFilters } = productSlice.actions;
export default productSlice.reducer;