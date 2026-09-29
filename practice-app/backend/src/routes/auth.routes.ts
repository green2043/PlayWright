import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { store } from '../data/store';
import { JWT_SECRET, authenticate, AuthRequest } from '../middleware/auth.middleware';

const router = Router();

/**
 * POST /api/auth/login
 * body: { username, password }
 * returns: { token, user }
 */
router.post('/login', (req: Request, res: Response) => {
  const { username, password } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ error: 'BadRequest', message: 'username and password are required' });
  }
  const user = store.users.find(u => u.username === username);
  if (!user || user.password !== password) {
    return res.status(401).json({ error: 'Unauthorized', message: 'Invalid credentials' });
  }
  const token = jwt.sign({ sub: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '2h' });
  const { password: _pw, ...publicUser } = user;
  res.status(200).json({ token, user: publicUser });
});

/**
 * POST /api/auth/logout
 * Stateless JWT - client just discards the token. Endpoint provided for practice.
 */
router.post('/logout', (_req: Request, res: Response) => {
  res.status(200).json({ message: 'Logged out successfully' });
});

/**
 * GET /api/auth/me - protected route requiring a valid Bearer token
 */
router.get('/me', authenticate, (req: AuthRequest, res: Response) => {
  const user = store.users.find(u => u.id === req.user?.sub);
  if (!user) {
    return res.status(404).json({ error: 'NotFound', message: 'User not found' });
  }
  const { password: _pw, ...publicUser } = user;
  res.status(200).json(publicUser);
});

export default router;
