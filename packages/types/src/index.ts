// User Types
export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: 'buyer' | 'seller' | 'admin';
  avatar?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserDto {
  email: string;
  password: string;
  name: string;
  phone?: string;
  role?: 'buyer' | 'seller';
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: Omit<User, 'createdAt' | 'updatedAt'>;
  accessToken: string;
  refreshToken: string;
}

// Seller Types
export interface Seller {
  id: string;
  userId: string;
  storeName: string;
  slug: string;
  description?: string;
  address?: string;
  phone?: string;
  whatsapp?: string;
  logo?: string;
  isVerified: boolean;
  isActive: boolean;
  verifiedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateSellerDto {
  storeName: string;
  description?: string;
  address?: string;
  phone?: string;
  whatsapp?: string;
}

// Product Types
export interface Product {
  id: string;
  sellerId: string;
  categoryId: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  stock: number;
  unit: string;
  weight: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductWithDetails extends Product {
  category: Category;
  seller: Seller;
  images: ProductImage[];
}

export interface CreateProductDto {
  name: string;
  description?: string;
  price: number;
  stock: number;
  unit?: string;
  weight?: number;
  categoryId: string;
}

// Product Image Types
export interface ProductImage {
  id: string;
  productId: string;
  imageUrl: string;
  isPrimary: boolean;
  sortOrder: number;
  createdAt: Date;
}

// Category Types
export interface Category {
  id: string;
  parentId?: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CategoryWithChildren extends Category {
  children?: Category[];
}

// Order Types
export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  sellerId: string;
  status: OrderStatus;
  subtotal: number;
  total: number;
  notes?: string;
  shippingName?: string;
  shippingPhone?: string;
  shippingAddress?: string;
  cancelledReason?: string;
  cancelledAt?: Date;
  confirmedAt?: Date;
  processingAt?: Date;
  shippedAt?: Date;
  deliveredAt?: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderWithDetails extends Order {
  items: OrderItem[];
  seller: Pick<Seller, 'id' | 'storeName' | 'whatsapp'>;
}

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'completed'
  | 'cancelled';

export interface CreateOrderDto {
  sellerId: string;
  items: OrderItemDto[];
  shippingName: string;
  shippingPhone: string;
  shippingAddress: string;
  notes?: string;
}

export interface OrderItemDto {
  productId: string;
  quantity: number;
}

// Order Item Types
export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  productPrice: number;
  quantity: number;
  subtotal: number;
  createdAt: Date;
}

// Address Types
export interface Address {
  id: string;
  userId: string;
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  province: string;
  postalCode: string;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateAddressDto {
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  province: string;
  postalCode: string;
  isDefault?: boolean;
}

// Banner Types
export interface Banner {
  id: string;
  title: string;
  imageUrl: string;
  link?: string;
  isActive: boolean;
  sortOrder: number;
  startDate?: Date;
  endDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Error Types
export interface ApiError {
  success: boolean;
  error: string;
  message?: string;
  details?: Record<string, string>;
}