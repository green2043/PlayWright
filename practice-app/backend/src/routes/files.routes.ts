import { Router, Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import multer from 'multer';

const router = Router();

const uploadsDir = path.join(__dirname, '..', '..', 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

/** POST /api/files/upload - single file, multipart/form-data field name "file" */
router.post('/upload', upload.single('file'), (req: Request, res: Response) => {
  if (!req.file) return res.status(400).json({ error: 'BadRequest', message: 'No file uploaded (field name must be "file")' });
  res.status(201).json({
    message: 'File uploaded successfully',
    originalName: req.file.originalname,
    savedAs: req.file.filename,
    size: req.file.size,
    mimeType: req.file.mimetype
  });
});

/** POST /api/files/upload-multiple - multiple files, field name "files" */
router.post('/upload-multiple', upload.array('files', 10), (req: Request, res: Response) => {
  const files = (req.files as Express.Multer.File[]) || [];
  if (files.length === 0) return res.status(400).json({ error: 'BadRequest', message: 'No files uploaded (field name must be "files")' });
  res.status(201).json({
    message: `${files.length} file(s) uploaded successfully`,
    files: files.map(f => ({ originalName: f.originalname, savedAs: f.filename, size: f.size, mimeType: f.mimetype }))
  });
});

/** GET /api/files/download/:type - downloads sample files by type: txt, csv, json, pdf */
router.get('/download/:type', (req: Request, res: Response) => {
  const allowed: Record<string, string> = {
    txt: 'sample.txt', csv: 'sample.csv', json: 'sample.json', pdf: 'sample.pdf'
  };
  const filename = allowed[req.params.type];
  if (!filename) {
    return res.status(400).json({ error: 'BadRequest', message: `type must be one of: ${Object.keys(allowed).join(', ')}` });
  }
  const filePath = path.join(__dirname, '..', '..', 'downloads', filename);
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'NotFound', message: 'Sample file missing on server' });
  }
  res.download(filePath, filename);
});

export default router;
