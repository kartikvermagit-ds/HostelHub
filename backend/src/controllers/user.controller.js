import { UserService } from '../services/user.service.js';
import { ApiResponse } from '../utils/apiResponse.js';

export class UserController {
  static async getMe(req, res, next) {
    try {
      const profile = await UserService.getProfileById(req.profile.id);
      return ApiResponse.success(res, profile, 'Profile retrieved successfully');
    } catch (error) {
      return next(error);
    }
  }

  static async updateMe(req, res, next) {
    try {
      const updated = await UserService.updateProfile(req.profile.id, req.body);
      return ApiResponse.success(res, updated, 'Profile updated successfully');
    } catch (error) {
      return next(error);
    }
  }

  static async getUserById(req, res, next) {
    try {
      const profile = await UserService.getProfileById(req.params.id);
      return ApiResponse.success(res, profile, 'User profile retrieved');
    } catch (error) {
      return next(error);
    }
  }

  static async getMyUploads(req, res, next) {
    try {
      const result = await UserService.getUserUploads(req.profile.id, req.query);
      return ApiResponse.success(res, result.items, 'User uploads retrieved', 200, result.pagination);
    } catch (error) {
      return next(error);
    }
  }

  static async getMyBookmarks(req, res, next) {
    try {
      const result = await UserService.getUserBookmarks(req.profile.id, req.query);
      return ApiResponse.success(res, result.items, 'User bookmarks retrieved', 200, result.pagination);
    } catch (error) {
      return next(error);
    }
  }
}
