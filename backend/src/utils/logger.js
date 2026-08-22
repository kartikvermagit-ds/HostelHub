import { env } from '../config/env.js';

const sanitizeData = (data) => {
  if (!data || typeof data !== 'object') return data;
  const sanitized = { ...data };
  const sensitiveKeys = ['password', 'token', 'jwt', 'authorization', 'apiKey', 'secret', 'SUPABASE_SERVICE_ROLE_KEY'];
  
  for (const key of Object.keys(sanitized)) {
    if (sensitiveKeys.some(s => key.toLowerCase().includes(s.toLowerCase()))) {
      sanitized[key] = '[REDACTED]';
    } else if (typeof sanitized[key] === 'object') {
      sanitized[key] = sanitizeData(sanitized[key]);
    }
  }
  return sanitized;
};

export const logger = {
  info: (message, meta = null) => {
    console.log(JSON.stringify({
      timestamp: new Date().toISOString(),
      level: 'INFO',
      message,
      ...(meta ? { meta: sanitizeData(meta) } : {}),
    }));
  },
  warn: (message, meta = null) => {
    console.warn(JSON.stringify({
      timestamp: new Date().toISOString(),
      level: 'WARN',
      message,
      ...(meta ? { meta: sanitizeData(meta) } : {}),
    }));
  },
  error: (message, error = null) => {
    console.error(JSON.stringify({
      timestamp: new Date().toISOString(),
      level: 'ERROR',
      message,
      ...(error ? {
        error: error.message || error,
        ...(env.NODE_ENV === 'development' && error.stack ? { stack: error.stack } : {}),
      } : {}),
    }));
  },
  debug: (message, meta = null) => {
    if (env.NODE_ENV === 'development') {
      console.debug(JSON.stringify({
        timestamp: new Date().toISOString(),
        level: 'DEBUG',
        message,
        ...(meta ? { meta: sanitizeData(meta) } : {}),
      }));
    }
  }
};
