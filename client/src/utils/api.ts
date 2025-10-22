import { API_BASE_URL } from './constants';

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  errors?: string[];
}

class ApiService {
  private baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = localStorage.getItem('token');
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, config);
      
      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server returned non-JSON response');
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  // Auth methods
  async login(credentials: { email: string; password: string }) {
    return this.request<ApiResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async register(userData: { name: string; email: string; password: string; role?: string }) {
    return this.request<ApiResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async getProfile() {
    return this.request<ApiResponse>('/auth/me');
  }

  async updateProfile(userData: { 
    name?: string; 
    phone?: string; 
    address?: any; 
    dateOfBirth?: string;
  }) {
    return this.request<ApiResponse>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async changePassword(passwordData: { 
    currentPassword: string; 
    newPassword: string;
  }) {
    return this.request<ApiResponse>('/auth/password', {
      method: 'PUT',
      body: JSON.stringify(passwordData),
    });
  }

  async refreshToken(refreshToken: string) {
    return this.request<ApiResponse>('/auth/refresh-token', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });
  }

  // Product methods
  async getProducts(params?: { 
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
  }) {
    const queryParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, String(value));
        }
      });
    }

    const queryString = queryParams.toString();
    return this.request<ApiResponse>(`/products${queryString ? `?${queryString}` : ''}`);
  }

  async getProduct(id: string) {
    return this.request<ApiResponse>(`/products/${id}`);
  }

  async getFeaturedProducts(limit?: number) {
    const queryString = limit ? `?limit=${limit}` : '';
    return this.request<ApiResponse>(`/products/featured${queryString}`);
  }

  async getCategories() {
    return this.request<ApiResponse>('/products/categories');
  }

  async createProduct(productData: any) {
    return this.request<ApiResponse>('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  }

  async updateProduct(id: string, productData: any) {
    return this.request<ApiResponse>(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  }

  async deleteProduct(id: string) {
    return this.request<ApiResponse>(`/products/${id}`, {
      method: 'DELETE',
    });
  }

  async addProductReview(productId: string, reviewData: {
    rating: number;
    comment: string;
  }) {
    return this.request<ApiResponse>(`/products/${productId}/reviews`, {
      method: 'POST',
      body: JSON.stringify(reviewData),
    });
  }

  // Order methods
  async createOrder(orderData: {
    items: Array<{
      productId: string;
      quantity: number;
    }>;
    shippingAddress: {
      fullName: string;
      phone: string;
      email?: string;
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country?: string;
    };
    paymentMethod: string;
    notes?: {
      customerNotes?: string;
    };
  }) {
    return this.request<ApiResponse>('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  async getUserOrders(params?: {
    page?: number;
    limit?: number;
    status?: string;
  }) {
    const queryParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, String(value));
        }
      });
    }

    const queryString = queryParams.toString();
    return this.request<ApiResponse>(`/orders${queryString ? `?${queryString}` : ''}`);
  }

  async getOrder(id: string) {
    return this.request<ApiResponse>(`/orders/${id}`);
  }

  async cancelOrder(id: string, reason?: string) {
    return this.request<ApiResponse>(`/orders/${id}/cancel`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  }

  async updateOrderStatus(id: string, status: string, note?: string) {
    return this.request<ApiResponse>(`/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, note }),
    });
  }

  async getAllOrders(params?: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
  }) {
    const queryParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, String(value));
        }
      });
    }

    const queryString = queryParams.toString();
    return this.request<ApiResponse>(`/orders/admin/all${queryString ? `?${queryString}` : ''}`);
  }

  // Utility methods
  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  removeToken(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
  }

  async handleApiError(error: any): Promise<never> {
    if (error.message === 'Invalid token' || error.message === 'Token is not valid') {
      this.removeToken();
      window.location.href = '/login';
    }
    throw error;
  }
}

export const apiService = new ApiService();
export default apiService;