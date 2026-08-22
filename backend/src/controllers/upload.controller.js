import { StorageService } from '../services/storage.service.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { ApiError } from '../utils/apiError.js';

export class UploadController {
  static async getSignedUploadUrl(req, res, next) {
    try {
      const { fileName, fileType, fileSize } = req.body;
      const uploadAuth = await StorageService.generateSignedUploadUrl(fileName, fileType, fileSize);
      return ApiResponse.success(res, uploadAuth, 'Upload authorization generated');
    } catch (error) {
      return next(error);
    }
  }

  static async directUpload(req, res, next) {
    try {
      if (!req.file) {
        throw ApiError.badRequest('No file uploaded in request');
      }

      const uploadResult = await StorageService.uploadFileBuffer(
        req.file.buffer,
        req.file.originalname,
        req.file.mimetype
      );

      return ApiResponse.created(res, uploadResult, 'File uploaded to storage successfully');
    } catch (error) {
      return next(error);
    }
  }
}
