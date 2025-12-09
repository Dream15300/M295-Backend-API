import { Router } from 'express';
import authRouter from './authRoutes.js';
import fileRouter from './fileRoutes.js';
const router = Router();
router.use('/auth', authRouter);
router.use('/files', fileRouter);
// später: weitere Router (z.B. /cars, /users, ...)
export default router;
//# sourceMappingURL=index.js.map