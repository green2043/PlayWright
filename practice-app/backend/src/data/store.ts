import { v4 as uuid } from 'uuid';
import { User, Product, Order } from '../types';

// In-memory data store. Exposes a reset() so the app never accumulates
// unbounded state across long automation sessions and can be reset via
// POST /api/admin/reset for clean test runs.

const now = () => new Date().toISOString();

function seedUsers(): User[] {
  return [
    { id: uuid(), name: 'Alice Admin', username: 'admin', email: 'admin@example.com', role: 'admin', password: 'Admin@123', createdAt: now() },
    { id: uuid(), name: 'Bob User', username: 'bob', email: 'bob@example.com', role: 'user', password: 'User@123', createdAt: now() },
    { id: uuid(), name: 'Carla Tester', username: 'carla', email: 'carla@example.com', role: 'user', password: 'User@123', createdAt: now() }
  ];
}

function seedProducts(): Product[] {
  const categories = ['Electronics', 'Books', 'Clothing', 'Toys', 'Home'];
  const products: Product[] = [];
  for (let i = 1; i <= 25; i++) {
    products.push({
      id: uuid(),
      name: `Product ${i}`,
      category: categories[i % categories.length],
      price: Math.round((Math.random() * 200 + 5) * 100) / 100,
      inStock: i % 4 !== 0,
      tags: i % 2 === 0 ? ['sale', 'featured'] : ['new'],
      rating: { average: Math.round((Math.random() * 5) * 10) / 10, count: Math.floor(Math.random() * 500) },
      createdAt: now()
    });
  }
  return products;
}

function seedOrders(users: User[], products: Product[]): Order[] {
  const statuses: Order['status'][] = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
  const orders: Order[] = [];
  for (let i = 1; i <= 10; i++) {
    const user = users[i % users.length];
    const item1 = products[i % products.length];
    const item2 = products[(i + 3) % products.length];
    orders.push({
      id: uuid(),
      userId: user.id,
      items: [
        { productId: item1.id, quantity: (i % 3) + 1 },
        { productId: item2.id, quantity: 1 }
      ],
      status: statuses[i % statuses.length],
      total: Math.round((item1.price * ((i % 3) + 1) + item2.price) * 100) / 100,
      createdAt: now(),
      notes: i % 5 === 0 ? 'Leave at front door' : null
    });
  }
  return orders;
}

class Store {
  users: User[] = seedUsers();
  products: Product[] = seedProducts();
  orders: Order[] = seedOrders(this.users, this.products);

  reset() {
    this.users = seedUsers();
    this.products = seedProducts();
    this.orders = seedOrders(this.users, this.products);
  }
}

export const store = new Store();
