"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const multer_1 = __importDefault(require("multer"));
const router = (0, express_1.Router)();
const uploadsDir = path_1.default.join(__dirname, '..', '..', 'uploads');
if (!fs_1.default.existsSync(uploadsDir))
    fs_1.default.mkdirSync(uploadsDir, { recursive: true });
const storage = multer_1.default.diskStorage({
    destination: (_req, _file, cb) => cb(null, uploadsDir),
    filename: (_req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = (0, multer_1.default)({ storage, limits: { fileSize: 10 * 1024 * 1024 } });
/** POST /api/files/upload - single file, multipart/form-data field name "file" */
router.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file)
        return res.status(400).json({ error: 'BadRequest', message: 'No file uploaded (field name must be "file")' });
    res.status(201).json({
        message: 'File uploaded successfully',
        originalName: req.file.originalname,
        savedAs: req.file.filename,
        size: req.file.size,
        mimeType: req.file.mimetype
    });
});
/** POST /api/files/upload-multiple - multiple files, field name "files" */
router.post('/upload-multiple', upload.array('files', 10), (req, res) => {
    const files = req.files || [];
    if (files.length === 0)
        return res.status(400).json({ error: 'BadRequest', message: 'No files uploaded (field name must be "files")' });
    res.status(201).json({
        message: `${files.length} file(s) uploaded successfully`,
        files: files.map(f => ({ originalName: f.originalname, savedAs: f.filename, size: f.size, mimeType: f.mimetype }))
    });
});
/** GET /api/files/download/:type - downloads sample files by type: txt, csv, json, pdf */
router.get('/download/:type', (req, res) => {
    const allowed = {
        txt: 'sample.txt', csv: 'sample.csv', json: 'sample.json', pdf: 'sample.pdf'
    };
    const filename = allowed[req.params.type];
    if (!filename) {
        return res.status(400).json({ error: 'BadRequest', message: `type must be one of: ${Object.keys(allowed).join(', ')}` });
    }
    const filePath = path_1.default.join(__dirname, '..', '..', 'downloads', filename);
    if (!fs_1.default.existsSync(filePath)) {
        return res.status(404).json({ error: 'NotFound', message: 'Sample file missing on server' });
    }
    res.download(filePath, filename);
});
exports.default = router;
//# sourceMappingURL=files.routes.js.map