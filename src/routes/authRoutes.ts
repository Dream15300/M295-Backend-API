import { Router } from "express";
import { login, logout } from "../controllers/authController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = Router();

// POST /login
router.post("/login", login);

// Optional: geschützter Logout (Token wird geprüft)
router.post("/logout", verifyToken, logout);

export default router;
