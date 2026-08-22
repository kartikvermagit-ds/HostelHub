import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { logger } from '../utils/logger.js';
import { env } from '../config/env.js';

export const errorHandler = (err, req, res, next) => {
  let error = err;

  // If error is not an instance of ApiError, normalize it
  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || error.status || 500;
    const message = error.message || 'Internal Server Error';
    error = new ApiError(statusCode, message, error.code || 'INTERNAL_ERROR', error.details || null);
  }

  // Handle Supabase/PostgreSQL common constraint errors
  if (err.code === '23505') { // Unique violation
    error = ApiError.conflict('A record with this unique identifier already exists', 'UNIQUE_VIOLATION');
  } else if (err.code === '23503') { // Foreign key violation
    error = ApiError.badRequest('Referenced record does not exist', 'FOREIGN_KEY_VIOLATION');
  } else if (err.code === 'PGRST116') { // Row not found
    error = ApiError.notFound('Requested record not found');
  }

  // Log error with request details
  logger.error(`${req.method} ${req.originalUrl} - ${error.message}`, {
    statusCode: error.statusCode,
    code: error.code,
    details: error.details,
    ip: req.ip,
  });

  const responsePayload = {
    code: error.code || 'INTERNAL_ERROR',
    message: error.message,
    ...(error.details ? { details: error.details } : {}),
  };

  return ApiResponse.error(res, responsePayload, error.statusCode || 500);
};

export const notFoundHandler = (req, res, next) => {
  next(ApiError.notFound(`Endpoint not found: ${req.method} ${req.originalUrl}`));
};
