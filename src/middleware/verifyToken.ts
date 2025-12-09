import type { Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import type { AuthenticatedRequest, JwtUserPayload } from '../types/auth.js'
import { JWT_SECRET } from '../config/authConfig.js'

export function verifyToken(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  const authHeader = req.header('Authorization')

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ fehler: 'Kein Bearer-Token übermittelt' })
  }

  const token = authHeader.substring('Bearer '.length).trim()

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtUserPayload
    req.user = decoded
    return next()
  } catch {
    return res.status(401).json({ fehler: 'Ungültiger oder abgelaufener Token' })
  }
}
