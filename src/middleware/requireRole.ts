import type { Response, NextFunction } from 'express'
import type { AuthenticatedRequest } from '../types/auth.js'

export function requireRole(role: string) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ fehler: 'Nicht angemeldet' })
    }

    if (!req.user.role) {
      return res.status(403).json({ fehler: 'Rolle nicht gesetzt' })
    }

    if (req.user.role !== role) {
      return res.status(403).json({ fehler: 'Keine Berechtigung' })
    }

    return next()
  }
}
