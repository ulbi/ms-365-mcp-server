import winston from 'winston';
import { redactionEnabled, redactSensitive } from './lib/log-redactor.js';

const redactFormat = winston.format((info) => {
  if (!redactionEnabled()) return info;
  if (typeof info.message === 'string') {
    info.message = redactSensitive(info.message);
  }
  return info;
});

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'debug',
  format: winston.format.combine(
    redactFormat(),
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf(
      ({ level, message, timestamp }) => `${timestamp} ${level.toUpperCase()}: ${message}`
    )
  ),
  transports: [
    new winston.transports.Console({
      silent: process.env.SILENT === 'true' || process.env.SILENT === '1',
    }),
  ],
});

export const enableConsoleLogging = (): void => {};

export default logger;
