import morgan from 'morgan';
import { logger } from '../utils/logger.js';

export const httpLogger = morgan(
  (tokens, req, res) => {
    return JSON.stringify({
      method: tokens.method(req, res),
      url: tokens.url(req, res),
      status: Number(tokens.status(req, res)),
      responseTime: `${tokens['response-time'](req, res)} ms`,
      remoteAddr: tokens['remote-addr'](req, res),
    });
  },
  {
    stream: {
      write: (message) => {
        try {
          const parsed = JSON.parse(message);
          logger.info(`HTTP ${parsed.method} ${parsed.url} ${parsed.status} (${parsed.responseTime})`, parsed);
        } catch {
          logger.info(message.trim());
        }
      },
    },
  }
);
