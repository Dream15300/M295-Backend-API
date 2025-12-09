import type { Request, Response, NextFunction } from 'express'

export function notFoundHandler(_req: Request, res: Response) {
  res.status(404).json({ fehler: 'Nicht gefunden' })
}
