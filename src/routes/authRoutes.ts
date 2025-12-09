import { Router } from 'express'
import { login } from '../controllers/authController.js'
import { verifyToken } from '../middleware/verifyToken.js'

const router = Router()

// GET /api/auth/login
router.get('/login', login)

// GET /api/auth/me
router.get('/me', verifyToken)

export default router
