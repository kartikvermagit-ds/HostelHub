import { Router } from 'express';
import { UserController } from '../controllers/user.controller.js';
import { authenticate, optionalAuth } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validation.middleware.js';
import { updateProfileSchema } from '../validators/user.validator.js';

const router = Router();

router.get('/me', authenticate, UserController.getMe);
router.patch('/me', authenticate, validate(updateProfileSchema), UserController.updateMe);
router.get('/me/uploads', authenticate, UserController.getMyUploads);
router.get('/me/bookmarks', authenticate, UserController.getMyBookmarks);
router.get('/:id', optionalAuth, UserController.getUserById);

export default router;
