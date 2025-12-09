import { Router } from "express";
import { listUsers } from "../controllers/userController.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { requireRole } from "../middleware/requireRole.js";
const router = Router();
// /users GET (nur Admin)
router.get("/", verifyToken, requireRole("admin"), listUsers);
export default router;
//# sourceMappingURL=userRoutes.js.map