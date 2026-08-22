export class ApiError extends Error {
  constructor(statusCode, message, code = 'ERROR', details = null) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message = 'Bad request', code = 'BAD_REQUEST', details = null) {
    return new ApiError(400, message, code, details);
  }

  static unauthorized(message = 'Unauthorized access', code = 'UNAUTHORIZED') {
    return new ApiError(401, message, code);
  }

  static forbidden(message = 'Access forbidden', code = 'FORBIDDEN') {
    return new ApiError(403, message, code);
  }

  static notFound(message = 'Resource not found', code = 'NOT_FOUND') {
    return new ApiError(404, message, code);
  }

  static conflict(message = 'Resource already exists', code = 'CONFLICT') {
    return new ApiError(409, message, code);
  }

  static unprocessable(message = 'Validation failed', details = null) {
    return new ApiError(422, message, 'VALIDATION_ERROR', details);
  }

  static tooManyRequests(message = 'Too many requests, please try again later.') {
    return new ApiError(429, message, 'RATE_LIMIT_EXCEEDED');
  }

  static internal(message = 'Internal server error', details = null) {
    return new ApiError(500, message, 'INTERNAL_SERVER_ERROR', details);
  }
}
