import { AnnouncementService } from '../services/announcement.service.js';
import { ApiResponse } from '../utils/apiResponse.js';

export class AnnouncementController {
  static async getAll(req, res, next) {
    try {
      const isAdmin = req.profile && req.profile.role === 'ADMIN';
      const result = await AnnouncementService.getAllAnnouncements(req.query, isAdmin);
      return ApiResponse.success(res, result.items, 'Announcements retrieved', 200, result.pagination);
    } catch (error) {
      return next(error);
    }
  }

  static async getById(req, res, next) {
    try {
      const announcement = await AnnouncementService.getAnnouncementById(req.params.id);
      return ApiResponse.success(res, announcement, 'Announcement retrieved');
    } catch (error) {
      return next(error);
    }
  }

  static async create(req, res, next) {
    try {
      const announcement = await AnnouncementService.createAnnouncement(req.body, req.profile.id);
      return ApiResponse.created(res, announcement, 'Announcement published successfully');
    } catch (error) {
      return next(error);
    }
  }

  static async update(req, res, next) {
    try {
      const updated = await AnnouncementService.updateAnnouncement(req.params.id, req.body);
      return ApiResponse.success(res, updated, 'Announcement updated successfully');
    } catch (error) {
      return next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      await AnnouncementService.deleteAnnouncement(req.params.id);
      return ApiResponse.success(res, null, 'Announcement deleted successfully');
    } catch (error) {
      return next(error);
    }
  }
}
