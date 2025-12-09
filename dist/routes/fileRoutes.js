import { Router } from 'express';
import { verifyToken } from '../middleware/verifyToken.js';
import { requireRole } from '../middleware/requireRole.js';
import { uploadImage, uploadErrorHandler } from '../middleware/upload.js';
import { listFiles, uploadFile, downloadFile, updateFile, deleteFile, } from '../controllers/fileController.js';
const router = Router();
router.get('/', listFiles);
router.post('/', verifyToken, requireRole('admin'), uploadImage, uploadErrorHandler, uploadFile);
router.get('/:filename', downloadFile);
router.put('/:filename', verifyToken, requireRole('admin'), uploadImage, uploadErrorHandler, updateFile);
router.delete('/:filename', verifyToken, requireRole('admin'), deleteFile);
export default router;
//# sourceMappingURL=fileRoutes.js.map