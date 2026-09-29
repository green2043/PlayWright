"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const store_1 = require("../data/store");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
/**
 * POST /api/auth/login
 * body: { username, password }
 * returns: { token, user }
 */
router.post('/login', (req, res) => {
    const { username, password } = req.body || {};
    if (!username || !password) {
        return res.status(400).json({ error: 'BadRequest', message: 'username and password are required' });
    }
    const user = store_1.store.users.find(u => u.username === username);
    if (!user || user.password !== password) {
        return res.status(401).json({ error: 'Unauthorized', message: 'Invalid credentials' });
    }
    const token = jsonwebtoken_1.default.sign({ sub: user.id, username: user.username, role: user.role }, auth_middleware_1.JWT_SECRET, { expiresIn: '2h' });
    const { password: _pw, ...publicUser } = user;
    res.status(200).json({ token, user: publicUser });
});
/**
 * POST /api/auth/logout
 * Stateless JWT - client just discards the token. Endpoint provided for practice.
 */
router.post('/logout', (_req, res) => {
    res.status(200).json({ message: 'Logged out successfully' });
});
/**
 * GET /api/auth/me - protected route requiring a valid Bearer token
 */
router.get('/me', auth_middleware_1.authenticate, (req, res) => {
    const user = store_1.store.users.find(u => u.id === req.user?.sub);
    if (!user) {
        return res.status(404).json({ error: 'NotFound', message: 'User not found' });
    }
    const { password: _pw, ...publicUser } = user;
    res.status(200).json(publicUser);
});
exports.default = router;
//# sourceMappingURL=auth.routes.js.map