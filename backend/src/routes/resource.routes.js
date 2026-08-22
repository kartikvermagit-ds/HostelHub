import { Router } from 'express';
import { ResourceController } from '../controllers/resource.controller.js';
import { BookmarkController } from '../controllers/bookmark.controller.js';
import { CommentController } from '../controllers/comment.controller.js';
import { authenticate, optionalAuth } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validation.middleware.js';
import {
  createResourceSchema,
  updateResourceSchema,
  listResourcesSchema,
  searchResourcesSchema,
} from '../validators/resource.validator.js';
import { createCommentSchema } from '../validators/comment.validator.js';
import { uploadRateLimiter } from '../middleware/rateLimit.middleware.js';

const router = Router();

// Resource Search & List (public/optional auth)
router.get('/search', validate(searchResourcesSchema), ResourceController.search);
router.get('/', validate(listResourcesSchema), optionalAuth, ResourceController.getAll);

// Create Resource
router.post('/', authenticate, uploadRateLimiter, validate(createResourceSchema), ResourceController.create);

// Single Resource Operations
router.get('/:id', optionalAuth, ResourceController.getById);
router.patch('/:id', authenticate, validate(updateResourceSchema), ResourceController.update);
router.delete('/:id', authenticate, ResourceController.delete);

// Download Resource File
router.get('/:id/download', optionalAuth, ResourceController.download);

// Resource Bookmark Toggle
router.post('/:id/bookmark', authenticate, BookmarkController.addBookmark);
router.delete('/:id/bookmark', authenticate, BookmarkController.removeBookmark);

// Resource Nested Comments
router.get('/:id/comments', optionalAuth, CommentController.getResourceComments);
router.post('/:id/comments', authenticate, validate(createCommentSchema), CommentController.createComment);

export default router;
