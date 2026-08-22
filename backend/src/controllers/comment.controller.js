import { CommentService } from '../services/comment.service.js';
import { ApiResponse } from '../utils/apiResponse.js';

export class CommentController {
  static async getResourceComments(req, res, next) {
    try {
      const result = await CommentService.getResourceComments(req.params.id, req.query);
      return ApiResponse.success(res, result.items, 'Comments retrieved', 200, result.pagination);
    } catch (error) {
      return next(error);
    }
  }

  static async createComment(req, res, next) {
    try {
      const comment = await CommentService.createComment(req.params.id, req.profile.id, req.body.content);
      return ApiResponse.created(res, comment, 'Comment posted successfully');
    } catch (error) {
      return next(error);
    }
  }

  static async updateComment(req, res, next) {
    try {
      const updated = await CommentService.updateComment(req.params.id, req.profile, req.body.content);
      return ApiResponse.success(res, updated, 'Comment updated successfully');
    } catch (error) {
      return next(error);
    }
  }

  static async deleteComment(req, res, next) {
    try {
      await CommentService.deleteComment(req.params.id, req.profile);
      return ApiResponse.success(res, null, 'Comment deleted successfully');
    } catch (error) {
      return next(error);
    }
  }
}
