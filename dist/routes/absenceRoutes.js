import { Router } from 'express';
import { getAbsences } from '../controllers/absenceController.js';
import { uploadDocuments, listDocuments, downloadDocument, deleteDocument, } from '../controllers/absenceDocumentController.js';
import { verifyToken } from '../middleware/verifyToken.js';
import { requireRole } from '../middleware/requireRole.js';
import { uploadAbsenceDocuments } from '../middleware/uploadAbsenceDocuments.js';
const router = Router();
// GET /api/absences
router.get('/', getAbsences);
// Dokumente hochladen (mit JWT, Benutzer im Token)
// POST /api/absences/:id/documents
router.post('/:id/documents', verifyToken, uploadAbsenceDocuments, uploadDocuments);
// nur admin
// GET /api/absences/:id/documents
router.get('/:id/documents', verifyToken, requireRole('admin'), listDocuments);
// GET /api/absences/:id/documents/:docId
router.get('/:id/documents/:docId', verifyToken, requireRole('admin'), downloadDocument);
// DELETE /api/absences/:id/documents/:docId
router.delete('/:id/documents/:docId', verifyToken, requireRole('admin'), deleteDocument);
export default router;
//# sourceMappingURL=absenceRoutes.js.map