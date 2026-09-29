import { Router, Request, Response } from 'express';
import { v4 as uuid } from 'uuid';
import { store } from '../data/store';
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth.middleware';

const router = Router();

const toPublic = (u: typeof store.users[number]) => {
  const { password, ...rest } = u;
  return rest;
};

/**
 * GET /api/users?page=1&limit=10&role=admin&sort=name&order=asc&search=bob
 */
router.get('/', (req: Request, res: Response) => {
  let results = [...store.users];

  const { role, search, sort, order } = req.query as Record<string, string | undefined>;

  if (role) {
    results = results.filter(u => u.role === role);
  }
  if (search) {
    const s = search.toLowerCase();
    results = results.filter(u => u.name.toLowerCase().includes(s) || u.username.toLowerCase().includes(s));
  }
  if (sort) {
    const dir = order === 'desc' ? -1 : 1;
    results.sort((a: any, b: any) => (a[sort] > b[sort] ? 1 : a[sort] < b[sort] ? -1 : 0) * dir);
  }

  const page = Math.max(parseInt((req.query.page as string) || '1', 10), 1);
  const limit = Math.max(parseInt((req.query.limit as string) || '10', 10), 1);
  const start = (page - 1) * limit;
  const paged = results.slice(start, start + limit);

  res.status(200).json({
    data: paged.map(toPublic),
    pagination: { page, limit, total: results.length, totalPages: Math.ceil(results.length / limit) || 1 }
  });
});

/** GET /api/users/:id */
router.get('/:id', (req: Request, res: Response) => {
  const user = store.users.find(u => u.id === req.params.id);
  if (!user) return res.status(404).json({ error: 'NotFound', message: `User ${req.params.id} not found` });
  res.status(200).json(toPublic(user));
});

/** POST /api/users - protected, admin only */
router.post('/', authenticate, requireAdmin, (req: Request, res: Response) => {
  const { name, username, email, password, role } = req.body || {};
  if (!name || !username || !email || !password) {
    return res.status(400).json({ error: 'BadRequest', message: 'name, username, email, password are required' });
  }
  if (store.users.some(u => u.username === username)) {
    return res.status(400).json({ error: 'BadRequest', message: 'username already exists' });
  }
  const user = {
    id: uuid(), name, username, email, password,
    role: role === 'admin' ? 'admin' as const : 'user' as const,
    createdAt: new Date().toISOString()
  };
  store.users.push(user);
  res.status(201).json(toPublic(user));
});

/** PUT /api/users/:id - full update, protected */
router.put('/:id', authenticate, (req: Request, res: Response) => {
  const user = store.users.find(u => u.id === req.params.id);
  if (!user) return res.status(404).json({ error: 'NotFound', message: 'User not found' });
  const { name, username, email, password, role } = req.body || {};
  if (!name || !username || !email || !password) {
    return res.status(400).json({ error: 'BadRequest', message: 'name, username, email, password are required for PUT' });
  }
  Object.assign(user, { name, username, email, password, role: role === 'admin' ? 'admin' : 'user' });
  res.status(200).json(toPublic(user));
});

/** PATCH /api/users/:id - partial update, protected */
router.patch('/:id', authenticate, (req: Request, res: Response) => {
  const user = store.users.find(u => u.id === req.params.id);
  if (!user) return res.status(404).json({ error: 'NotFound', message: 'User not found' });
  Object.assign(user, req.body || {});
  res.status(200).json(toPublic(user));
});

/** DELETE /api/users/:id - admin only */
router.delete('/:id', authenticate, requireAdmin, (req: Request, res: Response) => {
  const idx = store.users.findIndex(u => u.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'NotFound', message: 'User not found' });
  store.users.splice(idx, 1);
  res.status(200).json({ message: 'User deleted' });
});

export default router;
