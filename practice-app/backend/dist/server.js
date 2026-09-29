"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const yamljs_1 = __importDefault(require("yamljs"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const users_routes_1 = __importDefault(require("./routes/users.routes"));
const products_routes_1 = __importDefault(require("./routes/products.routes"));
const orders_routes_1 = __importDefault(require("./routes/orders.routes"));
const files_routes_1 = __importDefault(require("./routes/files.routes"));
const misc_routes_1 = __importDefault(require("./routes/misc.routes"));
const app = (0, express_1.default)();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
app.use((0, cors_1.default)());
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true }));
// Serve the static frontend
const frontendDir = path_1.default.join(__dirname, '..', '..', 'frontend');
app.use(express_1.default.static(frontendDir));
// Redirect the site root to the actual home page under /pages
app.get('/', (_req, res) => {
    res.redirect('/pages/index.html');
});
// Swagger API docs
try {
    const swaggerDoc = yamljs_1.default.load(path_1.default.join(__dirname, '..', 'swagger.yaml'));
    app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDoc));
}
catch (err) {
    console.error('Failed to load swagger.yaml:', err);
}
// API routes
app.use('/api/auth', auth_routes_1.default);
app.use('/api/users', users_routes_1.default);
app.use('/api/products', products_routes_1.default);
app.use('/api/orders', orders_routes_1.default);
app.use('/api/files', files_routes_1.default);
app.use('/api/misc', misc_routes_1.default);
app.use('/api/admin', misc_routes_1.default); // /api/admin/reset lives in misc.routes.ts
// Fallback for unknown API routes -> JSON 404 (keeps API predictable)
app.use('/api', (req, res) => {
    res.status(404).json({ error: 'NotFound', message: `No API route for ${req.method} ${req.originalUrl}` });
});
// SPA-ish fallback for frontend pages (serves index.html for unknown non-API routes)
app.get('*', (req, res) => {
    res.sendFile(path_1.default.join(frontendDir, 'pages', 'index.html'));
});
// Global error handler - ensures the server NEVER crashes on unexpected errors
app.use((err, _req, res, _next) => {
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
//# sourceMappingURL=server.js.map