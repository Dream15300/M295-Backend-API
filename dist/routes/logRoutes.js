import { Router } from "express";
import { getLogs } from "../controllers/logController.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { requireRole } from "../middleware/requireRole.js";
const router = Router();
// /logs GET (nur Admin → UC)
router.get("/", verifyToken, requireRole("admin"), getLogs);
export default router;
//# sourceMappingURL=logRoutes.js.map