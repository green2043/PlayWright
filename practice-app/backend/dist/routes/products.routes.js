"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const uuid_1 = require("uuid");
const store_1 = require("../data/store");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
/** GET /api/products?category=&minPrice=&maxPrice=&inStock=&sort=&order=&page=&limit= */
router.get('/', (req, res) => {
    let results = [...store_1.store.products];
    const { category, minPrice, maxPrice, inStock, sort, order, search } = req.query;
    if (category)
        results = results.filter(p => p.category.toLowerCase() === category.toLowerCase());
    if (inStock !== undefined)
        results = results.filter(p => p.inStock === (inStock === 'true'));
    if (minPrice)
        results = results.filter(p => p.price >= parseFloat(minPrice));
    if (maxPrice)
        results = results.filter(p => p.price <= parseFloat(maxPrice));
    if (search)
        results = results.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
    if (sort) {
        const dir = order === 'desc' ? -1 : 1;
        results.sort((a, b) => (a[sort] > b[sort] ? 1 : a[sort] < b[sort] ? -1 : 0) * dir);
    }
    const page = Math.max(parseInt(req.query.page || '1', 10), 1);
    const limit = Math.max(parseInt(req.query.limit || '10', 10), 1);
    const start = (page - 1) * limit;
    const paged = results.slice(start, start + limit);
    res.status(200).json({
        data: paged,
        pagination: { page, limit, total: results.length, totalPages: Math.ceil(results.length / limit) || 1 }
    });
});
/** GET /api/products/slow - simulated slow endpoint for timeout/retry practice */
router.get('/slow', async (req, res) => {
    const delayMs = Math.min(parseInt(req.query.delay || '3000', 10), 15000);
    await new Promise(r => setTimeout(r, delayMs));
    res.status(200).json({ message: `Responded after ${delayMs}ms`, data: store_1.store.products.slice(0, 5) });
});
/** GET /api/products/:id */
router.get('/:id', (req, res) => {
    const product = store_1.store.products.find(p => p.id === req.params.id);
    if (!product)
        return res.status(404).json({ error: 'NotFound', message: `Product ${req.params.id} not found` });
    res.status(200).json(product);
});
/** POST /api/products - protected */
router.post('/', auth_middleware_1.authenticate, (req, res) => {
    const { name, category, price, inStock, tags } = req.body || {};
    if (!name || !category || price === undefined) {
        return res.status(400).json({ error: 'BadRequest', message: 'name, category, price are required' });
    }
    if (typeof price !== 'number' || price < 0) {
        return res.status(400).json({ error: 'BadRequest', message: 'price must be a non-negative number' });
    }
    const product = {
        id: (0, uuid_1.v4)(), name, category, price, inStock: !!inStock, tags: Array.isArray(tags) ? tags : [],
        rating: { average: 0, count: 0 }, createdAt: new Date().toISOString()
    };
    store_1.store.products.push(product);
    res.status(201).json(product);
});
/** PUT /api/products/:id */
router.put('/:id', auth_middleware_1.authenticate, (req, res) => {
    const product = store_1.store.products.find(p => p.id === req.params.id);
    if (!product)
        return res.status(404).json({ error: 'NotFound', message: 'Product not found' });
    const { name, category, price, inStock, tags } = req.body || {};
    if (!name || !category || price === undefined) {
        return res.status(400).json({ error: 'BadRequest', message: 'name, category, price are required for PUT' });
    }
    Object.assign(product, { name, category, price, inStock: !!inStock, tags: Array.isArray(tags) ? tags : [] });
    res.status(200).json(product);
});
/** PATCH /api/products/:id */
router.patch('/:id', auth_middleware_1.authenticate, (req, res) => {
    const product = store_1.store.products.find(p => p.id === req.params.id);
    if (!product)
        return res.status(404).json({ error: 'NotFound', message: 'Product not found' });
    Object.assign(product, req.body || {});
    res.status(200).json(product);
});
/** DELETE /api/products/:id */
router.delete('/:id', auth_middleware_1.authenticate, (req, res) => {
    const idx = store_1.store.products.findIndex(p => p.id === req.params.id);
    if (idx === -1)
        return res.status(404).json({ error: 'NotFound', message: 'Product not found' });
    store_1.store.products.splice(idx, 1);
    res.status(200).json({ message: 'Product deleted' });
});
exports.default = router;
//# sourceMappingURL=products.routes.js.map