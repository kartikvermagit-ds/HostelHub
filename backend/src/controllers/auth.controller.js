import { AuthService } from '../services/auth.service.js';
import { ApiResponse } from '../utils/apiResponse.js';

export class AuthController {
  static async register(req, res, next) {
    try {
      const result = await AuthService.register(req.body);
      return ApiResponse.created(res, result, 'Registration successful');
    } catch (error) {
      return next(error);
    }
  }

  static async login(req, res, next) {
    try {
      const result = await AuthService.login(req.body);
      return ApiResponse.success(res, result, 'Login successful');
    } catch (error) {
      return next(error);
    }
  }

  static async logout(req, res, next) {
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader ? authHeader.split(' ')[1] : null;
      await AuthService.logout(token);
      return ApiResponse.success(res, null, 'Logged out successfully');
    } catch (error) {
      return next(error);
    }
  }

  static async getCurrentUser(req, res, next) {
    try {
      return ApiResponse.success(res, {
        user: req.profile,
      }, 'Current user profile retrieved');
    } catch (error) {
      return next(error);
    }
  }
}
