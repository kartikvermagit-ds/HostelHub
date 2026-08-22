import { ResourceService } from '../services/resource.service.js';
import { ApiResponse } from '../utils/apiResponse.js';

export class ResourceController {
  static async create(req, res, next) {
    try {
      const resource = await ResourceService.createResource(req.body, req.profile.id);
      return ApiResponse.created(res, resource, 'Resource uploaded and created successfully');
    } catch (error) {
      return next(error);
    }
  }

  static async getAll(req, res, next) {
    try {
      const currentUserId = req.profile ? req.profile.id : null;
      const result = await ResourceService.getAllResources(req.query, currentUserId);
      return ApiResponse.success(res, result.items, 'Resources retrieved', 200, result.pagination);
    } catch (error) {
      return next(error);
    }
  }

  static async search(req, res, next) {
    try {
      const result = await ResourceService.searchResources(req.query);
      return ApiResponse.success(res, result.items, 'Search results retrieved', 200, result.pagination);
    } catch (error) {
      return next(error);
    }
  }

  static async getById(req, res, next) {
    try {
      const resource = await ResourceService.getResourceById(req.params.id);
      return ApiResponse.success(res, resource, 'Resource details retrieved');
    } catch (error) {
      return next(error);
    }
  }

  static async update(req, res, next) {
    try {
      const updated = await ResourceService.updateResource(req.params.id, req.body, req.profile);
      return ApiResponse.success(res, updated, 'Resource updated successfully');
    } catch (error) {
      return next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      await ResourceService.deleteResource(req.params.id, req.profile);
      return ApiResponse.success(res, null, 'Resource deleted successfully');
    } catch (error) {
      return next(error);
    }
  }

  static async download(req, res, next) {
    try {
      const downloadData = await ResourceService.downloadResource(req.params.id);
      return ApiResponse.success(res, downloadData, 'Download authorization granted');
    } catch (error) {
      return next(error);
    }
  }
}
