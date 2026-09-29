export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  role: 'admin' | 'user';
  password: string; // plaintext only for practice purposes - never do this in real apps
  createdAt: string;
}

export interface PublicUser {
  id: string;
  name: string;
  username: string;
  email: string;
  role: 'admin' | 'user';
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  inStock: boolean;
  tags: string[];
  rating: {
    average: number;
    count: number;
  };
  createdAt: string;
}

export interface Order {
  id: string;
  userId: string;
  items: { productId: string; quantity: number }[];
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  createdAt: string;
  notes?: string | null;
}

export interface JwtPayload {
  sub: string;
  username: string;
  role: 'admin' | 'user';
}
