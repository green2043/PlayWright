import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';

import authRoutes from './routes/auth.routes';
import usersRoutes from './routes/users.routes';
import productsRoutes from './routes/products.routes';
import ordersRoutes from './routes/orders.routes';
import filesRoutes from './routes/files.routes';
import miscRoutes from './routes/misc.routes';

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve the static frontend
const frontendDir = path.join(__dirname, '..', '..', 'frontend');
app.use(express.static(frontendDir));

// Redirect the site root to the actual home page under /pages
app.get('/', (_req: Request, res: Response) => {
  res.redirect('/pages/index.html');
});

// Swagger API docs
try {
  const swaggerDoc = YAML.load(path.join(__dirname, '..', 'swagger.yaml'));
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));
} catch (err) {
  console.error('Failed to load swagger.yaml:', err);
}

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/files', filesRoutes);
app.use('/api/misc', miscRoutes);
app.use('/api/admin', miscRoutes); // /api/admin/reset lives in misc.routes.ts

// Fallback for unknown API routes -> JSON 404 (keeps API predictable)
app.use('/api', (req: Request, res: Response) => {
  res.status(404).json({ error: 'NotFound', message: `No API route for ${req.method} ${req.originalUrl}` });
});

// SPA-ish fallback for frontend pages (serves index.html for unknown non-API routes)
app.get('*', (req: Request, res: Response) => {
  res.sendFile(path.join(frontendDir, 'pages', 'index.html'));
});

// Global error handler - ensures the server NEVER crashes on unexpected errors
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'InternalServerError', message: 'Something went wrong. Please try again.' });
});

// Guard against process crashes from unhandled rejections/exceptions
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
});
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

app.listen(PORT, () => {
  console.log(`\n✅ Playwright Practice App running at http://localhost:${PORT}`);
  console.log(`📄 API docs available at http://localhost:${PORT}/api-docs\n`);
});
