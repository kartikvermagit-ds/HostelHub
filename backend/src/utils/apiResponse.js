export class ApiResponse {
  static success(res, data = {}, message = 'Success', statusCode = 200, pagination = null) {
    const payload = {
      success: true,
      message,
      data,
    };

    if (pagination) {
      payload.pagination = pagination;
    }

    return res.status(statusCode).json(payload);
  }

  static created(res, data = {}, message = 'Resource created successfully') {
    return this.success(res, data, message, 201);
  }

  static noContent(res) {
    return res.status(204).send();
  }

  static error(res, error = { code: 'INTERNAL_ERROR', message: 'Internal server error' }, statusCode = 500) {
    return res.status(statusCode).json({
      success: false,
      error,
    });
  }
}
