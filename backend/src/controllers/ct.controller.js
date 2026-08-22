import { CTService } from '../services/ct.service.js';
import { ApiResponse } from '../utils/apiResponse.js';

export class CTController {
  static async getAll(req, res, next) {
    try {
      const result = await CTService.getAllCTs(req.query);
      return ApiResponse.success(res, result.items, 'Class tests retrieved', 200, result.pagination);
    } catch (error) {
      return next(error);
    }
  }

  static async getUpcoming(req, res, next) {
    try {
      const upcoming = await CTService.getUpcomingCTs();
      return ApiResponse.success(res, upcoming, 'Upcoming class tests retrieved');
    } catch (error) {
      return next(error);
    }
  }

  static async getById(req, res, next) {
    try {
      const ct = await CTService.getCTById(req.params.id);
      return ApiResponse.success(res, ct, 'Class test details retrieved');
    } catch (error) {
      return next(error);
    }
  }

  static async getResources(req, res, next) {
    try {
      const prepData = await CTService.getCTResources(req.params.id);
      return ApiResponse.success(res, prepData, 'CT preparation materials retrieved');
    } catch (error) {
      return next(error);
    }
  }

  static async create(req, res, next) {
    try {
      const ct = await CTService.createCT(req.body, req.profile.id);
      return ApiResponse.created(res, ct, 'Class test created successfully');
    } catch (error) {
      return next(error);
    }
  }

  static async update(req, res, next) {
    try {
      const updated = await CTService.updateCT(req.params.id, req.body);
      return ApiResponse.success(res, updated, 'Class test updated successfully');
    } catch (error) {
      return next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      await CTService.deleteCT(req.params.id);
      return ApiResponse.success(res, null, 'Class test deleted successfully');
    } catch (error) {
      return next(error);
    }
  }
}
