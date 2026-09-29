"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const uuid_1 = require("uuid");
const store_1 = require("../data/store");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
const toPublic = (u) => {
    const { password, ...rest } = u;
    return rest;
};
/**
 * GET /api/users?page=1&limit=10&role=admin&sort=name&order=asc&search=bob
 */
router.get('/', (req, res) => {
    let results = [...store_1.store.users];
    const { role, search, sort, order } = req.query;
    if (role) {
        results = results.filter(u => u.role === role);
    }
    if (search) {
        const s = search.toLowerCase();
        results = results.filter(u => u.name.toLowerCase().includes(s) || u.username.toLowerCase().includes(s));
    }
    if (sort) {
        const dir = order === 'desc' ? -1 : 1;
        results.sort((a, b) => (a[sort] > b[sort] ? 1 : a[sort] < b[sort] ? -1 : 0) * dir);
    }
    const page = Math.max(parseInt(req.query.page || '1', 10), 1);
    const limit = Math.max(parseInt(req.query.limit || '10', 10), 1);
    const start = (page - 1) * limit;
    const paged = results.slice(start, start + limit);
    res.status(200).json({
        data: paged.map(toPublic),
        pagination: { page, limit, total: results.length, totalPages: Math.ceil(results.length / limit) || 1 }
    });
});
/** GET /api/users/:id */
router.get('/:id', (req, res) => {
    const user = store_1.store.users.find(u => u.id === req.params.id);
    if (!user)
        return res.status(404).json({ error: 'NotFound', message: `User ${req.params.id} not found` });
    res.status(200).json(toPublic(user));
});
/** POST /api/users - protected, admin only */
router.post('/', auth_middleware_1.authenticate, auth_middleware_1.requireAdmin, (req, res) => {
    const { name, username, email, password, role } = req.body || {};
    if (!name || !username || !email || !password) {
        return res.status(400).json({ error: 'BadRequest', message: 'name, username, email, password are required' });
    }
    if (store_1.store.users.some(u => u.username === username)) {
        return res.status(400).json({ error: 'BadRequest', message: 'username already exists' });
    }
    const user = {
        id: (0, uuid_1.v4)(), name, username, email, password,
        role: role === 'admin' ? 'admin' : 'user',
        createdAt: new Date().toISOString()
    };
    store_1.store.users.push(user);
    res.status(201).json(toPublic(user));
});
/** PUT /api/users/:id - full update, protected */
router.put('/:id', auth_middleware_1.authenticate, (req, res) => {
    const user = store_1.store.users.find(u => u.id === req.params.id);
    if (!user)
        return res.status(404).json({ error: 'NotFound', message: 'User not found' });
    const { name, username, email, password, role } = req.body || {};
    if (!name || !username || !email || !password) {
        return res.status(400).json({ error: 'BadRequest', message: 'name, username, email, password are required for PUT' });
    }
    Object.assign(user, { name, username, email, password, role: role === 'admin' ? 'admin' : 'user' });
    res.status(200).json(toPublic(user));
});
/** PATCH /api/users/:id - partial update, protected */
router.patch('/:id', auth_middleware_1.authenticate, (req, res) => {
    const user = store_1.store.users.find(u => u.id === req.params.id);
    if (!user)
        return res.status(404).json({ error: 'NotFound', message: 'User not found' });
    Object.assign(user, req.body || {});
    res.status(200).json(toPublic(user));
});
/** DELETE /api/users/:id - admin only */
router.delete('/:id', auth_middleware_1.authenticate, auth_middleware_1.requireAdmin, (req, res) => {
    const idx = store_1.store.users.findIndex(u => u.id === req.params.id);
    if (idx === -1)
        return res.status(404).json({ error: 'NotFound', message: 'User not found' });
    store_1.store.users.splice(idx, 1);
    res.status(200).json({ message: 'User deleted' });
});
exports.default = router;
//# sourceMappingURL=users.routes.js.map