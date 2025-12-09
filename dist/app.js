import express from 'express';
import morgan from 'morgan';
import apiRouter from './routes/index.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';
import { requestLogger, errorLogger } from './logger.js';
// Sicherheit & Logging
import helmet from "helmet";
const app = express();
app.use(helmet());
// Logging (Winston + Express)
app.use(requestLogger);
// Fehler-Logger (nach den Routen, vor dem globalen Error-Handler)
app.use(errorLogger);
// Logging
app.use(morgan('dev'));
// JSON-Body-Parsing
app.use(express.json());
app.get("/", (req, res) => {
    res.status(200).send("OK");
});
// Statische Files (z.B. für Uploads, falls nötig)
app.use('/uploads', express.static('uploads'));
// Haupt-Router (z.B. /api/file)
app.use('/api', apiRouter);
// 404-Handler
app.use(notFoundHandler);
// Fehler-Handler (immer zuletzt)
app.use(errorHandler);
export default app;
//# sourceMappingURL=app.js.map