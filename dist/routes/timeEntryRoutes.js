import { Router } from 'express';
import { createTimeEntry, updateTimeEntry, deleteTimeEntry, } from '../controllers/timeEntryController.js';
import { verifyToken } from '../middleware/verifyToken.js';
import { requireRole } from '../middleware/requireRole.js';
const router = Router();
// POST /api/time-entries
router.post('/', createTimeEntry);
// PUT /api/time-entries/:id
router.put('/:id', verifyToken, requireRole('admin'), updateTimeEntry);
// DELETE /api/time-entries/:id
router.delete('/:id', verifyToken, requireRole('admin'), deleteTimeEntry);
export default router;
//# sourceMappingURL=timeEntryRoutes.js.map