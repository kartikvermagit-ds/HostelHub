import { BookmarkService } from '../services/bookmark.service.js';
import { ApiResponse } from '../utils/apiResponse.js';

export class BookmarkController {
  static async addBookmark(req, res, next) {
    try {
      const bookmark = await BookmarkService.addBookmark(req.profile.id, req.params.id);
      return ApiResponse.created(res, bookmark, 'Resource added to bookmarks');
    } catch (error) {
      return next(error);
    }
  }

  static async removeBookmark(req, res, next) {
    try {
      await BookmarkService.removeBookmark(req.profile.id, req.params.id);
      return ApiResponse.success(res, null, 'Resource removed from bookmarks');
    } catch (error) {
      return next(error);
    }
  }
}
