export interface User {
  id: number;
  name: string;
  email: string;
  password_hash: string;
  token?: string;
}

export interface Product {
  id: number;
  label: string;
  description?: string;
  price: number;
  category_id: number;
  thumbnail_url?: string;
  visible_public: boolean;
  visible_authenticated: boolean;
}

export interface Category {
  id: number;
  index?: number;
  label: string;
  description?: string;
}

export interface Cart {
  id: number;
  user_id: number;
  product_id: number;
  quantity?: number;
}

export interface ApiResponse {
  success: boolean;
  data: any;
  errors: string[];
  warnings: string[];
}
