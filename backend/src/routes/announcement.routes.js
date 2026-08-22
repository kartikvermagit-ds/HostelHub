import { Router } from 'express';
import { AnnouncementController } from '../controllers/announcement.controller.js';
import { authenticate, optionalAuth } from '../middleware/auth.middleware.js';
import { requireModerator } from '../middleware/role.middleware.js';
import { validate } from '../middleware/validation.middleware.js';
import { createAnnouncementSchema } from '../validators/ct.validator.js';

const router = Router();

router.get('/', optionalAuth, AnnouncementController.getAll);
router.get('/:id', optionalAuth, AnnouncementController.getById);

// Admin / Moderator Broadcasts
router.post('/', authenticate, requireModerator, validate(createAnnouncementSchema), AnnouncementController.create);
router.patch('/:id', authenticate, requireModerator, AnnouncementController.update);
router.delete('/:id', authenticate, requireModerator, AnnouncementController.delete);

export default router;
