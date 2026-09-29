"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const uuid_1 = require("uuid");
const store_1 = require("../data/store");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
/** GET /api/orders?status=&userId=&page=&limit= - protected */
router.get('/', auth_middleware_1.authenticate, (req, res) => {
    let results = [...store_1.store.orders];
    const { status, userId } = req.query;
    if (status)
        results = results.filter(o => o.status === status);
    if (userId)
        results = results.filter(o => o.userId === userId);
    const page = Math.max(parseInt(req.query.page || '1', 10), 1);
    const limit = Math.max(parseInt(req.query.limit || '10', 10), 1);
    const start = (page - 1) * limit;
    const paged = results.slice(start, start + limit);
    res.status(200).json({
        data: paged,
        pagination: { page, limit, total: results.length, totalPages: Math.ceil(results.length / limit) || 1 }
    });
});
/** GET /api/orders/:id - protected */
router.get('/:id', auth_middleware_1.authenticate, (req, res) => {
    const order = store_1.store.orders.find(o => o.id === req.params.id);
    if (!order)
        return res.status(404).json({ error: 'NotFound', message: 'Order not found' });
    res.status(200).json(order);
});
/** POST /api/orders - protected, creates for the authenticated user */
router.post('/', auth_middleware_1.authenticate, (req, res) => {
    const { items, notes } = req.body || {};
    if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: 'BadRequest', message: 'items must be a non-empty array' });
    }
    for (const item of items) {
        if (!item.productId || !store_1.store.products.some(p => p.id === item.productId)) {
            return res.status(400).json({ error: 'BadRequest', message: `Invalid productId: ${item.productId}` });
        }
    }
    const total = items.reduce((sum, item) => {
        const product = store_1.store.products.find(p => p.id === item.productId);
        return sum + product.price * (item.quantity || 1);
    }, 0);
    const order = {
        id: (0, uuid_1.v4)(), userId: req.user.sub, items, status: 'pending',
        total: Math.round(total * 100) / 100, createdAt: new Date().toISOString(), notes: notes ?? null
    };
    store_1.store.orders.push(order);
    res.status(201).json(order);
});
/** PATCH /api/orders/:id/status - protected, update status only */
router.patch('/:id/status', auth_middleware_1.authenticate, (req, res) => {
    const order = store_1.store.orders.find(o => o.id === req.params.id);
    if (!order)
        return res.status(404).json({ error: 'NotFound', message: 'Order not found' });
    const { status } = req.body || {};
    const valid = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!valid.includes(status)) {
        return res.status(400).json({ error: 'BadRequest', message: `status must be one of ${valid.join(', ')}` });
    }
    order.status = status;
    res.status(200).json(order);
});
/** DELETE /api/orders/:id - protected */
router.delete('/:id', auth_middleware_1.authenticate, (req, res) => {
    const idx = store_1.store.orders.findIndex(o => o.id === req.params.id);
    if (idx === -1)
        return res.status(404).json({ error: 'NotFound', message: 'Order not found' });
    store_1.store.orders.splice(idx, 1);
    res.status(200).json({ message: 'Order deleted' });
});
exports.default = router;
//# sourceMappingURL=orders.routes.js.map