import fs from 'fs';
import path from 'path';

const logDir = 'logs';
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const getTimestamp = () => new Date().toISOString();

const writeLog = (level, message, meta = {}) => {
  const logEntry = {
    timestamp: getTimestamp(),
    level,
    message,
    ...meta
  };

  const logFile = path.join(logDir, `${level}.log`);
  fs.appendFileSync(logFile, JSON.stringify(logEntry) + '\n');

  if (process.env.NODE_ENV === 'development') {
    console.log(`[${level.toUpperCase()}] ${message}`, meta);
  }
};

export const logger = {
  info: (message, meta) => writeLog('info', message, meta),
  error: (message, meta) => writeLog('error', message, meta),
  warn: (message, meta) => writeLog('warn', message, meta),
  debug: (message, meta) => writeLog('debug', message, meta),
};