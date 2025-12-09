import type { Response, NextFunction } from "express";
import type { AuthenticatedRequest } from "../types/auth.js";
import * as userRepo from "../repo/userRepo.js";

export async function listUsers(
  _req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const users = await userRepo.list();
    return res.status(200).json(users);
  } catch (err) {
    next(err);
  }
}
