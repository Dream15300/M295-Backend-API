// src/controllers/authController.ts
import type { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { JWT_EXPIRES_IN, JWT_SECRET } from '../config/authConfig.js'

// später durch DB-Abfrage ersetzen
const demoUser = {
  id: 1,
  email: 'admin@example.com',
  password: 'hallo123456',
  role: 'admin',
}

export async function login(req: Request, res: Response, _next: NextFunction) {
  // zuerst Body, dann Query (so funktioniert GET & POST)
  const email =
    (req.body?.email as string | undefined) ??
    (req.query.email as string | undefined)

  const password =
    (req.body?.password as string | undefined) ??
    (req.query.password as string | undefined)

  if (!email || !password) {
    return res
      .status(400)
      .json({ fehler: 'email und password sind erforderlich' })
  }

  if (email !== demoUser.email || password !== demoUser.password) {
    return res.status(401).json({ fehler: 'Ungültige Anmeldedaten' })
  }

  const payload = {
    id: demoUser.id,
    email: demoUser.email,
    role: demoUser.role,
  }

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })

  return res.status(200).json({ token, user: payload })
}
