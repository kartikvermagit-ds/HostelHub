import { Router } from 'express';
import { CTController } from '../controllers/ct.controller.js';
import { authenticate, optionalAuth } from '../middleware/auth.middleware.js';
import { requireModerator } from '../middleware/role.middleware.js';
import { validate } from '../middleware/validation.middleware.js';
import { createCTSchema, updateCTSchema } from '../validators/ct.validator.js';

const router = Router();

router.get('/upcoming', optionalAuth, CTController.getUpcoming);
router.get('/', optionalAuth, CTController.getAll);
router.get('/:id', optionalAuth, CTController.getById);
router.get('/:id/resources', optionalAuth, CTController.getResources);

// Admin / Moderator CT Management
router.post('/', authenticate, requireModerator, validate(createCTSchema), CTController.create);
router.patch('/:id', authenticate, requireModerator, validate(updateCTSchema), CTController.update);
router.delete('/:id', authenticate, requireModerator, CTController.delete);

export default router;
