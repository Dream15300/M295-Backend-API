import type { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { JWT_EXPIRES_IN, JWT_SECRET } from '../config/authConfig.js'
import { findByEmail } from '../repo/userRepo.js'

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
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

    // 1. User aus DB laden
    const user = await findByEmail(email)

    if (!user) {
      return res.status(401).json({ fehler: 'Ungültige Anmeldedaten' })
    }

    // 2. Passwort prüfen (Hash vergleichen)
    const valid = await bcrypt.compare(password, user.password_hash)
    if (!valid) {
      return res.status(401).json({ fehler: 'Ungültige Anmeldedaten' })
    }

    // 3. JWT erzeugen
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
    }

    const token = jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    })

    return res.status(200).json({ token, user: payload })
  } catch (err) {
    next(err)
  }
}
