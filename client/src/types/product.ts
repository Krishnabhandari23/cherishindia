export interface Product {
  _id: string;
  name: string;
  price: number;
  originalPrice?: number;
  category: string;
  image: string;
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
  description: string;
  stock: number;
  discount?: number;
  isActive: boolean;
  isFeatured: boolean;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}