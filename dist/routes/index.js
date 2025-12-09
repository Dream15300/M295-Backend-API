import { Router } from 'express';
import authRouter from './authRoutes.js';
import fileRouter from './fileRoutes.js';
import timeEntryRouter from './timeEntryRoutes.js';
const router = Router();
router.use('/auth', authRouter);
router.use('/files', fileRouter);
router.use('/time-entries', timeEntryRouter);
// später: weitere Router (z.B. /absences, /logs, ...)
export default router;
//# sourceMappingURL=index.js.map