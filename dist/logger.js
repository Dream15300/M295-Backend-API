import winston from 'winston';
import expressWinston from 'express-winston';
export const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: 'logs/combined.log' }),
    ],
});
export const requestLogger = expressWinston.logger({
    winstonInstance: logger,
    meta: true,
    msg: '{{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms',
});
export const errorLogger = expressWinston.errorLogger({
    winstonInstance: logger,
});
//# sourceMappingURL=logger.js.map