"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.store = void 0;
const uuid_1 = require("uuid");
// In-memory data store. Exposes a reset() so the app never accumulates
// unbounded state across long automation sessions and can be reset via
// POST /api/admin/reset for clean test runs.
const now = () => new Date().toISOString();
function seedUsers() {
    return [
        { id: (0, uuid_1.v4)(), name: 'Alice Admin', username: 'admin', email: 'admin@example.com', role: 'admin', password: 'Admin@123', createdAt: now() },
        { id: (0, uuid_1.v4)(), name: 'Bob User', username: 'bob', email: 'bob@example.com', role: 'user', password: 'User@123', createdAt: now() },
        { id: (0, uuid_1.v4)(), name: 'Carla Tester', username: 'carla', email: 'carla@example.com', role: 'user', password: 'User@123', createdAt: now() }
    ];
}
function seedProducts() {
    const categories = ['Electronics', 'Books', 'Clothing', 'Toys', 'Home'];
    const products = [];
    for (let i = 1; i <= 25; i++) {
        products.push({
            id: (0, uuid_1.v4)(),
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
function seedOrders(users, products) {
    const statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    const orders = [];
    for (let i = 1; i <= 10; i++) {
        const user = users[i % users.length];
        const item1 = products[i % products.length];
        const item2 = products[(i + 3) % products.length];
        orders.push({
            id: (0, uuid_1.v4)(),
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
    constructor() {
        this.users = seedUsers();
        this.products = seedProducts();
        this.orders = seedOrders(this.users, this.products);
    }
    reset() {
        this.users = seedUsers();
        this.products = seedProducts();
        this.orders = seedOrders(this.users, this.products);
    }
}
exports.store = new Store();
//# sourceMappingURL=store.js.map