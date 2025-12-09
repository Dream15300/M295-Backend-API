import { Router } from "express";
import authRouter from "./authRoutes.js";
import fileRouter from "./fileRoutes.js";
import timeEntryRouter from "./timeEntryRoutes.js";
import absenceRouter from "./absenceRoutes.js";
import userRouter from "./userRoutes.js";
import logRouter from "./logRoutes.js";

const router = Router();

// exakt wie im LB:
router.use("/", authRouter);             // /login, /logout
router.use("/users", userRouter);        // /users
router.use("/time-entries", timeEntryRouter);
router.use("/absences", absenceRouter);
router.use("/logs", logRouter);

// evtl. bestehende Upload-Routen:
router.use("/files", fileRouter);

export default router;
