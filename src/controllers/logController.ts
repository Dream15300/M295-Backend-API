import type { Response, NextFunction } from "express";
import type { AuthenticatedRequest } from "../types/auth.js";
import * as changeLogRepo from "../repo/changeLogRepo.js";

export async function getLogs(
  _req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const logs = await changeLogRepo.list();
    return res.status(200).json(logs);
  } catch (err) {
    next(err);
  }
}
