import { SubjectService } from '../services/subject.service.js';
import { DashboardService } from '../services/dashboard.service.js';
import { ApiResponse } from '../utils/apiResponse.js';

export class SubjectController {
  static async getAll(req, res, next) {
    try {
      const subjects = await SubjectService.getAllSubjects();
      return ApiResponse.success(res, subjects, 'Subjects retrieved successfully');
    } catch (error) {
      return next(error);
    }
  }

  static async create(req, res, next) {
    try {
      const subject = await SubjectService.createSubject(req.body);
      return ApiResponse.created(res, subject, 'Subject created successfully');
    } catch (error) {
      return next(error);
    }
  }
}

export class DashboardController {
  static async getDashboard(req, res, next) {
    try {
      const data = await DashboardService.getDashboardData();
      return ApiResponse.success(res, data, 'Dashboard data retrieved successfully');
    } catch (error) {
      return next(error);
    }
  }
}

export class HealthController {
  static check(req, res) {
    return ApiResponse.success(res, {
      status: 'UP',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      service: 'HostelHub API',
      version: '1.0.0',
    }, 'HostelHub API is running');
  }
}
