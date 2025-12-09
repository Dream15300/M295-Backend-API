// nur BSP, später löschen
import { Router } from 'express';
import { getHealth } from './../controllers/healthController.js';
const router = Router();
router.get('/', getHealth);
export default router;
//# sourceMappingURL=health.js.map