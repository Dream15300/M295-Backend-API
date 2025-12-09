import type { Request } from 'express'

export interface JwtUserPayload {
  id: number
  username: string
  role?: string
}

export interface AuthenticatedRequest extends Request {
  user?: JwtUserPayload
}
