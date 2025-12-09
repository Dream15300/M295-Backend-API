import express, { Request, Response, NextFunction } from 'express'
import morgan from 'morgan'

import apiRouter from './routes/index.js'
import { notFoundHandler } from './middleware/notFoundHandler.js'
import { errorHandler } from './middleware/errorHandler.js'
import { requestLogger, errorLogger } from './logger.js'
import { runSeeders } from './lib/runSeeders.js'
import { runMigrations } from './lib/runMigrations.js'

// Sicherheit & Logging
import helmet from 'helmet'

// 🔹 DB-Initialisierung: zuerst Migrationen, dann Seeders
;(async () => {
  try {
    await runMigrations()
    console.log('Migrationen erfolgreich ausgeführt')

    await runSeeders()
    console.log('Seeders erfolgreich ausgeführt')
  } catch (err) {
    console.error('Fehler bei DB-Initialisierung', err)
  }
})()

const app = express()

app.use(helmet())

// Logging (Winston + Express)
app.use(requestLogger)
// Fehler-Logger (nach den Routen, vor dem globalen Error-Handler)
app.use(errorLogger)

// Logging
app.use(morgan('dev'))

// JSON-Body-Parsing
app.use(express.json())

app.get('/', (req: Request, res: Response) => {
  res.status(200).send('OK')
})

// Statische Files (z.B. für Uploads, falls nötig)
app.use('/uploads', express.static('uploads'))

// Haupt-Router (LB-konforme Pfade: /login, /users, /time-entries, ...)
app.use('/', apiRouter)

// 404-Handler
app.use(notFoundHandler)

// Fehler-Handler (immer zuletzt)
app.use(errorHandler)

export default app
