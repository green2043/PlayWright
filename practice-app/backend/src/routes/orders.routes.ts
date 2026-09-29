import { Router, Request, Response } from 'express';
import { v4 as uuid } from 'uuid';
import { store } from '../data/store';
import { authenticate, AuthRequest } from '../middleware/auth.middleware';

const router = Router();

/** GET /api/orders?status=&userId=&page=&limit= - protected */
router.get('/', authenticate, (req: Request, res: Response) => {
  let results = [...store.orders];
  const { status, userId } = req.query as Record<string, string | undefined>;
  if (status) results = results.filter(o => o.status === status);
  if (userId) results = results.filter(o => o.userId === userId);

  const page = Math.max(parseInt((req.query.page as string) || '1', 10), 1);
  const limit = Math.max(parseInt((req.query.limit as string) || '10', 10), 1);
  const start = (page - 1) * limit;
  const paged = results.slice(start, start + limit);

  res.status(200).json({
    data: paged,
    pagination: { page, limit, total: results.length, totalPages: Math.ceil(results.length / limit) || 1 }
  });
});

/** GET /api/orders/:id - protected */
router.get('/:id', authenticate, (req: Request, res: Response) => {
  const order = store.orders.find(o => o.id === req.params.id);
  if (!order) return res.status(404).json({ error: 'NotFound', message: 'Order not found' });
  res.status(200).json(order);
});

/** POST /api/orders - protected, creates for the authenticated user */
router.post('/', authenticate, (req: AuthRequest, res: Response) => {
  const { items, notes } = req.body || {};
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'BadRequest', message: 'items must be a non-empty array' });
  }
  for (const item of items) {
    if (!item.productId || !store.products.some(p => p.id === item.productId)) {
      return res.status(400).json({ error: 'BadRequest', message: `Invalid productId: ${item.productId}` });
    }
  }
  const total = items.reduce((sum: number, item: any) => {
    const product = store.products.find(p => p.id === item.productId)!;
    return sum + product.price * (item.quantity || 1);
  }, 0);
  const order = {
    id: uuid(), userId: req.user!.sub, items, status: 'pending' as const,
    total: Math.round(total * 100) / 100, createdAt: new Date().toISOString(), notes: notes ?? null
  };
  store.orders.push(order);
  res.status(201).json(order);
});

/** PATCH /api/orders/:id/status - protected, update status only */
router.patch('/:id/status', authenticate, (req: Request, res: Response) => {
  const order = store.orders.find(o => o.id === req.params.id);
  if (!order) return res.status(404).json({ error: 'NotFound', message: 'Order not found' });
  const { status } = req.body || {};
  const valid = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
  if (!valid.includes(status)) {
    return res.status(400).json({ error: 'BadRequest', message: `status must be one of ${valid.join(', ')}` });
  }
  order.status = status;
  res.status(200).json(order);
});

/** DELETE /api/orders/:id - protected */
router.delete('/:id', authenticate, (req: Request, res: Response) => {
  const idx = store.orders.findIndex(o => o.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'NotFound', message: 'Order not found' });
  store.orders.splice(idx, 1);
  res.status(200).json({ message: 'Order deleted' });
});

export default router;
