import type { Request } from 'express'
import type { UserRole } from './user.js'

export interface JwtUserPayload {
  id: number
  username: string
  role: UserRole
}

export interface AuthenticatedRequest extends Request {
  user?: JwtUserPayload
}
