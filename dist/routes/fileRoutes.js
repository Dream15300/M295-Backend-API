// src/routes/fileRoutes.ts
import { Router } from 'express';
import { verifyToken } from '../middleware/verifyToken.js';
import { requireRole } from '../middleware/requireRole.js';
import { uploadImage, uploadErrorHandler } from '../middleware/upload.js';
import { listFiles, uploadFile, downloadFile, updateFile, deleteFile, } from '../controllers/fileController.js';
const router = Router();
// GET /api/files  → Liste aller Dateien
router.get('/', listFiles);
// POST /api/files  (Upload nur für Admin)
router.post('/', verifyToken, requireRole('admin'), uploadImage, uploadErrorHandler, uploadFile);
// GET /api/files/:filename  (Download)
router.get('/:filename', downloadFile);
// PUT /api/files/:filename  (Datei ersetzen, nur Admin)
router.put('/:filename', verifyToken, requireRole('admin'), uploadImage, uploadErrorHandler, updateFile);
// DELETE /api/files/:filename  (Löschen nur für Admin)
router.delete('/:filename', verifyToken, requireRole('admin'), deleteFile);
export default router;
//# sourceMappingURL=fileRoutes.js.map