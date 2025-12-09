import { Router } from 'express'
import authRouter from './authRoutes.js'
import fileRouter from './fileRoutes.js'
import timeEntryRouter from './timeEntryRoutes.js'
import absenceRouter from './absenceRoutes.js'

const router = Router()

router.use('/auth', authRouter)
router.use('/files', fileRouter)
router.use('/time-entries', timeEntryRouter)
router.use('/absences', absenceRouter)

export default router
